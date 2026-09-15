"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Braces,
  CreditCard,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const cards = [
  {
    icon: CreditCard,
    title: "Cobros automáticos",
    text: "Decisiones rápidas con pagos en tiempo real, confirmación instantánea y control de riesgo integrado.",
    accent: "from-emerald-500/20 via-white to-emerald-50",
  },
  {
    icon: WalletCards,
    title: "Pagos omnicanal",
    text: "Tarjetas, Yape, Plin, transferencias y wallets en una sola experiencia para tus clientes.",
    accent: "from-sky-500/20 via-white to-cyan-50",
  },
  {
    icon: TrendingUp,
    title: "Analítica inteligente",
    text: "KPIs, tendencia por canal y recomendaciones para mejorar conversiones y rentabilidad.",
    accent: "from-violet-500/20 via-white to-fuchsia-50",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad por defecto",
    text: "Infraestructura con validaciones, auditoría y permisos para operar sin fricción ni riesgo.",
    accent: "from-amber-500/20 via-white to-yellow-50",
  },
] as const;

const steps = [
  { number: "01", title: "Conecta", text: "Integra tu negocio en minutos con APIs, webhooks y dashboards listos para operar." },
  { number: "02", title: "Automatiza", text: "Configura pagos, cobros y flujos de negocio con reglas y alertas inteligentes." },
  { number: "03", title: "Escala", text: "Acelera la operación con herramientas que crecen con tus ventas y tus equipos." },
] as const;

export default function AnimateUIShowcase() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-700 shadow-sm backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            animate-ui style
          </div>
          <h2 className="mt-6 text-[32px] font-light leading-tight tracking-[-0.04em] text-text-primary md:text-[46px]">
            Una experiencia de producto más premium
          </h2>
          <p className="mt-4 text-md font-light leading-relaxed text-text-secondary">
            Diseñado para destacar, convertir y simplificar la operación financiera de empresas que crecen.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.35)] backdrop-blur-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-90`} />
                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-brand-100 bg-white/90 text-brand shadow-sm">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-light text-text-primary">{card.title}</h3>
                  <p className="mt-3 text-sm font-light leading-relaxed text-text-secondary">{card.text}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-700">
                    Ver detalle
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55 }}
          className="mt-14 rounded-[32px] border border-brand-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_38%,#f8fafc_100%)] p-6 shadow-[0_30px_100px_-40px_rgba(5,150,105,0.38)] md:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-700">
                <Blocks className="size-3.5" />
                flujo de trabajo
              </div>
              <h3 className="mt-5 text-[28px] font-light leading-tight tracking-[-0.04em] text-text-primary md:text-[36px]">
                Todo en un panel claro, rápido y listo para crecer.
              </h3>
              <p className="mt-4 max-w-xl text-md font-light leading-relaxed text-text-secondary">
                Cuando tu operación es más compleja, la plataforma se vuelve más útil: menos fricción, más control y mejor decisión.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/80 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-text-tertiary">Dashboard</p>
                  <p className="mt-1 text-lg font-medium text-text-primary">Operación SWP</p>
                </div>
                <div className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">Live</div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-secondary p-3">
                  <div className="flex items-center justify-between text-sm text-text-secondary">
                    <span>Ingresos</span>
                    <span className="font-medium text-brand-700">+28%</span>
                  </div>
                  <div className="mt-3 flex h-16 items-end gap-2">
                    {[35, 52, 46, 70, 62, 84, 95].map((height, idx) => (
                      <span
                        key={idx}
                        className="flex-1 rounded-t-xl bg-gradient-to-t from-brand-600 to-brand-300"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-white p-3">
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span>Pagos</span>
                      <BadgeCheck className="size-3.5 text-brand" />
                    </div>
                    <p className="mt-2 text-2xl font-light tracking-[-0.05em] text-text-primary">12.4k</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-white p-3">
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span>Conversiones</span>
                      <Braces className="size-3.5 text-brand" />
                    </div>
                    <p className="mt-2 text-2xl font-light tracking-[-0.05em] text-text-primary">8.3%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-[26px] border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-brand-700">{step.number}</span>
                <div className="size-8 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center">
                  <ArrowRight className="size-3.5" />
                </div>
              </div>
              <h4 className="mt-5 text-xl font-light text-text-primary">{step.title}</h4>
              <p className="mt-2 text-sm font-light leading-relaxed text-text-secondary">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
