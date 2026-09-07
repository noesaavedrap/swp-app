import type { Metadata } from "next";
import CorporatePage from "@/components/CorporatePage";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Precios | SWP",
  description: "Planes flexibles para empresas que necesitan crecer con control.",
};

export default function PreciosPage() {
  return (
    <CorporatePage
      eyebrow="Planes y precios"
      title="Crece con costos claros y capacidad empresarial."
      description="Empieza sin fricción y escala con herramientas, soporte y analítica alineados al ritmo de tu operación."
    >
      <Pricing />
      <FAQ />
      <CTA />
    </CorporatePage>
  );
}
