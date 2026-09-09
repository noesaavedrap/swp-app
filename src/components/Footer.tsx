"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
import { ArrowUpRight, AtSign, Globe, MessageCircle, Share2, Zap } from "lucide-react";

const footerLinks = {
  Producto: [
    { label: "SWP Pay", href: "/producto" },
    { label: "SWP Store", href: "/producto" },
    { label: "SWP Business", href: "/producto" },
    { label: "SWP Wallet", href: "/socios" },
    { label: "Precios", href: "/precios" },
  ],
  Compañía: [
    { label: "Clientes", href: "/clientes" },
    { label: "Preguntas frecuentes", href: "/faq" },
    { label: "Área de socios", href: "/socios" },
  ],
  Soporte: [
    { label: "Centro de ayuda", href: "/faq" },
    { label: "Contacto", href: "mailto:hola@swp.finance" },
    { label: "Seguridad", href: "/faq" },
  ],
};

const socials = [
  { icon: Globe, label: "Sitio web", href: "/" },
  { icon: AtSign, label: "X", href: "#" },
  { icon: MessageCircle, label: "Mensajería", href: "mailto:hola@swp.finance" },
  { icon: Share2, label: "Compartir", href: "#" },
];

export default function Footer() {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setSpotlight({ x: ((event.clientX - bounds.left) / bounds.width) * 100, y: ((event.clientY - bounds.top) / bounds.height) * 100 });
  };
  const style = { "--spotlight-x": `${spotlight.x}%`, "--spotlight-y": `${spotlight.y}%` } as CSSProperties;

  return (
    <footer onMouseMove={handleMove} style={style} className="relative overflow-hidden bg-foreground text-white">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(600px_circle_at_var(--spotlight-x)_var(--spotlight-y),rgba(52,211,153,0.16),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

      <div className="relative mx-auto max-w-[76rem] px-4 pb-8 pt-14 xl:px-0 lg:pt-20">
        <div className="mb-16 grid gap-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-light">Construye con SWP</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-light leading-tight tracking-tight text-white md:text-4xl">Tu próxima etapa empieza con una mejor infraestructura.</h2>
          </div>
          <a href="/socios/registro" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-foreground transition-colors hover:bg-brand-100">Crear cuenta <ArrowUpRight className="size-4" /></a>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <a href="/" className="inline-flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand"><Zap className="size-5 text-white" strokeWidth={2.5} /></span>
              <span className="text-base font-semibold tracking-tight text-white">SWP</span>
            </a>
            <p className="mt-4 max-w-[260px] text-sm font-light leading-relaxed text-white/55">La plataforma financiera todo-en-uno para empresas que escalan en Latinoamérica.</p>
            <div className="mt-5 flex gap-2">
              {socials.map(({ icon: Icon, label, href }) => <a key={label} href={href} aria-label={label} className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition-colors hover:border-brand-light/40 hover:bg-brand/20 hover:text-brand-light"><Icon className="size-4" /></a>)}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => <div key={title}><h3 className="text-sm font-medium text-white">{title}</h3><ul className="mt-4 space-y-3">{links.map((link) => <li key={link.label}><a href={link.href} className="text-sm font-light text-white/55 transition-colors hover:text-brand-light">{link.label}</a></li>)}</ul></div>)}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs tracking-[0.28px] text-white/40">&copy; 2026 SWP. Todos los derechos reservados.</p>
          <div className="flex gap-4"><a href="#" className="text-xs text-white/40 transition-colors hover:text-white">Términos</a><a href="#" className="text-xs text-white/40 transition-colors hover:text-white">Privacidad</a><a href="#" className="text-xs text-white/40 transition-colors hover:text-white">Cookies</a></div>
        </div>
      </div>
    </footer>
  );
}
