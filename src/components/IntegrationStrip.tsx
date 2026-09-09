import { ArrowRight, BarChart3, Boxes, Code2, Globe2, ShieldCheck } from "lucide-react";

const integrations = [
  { name: "API abierta", icon: Code2, detail: "Conecta tu stack" },
  { name: "Shopify y Woo", icon: Boxes, detail: "Vende sin fricción" },
  { name: "Analytics", icon: BarChart3, detail: "Decide con datos" },
  { name: "Cobros globales", icon: Globe2, detail: "Opera en LATAM" },
  { name: "Seguridad", icon: ShieldCheck, detail: "Protección 24/7" },
];

export default function IntegrationStrip() {
  return (
    <section className="bg-white py-8 md:py-10">
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[190px] text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">
            Se integra con tu operación actual
          </p>
          <div className="grid flex-1 gap-2 sm:grid-cols-5 lg:max-w-[880px]">
            {integrations.map(({ name, icon: Icon, detail }) => (
              <div key={name} className="group flex items-center gap-3 border-l border-border px-3 py-2 first:border-l-0">
                <Icon className="size-5 shrink-0 text-brand-700" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{name}</p>
                  <p className="truncate text-xs text-text-tertiary">{detail}</p>
                </div>
                <ArrowRight className="ml-auto hidden size-3.5 text-text-tertiary transition-transform group-hover:translate-x-0.5 sm:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
