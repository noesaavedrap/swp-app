import type { Metadata } from "next";
import SocioForm from "@/components/SocioForm";

export const metadata: Metadata = {
  title: "SWP | Iniciar sesión — Socios",
  description: "Accede a tu dashboard de socios en SWP Finance.",
};

export default function SocioLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-12">
      <SocioForm mode="login" />
    </div>
  );
}
