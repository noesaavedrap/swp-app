"use client";

import { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Básico",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Ideal para empezar",
    featured: false,
    features: [
      { text: "Hasta 100 transacciones/mes", included: true },
      { text: "1 usuario", included: true },
      { text: "Soporte por email", included: true },
      { text: "Analytics avanzado", included: false },
      { text: "API personalizada", included: false },
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 19,
    annualPrice: 15,
    description: "Para negocios en crecimiento",
    featured: true,
    features: [
      { text: "Transacciones ilimitadas", included: true },
      { text: "Hasta 10 usuarios", included: true },
      { text: "Soporte prioritario 24/7", included: true },
      { text: "Analytics avanzado", included: true },
      { text: "API personalizada", included: true },
      { text: "Multi-moneda", included: true },
    ],
  },
  {
    name: "Empresa",
    monthlyPrice: 49,
    annualPrice: 39,
    description: "Para grandes operaciones",
    featured: false,
    features: [
      { text: "Transacciones ilimitadas", included: true },
      { text: "Usuarios ilimitados", included: true },
      { text: "Soporte dedicado", included: true },
      { text: "Analytics avanzado", included: true },
      { text: "API personalizada", included: true },
      { text: "Multi-moneda + conciliación", included: true },
    ],
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <section className="swp-section py-10 md:py-14 lg:py-28">
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="swp-kicker">Planes que escalan contigo</span>
          <h2 className="mt-3 text-[32px] lg:text-[44px] font-light text-white -tracking-[0.96px] leading-tight">
            Precios simples para crecer
          </h2>
          <p className="mt-2 text-md font-light text-white/60 max-w-[560px] mx-auto">
            Elige el plan que mejor se adapte a tu negocio.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 text-sm font-light rounded-full transition-colors ${
              billing === "monthly"
                ? "bg-brand-100 text-brand-700"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-4 py-2 text-sm font-light rounded-full transition-colors ${
              billing === "annual"
                ? "bg-brand-100 text-brand-700"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Anual
          </button>
          {billing === "annual" && (
            <Badge variant="brand" className="ml-1">
              -20%
            </Badge>
          )}
        </div>

        {/* Plans Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md ${
                plan.featured
                  ? "border-2 border-brand/40 bg-[linear-gradient(180deg,rgba(212,255,0,0.12),rgba(255,255,255,0.035))] shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
                  : ""
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-100 text-brand-700 text-xs rounded-full px-2.5 py-1">
                    Más Popular
                  </span>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-white/60">
                  {plan.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-[40px] leading-11 font-light text-white">
                    {billing === "annual" ? plan.annualPrice : plan.monthlyPrice === 0
                      ? "$0"
                      : `$${plan.monthlyPrice}`}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-sm font-light text-white/45">
                      /mes
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-white/45">{plan.description}</p>
              </div>

              <div className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature.text} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check className="size-4 text-brand shrink-0" />
                    ) : (
                      <X className="size-4 text-text-tertiary shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included
                          ? "text-white/80 font-light"
                          : "text-white/35"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.featured ? "dark" : "secondary"}
                className="mt-6 w-full gap-2"
              >
                Comenzar
                <ArrowRight className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
