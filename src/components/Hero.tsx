"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Play,
  Star,
  X,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Hero() {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#d1fae5_0%,#FFFFFF_100%)]">
      <div className="mx-auto max-w-[76rem] px-4 pt-28 md:pt-36 xl:px-0 lg:pt-40">
        <div className="flex flex-col md:flex-row items-center gap-10 gap-x-16">
          {/* Left text column */}
          <div className="flex-1 max-w-[580px]">
            {/* Pill badge */}
            <div className="animate-in fade-in slide-in-from-top-4 duration-700 fill-mode-both">
              <div className="flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-white/60 p-1 pr-3 text-sm font-light text-text-secondary backdrop-blur-[3px]">
                <Badge
                  variant="brand"
                  className="px-2 py-0.5 text-xs font-medium"
                >
                  NUEVO
                </Badge>
                Nueva versión disponible · SWP 2.0
              </div>
            </div>

            {/* Heading */}
            <h1 className="mt-6 animate-in fade-in slide-in-from-bottom-4 delay-150 duration-700 fill-mode-both text-text-primary font-light -tracking-[1.2px] text-[44px] leading-[1.05] md:text-[60px] lg:text-[68px]">
              La infraestructura de{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand to-brand-light">
                pagos y comercio
              </span>{" "}
              para empresas que escalan en LATAM
            </h1>

            {/* Subtitle */}
            <p className="mt-5 animate-in fade-in slide-in-from-bottom-4 delay-300 duration-700 fill-mode-both text-md font-light text-text-secondary max-w-[520px] leading-relaxed">
              SWP consolida pagos, ecommerce y operación financiera en una única
              plataforma segura para compañías en crecimiento de Latinoamérica:
              más control, menor costo y decisiones basadas en datos.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-4 delay-500 duration-700 fill-mode-both">
              <Button variant="dark" size="lg" asChild>
                <Link href="/socios/registro">
                Solicitar acceso
                <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setPreviewOpen(true)}>
                <Play className="mr-2 size-4" />
                Ver plataforma
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 delay-700 duration-700 fill-mode-both">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm font-light text-text-secondary">
                Confían en SWP: +500.000 usuarios
              </span>
            </div>

            {/* Payment methods */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 animate-in fade-in delay-900 duration-700 fill-mode-both">
              <span className="text-sm font-light text-text-tertiary">
                Acepta pagos con:
              </span>
              {[
                { src: "/payments/yape.svg", alt: "Yape" },
                { src: "/payments/plin.svg", alt: "Plin" },
                { src: "/payments/visa.svg", alt: "Visa" },
                { src: "/payments/pagoefectivo.svg", alt: "PagoEfectivo" },
              ].map((logo) => (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-8 w-auto opacity-85 transition-opacity duration-300 hover:opacity-100"
                />
              ))}
            </div>
          </div>

          {/* Right mockup column */}
          <div className="relative flex-1 animate-in fade-in delay-500 duration-1000 fill-mode-both flex justify-center">
            <img
              src="/images/hero-dashboard.svg"
              alt="Panel de control de SWP"
              className="h-auto w-full max-w-[560px]"
              loading="lazy"
            />
            <div className="absolute -bottom-3 left-2 flex items-center gap-2 rounded-xl border border-white/80 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm md:left-0">
              <span className="flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-700"><Zap className="size-4" /></span>
              <div><p className="text-xs font-medium text-text-primary">Operación activa</p><p className="text-[10px] text-text-tertiary">99.99% disponibilidad</p></div>
            </div>
            <div className="absolute -right-1 top-8 rounded-xl border border-white/80 bg-foreground px-3 py-2 text-white shadow-lg md:right-2">
              <p className="text-[10px] text-white/60">Liquidación</p><p className="text-sm font-semibold text-brand-light">T+0</p>
            </div>
          </div>
        </div>
      </div>
      {previewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="platform-preview-title">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-white p-3 shadow-2xl md:p-5">
            <button type="button" onClick={() => setPreviewOpen(false)} aria-label="Cerrar vista de plataforma" className="absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full bg-foreground text-white transition-colors hover:bg-brand"><X className="size-4" /></button>
            <div className="mb-4 px-2 pt-2"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Vista de plataforma</p><h2 id="platform-preview-title" className="mt-1 text-xl font-medium text-text-primary">Todo el control, en una sola vista.</h2></div>
            <img src="/images/hero-dashboard.svg" alt="Vista ampliada del panel de control de SWP" className="h-auto w-full rounded-xl border border-border bg-secondary" />
          </div>
        </div>
      )}
    </section>
  )
}
