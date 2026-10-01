import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SociosPage() {
  return (
    <div className="min-h-screen bg-[#eff4ee] bg-[linear-gradient(to_right,rgba(23,51,38,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,51,38,0.035)_1px,transparent_1px)] bg-[size:32px_32px]">
      <header className="mx-auto flex max-w-[76rem] items-center justify-between px-4 py-6 xl:px-0">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand">
            <Zap className="size-5 text-[#102317]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold text-[#173326] tracking-tight">
              SWP
            </span>
            <span className="text-[10px] font-light text-[#64786c] tracking-wide uppercase">
              Finance
            </span>
          </div>
        </a>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/socios/login">Iniciar sesión</Link>
          </Button>
          <Button variant="dark" size="sm" asChild>
            <Link href="/socios/registro">Crear cuenta</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[76rem] px-4 pt-20 pb-28 text-center xl:px-0">
        <div className="mx-auto max-w-[640px]">
          <div className="inline-flex items-center gap-2 rounded-md border border-[#cfddcf] bg-white px-3 py-1 text-sm font-medium text-[#41604a]">
            <span className="size-1.5 rounded-full bg-brand animate-pulse" />
            Área de Socios
          </div>

          <h1 className="mt-6 text-[40px] leading-[1.05] font-semibold text-[#173326] md:text-[56px]">
            Tu espacio como{" "}
            <span className="text-[#327746]">
              socio
            </span>{" "}
            de SWP
          </h1>

          <p className="mt-5 text-md font-light text-[#53695a] leading-relaxed">
            Gestiona tus finanzas, revisa tus movimientos y mantén control total
            de tu actividad como socio dentro de la plataforma SWP.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button variant="dark" size="lg" asChild>
              <Link href="/socios/login">Iniciar sesión</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/socios/registro">Crear cuenta de socio</Link>
            </Button>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3 text-left">
            {[
              {
                title: "Dashboard Personal",
                desc: "Visualiza tu saldo, ingresos y egresos en tiempo real.",
              },
              {
                title: "Transacciones",
                desc: "Registra ingresos, egresos y transferencias con tu método preferido.",
              },
              {
                title: "Real-time",
                desc: "Los cambios se reflejan al instante gracias a Supabase Realtime.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-[#d7e1d6] bg-white p-5"
              >
                <h3 className="text-sm font-medium text-[#173326]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-light text-[#53695a] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
