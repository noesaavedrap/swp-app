"use client";

import { motion, useReducedMotion } from "framer-motion";

const allies = [
  {
    name: "ENTEL S.A.",
    category: "Conectividad empresarial",
    logo: "/allies/entel.svg",
  },
  {
    name: "On Solutions",
    category: "Tecnología y soluciones",
    logo: "/allies/on-solutions.svg",
  },
  {
    name: "DHL",
    category: "Logística regional",
    logo: "/allies/dhl.svg",
  },
  {
    name: "Aliclick",
    category: "Comercio digital",
    logo: "/allies/aliclick.svg",
  },
];

export default function Allies() {
  const items = [...allies, ...allies];
  const reducedMotion = useReducedMotion();

  return (
    <section className="overflow-hidden border-y border-border bg-white py-14 md:py-20" aria-labelledby="allies-title">
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Ecosistema SWP
            </p>
            <h2 id="allies-title" className="mt-3 text-3xl font-light leading-tight tracking-tight text-text-primary md:text-4xl">
              Aliados que hacen avanzar cada operación.
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-text-secondary md:text-right">
            Una red de empresas que conecta pagos, tecnología, comercio y logística para crecer con más velocidad.
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden" aria-label="Empresas aliadas">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
          <motion.div
            className="flex w-max gap-4 motion-reduce:transform-none"
            animate={reducedMotion ? undefined : { x: [0, -744] }}
            transition={reducedMotion ? undefined : { duration: 24, ease: "linear", repeat: Infinity }}
          >
            {items.map((ally, index) => (
              <div
                key={`${ally.name}-${index}`}
                className="group flex h-28 w-56 flex-col justify-between rounded-2xl border border-border bg-background p-5 transition-colors hover:border-brand-200 hover:bg-brand-50"
              >
                <div className="flex items-center justify-between">
                  <img
                    src={ally.logo}
                    alt={`${ally.name} logo`}
                    className="h-12 w-36 object-contain object-left transition duration-300 group-hover:scale-105"
                  />
                  <span className="size-2 rounded-full bg-brand opacity-60 transition-transform duration-300 group-hover:scale-150" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{ally.name}</p>
                  <p className="mt-1 text-[11px] font-light text-text-tertiary">{ally.category}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
