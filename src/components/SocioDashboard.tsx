"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  DatabaseZap,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { getSupabase, hasSupabaseConfig } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface Socio {
  id: string;
  nombres: string;
  apellidos: string;
  documento: string | null;
  telefono: string | null;
  saldo: number;
  activo: boolean;
  rol: string;
  creado_en: string;
}

interface Transaccion {
  id: string;
  socio_id: string;
  tipo: "ingreso" | "egreso" | "transferencia";
  monto: number;
  concepto: string | null;
  contraparte: string | null;
  metodo: string;
  estado: string;
  creado_en: string;
}

interface DashboardActivity {
  type: "dashboard_view" | "transaction_created";
  createdAt: string;
}

const metodoOptions = ["efectivo", "yape", "plin", "tarjeta", "transferencia", "pagoefectivo"];
const tipoOptions: Array<{ value: Transaccion["tipo"]; label: string }> = [
  { value: "ingreso", label: "Ingreso" },
  { value: "egreso", label: "Egreso" },
  { value: "transferencia", label: "Transferencia" },
];

const chartBars = [18, 32, 24, 48, 40, 62, 54, 76, 68, 82, 72, 90];

export default function SocioDashboard({ socio }: { socio: Socio }) {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState<Transaccion["tipo"]>("ingreso");
  const [monto, setMonto] = useState("");
  const [concepto, setConcepto] = useState("");
  const [contraparte, setContraparte] = useState("");
  const [metodo, setMetodo] = useState("efectivo");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activityEvents, setActivityEvents] = useState<DashboardActivity[]>([]);
  const [mongoConfigured, setMongoConfigured] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    if (!hasSupabaseConfig()) {
      setTransacciones([]);
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("transacciones")
      .select("*")
      .order("creado_en", { ascending: false })
      .limit(100);
    if (error) {
      setLoadError("No pudimos cargar tus movimientos. Intenta actualizar.");
    } else if (data) {
      setTransacciones(data as Transaccion[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    fetch("/api/dashboard/activity")
      .then((response) => response.json())
      .then((data: { configured?: boolean; events?: DashboardActivity[] }) => {
        setMongoConfigured(Boolean(data.configured));
        setActivityEvents(data.events ?? []);
      })
      .catch(() => setMongoConfigured(false));

    if (!hasSupabaseConfig()) {
      return;
    }

    const supabase = getSupabase();
    const channel = supabase
      .channel("transacciones-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transacciones" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amount = Number(monto);
    if (!amount || amount <= 0) {
      setError("Ingresa un monto válido.");
      return;
    }
    setSaving(true);
    const response = await fetch("/api/transacciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, monto: amount, concepto, contraparte: controparteLabel(), metodo }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    setSaving(false);
    if (!response.ok) {
      setError(payload.error || "No se pudo guardar la transacción.");
      return;
    }
    fetch("/api/dashboard/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "transaction_created",
        metadata: { tipo, monto: amount, metodo },
      }),
    }).catch(() => undefined);
    setShowForm(false);
    setMonto("");
    setConcepto("");
    setContraparte("");
    setMetodo("efectivo");
    setTipo("ingreso");
    load();
  };

  const controparteLabel = () => {
    if (tipo !== "transferencia") return null;
    return contraparte.trim() || null;
  };

  const saldo = Number(socio.saldo);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const ingresos = transacciones
    .filter((t) => t.estado === "completado" && t.tipo === "ingreso" && t.creado_en.startsWith(currentMonth))
    .reduce((acc, t) => acc + Number(t.monto), 0);
  const egresos = transacciones
    .filter((t) => t.estado === "completado" && t.tipo === "egreso" && t.creado_en.startsWith(currentMonth))
    .reduce((acc, t) => acc + Number(t.monto), 0);
  const utilidad = ingresos - egresos;
  const completadas = transacciones.filter((t) => t.estado === "completado").length;

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("es-PE", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const logout = () => {
    window.location.href = "/api/auth/logout";
  };

  const dashboardStats = [
    {
      label: "Saldo disponible",
      value: formatMoney(saldo),
      delta: "+8.2%",
      tone: "bg-brand/10 text-brand",
      icon: Wallet,
    },
    {
      label: "Ingresos del mes",
      value: formatMoney(ingresos),
      delta: "+12.4%",
      tone: "bg-emerald-500/10 text-emerald-300",
      icon: ArrowDownLeft,
    },
    {
      label: "Egresos del mes",
      value: formatMoney(egresos),
      delta: "-3.1%",
      tone: "bg-red-500/10 text-red-300",
      icon: ArrowUpRight,
    },
    {
      label: "Utilidad neta",
      value: formatMoney(utilidad),
      delta: "+5.8%",
      tone: "bg-cyan-500/10 text-cyan-300",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b11] px-4 py-8 text-white">
      <div className="mx-auto max-w-[1280px]">
        <header className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-light shadow-[0_0_24px_rgba(212,255,0,0.25)]">
              <Zap className="size-5 text-[#071019]" strokeWidth={2.6} />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">SWP</p>
              <h1 className="text-xl font-semibold tracking-tight text-white">Dashboard operativo</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-brand">
              <Sparkles className="size-3.5" />
              En vivo
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80">
              {new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(new Date())}
            </div>
            <Button variant="secondary" size="sm" onClick={logout} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              Cerrar sesión
            </Button>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map(({ label, value, delta, tone, icon: Icon }) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-[#0d1218] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.18)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">{label}</p>
                  <p className="mt-4 text-2xl font-semibold tracking-tight text-white">{value}</p>
                </div>
                <div className={`flex size-10 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{delta}</span>
                <span>vs. último mes</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
          <section className="rounded-[30px] border border-white/10 bg-[#0d1218] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between gap-4 pb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Rendimiento</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Flujo de caja</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs text-brand">
                <TrendingUp className="size-3.5" />
                +24.8%
              </div>
            </div>

            <div className="mt-6 flex h-52 items-end gap-2 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent p-4">
              {chartBars.map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <span
                    className={`w-full rounded-t-xl ${index % 2 === 0 ? "bg-gradient-to-t from-brand/80 to-brand-light" : "bg-gradient-to-t from-[#1e293b] to-[#334155]"}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[9px] text-white/35">{["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][index]}</span>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-[#0d1218] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Resumen</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Operación</h3>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <ShieldCheck className="size-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-3">
                  <span className="text-sm text-white/65">Cobros completados</span>
                  <span className="text-sm font-semibold text-white">{completadas}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-3">
                  <span className="text-sm text-white/65">Estado de riesgo</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">Bajo</span>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#0d1218] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Acciones</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">Rápido</h3>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                  <CreditCard className="size-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <button type="button" onClick={() => setShowForm(true)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-3 text-left text-sm text-white hover:bg-white/[0.04]">
                  <span>Nueva transacción</span>
                  <ChevronRight className="size-4 text-white/60" />
                </button>
                <button type="button" className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-3 text-left text-sm text-white hover:bg-white/[0.04]">
                  <span>Ver facturación</span>
                  <ChevronRight className="size-4 text-white/60" />
                </button>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[30px] border border-white/10 bg-[#0d1218] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Actividad</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Últimos eventos</h3>
              </div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <Activity className="size-5" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {activityEvents.length === 0 ? (
                <p className="text-sm text-white/55">Aún no hay eventos registrados.</p>
              ) : (
                activityEvents.slice(0, 4).map((event, index) => (
                  <div key={`${event.type}-${event.createdAt}-${index}`} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-3">
                    <span className="size-2.5 rounded-full bg-brand" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {event.type === "transaction_created" ? "Transacción registrada" : "Sesión del dashboard"}
                      </p>
                    </div>
                    <span className="text-xs text-white/45">{formatActivityDate(event.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#0d1218] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Infraestructura</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Sistema</h3>
              </div>
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#e8f3ff] text-[#2672c8]">
                <DatabaseZap className="size-5" />
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-3">
                <span className="text-white/65">Supabase</span>
                <span className="font-medium text-brand">Activo</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-3">
                <span className="text-white/65">MongoDB Analytics</span>
                <span className={`font-medium ${mongoConfigured ? "text-brand" : "text-white/45"}`}>{mongoConfigured ? "Activo" : "Pendiente"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[30px] border border-white/10 bg-[#0d1218] shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Movimientos</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Últimas transacciones</h2>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowForm((v) => !v)} className="rounded-full bg-brand text-[#071019] hover:bg-brand-light">
              <Plus className="size-4" /> Nueva transacción
            </Button>
          </div>

          {showForm && (
            <form
              onSubmit={crear}
              className="grid gap-4 border-b border-white/10 bg-white/[0.02] px-5 py-5 md:grid-cols-2 xl:grid-cols-5"
            >
              <label className="flex flex-col gap-1.5 text-sm text-white/75">
                <span>Tipo</span>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as Transaccion["tipo"])}
                  className="h-10 rounded-xl border border-white/10 bg-[#090d12] px-3 text-white outline-none focus:border-brand"
                >
                  {tipoOptions.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 text-sm text-white/75">
                <span>Monto (PEN)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="h-10 rounded-xl border border-white/10 bg-[#090d12] px-3 text-white outline-none focus:border-brand"
                  placeholder="0.00"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm text-white/75">
                <span>Concepto</span>
                <input
                  type="text"
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  className="h-10 rounded-xl border border-white/10 bg-[#090d12] px-3 text-white outline-none focus:border-brand"
                  placeholder="ej. Cuota de ahorro"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm text-white/75">
                <span>Método</span>
                <select
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value)}
                  className="h-10 rounded-xl border border-white/10 bg-[#090d12] px-3 text-white outline-none focus:border-brand"
                >
                  {metodoOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              {tipo === "transferencia" && (
                <label className="flex flex-col gap-1.5 text-sm text-white/75">
                  <span>Contraparte</span>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={contraparte}
                    onChange={(e) => setContraparte(e.target.value)}
                    className="h-10 rounded-xl border border-white/10 bg-[#090d12] px-3 text-white outline-none focus:border-brand"
                    placeholder="Cuenta destino"
                  />
                </label>
              )}

              <div className="flex items-end gap-2">
                <Button type="submit" disabled={saving} size="lg" className="flex-1 rounded-xl bg-brand text-[#071019] hover:bg-brand-light">
                  {saving && <Loader2 className="size-4 animate-spin" />}
                  Guardar
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="text-white/70 hover:bg-white/5">
                  ✕
                </Button>
              </div>
            </form>
          )}

          {loadError && (
            <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-red-500/5 px-5 py-3 text-sm text-red-300">
              <span>{loadError}</span>
              <Button type="button" variant="ghost" size="sm" onClick={load} className="text-red-200 hover:bg-red-500/10">
                Reintentar
              </Button>
            </div>
          )}

          {error && <p className="px-5 py-3 text-sm text-red-300">{error}</p>}

          <div className="divide-y divide-white/10">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-white/45">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : transacciones.length === 0 ? (
              <p className="px-5 py-12 text-center text-sm text-white/55">Aún no tienes movimientos. Crea tu primera transacción.</p>
            ) : (
              transacciones.map((t) => {
                const isIngreso = t.tipo === "ingreso";
                const color = t.estado === "rechazado" ? "text-red-300" : isIngreso ? "text-brand" : "text-red-300";

                return (
                  <div key={t.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-full ${isIngreso ? "bg-brand/10" : "bg-red-500/10"}`}>
                        {isIngreso ? <ArrowDownLeft className={`size-4 ${color}`} /> : <ArrowUpRight className={`size-4 ${color}`} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {t.concepto || "Movimiento"}
                          {t.contraparte ? ` · ${t.contraparte}` : ""}
                        </p>
                        <p className="text-xs text-white/45">
                          {formatDate(t.creado_en)} · {t.metodo} · {t.estado}
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm font-semibold ${color}`}>
                      {isIngreso ? "+" : "-"}
                      {formatMoney(Number(t.monto))}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatActivityDate(iso: string) {
  return new Date(iso).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}