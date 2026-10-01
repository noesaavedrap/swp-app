"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  Globe,
  Send,
  ShieldCheck,
  ShoppingBag,
  Store,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

import { SectionHeading } from "@/components/SectionHeading";

const categories = ["Todos", "Pagos", "Comercio", "Operación", "Finanzas"] as const;
type Category = (typeof categories)[number];
type VisualType = "payments" | "store" | "analytics" | "wallet";

type Feature = {
  icon: typeof CreditCard;
  title: string;
  category: Exclude<Category, "Todos">;
  description: string;
  span: string;
  tone: string;
  chips: string[];
  visual: VisualType;
};

const features: Feature[] = [
  {
    icon: CreditCard,
    title: "SWP Pay",
    category: "Pagos",
    description: "Convierte cada pago en una experiencia rápida, segura y nativa para tu operación.",
    span: "lg:col-span-5",
    tone: "from-brand/22 via-transparent to-emerald-400/10",
    chips: ["Tarjetas", "Yape y Plin", "Transferencias"],
    visual: "payments",
  },
  {
    icon: Store,
    title: "SWP Store",
    category: "Comercio",
    description: "Un storefront conectado a inventario, checkout y redes para vender con más agilidad.",
    span: "lg:col-span-7",
    tone: "from-cyan-400/15 via-transparent to-brand/10",
    chips: ["Tienda online", "Inventario", "Checkout"],
    visual: "store",
  },
  {
    icon: BarChart3,
    title: "SWP Business",
    category: "Operación",
    description: "Indicadores accionables para poner en marcha decisiones basadas en datos reales.",
    span: "lg:col-span-7",
    tone: "from-brand/15 via-transparent to-emerald-400/10",
    chips: ["Analytics", "Facturación", "API"],
    visual: "analytics",
  },
  {
    icon: Wallet,
    title: "SWP Wallet",
    category: "Finanzas",
    description: "Liquidez y movimientos bajo control, en una sola vista con mayor visibilidad.",
    span: "lg:col-span-5",
    tone: "from-teal-400/15 via-transparent to-cyan-400/10",
    chips: ["Balances", "Multi-moneda", "Retiros"],
    visual: "wallet",
  },
];

export default function Features() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");

  const visibleFeatures = useMemo(
    () =>
      activeCategory === "Todos"
        ? features
        : features.filter((feature) => feature.category === activeCategory),
    [activeCategory],
  );

  return (
    <section id="features" className="swp-section scroll-mt-28 py-12 md:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:52px_52px] opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_75%,transparent)]" />

      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <SectionHeading
          eyebrow="Un ecosistema conectado"
          title={
            <>
              Todo lo que necesitas, en <span className="text-brand">una plataforma</span>
            </>
          }
          description="Cuatro productos poderosos para impulsar tu negocio desde el primer cobro hasta la siguiente etapa."
        />

        <div className="mt-9 flex flex-col items-center gap-4">
          <div
            className="mx-auto flex w-fit max-w-full overflow-x-auto rounded-lg border border-white/10 bg-white/[0.03] p-1"
            role="tablist"
            aria-label="Filtrar productos"
          >
            {categories.map((category) => {
              const isActive = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-200 md:px-4 ${
                    isActive
                      ? "bg-brand text-[#09090b]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">
            {[
              { label: "95% uptime", value: "SLA" },
              { label: "150+ integraciones", value: "API" },
              { label: "24/7 operación", value: "Monitoreo" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5"
              >
                <span className="text-brand">{stat.value}</span> {stat.label}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12"
          >
            {visibleFeatures.map((feature, index) => (
              <FeatureCard key={`${feature.title}-${activeCategory}`} feature={feature} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;

  return (
    <motion.article
      id={feature.visual}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: "easeOut" }}
      className={`group relative min-h-[370px] scroll-mt-28 overflow-hidden rounded-lg border border-white/10 bg-[#0b0e12] p-5 transition-colors duration-200 hover:border-brand/35 md:p-7 ${feature.span}`}
    >
      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex size-10 items-center justify-center rounded-md border border-brand/20 bg-brand/10 text-brand">
              <Icon className="size-6" />
            </div>
            <ArrowUpRight className="size-5 text-white/45 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand" />
          </div>

          <div className="mt-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-brand/80">
            {feature.category}
          </div>

          <h3 className="mt-3 text-[24px] font-light tracking-tight text-white">{feature.title}</h3>
          <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-white/70">{feature.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {feature.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <ProductVisual type={feature.visual} tone={feature.tone} />
      </div>
    </motion.article>
  );
}

function ProductVisual({ type, tone }: { type: VisualType; tone: string }) {
  return (
    <div
      className={`relative flex h-36 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-linear-to-br ${tone}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:26px_26px]" />

      {type === "payments" && <PaymentVisual />}
      {type === "store" && <StoreVisual />}
      {type === "analytics" && <AnalyticsVisual />}
      {type === "wallet" && <WalletVisual />}
    </div>
  );
}

function PaymentVisual() {
  return (
    <div className="relative w-[78%] rounded-md border border-white/10 bg-[#111820] p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/55">Cobros hoy</span>
        <ShieldCheck className="size-4 text-brand" />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">S/ 18,420</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-4/5 rounded-full bg-brand" />
      </div>
    </div>
  );
}

function StoreVisual() {
  return (
    <div className="relative w-[82%] rounded-md border border-white/10 bg-[#111820] p-3">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand/15 text-brand">
          <ShoppingBag className="size-4" />
        </div>
        <div>
          <p className="text-xs font-medium text-white">Orden #1024</p>
          <p className="text-[10px] text-white/50">Lista para enviar</p>
        </div>
        <span className="ml-auto rounded-full bg-brand/15 px-2 py-1 text-[10px] text-brand">Pagado</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        <span className="h-1.5 flex-1 rounded-full bg-brand" />
        <span className="h-1.5 flex-1 rounded-full bg-brand" />
        <span className="h-1.5 flex-1 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

function AnalyticsVisual() {
  return (
    <div className="flex w-[78%] items-end justify-between gap-2 rounded-md border border-border bg-white px-5 pb-4 pt-5">
      <div className="flex h-20 items-end gap-2">
        <span className="h-7 w-4 rounded-t bg-brand-200" />
        <span className="h-12 w-4 rounded-t bg-brand-300" />
        <span className="h-10 w-4 rounded-t bg-brand-400" />
        <span className="h-16 w-4 rounded-t bg-brand" />
        <span className="h-20 w-4 rounded-t bg-brand-700" />
      </div>
      <div>
        <BarChart3 className="size-6 text-brand-700" />
        <p className="mt-2 text-xs font-medium text-text-primary">+24.8%</p>
        <p className="text-[10px] text-text-tertiary">Conversión</p>
      </div>
    </div>
  );
}

function WalletVisual() {
  return (
    <div className="relative w-[76%] rounded-md bg-foreground p-4">
      <div className="flex items-center justify-between text-white">
        <span className="text-xs text-white/60">Balance total</span>
        <Wallet className="size-4 text-brand-light" />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">S/ 42,680</p>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-white/60">
        <Send className="size-3 text-brand-light" /> 4 cuentas conectadas
        <Globe className="ml-auto size-3 text-white/50" />
      </div>
    </div>
  );
}
