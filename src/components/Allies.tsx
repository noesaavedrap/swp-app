"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const allies = [
  {
    name: "ENTEL S.A.",
    category: "Conectividad empresarial",
    logo: "/allies/pinterest/entel.jpg",
  },
  {
    name: "ON Empresas",
    category: "Tecnología y soluciones",
    logo: "/allies/pinterest/on-empresas.svg",
  },
  {
    name: "DHL",
    category: "Logística regional",
    logo: "/allies/pinterest/dhl.jpg",
  },
  {
    name: "Aliclick",
    category: "Comercio digital",
    logo: "/allies/pinterest/logo.svg",
  },
];

export default function Allies() {
  const items = [...allies, ...allies];
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="swp-section overflow-hidden border-y border-white/10 py-14 md:py-20" aria-labelledby="allies-title">
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="swp-kicker">
              Ecosistema SWP
            </p>
            <h2 id="allies-title" className="mt-3 text-3xl font-light leading-tight tracking-tight text-white md:text-4xl">
              Aliados que hacen avanzar cada operación.
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-white/60 md:text-right">
            Una red de empresas que conecta pagos, tecnología, comercio y logística para crecer con más velocidad.
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden" aria-label="Empresas aliadas">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#080a0e] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#080a0e] to-transparent" />
          <motion.div
            className="flex w-max gap-4 will-change-transform motion-reduce:transform-none"
            animate={reducedMotion ? undefined : { x: [0, -960] }}
            transition={reducedMotion ? undefined : { duration: 26, ease: "linear", repeat: Infinity }}
          >
            {items.map((ally, index) => (
              <motion.div
                key={`${ally.name}-${index}`}
                whileHover={reducedMotion ? undefined : { y: -6, scale: 1.02 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group flex h-28 w-56 flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-colors hover:border-brand/30 hover:bg-brand/10"
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
                  <p className="text-sm font-medium text-white">{ally.name}</p>
                  <p className="mt-1 text-[11px] font-light text-white/45">{ally.category}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}
