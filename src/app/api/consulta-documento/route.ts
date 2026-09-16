import { NextResponse } from "next/server";
import {
  consultarDocumento,
  getDocumentoDisplayData,
  validateDocumentoInput,
} from "@/lib/dniweb";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      tipo?: "dni" | "ruc";
      numero?: string;
    };
    const tipo = body.tipo === "ruc" ? "ruc" : "dni";
    const numero = validateDocumentoInput(tipo, body.numero ?? "");

    const result = await consultarDocumento(tipo, numero);
    const { nombres, apellidos } = getDocumentoDisplayData(tipo, result.data);

    // Manual mode (no API token or empty data): format OK, user fills names
    if (result.source === "manual" || !nombres) {
      return NextResponse.json({
        ok: true,
        tipo,
        numero,
        nombres: nombres || "",
        apellidos: apellidos || "",
        source: result.source === "manual" ? "manual" : "partial",
        message:
          result.source === "manual"
            ? "Documento con formato válido. Completa nombres y apellidos manualmente."
            : "Se validó el formato. Completa los datos que falten.",
      });
    }

    return NextResponse.json({
      ok: true,
      tipo,
      numero,
      nombres,
      apellidos,
      source: "api",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo consultar el documento solicitado.";

    // Soft 404-style messages → still allow manual registration
    const isNotFound = /no se encontr|not found|404/i.test(message);

    return NextResponse.json(
      {
        ok: false,
        error: message,
        allowManual: isNotFound,
      },
      { status: isNotFound ? 404 : 400 },
    );
  }
}
