import type { Metadata } from "next";
import { ArrowRight, Check, Palette, PackageOpen, Settings2 } from "lucide-react";
import CorporatePage from "@/components/CorporatePage";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tiendas Shopify | SWP",
  description:
    "Diseñamos y configuramos tu tienda online en Shopify para que puedas lanzar tu negocio digital.",
};

const deliverables = [
  {
    icon: Palette,
    title: "Diseño de tu tienda",
    description:
      "Una experiencia alineada con tu marca, fácil de recorrer desde el móvil y el computador.",
  },
  {
    icon: PackageOpen,
    title: "Catálogo organizado",
    description:
      "Productos, colecciones e información esencial listos para que tus clientes encuentren lo que buscan.",
  },
  {
    icon: Settings2,
    title: "Configuración de lanzamiento",
    description:
      "Te acompañamos con los ajustes iniciales de la tienda y la preparación antes de salir al aire.",
  },
];

const steps = [
  "Conocemos tu marca y tus objetivos",
  "Diseñamos y configuramos Shopify contigo",
  "Revisamos la tienda y preparamos el lanzamiento",
];

export default function ShopifyPage() {
  return (
    <CorporatePage
      eyebrow="Diseño y configuración Shopify"
      title="Tu tienda online, hecha para tu marca."
      description="Creamos contigo una tienda en Shopify clara, atractiva y lista para presentar tus productos al mundo."
    >
      <section className="swp-section px-4 py-16 text-white md:py-24 xl:px-0">
        <div className="mx-auto max-w-[76rem]">
          <div className="max-w-2xl">
            <span className="swp-kicker">Un buen comienzo para vender online</span>
            <h2 className="mt-4 text-3xl font-light leading-tight md:text-4xl">
              De tu idea a una tienda que se siente tuya.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            {deliverables.map(({ icon: Icon, title, description }) => (
              <article key={title} className="border-t border-white/15 pt-6">
                <Icon className="size-5 text-brand" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-medium">{title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-white/65">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="swp-section border-y border-white/10 bg-white/[0.025] px-4 py-16 text-white md:py-20 xl:px-0">
        <div className="mx-auto grid max-w-[76rem] gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <span className="swp-kicker">Cómo trabajamos</span>
            <h2 className="mt-4 text-3xl font-light leading-tight">
              Un proceso simple, de principio a lanzamiento.
            </h2>
          </div>
          <ol className="divide-y divide-white/10">
            {steps.map((step, index) => (
              <li key={step} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-brand/40 text-xs text-brand">
                  {index + 1}
                </span>
                <span className="flex gap-3 text-sm font-light leading-relaxed text-white/80">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="swp-section px-4 py-16 text-white md:py-24 xl:px-0">
        <div className="mx-auto flex max-w-[76rem] flex-col items-start justify-between gap-8 border-t border-brand/30 pt-8 md:flex-row md:items-center">
          <div>
            <span className="swp-kicker">Hablemos de tu proyecto</span>
            <h2 className="mt-4 max-w-2xl text-3xl font-light leading-tight md:text-4xl">
              ¿Listo para darle forma a tu tienda?
            </h2>
            <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-white/65">
              Cuéntanos qué quieres vender y te ayudamos a definir el siguiente paso.
            </p>
          </div>
          <Button variant="primary" size="lg" asChild>
            <a href="mailto:ventas@swp.finance?subject=Quiero%20mi%20tienda%20Shopify">
              Cuéntanos tu idea <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>
    </CorporatePage>
  );
}