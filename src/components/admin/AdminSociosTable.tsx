"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, Loader2, UserCheck, UserX } from "lucide-react";
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

export default function AdminSociosTable() {
  const [socios, setSocios] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("socios")
      .select("*")
      .order("creado_en", { ascending: false });
    if (!error && data) setSocios(data as Socio[]);
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
    new Date(iso).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const toggleActivo = async (socio: Socio) => {
    const supabase = getSupabase();
    await supabase
      .from("socios")
      .update({ activo: !socio.activo })
      .eq("id", socio.id);
    load();
  };

  return (
    <div className="rounded-2xl border border-border bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-text-tertiary" />
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Socios
          </h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-text-tertiary">
            {socios.length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-5 animate-spin text-brand" />
        </div>
      ) : socios.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm font-light text-text-tertiary">
          No hay socios registrados aún.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Socio
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Documento
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Saldo
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Rol
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Estado
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Registro
                </th>
                <th className="px-6 py-3 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {socios.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                        <span className="text-xs font-medium">
                          {(s.nombres?.[0] || "?").toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {s.nombres || "Sin nombre"}{" "}
                          {s.apellidos || ""}
                        </p>
                        <p className="text-xs font-light text-text-tertiary truncate max-w-[200px]">
                          {s.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {s.documento || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {formatMoney(Number(s.saldo))}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        s.rol === "admin"
                          ? "bg-brand-100 text-brand-700"
                          : "bg-secondary text-text-secondary"
                      }`}
                    >
                      {s.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        s.activo ? "text-brand" : "text-red-500"
                      }`}
                    >
                      {s.activo ? (
                        <UserCheck className="size-3" />
                      ) : (
                        <UserX className="size-3" />
                      )}
                      {s.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-text-tertiary">
                    {formatDate(s.creado_en)}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant={s.activo ? "ghost" : "primary"}
                      size="sm"
                      onClick={() => toggleActivo(s)}
                    >
                      {s.activo ? "Desactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
