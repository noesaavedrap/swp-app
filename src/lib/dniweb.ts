export type DocumentoTipo = "dni" | "ruc";

export interface DocumentoConsultaResult {
  tipo: DocumentoTipo;
  numero: string;
  data: Record<string, unknown>;
  source: "api" | "manual";
}

function sanitizeDocumento(value: string) {
  return value.replace(/\s+/g, "").replace(/[^0-9]/g, "");
}

function getJsonPeBaseUrl() {
  const raw =
    process.env.JSONPE_API_BASE_URL ||
    process.env.DNIWEB_API_BASE_URL ||
    "https://api.json.pe";

  // back.json.pe is not the public API — force the documented host
  if (/back\.json\.pe/i.test(raw)) {
    return "https://api.json.pe";
  }

  return raw.replace(/\/$/, "");
}

function getJsonPeToken() {
  return process.env.JSONPE_API_TOKEN || process.env.DNIWEB_API_TOKEN || "";
}

export function validateDocumentoInput(tipo: DocumentoTipo, value: string) {
  const numero = sanitizeDocumento(value);

  if (tipo === "dni" && numero.length !== 8) {
    throw new Error("El DNI debe tener exactamente 8 dígitos.");
  }

  if (tipo === "ruc" && numero.length !== 11) {
    throw new Error("El RUC debe tener exactamente 11 dígitos.");
  }

  return numero;
}

export function getDocumentoDisplayData(
  tipo: DocumentoTipo,
  data: Record<string, unknown>,
) {
  if (tipo === "dni") {
    let nombres = String(
      data.nombres ?? data.nombre ?? data.nombres_completos ?? "",
    ).trim();
    let apellidoPaterno = String(
      data.apellido_paterno ?? data.apellidoPaterno ?? data.paterno ?? "",
    ).trim();
    let apellidoMaterno = String(
      data.apellido_materno ?? data.apellidoMaterno ?? data.materno ?? "",
    ).trim();

    // json.pe: "CASTILLO TERRONES, JOSE PEDRO"
    const completo = String(data.nombre_completo ?? "").trim();
    if (completo && (!nombres || !apellidoPaterno)) {
      const [apellidosPart, nombresPart] = completo.split(",").map((s) => s.trim());
      if (nombresPart) nombres = nombres || nombresPart;
      if (apellidosPart && !apellidoPaterno) {
        const parts = apellidosPart.split(/\s+/);
        apellidoPaterno = parts[0] || "";
        apellidoMaterno = parts.slice(1).join(" ");
      }
    }

    if (nombres && !apellidoPaterno && !apellidoMaterno) {
      const parts = nombres.split(/\s+/);
      if (parts.length >= 3) {
        return {
          nombres: parts.slice(0, -2).join(" "),
          apellidos: parts.slice(-2).join(" "),
        };
      }
    }

    return {
      nombres,
      apellidos: [apellidoPaterno, apellidoMaterno].filter(Boolean).join(" ").trim(),
    };
  }

  return {
    nombres: String(
      data.razon_social ??
        data.razonSocial ??
        data.nombre_o_razon_social ??
        data.nombre ??
        data.name ??
        "",
    ).trim(),
    apellidos: "",
  };
}

function normalizePayload(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;

  const obj = payload as Record<string, unknown>;

  // json.pe returns { success: true, message: "exito", data: {...} }
  if (obj.success === false) return null;

  if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    return obj.data as Record<string, unknown>;
  }

  if (obj.result && typeof obj.result === "object" && !Array.isArray(obj.result)) {
    return obj.result as Record<string, unknown>;
  }

  if (Array.isArray(obj.data) && obj.data.length > 0 && typeof obj.data[0] === "object") {
    return obj.data[0] as Record<string, unknown>;
  }

  if (obj.error || obj.message === "Not Found" || obj.status === 404) {
    return null;
  }

  // Has person fields at top level
  if (obj.nombres || obj.nombre_completo || obj.razon_social || obj.nombre_o_razon_social) {
    return obj;
  }

  return null;
}

export async function consultarDocumento(
  tipo: DocumentoTipo,
  value: string,
  overrideToken?: string,
): Promise<DocumentoConsultaResult> {
  const numero = validateDocumentoInput(tipo, value);
  const token = (overrideToken ?? getJsonPeToken()).trim();

  if (!token) {
    return {
      tipo,
      numero,
      data: {},
      source: "manual",
    };
  }

  const baseUrl = getJsonPeBaseUrl();
  // Official docs: POST https://api.json.pe/api/dni  body { "dni": "..." }
  const url = `${baseUrl}/api/${tipo}`;
  const payloadBody = JSON.stringify({ [tipo]: numero });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: payloadBody,
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    const normalized = normalizePayload(payload);

    if (response.ok && normalized) {
      return {
        tipo,
        numero,
        data: normalized,
        source: "api",
      };
    }

    const message =
      (typeof payload?.message === "string" && payload.message) ||
      (typeof payload?.error === "string" && payload.error) ||
      `No se encontró información para ese ${tipo.toUpperCase()}. Verifica el número e intenta de nuevo.`;

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "Token de JSON.pe inválido o sin créditos. Revisa JSONPE_API_TOKEN en Vercel.",
      );
    }

    if (/not found|no encontr|exito/i.test(message) && payload.success === false) {
      throw new Error(
        `No se encontró información para ese ${tipo.toUpperCase()}. Puedes completar los datos manualmente.`,
      );
    }

    throw new Error(
      /not found/i.test(message)
        ? `No se encontró información para ese ${tipo.toUpperCase()}. Puedes completar los datos manualmente.`
        : message,
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("JSON.pe")) {
      throw error;
    }
    if (error instanceof Error && /no se encontr|manualmente/i.test(error.message)) {
      throw error;
    }
    throw error instanceof Error
      ? error
      : new Error("Error de conexión con la API de documentos.");
  }
}
