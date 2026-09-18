import { NextResponse } from "next/server";
import { currentUser } from "@authgear/nextjs/server";
import { authgearConfig } from "@/lib/authgear";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

const transactionTypes = ["ingreso", "egreso", "transferencia"] as const;
const paymentMethods = [
  "efectivo",
  "yape",
  "plin",
  "tarjeta",
  "transferencia",
  "pagoefectivo",
] as const;

type TransactionType = (typeof transactionTypes)[number];
type PaymentMethod = (typeof paymentMethods)[number];

function isOneOf<T extends readonly string[]>(value: unknown, options: T): value is T[number] {
  return typeof value === "string" && options.includes(value);
}

export async function POST(request: Request) {
  try {
    const user = await currentUser(authgearConfig);
    if (!user) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const supabase = await getSupabaseServer();

    const body = (await request.json()) as Record<string, unknown>;
    const tipo = body.tipo;
    const metodo = body.metodo;
    const monto = typeof body.monto === "number" ? body.monto : Number(body.monto);
    const concepto = typeof body.concepto === "string" ? body.concepto.trim() : "";
    const contraparte = typeof body.contraparte === "string" ? body.contraparte.trim() : "";

    if (!isOneOf(tipo, transactionTypes)) {
      return NextResponse.json({ ok: false, error: "Tipo de transacción inválido." }, { status: 400 });
    }
    if (!isOneOf(metodo, paymentMethods)) {
      return NextResponse.json({ ok: false, error: "Método de pago inválido." }, { status: 400 });
    }
    if (!Number.isFinite(monto) || monto <= 0 || monto > 10_000_000) {
      return NextResponse.json({ ok: false, error: "El monto debe estar entre 0.01 y 10,000,000." }, { status: 400 });
    }
    if (concepto.length > 140 || contraparte.length > 120) {
      return NextResponse.json({ ok: false, error: "El texto ingresado supera el límite permitido." }, { status: 400 });
    }
    if (tipo === "transferencia" && !contraparte) {
      return NextResponse.json({ ok: false, error: "Indica la contraparte de la transferencia." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("transacciones")
      .insert({
        socio_id: user.sub,
        tipo: tipo as TransactionType,
        monto: Math.round(monto * 100) / 100,
        concepto: concepto || null,
        contraparte: tipo === "transferencia" ? contraparte : null,
        metodo: metodo as PaymentMethod,
        estado: "completado",
      })
      .select("*")
      .single();

    if (error) {
      console.error("Transaction creation error", error);
      return NextResponse.json({ ok: false, error: "No se pudo guardar la transacción." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, transaction: data }, { status: 201 });
  } catch (error) {
    console.error("Transaction API error", error);
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }
}
