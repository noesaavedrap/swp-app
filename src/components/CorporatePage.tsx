import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface CorporatePageProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export default function CorporatePage({
  eyebrow,
  title,
  description,
  children,
}: CorporatePageProps) {
  return (
    <main className="min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <header className="border-b border-border bg-[linear-gradient(135deg,#f0fdf8_0%,#ffffff_52%,#eff6ff_100%)] pb-16 pt-36 md:pb-24 md:pt-44">
        <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              {eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-light leading-tight tracking-tight text-text-primary md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-text-secondary md:text-xl">
              {description}
            </p>
          </div>
        </div>
      </header>
      {children}
      <Footer />
    </main>
  );
}
