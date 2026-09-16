import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="swp-section px-4 py-10 md:py-14 lg:py-28 xl:px-0">
      <div className="relative mx-auto max-w-[76rem] overflow-hidden rounded-3xl border border-brand/20 bg-[radial-gradient(circle_at_50%_0%,rgba(212,255,0,0.18),transparent_42%),linear-gradient(135deg,rgba(18,25,25,0.9),rgba(9,12,16,0.82))] px-8 py-16 text-center shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:rounded-[28px] md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

        <div className="relative z-10">
          <span className="swp-kicker">El siguiente movimiento</span>
          <h2 className="mt-4 text-[32px] md:text-[44px] font-light text-white -tracking-[0.96px] leading-tight">
            Empieza a vender hoy con SWP
          </h2>
          <p className="mt-4 text-md font-light text-white/65 max-w-[480px] mx-auto">
            Únete a miles de empresas que ya crecen con nuestra plataforma.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
      </div>
    </section>
  );
}
