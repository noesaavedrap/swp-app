"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, CreditCard, Store } from "lucide-react";

const rows = [
  {
    title: "Cobra y paga sin fricción",
    description:
      "Acepta tarjetas, transferencias, Yape, Plin y billeteras digitales. Cobra en segundos y liquida en T+0.",
    cta: "Conoce SWP Pay",
    mockup: "pay",
  },
  {
    title: "Vende online con SWP Store",
    description:
      "Crea tu tienda, gestiona inventario, conecta tus redes y recibe pagos con un checkout optimizado.",
    cta: "Conoce SWP Store",
    mockup: "store",
  },
];

function PayMockup() {
  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-100 text-brand">
          <CreditCard className="size-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">Pago recibido</p>
          <p className="text-xs text-text-secondary">Confirmado al instante</p>
        </div>
      </div>
      <p className="text-[32px] font-light text-text-primary -tracking-[0.6px]">
        S/ 1,250.00
      </p>
      <div className="mt-4 flex items-center gap-2 text-brand">
        <CheckCircle2 className="size-4" />
        <span className="text-sm font-medium">Transacción exitosa</span>
      </div>
    </div>
  );
}

function StoreMockup() {
  const orders = [
    { id: "#1024", product: "Zapatillas Air Max", amount: "S/ 349.00", status: "Pagado" },
    { id: "#1023", product: "Camiseta Premium", amount: "S/ 89.00", status: "Pagado" },
    { id: "#1022", product: "Mochila Laptop", amount: "S/ 159.00", status: "Pendiente" },
  ];

  return (
    <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-sm border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-100 text-brand">
          <Store className="size-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">Órdenes recientes</p>
          <p className="text-xs text-text-secondary">3 pedidos hoy</p>
        </div>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-text-primary">{order.product}</p>
              <p className="text-xs text-text-secondary">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{order.amount}</p>
              <p className="text-xs text-brand">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Showcase() {
  return (
    <section className="py-10 md:py-14 lg:py-28">
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="flex flex-col items-center gap-4 text-center mb-16">
          <h2 className="text-[32px] lg:text-[44px] font-light text-text-primary -tracking-[0.96px] leading-tight">
            Pensada para vender y crecer
          </h2>
          <p className="mt-2 text-md font-light text-text-secondary max-w-[560px] mx-auto">
            Herramientas diseñadas para impulsar cada etapa de tu negocio.
          </p>
        </div>

        <div className="space-y-16 lg:space-y-24">
          {rows.map((row, index) => (
            <motion.div
              key={row.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col items-center gap-12 lg:gap-20 ${
                index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="flex-1 max-w-lg">
                <h3 className="text-display-sm font-light text-text-primary">
                  {row.title}
                </h3>
                <p className="mt-4 text-text-secondary font-light leading-relaxed">
                  {row.description}
                </p>
                <Button variant="secondary" className="mt-8 gap-2">
                  {row.cta}
                  <ArrowRight className="size-4" />
                </Button>
              </div>

              <div className="flex-1 w-full flex justify-center">
                <div className="rounded-2xl border-t border-brand-200 bg-[linear-gradient(180deg,rgba(209,250,229,0.8)_0%,#FFFFFF_100%)] p-8 flex items-center justify-center w-full max-w-md">
                  {row.mockup === "pay" ? <PayMockup /> : <StoreMockup />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
