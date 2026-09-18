import { NextRequest, NextResponse } from "next/server";
import { getTurnstileSecret } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const secret = getTurnstileSecret();

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "TURNSTILE_SECRET no está configurada." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token : "";

    if (!token) {
      return NextResponse.json({ ok: false, error: "Falta el token de Turnstile." }, { status: 400 });
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: request.headers.get("x-forwarded-for") || "",
      }),
    });

    const result = (await response.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
      "error-codes"?: string[];
    };

    if (!result.success || !response.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "La verificación de seguridad falló.",
          details: result["error-codes"] ?? [],
        },
        { status: 403 },
      );
    }

    return NextResponse.json({ ok: true, hostname: result.hostname, action: result.action ?? null });
  } catch (error) {
    console.error("Turnstile verify error", error);
    return NextResponse.json({ ok: false, error: "No se pudo verificar el captcha." }, { status: 500 });
  }
}
