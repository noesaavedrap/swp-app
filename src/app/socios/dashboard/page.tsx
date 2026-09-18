import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { currentUser } from "@authgear/nextjs/server";
import { authgearConfig } from "@/lib/authgear";
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

export default async function SocioDashboardPage() {
  const user = await currentUser(authgearConfig);

  if (!user) {
    redirect("/socios/login");
  }

  const socio: Socio = {
      id: user.sub,
      nombres: user.givenName || user.name || "Socio",
      apellidos: user.familyName || "",
      documento: null,
      telefono: null,
      saldo: 0,
      activo: true,
      rol: "socio",
      creado_en: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="mx-auto max-w-[1100px] px-4 py-8 xl:px-0">
        <SocioDashboard socio={socio} />
      </div>
    </div>
  );
}
