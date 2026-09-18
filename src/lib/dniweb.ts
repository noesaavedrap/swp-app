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
  return process.env.JSONPE_API_BASE_URL || process.env.DNIWEB_API_BASE_URL || "https://api.json.pe";
}

function getJsonPeToken() {
  return process.env.JSONPE_API_TOKEN || process.env.DNIWEB_API_TOKEN;
}

export function validateDocumentoInput(tipo: DocumentoTipo, value: string) {
  const numero = sanitizeDocumento(value);

  if (tipo === "dni" && numero.length !== 8) {
    throw new Error("El DNI debe tener 8 dígitos.");
  }

  if (tipo === "ruc" && numero.length !== 11) {
    throw new Error("El RUC debe tener 11 dígitos.");
  }

  return numero;
}

export function getDocumentoDisplayData(tipo: DocumentoTipo, data: Record<string, unknown>) {
  if (tipo === "dni") {
    const nombres = String(data.nombres ?? data.nombre ?? "").trim();
    const apellidoPaterno = String(data.apellido_paterno ?? data.apellidoPaterno ?? "").trim();
    const apellidoMaterno = String(data.apellido_materno ?? data.apellidoMaterno ?? "").trim();

    return {
      nombres,
      apellidos: [apellidoPaterno, apellidoMaterno].filter(Boolean).join(" ").trim(),
    };
  }

  return {
    nombres: String(data.razon_social ?? data.razonSocial ?? data.nombre ?? "").trim(),
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

  return obj;
}

export async function consultarDocumento(
  tipo: DocumentoTipo,
  value: string,
  overrideToken?: string,
): Promise<DocumentoConsultaResult> {
  const token = overrideToken ?? getJsonPeToken();

  if (!token) {
    return {
      tipo,
      numero: validateDocumentoInput(tipo, value),
      data: {},
      source: "manual",
    };
  }

  const numero = validateDocumentoInput(tipo, value);
  const baseUrl = getJsonPeBaseUrl().replace(/\/$/, "");
  const candidates = [
    { url: `${baseUrl}/api/${tipo}/${numero}`, method: "GET" as const },
    { url: `${baseUrl}/api/${tipo.toUpperCase()}/${numero}`, method: "GET" as const },
    { url: `${baseUrl}/api/${tipo}`, method: "POST" as const },
    { url: `${baseUrl}/api/${tipo.toUpperCase()}`, method: "POST" as const },
    { url: `${baseUrl}/api/v1/${tipo}`, method: "POST" as const },
  ];

  let lastError: Error | null = null;

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate.url, {
        method: candidate.method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        ...(candidate.method === "POST"
          ? {
              "Content-Type": "application/json",
              body: JSON.stringify({ [tipo]: numero }),
            }
          : {}),
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
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

      lastError = new Error(message);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Error desconocido con la API.");
    }
  }

  throw lastError ?? new Error(`No se pudo consultar el ${tipo.toUpperCase()} solicitado.`);
}
