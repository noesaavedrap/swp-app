"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import ClientVideoCard from "@/components/ClientVideoCard";

const clientVideos = [
  {
    handle: "@jackistore_pe",
    label: "Jacki Store",
    id: "7644307733788757268",
    href: "https://www.tiktok.com/@jackistore_pe/video/7644307733788757268",
  },
  {
    handle: "@chiquitas.co",
    label: "Chiquitas",
    id: "7660635874199194900",
    href: "https://www.tiktok.com/@chiquitas.co/video/7660635874199194900",
  },
  {
    handle: "@el_mayorista_oficial",
    label: "El Mayorista",
    id: "7603895435941481746",
    href: "https://www.tiktok.com/@el_mayorista_oficial/video/7603895435941481746",
  },
  {
    handle: "@distribuidorajoya",
    label: "Distribuidora Joya",
    id: "7582432917205306625",
    href: "https://www.tiktok.com/@distribuidorajoya/video/7582432917205306625",
  },
];

const testimonials = [
  {
    initials: "MR",
    name: "María Rodríguez",
    role: "Dueña de boutique, Ciudad de México",
    quote:
      "Desde que uso SWP Pay, mis clientes pagan con tarjeta, Yape o lo que tengan a mano. Las ventas subieron un 40% en dos meses.",
  },
  {
    initials: "CL",
    name: "Carlos López",
    role: "Director de e-commerce, Bogotá",
    quote:
      "El checkout de SWP es el más rápido que probé. Nuestros clientes completan la compra en segundos y la tasa de conversión mejoró notablemente.",
  },
  {
    initials: "AF",
    name: "Ana Fernández",
    role: "Fundadora de tienda online, Lima",
    quote:
      "SWP Store me permitió lanzar mi tienda en un día. Inventario, pagos y envíos, todo conectado sin complicaciones técnicas.",
  },
  {
    initials: "JM",
    name: "Javier Morales",
    role: "CEO de restaurante, Santiago",
    quote:
      "Lo que más valoro es el settlement T+0. El dinero de las ventas del día lo tengo disponible de inmediato. Eso cambia tu flujo de caja.",
  },
  {
    initials: "LP",
    name: "Laura Paredes",
    role: "Gerente de retail, Buenos Aires",
    quote:
      "Pasé de pagar tres comisiones distintas a una sola con SWP. Ahorro miles al mes y todo se ve en un solo panel de control.",
  },
  {
    initials: "RC",
    name: "Roberto Castillo",
    role: "Emprendedor, Montevideo",
    quote:
      "El soporte de SWP es excepcional. Cada vez que tengo una duda, me responden rápido y solucionan todo. Se nota que conocen el mercado latinoamericano.",
  },
];

export default function Testimonials() {
  return (
    <section className="swp-section py-10 md:py-14 lg:py-28">
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="swp-kicker">Historias de crecimiento</span>
          <h2 className="mt-3 text-[32px] lg:text-[44px] font-light text-white -tracking-[0.96px] leading-tight">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-2 text-md font-light text-white/65 max-w-[560px] mx-auto">
            Empresas reales, resultados reales con la plataforma financiera de SWP.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-6 gap-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="col-span-6 flex flex-col items-start justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-md md:col-span-3 lg:col-span-2 xl:rounded-2xl"
            >
              <figure className="flex-1">
                <blockquote className="text-md font-light text-white/85 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </figure>

              <figcaption className="mt-5 flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-5 py-3">
                <div className="bg-brand-100 text-brand-700 rounded-full size-10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium">{t.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {t.name}
                  </p>
                  <p className="truncate text-xs text-white/45">{t.role}</p>
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="text-yellow-400 size-4 fill-yellow-400"
                    />
                  ))}
                </div>
              </figcaption>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="swp-kicker">Clientes en movimiento</span>
              <h3 className="mt-3 text-2xl font-light tracking-tight text-white md:text-3xl">
                Mira cómo lo están haciendo.
              </h3>
            </div>
            <p className="max-w-sm text-sm font-light leading-relaxed text-white/55 md:text-right">
              Historias y productos reales publicados por negocios que forman parte de nuestro ecosistema.
            </p>
          </div>

          <div className="swp-video-marquee mt-7" aria-label="Videos de clientes">
            <div className="swp-video-track">
              {[...clientVideos, ...clientVideos].map((client, index) => (
                <ClientVideoCard
                  key={`${client.href}-${index}`}
                  client={client}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

