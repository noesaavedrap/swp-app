"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const trustedTools = ["Yape", "Plin", "Visa", "Mastercard", "MercadoPago"]

export default function Hero() {
  const [previewOpen, setPreviewOpen] = useState(false)
  const heroRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = heroRef.current
    if (!node) return

    const handlePointer = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      node.style.setProperty("--mouse-x", `${x}%`)
      node.style.setProperty("--mouse-y", `${y}%`)
    }

    node.addEventListener("pointermove", handlePointer)
    return () => node.removeEventListener("pointermove", handlePointer)
  }, [])

  return (
    <section ref={heroRef} className="swp-hero pt-28 md:pt-32 lg:pt-36">
      <div className="swp-spotlight" />

      <div className="relative mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20">
          <div className="max-w-[720px]">
            <div className="swp-eyebrow">Plataforma financiera</div>

            <h1 className="swp-title">
              <span>RAW</span>
              <span className="swp-title-accent">REFINED</span>
            </h1>

            <p className="swp-subtitle">
              No solo procesamos pagos: convertimos la operación financiera de tu empresa en
              una experiencia más rápida, clara y escalable para crecer en LATAM.
            </p>

            <div className="swp-cta">
              <Button variant="primary" size="lg" asChild className="rounded-full bg-brand text-[#0a0b10] hover:bg-brand-light">
                <Link href="/socios/registro">
                  Solicitar acceso
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setPreviewOpen(true)} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Play className="mr-2 size-4" />
                Ver plataforma
              </Button>
            </div>

            <div className="swp-trust">
              <span>Herramientas</span>
              <div className="swp-trust-logos">
                {trustedTools.map((tool) => (
                  <span key={tool} className="chip">{tool}</span>
                ))}
              </div>
            </div>

            <div className="swp-metrics">
              <div className="swp-metric">
                <strong>1M+</strong>
                <span>Pagos</span>
              </div>
              <div className="swp-metric">
                <strong>300+</strong>
                <span>Empresas</span>
              </div>
              <div className="swp-metric">
                <strong>99.99%</strong>
                <span>Disponibilidad</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="swp-dashboard">
              <div className="swp-window-bar">
                <span />
                <span />
                <span />
              </div>

              <div className="swp-window-body">
                <div className="swp-panel">
                  <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                    <span>Volume</span>
                    <span className="text-brand">+24.8%</span>
                  </div>
                  <div className="swp-chart" />
                </div>

                <div className="swp-mini-cards">
                  <div className="swp-mini-card">
                    <span>Ingresos</span>
                    <strong>$84.2K</strong>
                  </div>
                  <div className="swp-mini-card">
                    <span>Recaudo</span>
                    <strong>92.4%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#09090b]/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="platform-preview-title">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c1017] p-3 shadow-2xl md:p-5">
            <button type="button" onClick={() => setPreviewOpen(false)} aria-label="Cerrar vista de plataforma" className="absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full bg-white text-[#09090b] transition-colors hover:bg-brand">
              <X className="size-4" />
            </button>
            <div className="mb-4 px-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Vista de plataforma</p>
              <h2 id="platform-preview-title" className="mt-1 text-xl font-medium text-white">Todo el control, en una sola vista.</h2>
            </div>
            <div className="swp-dashboard mx-auto max-w-3xl">
              <div className="swp-window-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="swp-window-body">
                <div className="swp-panel">
                  <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                    <span>Volume</span>
                    <span className="text-brand">+24.8%</span>
                  </div>
                  <div className="swp-chart" />
                </div>
                <div className="swp-mini-cards">
                  <div className="swp-mini-card">
                    <span>Ingresos</span>
                    <strong>$84.2K</strong>
                  </div>
                  <div className="swp-mini-card">
                    <span>Recaudo</span>
                    <strong>92.4%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
