"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KEYWORDS = [
  "RESULTADOS",
  "ENFOQUE",
  "ACCIÓN",
  "CRECIMIENTO",
  "DISCIPLINA",
  "MARKETING",
  "VENTAS",
  "LIDERAZGO",
  "CLIENTES",
];

export default function KeywordsScroll() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % KEYWORDS.length);
    }, 1800); // ~1.8s per word, similar to the original video

    return () => clearInterval(interval);
  }, []);

  // Get surrounding words for the blur stack effect
  const getWord = (offset: number) => {
    const i = (index + offset + KEYWORDS.length) % KEYWORDS.length;
    return KEYWORDS[i];
  };

  return (
    <section className="relative overflow-hidden bg-black py-24 md:py-32">
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent" />

      <div className="relative mx-auto flex max-w-[76rem] flex-col items-center px-4">
        <p className="mb-10 text-center text-sm font-medium uppercase tracking-[0.2em] text-brand-light">
          Lo que impulsa a las empresas que escalan
        </p>

        <div className="relative flex h-[280px] w-full max-w-3xl items-center justify-center md:h-[340px]">
          {/* Stack of blurred words */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const word = getWord(offset);
              const isActive = offset === 0;

              return (
                <motion.div
                  key={`${word}-${index}-${offset}`}
                  initial={{ opacity: 0, y: offset * 20 }}
                  animate={{
                    opacity: isActive ? 1 : Math.max(0.15, 0.55 - Math.abs(offset) * 0.2),
                    y: offset * 52,
                    scale: isActive ? 1 : 0.92 - Math.abs(offset) * 0.04,
                    filter: isActive ? "blur(0px)" : `blur(${Math.abs(offset) * 3.5}px)`,
                  }}
                  transition={{
                    duration: 0.55,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="absolute flex items-center gap-4"
                >
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.35 }}
                      className="text-2xl font-light text-white md:text-3xl"
                    >
                      →
                    </motion.span>
                  )}

                  <span
                    className={`select-none text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl ${
                      isActive
                        ? "text-white"
                        : "text-white/70"
                    }`}
                  >
                    {word}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        <p className="mt-12 max-w-lg text-center text-sm font-light leading-relaxed text-white/50">
          Resultados, enfoque y acción constante. Así construimos el crecimiento
          de las compañías que confían en SWP.
        </p>
      </div>
    </section>
  );
}
