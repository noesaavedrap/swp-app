import type { Metadata } from "next";
import SocioForm from "@/components/SocioForm";

export const metadata: Metadata = {
  title: "SWP | Crear cuenta — Socios",
  description: "Regístrate como socio en SWP Finance.",
};

export default function SocioRegistroPage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4 py-12">
      <SocioForm mode="signup" />
    </div>
  );
}
