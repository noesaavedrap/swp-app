import { NextResponse } from "next/server";
import { consultarDocumento, getDocumentoDisplayData, validateDocumentoInput } from "@/lib/dniweb";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { tipo?: "dni" | "ruc"; numero?: string };
    const tipo = body.tipo === "ruc" ? "ruc" : "dni";
    const numero = validateDocumentoInput(tipo, body.numero ?? "");

    const result = await consultarDocumento(tipo, numero);
    const { nombres, apellidos } = getDocumentoDisplayData(tipo, result.data);

    if (!nombres) {
      throw new Error(
        `La API de ${tipo.toUpperCase()} respondió sin datos útiles para completar el registro.`,
      );
    }

    return NextResponse.json({
      ok: true,
      tipo,
      numero,
      nombres,
      apellidos,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo consultar el documento solicitado.",
      },
      { status: 400 },
    );
  }
}
