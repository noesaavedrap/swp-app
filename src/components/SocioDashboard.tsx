"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Filter,
  Loader2,
  Plus,
  Search,
  Zap,
} from "lucide-react";
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

const metodoOptions = [
  "efectivo",
  "yape",
  "plin",
  "tarjeta",
  "transferencia",
  "pagoefectivo",
];

const tipoOptions: Array<{ value: Transaccion["tipo"]; label: string }> = [
  { value: "ingreso", label: "Ingreso" },
  { value: "egreso", label: "Egreso" },
  { value: "transferencia", label: "Transferencia" },
];

export default function SocioDashboard({ socio: initialSocio }: { socio: Socio }) {
  const router = useRouter();
  const [socio, setSocio] = useState<Socio>(initialSocio);
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

  // Filters
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroMetodo, setFiltroMetodo] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");

  const loadTransacciones = useCallback(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("transacciones")
      .select("*")
      .eq("socio_id", socio.id)
      .order("creado_en", { ascending: false })
      .limit(200);
    if (!error && data) setTransacciones(data as Transaccion[]);
    setLoading(false);
  }, [socio.id]);

  const loadSocio = useCallback(async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("socios")
      .select("*")
      .eq("id", socio.id)
      .single();
    if (data) setSocio(data as Socio);
  }, [socio.id]);

  useEffect(() => {
    loadTransacciones();

    const supabase = getSupabase();
    const channel = supabase
      .channel(`dashboard-${socio.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transacciones",
          filter: `socio_id=eq.${socio.id}`,
        },
        () => {
          loadTransacciones();
          loadSocio(); // actualiza saldo en tiempo real
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "socios",
          filter: `id=eq.${socio.id}`,
        },
        () => loadSocio()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadTransacciones, loadSocio, socio.id]);

  const crear = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amount = Number(monto);
    if (!amount || amount <= 0) {
      setError("Ingresa un monto válido.");
      return;
    }
    if (tipo === "transferencia" && !contraparte.trim()) {
      setError("Indica la contraparte de la transferencia.");
      return;
    }

    setSaving(true);
    const supabase = getSupabase();
    const { error: insertError } = await supabase.from("transacciones").insert({
      socio_id: socio.id,
      tipo,
      monto: amount,
      concepto: concepto.trim() || null,
      contraparte: tipo === "transferencia" ? contraparte.trim() : null,
      metodo,
      estado: "completado",
    });
    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setShowForm(false);
    setMonto("");
    setConcepto("");
    setContraparte("");
    setMetodo("efectivo");
    setTipo("ingreso");
    // El trigger + realtime se encargan del resto
  };

  // Cálculos del mes actual
  const now = new Date();
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);

  const transaccionesMes = useMemo(
    () =>
      transacciones.filter(
        (t) =>
          t.estado === "completado" && new Date(t.creado_en) >= inicioMes
      ),
    [transacciones, inicioMes]
  );

  const ingresos = transaccionesMes
    .filter((t) => t.tipo === "ingreso")
    .reduce((acc, t) => acc + Number(t.monto), 0);

  const egresos = transaccionesMes
    .filter((t) => t.tipo === "egreso" || t.tipo === "transferencia")
    .reduce((acc, t) => acc + Number(t.monto), 0);

  // Filtros aplicados
  const transaccionesFiltradas = useMemo(() => {
    return transacciones.filter((t) => {
      if (filtroTipo !== "todos" && t.tipo !== filtroTipo) return false;
      if (filtroMetodo !== "todos" && t.metodo !== filtroMetodo) return false;
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        const match =
          (t.concepto || "").toLowerCase().includes(q) ||
          (t.contraparte || "").toLowerCase().includes(q) ||
          t.metodo.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [transacciones, filtroTipo, filtroMetodo, busqueda]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(n);

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

  const exportCSV = () => {
    const headers = [
      "Fecha",
      "Tipo",
      "Monto",
      "Concepto",
      "Contraparte",
      "Método",
      "Estado",
    ];
    const rows = transaccionesFiltradas.map((t) => [
      new Date(t.creado_en).toISOString(),
      t.tipo,
      t.monto,
      t.concepto || "",
      t.contraparte || "",
      t.metodo,
      t.estado,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movimientos-swp-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
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
              Rol: {socio.rol} ·{" "}
              {socio.documento ? `Doc. ${socio.documento}` : "Sin documento"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
            Saldo disponible
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
            {formatMoney(Number(socio.saldo))}
          </p>
          <p className="mt-1 text-xs text-text-tertiary">Actualizado en tiempo real</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
            Ingresos del mes
          </p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-brand">
            <ArrowDownLeft className="size-5" />
            {formatMoney(ingresos)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
            Egresos del mes
          </p>
          <p className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight text-red-500">
            <ArrowUpRight className="size-5" />
            {formatMoney(egresos)}
          </p>
        </div>
      </div>

      {/* Movimientos */}
      <div className="rounded-2xl border border-border bg-white shadow-card">
        <div className="flex flex-col gap-4 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Movimientos
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={exportCSV}>
              <Download className="size-4" /> Exportar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowForm((v) => !v)}
            >
              <Plus className="size-4" /> Nueva transacción
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-secondary/30 px-6 py-3">
          <div className="flex items-center gap-2 text-text-tertiary">
            <Filter className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              Filtros
            </span>
          </div>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="todos">Todos los tipos</option>
            {tipoOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={filtroMetodo}
            onChange={(e) => setFiltroMetodo(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="todos">Todos los métodos</option>
            {metodoOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-tertiary" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar concepto o contraparte..."
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <form
            onSubmit={crear}
            className="grid gap-4 border-b border-border bg-secondary/40 px-6 py-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
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

            {tipo === "transferencia" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                  Contraparte
                </span>
                <input
                  type="text"
                  value={contraparte}
                  onChange={(e) => setContraparte(e.target.value)}
                  required
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
                  placeholder="Nombre o cuenta destino"
                />
              </label>
            )}

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

        {/* Lista */}
        <div className="divide-y divide-border">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-text-tertiary">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : transaccionesFiltradas.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm font-light text-text-tertiary">
              {transacciones.length === 0
                ? "Aún no tienes movimientos. Crea tu primera transacción."
                : "No hay resultados con los filtros aplicados."}
            </p>
          ) : (
            transaccionesFiltradas.map((t) => {
              const isIngreso = t.tipo === "ingreso";
              const color =
                t.estado === "rechazado"
                  ? "text-red-500"
                  : isIngreso
                    ? "text-brand"
                    : "text-red-500";
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-secondary/40"
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
