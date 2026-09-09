"use client"

import { useState, useEffect } from "react"
import { Menu, Zap, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Producto", href: "/producto" },
  { label: "Precios", href: "/precios" },
  { label: "Clientes", href: "/clientes" },
  { label: "FAQ", href: "/faq" },
  { label: "Socios", href: "/socios" },
  { label: "Admin", href: "/admin" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    fetch("/auth/profile", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user?.email ?? null))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return
        setUser(null)
      })
      .finally(() => setProfileLoading(false))

    return () => controller.abort()
  }, [])

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 z-50 w-[calc(100%-32px)] -translate-x-1/2 md:top-6 lg:top-7 max-w-[76rem] xl:w-full transition-shadow duration-300 ${scrolled ? "shadow-card" : ""}`}
      >
        <div className="bg-white rounded-xl md:rounded-2xl shadow-card border border-border px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-brand to-brand-light">
              <Zap className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold text-text-primary tracking-tight">
                SWP
              </span>
              <span className="text-[10px] font-light text-text-tertiary tracking-wide uppercase">
                Finance
              </span>
            </div>
          </a>

          {/* Center nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-light text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="hidden lg:inline-flex items-center gap-4">
            {profileLoading ? (
              <div className="h-9 w-28 animate-pulse rounded-lg bg-secondary" aria-label="Cargando sesión" />
            ) : user ? (
              <>
                <span className="text-sm font-light text-text-secondary max-w-[12rem] truncate">
                  {user}
                </span>
                <Button variant="dark" size="sm" asChild>
                  <a href="/auth/logout">Salir</a>
                </Button>
              </>
            ) : (
              <>
                <a
                  href="/auth/login?screen_hint=signup"
                  className="text-sm font-light text-text-secondary hover:text-text-primary transition-colors"
                >
                  Crear cuenta
                </a>
                <Button variant="secondary" size="sm" asChild>
                  <a href="/auth/login">Iniciar sesión</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="lg:hidden mt-2 bg-white rounded-xl border border-border shadow-card px-6 py-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200 fill-mode-both">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-light text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <hr className="border-border" />
            {user ? (
              <Button variant="dark" size="sm" className="w-full" asChild>
                <a href="/auth/logout">Salir ({user})</a>
              </Button>
            ) : (
              <>
                <a
                  href="/auth/login?screen_hint=signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-light text-text-secondary hover:text-text-primary transition-colors"
                >
                  Crear cuenta
                </a>
                <Button variant="dark" size="sm" className="w-full" asChild>
                  <a href="/auth/login">Iniciar sesión</a>
                </Button>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
