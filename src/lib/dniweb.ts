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
  return (
    process.env.JSONPE_API_BASE_URL ||
    process.env.DNIWEB_API_BASE_URL ||
    "https://api.json.pe"
  );
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
    const nombres = String(
      data.nombres ?? data.nombre ?? data.nombres_completos ?? "",
    ).trim();
    const apellidoPaterno = String(
      data.apellido_paterno ?? data.apellidoPaterno ?? data.paterno ?? "",
    ).trim();
    const apellidoMaterno = String(
      data.apellido_materno ?? data.apellidoMaterno ?? data.materno ?? "",
    ).trim();

    // Some APIs return full name in one field
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
      data.razon_social ?? data.razonSocial ?? data.nombre ?? data.name ?? "",
    ).trim(),
    apellidos: "",
  };
}

function normalizePayload(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;

  const obj = payload as Record<string, unknown>;

  if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    return obj.data as Record<string, unknown>;
  }

  if (obj.result && typeof obj.result === "object" && !Array.isArray(obj.result)) {
    return obj.result as Record<string, unknown>;
  }

  if (Array.isArray(obj.data) && obj.data.length > 0 && typeof obj.data[0] === "object") {
    return obj.data[0] as Record<string, unknown>;
  }

  // Reject pure error payloads
  if (obj.error || obj.message === "Not Found" || obj.status === 404) {
    return null;
  }

  return obj;
}

export async function consultarDocumento(
  tipo: DocumentoTipo,
  value: string,
  overrideToken?: string,
): Promise<DocumentoConsultaResult> {
  const numero = validateDocumentoInput(tipo, value);
  const token = (overrideToken ?? getJsonPeToken()).trim();

  // Without API token: only format validation (manual fill of names)
  if (!token) {
    return {
      tipo,
      numero,
      data: {},
      source: "manual",
    };
  }

  const baseUrl = getJsonPeBaseUrl().replace(/\/$/, "");
  const payloadBody = JSON.stringify({ [tipo]: numero });
  const candidates = [
    `${baseUrl}/api/${tipo}`,
    `${baseUrl}/api/${tipo.toUpperCase()}`,
    `${baseUrl}/api/v1/${tipo}`,
    `${baseUrl}/${tipo}/${numero}`,
  ];

  let lastError: Error | null = null;

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        method: url.includes(`/${tipo}/`) ? "GET" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: url.includes(`/${tipo}/`) ? undefined : payloadBody,
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;

      if (response.status === 404) {
        lastError = new Error(
          `No se encontró información para ese ${tipo.toUpperCase()}. Verifica el número e intenta de nuevo.`,
        );
        continue;
      }

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
        (typeof payload?.detail === "string" && payload.detail) ||
        (typeof payload?.error === "string" && payload.error) ||
        (typeof payload?.errors === "string" && payload.errors) ||
        `No se pudo consultar el ${tipo.toUpperCase()} solicitado.`;

      // Soften generic "Not Found"
      if (/not found/i.test(message)) {
        lastError = new Error(
          `No se encontró información para ese ${tipo.toUpperCase()}. Puedes completar los datos manualmente.`,
        );
      } else {
        lastError = new Error(message);
      }
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Error de conexión con la API de documentos.");
    }
  }

  throw (
    lastError ??
    new Error(`No se pudo consultar el ${tipo.toUpperCase()} solicitado.`)
  );
}
