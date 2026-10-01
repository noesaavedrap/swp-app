import type { Metadata } from "next";
import { ArrowRight, Check, CreditCard, PackageOpen, Palette, ShoppingBag, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Tiendas Shopify | SWP",
  description:
    "Diseñamos y configuramos tu tienda online en Shopify para que puedas lanzar tu negocio digital.",
};

const deliverables = [
  {
    icon: Palette,
    title: "Diseño a tu medida",
    description:
      "Una tienda que representa tu marca y se siente simple de usar en cualquier pantalla.",
  },
  {
    icon: PackageOpen,
    title: "Productos bien presentados",
    description:
      "Organizamos productos y colecciones para que tus clientes encuentren lo que buscan.",
  },
  {
    icon: CreditCard,
    title: "Lista para salir al mundo",
    description:
      "Te acompañamos con la configuración inicial y la revisión antes del lanzamiento.",
  },
];

const steps = [
  { title: "Nos cuentas tu idea", description: "Definimos juntos qué vendes y qué necesita tu tienda." },
  { title: "La construimos contigo", description: "Diseñamos la experiencia, organizamos el catálogo y configuramos Shopify." },
  { title: "La dejamos lista para lanzar", description: "Revisamos cada detalle contigo antes de publicar." },
];

const products = [
  {
    name: "Esencia diaria",
    category: "Cuidado facial",
    price: "S/ 89",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Ritual hidratante",
    category: "Hidratación",
    price: "S/ 69",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=700&q=85",
  },
];

