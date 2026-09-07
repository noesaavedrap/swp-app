import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="bg-white px-4 py-10 md:py-14 lg:py-28 xl:px-0">
      <div className="mx-auto max-w-[76rem] rounded-3xl md:rounded-[28px] px-8 py-16 md:py-20 text-center bg-[linear-gradient(180deg,rgba(209,250,229,0.55)_0%,#d1fae5_100%)] relative overflow-hidden">
        <div className="absolute rounded-full blur-3xl bg-brand-200/50 size-72 -top-20 -left-20" />
        <div className="absolute rounded-full blur-3xl bg-brand-200/50 size-72 -bottom-20 -right-20" />

        <div className="relative z-10">
          <h2 className="text-[32px] md:text-[44px] font-light text-text-primary -tracking-[0.96px] leading-tight">
            Empieza a vender hoy con SWP
          </h2>
          <p className="mt-4 text-md font-light text-text-secondary max-w-[480px] mx-auto">
            Únete a miles de empresas que ya crecen con nuestra plataforma.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button variant="dark" size="lg">
              Solicitar acceso
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button variant="secondary" size="lg">
              Hablar con ventas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
