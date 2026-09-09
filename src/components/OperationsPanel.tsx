"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CircleCheck,
  Clock3,
  CreditCard,
  MoreHorizontal,
  Plus,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const activity = [
  { label: "Pago recibido", detail: "Tienda online · hace 2 min", amount: "+ S/ 349.00", positive: true },
  { label: "Transferencia programada", detail: "Proveedor principal · hace 18 min", amount: "- S/ 1,250.00", positive: false },
  { label: "Liquidación completada", detail: "SWP Pay · hoy, 09:42", amount: "+ S/ 8,420.00", positive: true },
];

export default function OperationsPanel() {
  return (
    <section className="border-y border-border bg-secondary/45 py-12 md:py-20">
      <div className="mx-auto grid max-w-[76rem] gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center xl:px-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Centro de control</p>
          <h2 className="mt-4 text-[32px] font-light leading-tight tracking-tight text-text-primary md:text-[44px]">
            Una vista clara para cada decisión.
          </h2>
          <p className="mt-5 max-w-lg text-md font-light leading-relaxed text-text-secondary">
            Supervisa ingresos, pagos y liquidez desde un solo lugar. Tu equipo obtiene contexto antes de actuar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="dark" size="sm">
              Explorar plataforma <ChevronRight className="size-4" />
            </Button>
            <Button variant="secondary" size="sm">
              Ver reportes
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4 md:px-6">
            <div>
              <p className="text-sm font-medium text-text-primary">Resumen de operación</p>
              <p className="mt-1 text-xs text-text-tertiary">Actualizado hace unos segundos</p>
            </div>
            <button className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-secondary hover:text-text-primary" aria-label="Más opciones">
              <MoreHorizontal className="size-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            <Metric label="Saldo" value="S/ 42,680" icon={Wallet} />
            <Metric label="Ingresos" value="+18.4%" icon={ArrowDownLeft} positive />
            <Metric label="Egresos" value="-6.2%" icon={ArrowUpRight} />
            <Metric label="Disponibilidad" value="99.99%" icon={CircleCheck} positive />
          </div>

          <div className="p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Actividad reciente</p>
              <button className="text-xs font-medium text-brand-700 hover:text-brand-800">Ver todo</button>
            </div>
            <div className="space-y-4">
              {activity.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${item.positive ? "bg-brand-100 text-brand-700" : "bg-orange-50 text-orange-600"}`}>
                    {item.positive ? <CreditCard className="size-4" /> : <Clock3 className="size-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">{item.label}</p>
                    <p className="truncate text-xs text-text-tertiary">{item.detail}</p>
                  </div>
                  <span className={`text-sm font-medium ${item.positive ? "text-brand-700" : "text-text-primary"}`}>{item.amount}</span>
                </div>
              ))}
            </div>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-brand-200 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50">
              <Plus className="size-4" /> Crear movimiento
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, icon: Icon, positive = false }: { label: string; value: string; icon: typeof Wallet; positive?: boolean }) {
  return (
    <div className="bg-white p-4">
      <Icon className={`size-4 ${positive ? "text-brand" : "text-text-tertiary"}`} />
      <p className="mt-3 text-xs text-text-tertiary">{label}</p>
      <p className={`mt-1 text-base font-semibold ${positive ? "text-brand-700" : "text-text-primary"}`}>{value}</p>
    </div>
  );
}
