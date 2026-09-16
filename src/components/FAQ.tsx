"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "¿Qué es SWP?",
    answer:
      "SWP es una plataforma financiera todo-en-uno diseñada para empresas en Latinoamérica. Ofrece pagos digitales, comercio electrónico, gestión de cobros y herramientas de análisis financiero integradas en un solo lugar.",
  },
  {
    question: "¿Cómo empiezo a cobrar?",
    answer:
      "Solo necesitas crear una cuenta gratuita en SWP, completar la verificación de tu negocio y configurar tu método de cobro preferido. En menos de 24 horas puedes empezar a recibir pagos de tus clientes.",
  },
  {
    question: "¿Qué medios de pago acepta?",
    answer:
      "SWP acepta tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias, billeteras digitales como Yape y Plin, y pagos internacionales. Los métodos disponibles varían según el país.",
  },
  {
    question: "¿Cuánto cobra SWP?",
    answer:
      "SWP cobra una comisión competitiva por transacción que disminuye con el volumen de ventas. No hay costos de instalación ni mensualidad oculta. Consulta nuestra página de precios para ver las tarifas detalladas por país y método de pago.",
  },
  {
    question: "¿Es seguro?",
    answer:
      "Absolutamente. SWP cumple con los estándares PCI DSS nivel 1, utiliza cifrado de extremo a extremo y está regulado por las autoridades financieras de cada país donde opera. Tus fondos y datos están protegidos en todo momento.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="swp-section py-10 md:py-14 lg:py-28" id="faq">
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="swp-kicker">Respuestas claras</span>
          <h2 className="mt-3 text-[32px] lg:text-[44px] font-light text-white -tracking-[0.96px] leading-tight">
            Preguntas frecuentes
          </h2>
          <p className="mt-2 text-md font-light text-white/60 max-w-[560px] mx-auto">
            Todo lo que necesitas saber sobre SWP.
          </p>
        </div>

        <div className="mx-auto max-w-[660px] mt-12 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-6 text-start text-lg font-light text-white"
                >
                  {faq.question}
                  {isOpen ? (
                    <Minus className="size-5 shrink-0 text-text-secondary" />
                  ) : (
                    <Plus className="size-5 shrink-0 text-text-secondary" />
                  )}
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="rounded-xl bg-white/[0.035] px-5 py-6 font-light text-white/60">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
