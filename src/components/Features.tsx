"use client";

import { motion } from "framer-motion";
import {
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:52px_52px] opacity-35 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_75%,transparent)]" />
  Store,
  BarChart3,
  Wallet,
  Send,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: CreditCard,
    title: "SWP Pay - Pagos",
    description: "Sistema de pagos digitales para tu negocio",
            <FeatureCard key={feature.title} feature={feature} index={index} />
    chips: [
      { label: "Tarjetas", icon: <CreditCard className="size-4" /> },
      { label: "Yape/Plin", icon: <img src="/payments/yape.svg" alt="Yape" className="h-5 w-6 object-contain" /> },
      { label: "Transferencias", icon: <Send className="size-4" /> },
  }

type Feature = (typeof features)[number];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  const spotlightStyle = {
    "--spotlight-x": `${spotlight.x}%`,
    "--spotlight-y": `${spotlight.y}%`,
  } as CSSProperties;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      onMouseMove={handleMove}
      style={spotlightStyle}
      className={`group relative min-h-[370px] overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-card transition-shadow duration-500 hover:shadow-lg md:p-7 ${feature.span}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(340px_circle_at_var(--spotlight-x)_var(--spotlight-y),rgba(16,185,129,0.16),transparent_70%)]" />
      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div>
          <div className="flex items-start justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-700 transition-transform duration-500 group-hover:scale-105">
              <Icon className="size-6" />
            </div>
            <ArrowUpRight className="size-5 text-text-tertiary transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand-700" />
          </div>
          <h3 className="mt-5 text-[24px] font-light tracking-tight text-text-primary">{feature.title}</h3>
          <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-text-secondary">{feature.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {feature.chips.map((chip) => (
              <span key={chip} className="rounded-full border border-border bg-white/80 px-3 py-1 text-xs text-text-secondary shadow-sm backdrop-blur-sm">
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

function ProductVisual({ type, tone }: { type: Feature["visual"]; tone: Feature["tone"] }) {
  return (
    <div className={`relative flex h-36 items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-linear-to-br ${tone}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white_0,transparent_34%),linear-gradient(to_right,rgba(16,185,129,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.09)_1px,transparent_1px)] bg-[size:auto,26px_26px,26px_26px]" />
      {type === "payments" && <PaymentVisual />}
      {type === "store" && <StoreVisual />}
      {type === "analytics" && <AnalyticsVisual />}
      {type === "wallet" && <WalletVisual />}
    </div>
  );
}

function PaymentVisual() {
  return <div className="relative w-[78%] rounded-xl border border-border bg-white p-4 shadow-lg"><div className="flex items-center justify-between"><span className="text-xs text-text-tertiary">Cobros hoy</span><ShieldCheck className="size-4 text-brand" /></div><p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">S/ 18,420</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-brand-100"><div className="h-full w-4/5 rounded-full bg-brand" /></div></div>;
}

function StoreVisual() {
  return <div className="relative w-[82%] rounded-xl border border-border bg-white p-3 shadow-lg"><div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-brand"><ShoppingBag className="size-4" /></div><div><p className="text-xs font-medium text-text-primary">Orden #1024</p><p className="text-[10px] text-text-tertiary">Lista para enviar</p></div><span className="ml-auto rounded-full bg-brand-100 px-2 py-1 text-[10px] text-brand-700">Pagado</span></div><div className="mt-3 flex gap-1.5"><span className="h-1.5 flex-1 rounded-full bg-brand" /><span className="h-1.5 flex-1 rounded-full bg-brand" /><span className="h-1.5 flex-1 rounded-full bg-border" /></div></div>;
}

function AnalyticsVisual() {
  return <div className="flex w-[78%] items-end justify-between gap-2 rounded-xl border border-border bg-white px-5 pb-4 pt-5 shadow-lg"><div className="flex h-20 items-end gap-2"><span className="h-7 w-4 rounded-t bg-brand-200" /><span className="h-12 w-4 rounded-t bg-brand-300" /><span className="h-10 w-4 rounded-t bg-brand-400" /><span className="h-16 w-4 rounded-t bg-brand" /><span className="h-20 w-4 rounded-t bg-brand-700" /></div><div><BarChart3 className="size-6 text-brand-700" /><p className="mt-2 text-xs font-medium text-text-primary">+24.8%</p><p className="text-[10px] text-text-tertiary">Conversión</p></div></div>;
}

function WalletVisual() {
  return <div className="relative w-[76%] rounded-xl bg-foreground p-4 shadow-lg"><div className="flex items-center justify-between text-white"><span className="text-xs text-white/60">Balance total</span><Wallet className="size-4 text-brand-light" /></div><p className="mt-2 text-2xl font-semibold tracking-tight text-white">S/ 42,680</p><div className="mt-3 flex items-center gap-2 text-[10px] text-white/60"><Send className="size-3 text-brand-light" /> 4 cuentas conectadas <Globe className="ml-auto size-3 text-white/50" /></div></div>;
}
      { label: "Pagos internacionales", icon: <Globe className="size-4" /> },
    ],
  },
  {
    icon: Store,
    title: "SWP Store - Comercio",
    description: "Crea y administra tu tienda online profesional",
    span: "col-span-12 lg:col-span-7",
    chips: ["Tienda online", "Inventario", "Checkout", "Redes sociales"],
  },
  {
    icon: BarChart3,
    title: "SWP Business",
    description: "Herramientas para empresas en crecimiento",
    span: "col-span-12 lg:col-span-7",
    chips: ["Analytics", "Facturación", "API", "Reporting"],
  },
  {
    icon: Wallet,
    title: "SWP Wallet",
    description: "Tu billetera digital todo en uno",
    span: "col-span-12 lg:col-span-5",
    chips: ["Balances", "Transferencias", "Multi-moneda", "Withdrawals"],
  },
];

export default function Features() {
  return (
    <section className="py-10 md:py-14 lg:py-28">
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-[32px] lg:text-[44px] font-light text-text-primary -tracking-[0.96px] leading-tight">
            Todo lo que necesitas, en{" "}
            <span className="text-brand">una plataforma</span>
          </h2>
          <p className="mt-2 text-md font-light text-text-secondary max-w-[560px] mx-auto">
            Cuatro productos poderosos para impulsar tu negocio.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-12 gap-3 xl:gap-7">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex flex-col justify-between gap-8 overflow-hidden rounded-xl bg-white p-5 border border-border shadow-card hover:shadow-lg transition-shadow md:rounded-3xl md:p-7 ${feature.span}`}
            >
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mt-5 text-[22px] md:text-[24px] font-light text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-text-secondary font-light mt-2">
                  {feature.description}
                </p>
              </div>

              <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-lg bg-brand-50 md:rounded-2xl">
                <div className="flex flex-wrap justify-center gap-2 px-4">
                  {feature.chips.map((chip) => {
                    if (typeof chip === "string") {
                      return (
                        <span
                          key={chip}
                          className="bg-white border border-border text-xs text-text-secondary px-3 py-1 rounded-full"
                        >
                          {chip}
                        </span>
                      );
                    }
                    return (
                      <span
                        key={chip.label}
                        className="inline-flex items-center gap-1.5 bg-white border border-border text-xs text-text-secondary px-3 py-1 rounded-full"
                      >
                        {chip.icon}
                        {chip.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
