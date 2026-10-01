"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, ShieldCheck, Sparkles, TrendingUp, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const trustedTools = ["Yape", "Plin", "Visa", "Mastercard", "MercadoPago"];

const metrics = [
  { value: "1M+", label: "Pagos" },
  { value: "300+", label: "Empresas" },
  { value: "99.99%", label: "Disponibilidad" },
] as const;

export default function Hero() {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <section className="swp-hero pt-28 md:pt-32 lg:pt-36">
      <div className="relative mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20">
          <div className="max-w-[720px]">
              <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-brand/20 bg-brand/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-brand">
              <Sparkles className="size-3.5" />
              Plataforma financiera
            </div>

            <h1 className="text-[42px] font-light leading-[0.9] tracking-[-0.06em] text-white md:text-[64px] lg:text-[76px]">
              <span className="block">RAW</span>
              <span className="block text-brand">REFINED</span>
            </h1>

            <p className="mt-6 max-w-[620px] text-lg font-light leading-relaxed text-white/72 md:text-xl">
              No solo procesamos pagos: convertimos la operación financiera de tu empresa en una
              experiencia más rápida, clara y escalable para crecer en LATAM.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                asChild
                className="rounded-full bg-brand text-[#0a0b10] hover:bg-brand-light"
              >
                <Link href="/socios/registro">
                  Solicitar acceso
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setPreviewOpen(true)}
                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Play className="mr-2 size-4" />
                Ver plataforma
              </Button>
            </div>

            <div className="mt-8 flex flex-col gap-4 text-left">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
                Herramientas
              </span>
              <div className="flex flex-wrap gap-2.5">
                {trustedTools.map((tool) => (
                  <span key={tool} className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 grid max-w-[500px] grid-cols-3 gap-3 md:gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                >
                  <strong className="block text-2xl font-semibold tracking-tight text-white">
                    {metric.value}
                  </strong>
                  <span className="mt-1 block text-xs text-white/60">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0d1117] p-4">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/50">
                    <span>Volume</span>
                    <span className="flex items-center gap-1 text-brand">
                      <TrendingUp className="size-3" /> +24.8%
                    </span>
                  </div>
                  <div className="flex h-24 items-end gap-2">
                    {[40, 52, 34, 62, 58, 76, 88].map((height, index) => (
                      <span
                        key={index}
                        className="flex-1 rounded-t-xl bg-gradient-to-t from-brand/70 to-brand-light/90"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/50">
                      <span>Ingresos</span>
                      <ShieldCheck className="size-3.5 text-brand" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-white">$84.2K</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/50">
                      <span>Recaudo</span>
                      <ShieldCheck className="size-3.5 text-brand" />
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-white">92.4%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#09090b]/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="platform-preview-title"
        >
          <div className="relative w-full max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-[#0c1017] p-3 md:p-5">
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              aria-label="Cerrar vista de plataforma"
              className="absolute right-5 top-5 z-10 flex size-9 items-center justify-center rounded-full bg-white text-[#09090b] transition-colors hover:bg-brand"
            >
              <X className="size-4" />
            </button>
            <div className="mb-4 px-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                Vista de plataforma
              </p>
              <h2 id="platform-preview-title" className="mt-1 text-xl font-medium text-white">
                Todo el control, en una sola vista.
              </h2>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0d1117] p-4">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/50">
                    <span>Volume</span>
                    <span className="text-brand">+24.8%</span>
                  </div>
                  <div className="flex h-24 items-end gap-2">
                    {[38, 49, 30, 66, 73, 82, 96].map((height, index) => (
                      <span
                        key={index}
                        className="flex-1 rounded-t-xl bg-gradient-to-t from-brand/70 to-brand-light/90"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">Ingresos</span>
                    <strong className="mt-3 block text-2xl text-white">$84.2K</strong>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">Recaudo</span>
                    <strong className="mt-3 block text-2xl text-white">92.4%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