export default function ShopifyPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f8faf6] text-[#173326]">
      <Navbar />
      <section className="bg-[#edf5e8] px-4 pb-8 pt-28 md:pb-16 md:pt-40 xl:px-0">
        <div className="mx-auto grid max-w-[76rem] items-center gap-6 md:gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#bfd6c3] bg-white/70 px-3 py-1.5 text-[11px] font-medium text-[#225a3c] md:text-xs">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Tu tienda Shopify, hecha por SWP
            </span>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.02] md:mt-6 md:text-6xl">
              Tu marca merece una tienda hecha para vender.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#4b6257] md:mt-5 md:text-lg">
              Diseñamos y configuramos tu tienda Shopify para que pases de la idea a un negocio online listo para crecer.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 md:mt-7">
              <Button variant="primary" size="lg" asChild className="bg-[#174f36] text-white hover:bg-[#103e2a]">
                <a href="mailto:ventas@swp.finance?subject=Quiero%20mi%20tienda%20Shopify">
                  Quiero mi tienda <ArrowRight className="size-4" />
                </a>
              </Button>
              <a href="#servicios" className="px-3 py-2 text-sm font-medium text-[#275c40] underline decoration-[#9fbea6] underline-offset-4 hover:text-[#103e2a]">
                Conoce el proceso
              </a>
            </div>
            <p className="mt-3 text-[10px] text-[#64786c] md:mt-5 md:text-xs">Diseño · Catálogo · Configuración de lanzamiento</p>
          </div>

          <div className="mx-auto w-full max-w-[620px]">
            <div className="overflow-hidden rounded-lg border border-[#d7e1d5] bg-white shadow-[0_24px_60px_rgba(25,65,43,0.13)]">
              <div className="hidden h-10 items-center gap-1.5 border-b border-[#e7ece5] px-4 sm:flex">
                <span className="size-2 rounded-full bg-[#d8e1d7]" />
                <span className="size-2 rounded-full bg-[#d8e1d7]" />
                <span className="size-2 rounded-full bg-[#d8e1d7]" />
                <span className="ml-3 rounded-sm bg-[#f2f5f1] px-3 py-1 text-[9px] text-[#87968b]">mitienda.com</span>
              </div>
              <div className="hidden items-center justify-between border-b border-[#edf0eb] px-4 py-3 sm:flex md:px-6">
                <span className="text-[10px] font-bold tracking-[0.12em] text-[#183b2a] md:text-xs">NORTE / ESTUDIO</span>
                <div className="hidden gap-4 text-[9px] text-[#5d6e62] sm:flex">
                  <span>Tienda</span><span>Nosotros</span><span>Contacto</span>
                </div>
                <ShoppingBag className="size-4 text-[#254f37]" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1.05fr_0.95fr]">
                <div className="hidden flex-col justify-center px-4 py-5 sm:flex md:px-7 md:py-8">
                  <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#66816c]">Nueva colección</span>
                  <h2 className="mt-2 text-xl font-medium leading-tight text-[#1d3928] md:text-3xl">Muévete a tu manera.</h2>
                  <p className="mt-2 text-[9px] leading-relaxed text-[#67786b] md:text-xs">Diseño pensado para acompañarte todos los días.</p>
                  <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-sm bg-[#194d34] px-3 py-2 text-[9px] font-medium text-white md:mt-6 md:text-[10px]">Explorar colección <ArrowRight className="size-3" /></span>
                </div>
                <div
                  role="img"
                  aria-label="Productos de cuidado personal en la tienda de muestra"
                  className="min-h-[150px] bg-cover bg-center sm:min-h-[190px] md:min-h-[280px]"
                  style={{ backgroundImage: `url("${products[0].image}")` }}
                />
              </div>
              <div className="hidden grid-cols-2 gap-3 bg-white p-3 sm:grid md:gap-4 md:p-5">
                {products.map((product) => (
                  <article key={product.name}>
                    <div
                      role="img"
                      aria-label={product.name}
                      className="aspect-[1.6] rounded-sm bg-cover bg-center"
                      style={{ backgroundImage: `url("${product.image}")` }}
                    />
                    <div className="mt-2 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[9px] font-medium text-[#263d2e] md:text-[10px]">{product.name}</p>
                        <p className="mt-0.5 text-[8px] text-[#7b897e] md:text-[9px]">{product.category}</p>
                      </div>
                      <span className="text-[9px] font-medium text-[#263d2e] md:text-[10px]">{product.price}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-3 hidden items-center justify-between px-1 text-[10px] text-[#65766a] sm:flex">
              <span>Una vista de ejemplo de tu futura tienda</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#5b9c69]" /> Lista para personalizar</span>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="scroll-mt-24 bg-white px-4 py-14 md:py-20 xl:px-0">
        <div className="mx-auto max-w-[76rem]">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#438354]">Todo para empezar</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#173326] md:text-4xl">Una tienda profesional, sin tener que construirla solo.</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {deliverables.map(({ icon: Icon, title, description }) => (
              <article key={title} className="border-t border-[#dce7dc] pt-5">
                <Icon className="size-5 text-[#37814f]" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-[#173326]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#607266]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#173d2b] px-4 py-14 text-white md:py-20 xl:px-0">
        <div className="mx-auto grid max-w-[76rem] gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8df8e]">De la idea al lanzamiento</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">Tres pasos para poner tu tienda en marcha.</h2>
          </div>
          <ol className="divide-y divide-white/15">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/30 text-sm text-[#c5e99e]">0{index + 1}</span>
                <div>
                  <h3 className="text-base font-medium">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/65">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#e8f1df] px-4 py-14 md:py-20 xl:px-0">
        <div className="mx-auto flex max-w-[76rem] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#438354]">Hagámosla realidad</span>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-[#173326] md:text-4xl">Tu tienda puede empezar con una conversación.</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#53695a]">Cuéntanos qué quieres vender y te ayudamos a definir el siguiente paso.</p>
          </div>
          <Button variant="primary" size="lg" asChild className="bg-[#174f36] text-white hover:bg-[#103e2a]">
            <a href="mailto:ventas@swp.finance?subject=Quiero%20mi%20tienda%20Shopify">
              Hablemos de tu tienda <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  );
}