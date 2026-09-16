import { NextResponse } from "next/server";
import { getMongoDb, isMongoConfigured } from "@/lib/mongodb";
import { getSupabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

interface DashboardEvent {
  type: "dashboard_view" | "transaction_created";
  socioId: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: Date;
}

export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

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
      socioId: user.id,
      createdAt: new Date(),
    });

    const recentEvents = await events
      .find({ socioId: user.id })
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
    return NextResponse.json({ ok: true, configured: false, events: [] });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
    }

    const db = await getMongoDb();
    if (!db) {
      return NextResponse.json({ ok: true, configured: false });
    }

    const body = (await request.json()) as {
      type?: DashboardEvent["type"];
      metadata?: DashboardEvent["metadata"];
    };
    const type = body.type === "transaction_created" ? body.type : "dashboard_view";

    await db.collection<DashboardEvent>("dashboard_events").insertOne({
      type,
      socioId: user.id,
      metadata: body.metadata,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, configured: true });
  } catch (error) {
    console.error("Dashboard activity write error", error);
    return NextResponse.json({ ok: true, configured: false });
  }
}
