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
      <header className="border-b border-[#d7e4d9] bg-[#edf4eb] bg-[linear-gradient(to_right,rgba(23,51,38,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,51,38,0.035)_1px,transparent_1px)] bg-[size:32px_32px] pb-16 pt-36 md:pb-24 md:pt-44">
        <div className="mx-auto max-w-[76rem] px-4 xl:px-0">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#39734b]">
              {eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-[#173326] md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-[#53695a] md:text-xl">
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
