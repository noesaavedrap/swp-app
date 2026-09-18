"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSupabase, hasSupabaseConfig } from "@/lib/supabase";
import SocioDashboard from "@/components/SocioDashboard";

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

export default function SocioDashboardPage() {
  const router = useRouter();
  const [socio, setSocio] = useState<Socio | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    if (!hasSupabaseConfig()) {
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/socios/login");
      return;
    }

    const { data: socioData, error } = await supabase
      .from("socios")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !socioData) {
      router.push("/socios/login");
      return;
    }

    setSocio(socioData as Socio);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-brand" />
          <p className="text-sm font-light text-text-tertiary">
            Verificando sesión...
          </p>
        </div>
      </div>
    );
  }

  if (!socio && !hasSupabaseConfig()) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-card">
          <h1 className="text-xl font-semibold text-text-primary">Autenticación pendiente</h1>
          <p className="mt-3 text-sm text-text-secondary">
            Configura Authgear o Supabase para habilitar la sesión de socios.
          </p>
          <a
            href="/socios/login"
            className="mt-5 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-medium text-black"
          >
            Ir al login
          </a>
        </div>
      </div>
    );
  }

  if (!socio) return null;

  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto max-w-[1100px] px-4 py-8 xl:px-0">
        <SocioDashboard socio={socio} />
      </div>
    </div>
  );
}
