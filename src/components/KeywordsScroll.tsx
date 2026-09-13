"use client";

import { useEffect, useState, useCallback } from "react";
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
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % KEYWORDS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 2000);
    return () => clearInterval(interval);
  }, [paused, next]);

  const getWord = (offset: number) => {
    const i = (index + offset + KEYWORDS.length) % KEYWORDS.length;
    return KEYWORDS[i];
  };

  return (
    <section
      className="relative overflow-hidden bg-black py-28 md:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/8 blur-[120px]" />
      </div>

      {/* Noise texture overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto flex max-w-[76rem] flex-col items-center px-4">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center text-xs font-semibold uppercase tracking-[0.28em] text-brand-light md:text-sm"
        >
          Lo que impulsa a las empresas que escalan
        </motion.p>

        {/* Animation stage */}
        <div className="relative flex h-[260px] w-full max-w-4xl items-center justify-center md:h-[340px]">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {[-2, -1, 0, 1, 2].map((offset) => {
              const word = getWord(offset);
              const isActive = offset === 0;
              const abs = Math.abs(offset);

              return (
                <motion.div
                  key={`${index}-${offset}`}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : Math.max(0.08, 0.45 - abs * 0.18),
                    y: offset * 58,
                    scale: isActive ? 1 : 0.88 - abs * 0.06,
                    filter: isActive ? "blur(0px)" : `blur(${abs * 4.5}px)`,
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute flex items-center gap-3 md:gap-5"
                >
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.span
                        key="arrow"
                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="text-2xl font-light text-brand-light md:text-4xl"
                      >
                        →
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <span
                    className={`select-none whitespace-nowrap text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl ${
                      isActive
                        ? "bg-gradient-to-r from-white via-white to-brand-light bg-clip-text text-transparent"
                        : "text-white/50"
                    }`}
                  >
                    {word}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Progress dots */}
        <div className="mt-10 flex items-center gap-2">
          {KEYWORDS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir a ${KEYWORDS[i]}`}
              className="group relative flex h-6 w-6 items-center justify-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  i === index
                    ? "w-6 bg-brand"
                    : "w-1.5 bg-white/25 group-hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-12 max-w-md text-center text-sm font-light leading-relaxed text-white/40"
        >
          Resultados, enfoque y acción constante.
          <br />
          Así construimos el crecimiento de las compañías que confían en SWP.
        </motion.p>
      </div>
    </section>
  );
}
