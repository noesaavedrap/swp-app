"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAuthgearConfig, getAuthgearSessionCookie } from "@/lib/authgear";
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

  useEffect(() => {
    const config = getAuthgearConfig();
    const session = getAuthgearSessionCookie();

    if (!config || !session?.sub) {
      router.push("/socios/login");
      return;
    }

    const user = {
      id: session.sub,
      nombres: session.given_name || session.name || "Socio",
      apellidos: session.family_name || "",
      documento: null,
      telefono: null,
      saldo: 0,
      activo: true,
      rol: "socio",
      creado_en: new Date().toISOString(),
    };

    setSocio(user);
    setLoading(false);
  }, [router]);

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

  if (!socio) return null;

  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto max-w-[1100px] px-4 py-8 xl:px-0">
        <SocioDashboard socio={socio} />
      </div>
    </div>
  );
}
