import type { Metadata } from "next";
import CorporatePage from "@/components/CorporatePage";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Clientes | SWP",
  description: "Empresas latinoamericanas que escalan su operación con SWP.",
};

export default function ClientesPage() {
  return (
    <CorporatePage
      eyebrow="Clientes SWP"
      title="La operación que tu equipo necesita para avanzar."
      description="Desde negocios digitales hasta equipos regionales, SWP convierte operaciones complejas en decisiones simples."
    >
      <Stats />
      <Testimonials />
      <CTA />
    </CorporatePage>
  );
}
