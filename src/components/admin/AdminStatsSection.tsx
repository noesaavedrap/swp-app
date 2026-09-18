"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Loader2,
  DollarSign,
  CircleDashed,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

interface StatsData {
  totalSocios: number;
  sociosActivos: number;
  totalTransacciones: number;
  totalIngresos: number;
  totalEgresos: number;
  transaccionesPendientes: number;
}

interface SocioActivoRow {
  activo: boolean | null;
}

interface TxStatsRow {
  tipo: string;
  monto: number | string;
  estado: string;
  creado_en: string;
  concepto: string | null;
  metodo: string | null;
}

export default function AdminStatsSection() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentTx, setRecentTx] = useState<TxStatsRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    const supabase = getSupabase();

    const [
      { count: totalSocios },
      { data: socios },
      { count: totalTransacciones },
      { data: transacciones },
    ] = await Promise.all([
      supabase.from("socios").select("*", { count: "exact", head: true }),
      supabase.from("socios").select("activo"),
      supabase.from("transacciones").select("*", { count: "exact", head: true }),
      supabase
        .from("transacciones")
        .select("tipo,monto,estado,creado_en,concepto,metodo")
        .order("creado_en", { ascending: false })
        .limit(8),
    ]);

    const sociosRows = (socios ?? []) as SocioActivoRow[];
    const allTx = (transacciones ?? []) as TxStatsRow[];
    const sociosActivos = sociosRows.filter((s) => s.activo).length;
    const totalIngresos = allTx
      .filter((t) => t.tipo === "ingreso" && t.estado === "completado")
      .reduce((acc: number, t) => acc + Number(t.monto), 0);
    const totalEgresos = allTx
      .filter((t) => t.tipo === "egreso" && t.estado === "completado")
      .reduce((acc: number, t) => acc + Number(t.monto), 0);
    const transaccionesPendientes = allTx.filter(
      (t) => t.estado === "pendiente"
    ).length;

    setRecentTx(allTx);
    setStats({
      totalSocios: totalSocios ?? 0,
      sociosActivos,
      totalTransacciones: totalTransacciones ?? 0,
      totalIngresos,
      totalEgresos,
      transaccionesPendientes,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(n);

  const monthTrend = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const ingresos = (recentTx ?? [])
        .filter(
          (t) =>
            t.tipo === "ingreso" &&
            t.estado === "completado" &&
            t.creado_en?.startsWith(monthKey)
        )
        .reduce((acc, t) => acc + Number(t.monto), 0);
      const egresos = (recentTx ?? [])
        .filter(
          (t) =>
            t.tipo === "egreso" &&
            t.estado === "completado" &&
            t.creado_en?.startsWith(monthKey)
        )
        .reduce((acc, t) => acc + Number(t.monto), 0);

      return {
        label: date.toLocaleDateString("es-PE", { month: "short" }),
        ingresos,
        egresos,
      };
    });
  }, [recentTx]);

  const maxMonthlyValue = Math.max(
    1,
    ...monthTrend.flatMap((item) => [item.ingresos, item.egresos])
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: "Total Socios",
      value: stats.totalSocios.toString(),
      sub: `${stats.sociosActivos} activos`,
      icon: Users,
      color: "bg-brand-100 text-brand",
    },
    {
      label: "Transacciones",
      value: stats.totalTransacciones.toString(),
      sub: `${stats.transaccionesPendientes} pendientes`,
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Ingresos Totales",
      value: formatMoney(stats.totalIngresos),
      sub: "Completados",
      icon: ArrowDownLeft,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Egresos Totales",
      value: formatMoney(stats.totalEgresos),
      sub: "Completados",
      icon: ArrowUpRight,
      color: "bg-red-50 text-red-500",
    },
    {
      label: "Balance Neto",
      value: formatMoney(stats.totalIngresos - stats.totalEgresos),
      sub: "Ingresos - Egresos",
      icon: DollarSign,
      color:
        stats.totalIngresos - stats.totalEgresos >= 0
          ? "bg-brand-100 text-brand"
          : "bg-red-50 text-red-500",
    },
    {
      label: "Tasa Aprobación",
      value:
        stats.totalTransacciones > 0
          ? `${(
              ((stats.totalTransacciones - stats.transaccionesPendientes) /
                stats.totalTransacciones) *
              100
            ).toFixed(1)}%`
          : "0%",
      sub: "Transacciones completadas",
      icon: CircleDashed,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-white p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-light uppercase tracking-[0.18em] text-text-tertiary">
                {card.label}
              </p>
              <div
                className={`flex size-9 items-center justify-center rounded-lg ${card.color}`}
              >
                <card.icon className="size-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
              {card.value}
            </p>
            <p className="mt-1 text-xs font-light text-text-tertiary">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-light uppercase tracking-[0.18em] text-text-tertiary">
                Rendimiento
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-text-primary">
                Ingresos y egresos últimos 6 meses
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-tertiary">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-brand" /> Ingresos
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-400" /> Egresos
              </span>
            </div>
          </div>

          <div className="mt-8 flex h-52 items-end gap-3">
            {monthTrend.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-36 w-full items-end justify-center gap-1">
                  <span
                    className="w-1/2 rounded-t-md bg-brand/90"
                    style={{ height: `${(item.ingresos / maxMonthlyValue) * 100}%` }}
                    title={`${item.label}: ingresos ${formatMoney(item.ingresos)}`}
                  />
                  <span
                    className="w-1/2 rounded-t-md bg-red-400/80"
                    style={{ height: `${(item.egresos / maxMonthlyValue) * 100}%` }}
                    title={`${item.label}: egresos ${formatMoney(item.egresos)}`}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <p className="text-[11px] font-light uppercase tracking-[0.18em] text-text-tertiary">
            Actividad reciente
          </p>
          <div className="mt-5 space-y-3">
            {recentTx.length === 0 ? (
              <p className="text-sm text-text-tertiary">Sin actividad aún.</p>
            ) : (
              recentTx.slice(0, 5).map((transaction, index) => {
                const sign = transaction.tipo === "ingreso" ? "+" : "-";
                const tone =
                  transaction.tipo === "ingreso" ? "text-brand" : "text-red-500";
                return (
                  <div
                    key={`${transaction.creado_en}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl bg-secondary px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {transaction.concepto || "Movimiento"}
                      </p>
                      <p className="text-[11px] text-text-tertiary">
                        {transaction.metodo || "N/D"} · {transaction.estado}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${tone}`}>
                      {sign}
                      {formatMoney(Number(transaction.monto))}
                    </span>
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
