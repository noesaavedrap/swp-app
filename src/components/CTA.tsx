import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="swp-section border-y border-white/10 bg-[#0d1213] px-4 py-12 md:py-16 lg:py-20 xl:px-0">
      <div className="mx-auto grid max-w-[76rem] gap-8 border-l-2 border-brand pl-5 md:grid-cols-[1fr_auto] md:items-center md:gap-12 md:pl-8">
        <div>
          <span className="swp-kicker">El siguiente movimiento</span>
          <h2 className="mt-3 text-[32px] font-semibold leading-tight text-white md:text-[44px]">
            Empieza a vender hoy con SWP
          </h2>
          <p className="mt-3 max-w-[560px] text-md font-light text-white/65">
            Únete a miles de empresas que ya crecen con nuestra plataforma.
          </p>
        </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 md:mt-0">
            <Button variant="dark" size="lg" asChild>
              <Link href="/socios/registro">
              Solicitar acceso
              <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              <a href="mailto:ventas@swp.finance">Hablar con ventas</a>
            </Button>
          </div>
      </div>
    </section>
  );
}
