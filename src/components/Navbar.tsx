"use client"

import { useState, useEffect } from "react"
import { Globe2, Menu, Zap, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Producto", href: "/producto" },
  { label: "Precios", href: "/precios" },
  { label: "Clientes", href: "/clientes" },
  { label: "FAQ", href: "/faq" },
  { label: "Socios", href: "/socios" },
  { label: "Admin", href: "/admin" },
]

const markets = [
  { code: "PE", name: "Perú", flag: "🇵🇪" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "BR", name: "Brasil", flag: "🇧🇷" },
] as const

type MarketCode = (typeof markets)[number]["code"]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [market, setMarket] = useState<MarketCode>("PE")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const savedMarket = window.localStorage.getItem("swp-market") as MarketCode | null
    if (savedMarket && markets.some((item) => item.code === savedMarket)) {
      setMarket(savedMarket)
    }
  }, [])

  const handleMarketChange = (value: MarketCode) => {
    setMarket(value)
    window.localStorage.setItem("swp-market", value)
  }

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
        className={`fixed top-12 left-1/2 z-50 w-[calc(100%-32px)] -translate-x-1/2 md:top-14 lg:top-16 max-w-[76rem] xl:w-full transition-all duration-300 ${scrolled ? "" : ""}`}
      >
        <div className="rounded-xl md:rounded-2xl border border-white/10 bg-[#0d1016]/80 px-6 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-brand to-brand-light shadow-[0_0_24px_rgba(212,255,0,0.3)]">
              <Zap className="size-5 text-[#0a0b10]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold text-white tracking-tight">SWP</span>
              <span className="text-[10px] font-light text-text-tertiary tracking-[0.22em] uppercase">Finance</span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-light text-text-secondary transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:inline-flex items-center gap-4">
            <MarketSwitcher market={market} onChange={handleMarketChange} />
            {profileLoading ? (
              <div className="h-9 w-28 animate-pulse rounded-lg bg-white/5" aria-label="Cargando sesión" />
            ) : user ? (
              <>
                <span className="max-w-[12rem] truncate text-sm font-light text-text-secondary">{user}</span>
                <Button variant="dark" size="sm" asChild>
                  <a href="/auth/logout">Salir</a>
                </Button>
              </>
            ) : (
              <>
                <a href="/auth/login?screen_hint=signup" className="text-sm font-light text-text-secondary transition-colors hover:text-white">
                  Crear cuenta
                </a>
                <Button variant="primary" size="sm" asChild>
                  <a href="/auth/login">Iniciar sesión</a>
                </Button>
              </>
            )}
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden border-white/10 bg-white/5 text-white hover:bg-white/10"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="mt-2 flex flex-col gap-4 rounded-xl border border-white/10 bg-[#0d1016]/90 px-6 py-5 shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl lg:hidden animate-in fade-in slide-in-from-top-2 duration-200 fill-mode-both">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-light text-text-secondary transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <MarketSwitcher market={market} onChange={handleMarketChange} mobile />
            <hr className="border-white/10" />
            {user ? (
              <Button variant="dark" size="sm" className="w-full" asChild>
                <a href="/auth/logout">Salir ({user})</a>
              </Button>
            ) : (
              <>
                <a
                  href="/auth/login?screen_hint=signup"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-light text-text-secondary transition-colors hover:text-white"
                >
                  Crear cuenta
                </a>
                <Button variant="primary" size="sm" className="w-full" asChild>
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

function MarketSwitcher({ market, onChange, mobile = false }: { market: MarketCode; onChange: (value: MarketCode) => void; mobile?: boolean }) {
  const selectedMarket = markets.find((item) => item.code === market) ?? markets[0]

  return (
    <label className={`relative flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-white/75 backdrop-blur-sm ${mobile ? "w-full" : ""}`}>
      <Globe2 className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
      <span className="text-base leading-none" aria-hidden="true">{selectedMarket.flag}</span>
      <span className="sr-only">País de operación</span>
      <select
        value={market}
        onChange={(event) => onChange(event.target.value as MarketCode)}
        aria-label="País de operación"
        className="w-full cursor-pointer appearance-none bg-transparent pr-5 outline-none"
      >
        {markets.map((item) => (
          <option key={item.code} value={item.code} className="bg-[#0d1016] text-white">
            {item.flag} {item.code} - {item.name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-[9px] text-white/40">v</span>
    </label>
  )
}
