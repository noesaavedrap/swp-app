"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, ArrowDownLeft, ArrowUpRight, DatabaseZap, Loader2, Plus, Zap } from "lucide-react";
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

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("es-PE", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const logout = async () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-brand to-brand-light">
            <Zap className="size-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              Hola, {socio.nombres}
            </h1>
            <p className="text-xs font-light text-text-tertiary">
              Rol: {socio.rol} · {socio.documento ? `Doc. ${socio.documento}` : "Sin documento"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
            Saldo disponible
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
            {formatMoney(saldo)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
            Ingresos (mes)
          </p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-brand">
            <ArrowDownLeft className="size-5" />
            {formatMoney(ingresos)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
            Egresos (mes)
          </p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-red-500">
            <ArrowUpRight className="size-5" />
            {formatMoney(egresos)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Actividad del dashboard</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-text-primary">Tu operación, sincronizada</h2>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Activity className="size-5" />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {activityEvents.length === 0 ? (
              <p className="text-sm text-text-tertiary">Aún no hay eventos registrados.</p>
            ) : (
              activityEvents.slice(0, 4).map((event, index) => (
                <div key={`${event.type}-${event.createdAt}-${index}`} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5">
                  <span className="size-2 rounded-full bg-brand" />
                  <p className="flex-1 text-sm text-text-secondary">
                    {event.type === "transaction_created" ? "Transacción registrada" : "Sesión del dashboard"}
                  </p>
                  <span className="text-xs text-text-tertiary">{formatActivityDate(event.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e8f3ff] text-[#2672c8]">
              <DatabaseZap className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Infraestructura</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-text-primary">Datos protegidos</h2>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2.5"><span className="text-text-secondary">Supabase</span><span className="font-medium text-brand">Activo</span></div>
            <div className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2.5"><span className="text-text-secondary">MongoDB Analytics</span><span className={`font-medium ${mongoConfigured ? "text-brand" : "text-text-tertiary"}`}>{mongoConfigured ? "Activo" : "Pendiente"}</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Movimientos
          </h2>
          <Button variant="primary" size="sm" onClick={() => setShowForm((v) => !v)}>
            <Plus className="size-4" /> Nueva transacción
          </Button>
        </div>

        {showForm && (
          <form
            onSubmit={crear}
            className="grid gap-4 border-b border-border bg-secondary/40 px-6 py-5 md:grid-cols-2 lg:grid-cols-5"
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                Tipo
              </span>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as Transaccion["tipo"])}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
              >
                {tipoOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                Monto (PEN)
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
                placeholder="0.00"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                Concepto
              </span>
              <input
                type="text"
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
                placeholder="ej. Cuota de ahorro"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                Método
              </span>
              <select
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
              >
                {metodoOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            {tipo === "transferencia" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                  Contraparte
                </span>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={contraparte}
                  onChange={(e) => setContraparte(e.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Persona o cuenta destino"
                />
              </label>
            )}

            <div className="flex items-end gap-2">
              <Button type="submit" disabled={saving} size="lg" className="flex-1">
                {saving && <Loader2 className="size-4 animate-spin" />}
                Guardar
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForm(false)}
                aria-label="Cancelar"
              >
                ✕
              </Button>
            </div>
          </form>
        )}

        {loadError && (
          <div className="flex items-center justify-between gap-4 border-b border-border bg-red-50 px-6 py-3 text-sm text-red-700">
            <span>{loadError}</span>
            <Button type="button" variant="ghost" size="sm" onClick={load}>
              Reintentar
            </Button>
          </div>
        )}

        {error && (
          <p className="px-6 py-3 text-sm text-red-600">{error}</p>
        )}

        <div className="divide-y divide-border">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-text-tertiary">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : transacciones.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm font-light text-text-tertiary">
              Aún no tienes movimientos. Crea tu primera transacción.
            </p>
          ) : (
            transacciones.map((t) => {
              const isIngreso = t.tipo === "ingreso";
              const color =
                t.estado === "rechazado" ? "text-red-500" : isIngreso ? "text-brand" : "text-red-500";
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-9 items-center justify-center rounded-full ${
                        isIngreso ? "bg-brand/10" : "bg-red-50"
                      }`}
                    >
                      {isIngreso ? (
                        <ArrowDownLeft className={`size-4 ${color}`} />
                      ) : (
                        <ArrowUpRight className={`size-4 ${color}`} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {t.concepto || "Movimiento"}
                        {t.contraparte ? ` · ${t.contraparte}` : ""}
                      </p>
                      <p className="text-xs font-light text-text-tertiary">
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
  );
}

function formatActivityDate(iso: string) {
  return new Date(iso).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}