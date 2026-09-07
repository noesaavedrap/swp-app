"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SlidingNumberProps {
  number: number;
  fromNumber?: number;
  decimalPlaces?: number;
  className?: string;
}

export function SlidingNumber({
  number,
  fromNumber,
  decimalPlaces = 0,
  className,
}: SlidingNumberProps) {
  const [display, setDisplay] = useState(fromNumber ?? number);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = fromNumber ?? 0;
    const end = number;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [number, fromNumber]);

  const formatted = display.toFixed(decimalPlaces);
  const parts = formatted.split(".");

  return (
    <span className={cn("inline-flex items-baseline tabular-nums", className)}>
      <span>{parts[0]}</span>
      {parts[1] !== undefined && (
        <>
          <span className="text-[0.75em]">.</span>
          <span>{parts[1]}</span>
        </>
      )}
    </span>
  );
}
