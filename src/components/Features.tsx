"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
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
    span: "col-span-12 lg:col-span-5",
    chips: [
      { label: "Tarjetas", icon: <CreditCard className="size-4" /> },
      { label: "Yape/Plin", icon: <img src="/payments/yape.svg" alt="Yape" className="h-5 w-6 object-contain" /> },
      { label: "Transferencias", icon: <Send className="size-4" /> },
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
