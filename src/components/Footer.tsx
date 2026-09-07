import { Zap, Globe, AtSign, MessageCircle, Share2 } from "lucide-react";

const footerLinks = {
  Producto: [
    { label: "SWP Pay", href: "#" },
    { label: "SWP Store", href: "#" },
    { label: "SWP Business", href: "#" },
    { label: "SWP Wallet", href: "#" },
    { label: "Pricing", href: "#" },
  ],
  Compañía: [
    { label: "Sobre nosotros", href: "#" },
    { label: "Carreras", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Prensa", href: "#" },
  ],
  Soporte: [
    { label: "Centro de ayuda", href: "#" },
    { label: "Contacto", href: "#" },
    { label: "Estado", href: "#" },
    { label: "Seguridad", href: "#" },
  ],
  Legal: [
    { label: "Términos", href: "#" },
    { label: "Privacidad", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

const socials = [
  { icon: Globe, label: "Sitio web", href: "#" },
  { icon: AtSign, label: "X", href: "#" },
  { icon: MessageCircle, label: "Mensajería", href: "#" },
  { icon: Share2, label: "Compartir", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="mx-auto max-w-[76rem] px-4 xl:px-0 pt-14 pb-10 lg:pt-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand column – spans 2 on lg */}
          <div className="col-span-2">
            <a href="/" className="inline-flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-brand">
                <Zap className="size-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-semibold text-text-primary tracking-tight">
                SWP
              </span>
            </a>
            <p className="mt-4 max-w-[260px] text-sm font-light text-text-secondary leading-relaxed">
              La plataforma financiera todo-en-uno para Latinoamérica.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex size-9 items-center justify-center rounded-full bg-background text-text-primary hover:bg-brand-100 transition-colors"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-medium text-text-primary mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-light text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-tertiary tracking-[0.28px]">
            &copy; 2026 SWP. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              Términos
            </a>
            <a
              href="#"
              className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              Privacidad
            </a>
            <a
              href="#"
              className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
