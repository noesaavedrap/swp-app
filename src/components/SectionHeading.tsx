import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-2xl flex-col gap-4",
        align === "left" ? "items-start text-left" : "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-brand">
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "text-[32px] font-light leading-tight tracking-tight text-white lg:text-[46px]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-[560px] text-base font-light leading-relaxed text-white/75",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
