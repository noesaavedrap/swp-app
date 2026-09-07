import type { Metadata } from "next";
import CorporatePage from "@/components/CorporatePage";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | SWP",
  description: "Respuestas sobre pagos, seguridad, precios y operación con SWP.",
};

export default function FAQPage() {
  return (
    <CorporatePage
      eyebrow="Centro de ayuda"
      title="Respuestas claras para operar con confianza."
      description="Encuentra información sobre la plataforma, métodos de pago, seguridad y el crecimiento de tu negocio."
    >
      <FAQ />
      <CTA />
    </CorporatePage>
  );
}
