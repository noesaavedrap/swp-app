"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight, Loader2, Plus, Zap } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
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

const metodoOptions = ["efectivo", "yape", "plin", "tarjeta", "transferencia", "pagoefectivo"];
const tipoOptions: Array<{ value: Transaccion["tipo"]; label: string }> = [
  { value: "ingreso", label: "Ingreso" },
  { value: "egreso", label: "Egreso" },
  { value: "transferencia", label: "Transferencia" },
];

export default function SocioDashboard({ socio }: { socio: Socio }) {
  const router = useRouter();
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

  const load = useCallback(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("transacciones")
      .select("*")
      .order("creado_en", { ascending: false })
      .limit(100);
    if (!error && data) setTransacciones(data as Transaccion[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

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
    const supabase = getSupabase();
    const { error } = await supabase.from("transacciones").insert({
      socio_id: socio.id,
      tipo,
      monto: amount,
      concepto: concepto.trim() || null,
      contraparte: controparteLabel(),
      metodo,
      estado: "completado",
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
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
  const ingresos = transacciones
    .filter((t) => t.estado === "completado" && t.tipo === "ingreso")
    .reduce((acc, t) => acc + Number(t.monto), 0);
  const egresos = transacciones
    .filter((t) => t.estado === "completado" && t.tipo === "egreso")
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
    await getSupabase().auth.signOut();
    router.push("/socios");
    router.refresh();
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