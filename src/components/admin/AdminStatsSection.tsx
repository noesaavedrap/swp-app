"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Loader2,
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

export default function AdminStatsSection() {
  const [stats, setStats] = useState<StatsData | null>(null);
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
      supabase.from("transacciones").select("tipo,monto,estado"),
    ]);

    const sociosActivos = socios?.filter((s) => s.activo).length ?? 0;
    const allTx = transacciones ?? [];
    const totalIngresos = allTx
      .filter((t) => t.tipo === "ingreso" && t.estado === "completado")
      .reduce((acc, t) => acc + Number(t.monto), 0);
    const totalEgresos = allTx
      .filter((t) => t.tipo === "egreso" && t.estado === "completado")
      .reduce((acc, t) => acc + Number(t.monto), 0);
    const transaccionesPendientes = allTx.filter(
      (t) => t.estado === "pendiente"
    ).length;

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
      icon: TrendingUp,
      color: stats.totalIngresos - stats.totalEgresos >= 0
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
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-border bg-white p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
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
  );
}
