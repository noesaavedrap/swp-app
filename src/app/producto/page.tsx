import type { Metadata } from "next";
import CorporatePage from "@/components/CorporatePage";
import Features from "@/components/Features";
import Showcase from "@/components/Showcase";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Producto | SWP",
  description: "Pagos, ecommerce y operación financiera en una plataforma empresarial.",
};

export default function ProductoPage() {
  return (
    <CorporatePage
      eyebrow="Producto SWP"
      title="Una infraestructura financiera para cada etapa de tu negocio."
      description="Centraliza cobros, ventas y operación con herramientas diseñadas para crecer en Latinoamérica."
    >
      <Features />
      <Showcase />
      <CTA />
    </CorporatePage>
  );
}
