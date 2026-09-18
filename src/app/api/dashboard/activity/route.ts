import { NextResponse } from "next/server";
import { currentUser } from "@authgear/nextjs/server";
import { authgearConfig } from "@/lib/authgear";
import { getMongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";

interface DashboardEvent {
  type: "dashboard_view" | "transaction_created";
  socioId: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: Date;
}

export async function GET() {
  try {
    const user = await currentUser(authgearConfig);
    if (!user) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ ok: true, configured: false, events: [] });
    }

    const events = db.collection<DashboardEvent>("dashboard_events");
    await events.insertOne({
      type: "dashboard_view",
      socioId: user.sub,
      createdAt: new Date(),
    });

    const recentEvents = await events
      .find({ socioId: user.sub })
      .sort({ createdAt: -1 })
      .limit(8)
      .project({ _id: 0, type: 1, metadata: 1, createdAt: 1 })
      .toArray();

    return NextResponse.json({
      ok: true,
      configured: true,
      events: recentEvents,
    });
  } catch (error) {
    console.error("Dashboard activity error", error);
    return NextResponse.json(
      { ok: false, configured: false, events: [], error: "No se pudo cargar la actividad" },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser(authgearConfig);
    if (!user) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const body = (await request.json()) as {
      type?: DashboardEvent["type"];
      metadata?: DashboardEvent["metadata"];
    };
    if (body.type !== "transaction_created" && body.type !== "dashboard_view") {
      return NextResponse.json({ ok: false, error: "Tipo de evento inválido" }, { status: 400 });
    }
    const type = body.type;
    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json(
        { ok: false, configured: false, error: "Analítica no configurada" },
        { status: 503 },
      );
    }

    await db.collection<DashboardEvent>("dashboard_events").insertOne({
      type,
      socioId: user.sub,
      metadata: body.metadata,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, configured: true });
  } catch (error) {
    console.error("Dashboard activity write error", error);
    return NextResponse.json(
      { ok: false, configured: false, error: "No se pudo registrar el evento" },
      { status: 500 },
    );
  }
}
