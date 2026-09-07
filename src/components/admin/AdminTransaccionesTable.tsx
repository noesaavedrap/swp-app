"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Loader2, Receipt } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

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
  socio_nombre?: string;
}

export default function AdminTransaccionesTable() {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabase();

    const { data: txData, error } = await supabase
      .from("transacciones")
      .select("*")
      .order("creado_en", { ascending: false })
      .limit(50);

    if (error || !txData) {
      setLoading(false);
      return;
    }

    const socioIds = [...new Set(txData.map((t) => t.socio_id))];
    const { data: sociosData } = await supabase
      .from("socios")
      .select("id,nombres,apellidos")
      .in("id", socioIds);

    const socioMap = new Map(
      (sociosData ?? []).map((s) => [
        s.id,
        `${s.nombres || ""} ${s.apellidos || ""}`.trim() || "Desconocido",
      ])
    );

    const enriched = txData.map((t) => ({
      ...t,
      socio_nombre: socioMap.get(t.socio_id) ?? "Desconocido",
    }));

    setTransacciones(enriched as Transaccion[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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

  const estadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      completado: "bg-emerald-50 text-emerald-700",
      pendiente: "bg-yellow-50 text-yellow-700",
      rechazado: "bg-red-50 text-red-600",
      reembolsado: "bg-blue-50 text-blue-600",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
          styles[estado] ?? "bg-secondary text-text-secondary"
        }`}
      >
        {estado}
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-text-tertiary" />
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Últimas Transacciones
          </h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-text-tertiary">
            {transacciones.length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-5 animate-spin text-brand" />
        </div>
      ) : transacciones.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm font-light text-text-tertiary">
          No hay transacciones registradas aún.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Tipo
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Socio
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Concepto
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Monto
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Método
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Estado
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transacciones.map((t) => {
                const isIngreso = t.tipo === "ingreso";
                return (
                  <tr
                    key={t.id}
                    className="hover:bg-secondary/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div
                        className={`flex size-8 items-center justify-center rounded-full ${
                          isIngreso ? "bg-brand/10" : "bg-red-50"
                        }`}
                      >
                        {isIngreso ? (
                          <ArrowDownLeft className="size-4 text-brand" />
                        ) : (
                          <ArrowUpRight className="size-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-text-primary">
                        {t.socio_nombre}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {t.concepto || "—"}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${
                        isIngreso ? "text-brand" : "text-red-500"
                      }`}
                    >
                      {isIngreso ? "+" : "-"}
                      {formatMoney(Number(t.monto))}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-tertiary capitalize">
                      {t.metodo}
                    </td>
                    <td className="px-6 py-4">{estadoBadge(t.estado)}</td>
                    <td className="px-6 py-4 text-xs text-text-tertiary">
                      {formatDate(t.creado_en)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
