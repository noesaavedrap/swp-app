"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2 } from "lucide-react";
import {
  createPkcePair,
  getAuthgearConfig,
  getAuthgearDiscovery,
  getAuthgearSessionCookie,
  makeAuthgearAuthorizeUrl,
} from "@/lib/authgear";
import { getTurnstileSiteKey } from "@/lib/turnstile";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function SocioForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState<"dni" | "ruc">("dni");
  const [documento, setDocumento] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [loading, setLoading] = useState(false);
  const [validatingDocumento, setValidatingDocumento] = useState(false);
  const [documentoValidado, setDocumentoValidado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetRef = useRef<string | null>(null);

  useEffect(() => {
    const session = getAuthgearSessionCookie();
    if (session?.sub) {
      router.push("/socios/dashboard");
    }
  }, [router]);

  useEffect(() => {
    const container = turnstileRef.current;
    if (!container) return;

    const scriptId = "cloudflare-turnstile-script";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    const renderWidget = () => {
      if (!window.turnstile || !container) return;

      if (turnstileWidgetRef.current) {
        window.turnstile.remove(turnstileWidgetRef.current);
      }

      const widgetId = window.turnstile.render(container, {
        sitekey: getTurnstileSiteKey(),
        action: mode === "signup" ? "socio_signup" : "socio_login",
        theme: "light",
        callback: (token: string) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });

      turnstileWidgetRef.current = widgetId;
      setTurnstileWidgetId(widgetId);
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
      return () => {
        if (turnstileWidgetRef.current) {
          window.turnstile?.remove(turnstileWidgetRef.current);
          turnstileWidgetRef.current = null;
        }
      };
    }

    if (window.turnstile) {
      renderWidget();
    }

    return () => {
      if (turnstileWidgetRef.current) {
        window.turnstile?.remove(turnstileWidgetRef.current);
        turnstileWidgetRef.current = null;
      }
    };
  }, [mode]);

  const verifyTurnstile = async () => {
    if (!turnstileToken) {
      setError("Completa la verificación de seguridad antes de continuar.");
      return false;
    }

    const response = await fetch("/api/turnstile/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: turnstileToken }),
    });

    const payload = (await response.json().catch(() => ({ ok: false, error: "La verificación falló." }))) as {
      ok?: boolean;
      error?: string;
    };

    if (!response.ok || !payload.ok) {
      setError(payload.error || "La verificación de seguridad falló.");
      if (turnstileWidgetId) {
        window.turnstile?.reset(turnstileWidgetId);
      }
      setTurnstileToken("");
      return false;
    }

    return true;
  };

  const validarDocumento = async () => {
    const numero = documento.trim();
    if (!numero) {
      setError("Ingresa un DNI o RUC para validarlo.");
      return;
    }

    setError(null);
    setInfo(null);
    setValidatingDocumento(true);

    try {
      const response = await fetch("/api/consulta-documento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: tipoDocumento, numero }),
      });

      const payload = await response.json();

      // Soft success: format OK, maybe no auto-filled names
      if (payload.ok) {
        const nextNombres = String(payload.nombres || "").trim();
        const nextApellidos = String(payload.apellidos || "").trim();

        if (nextNombres) setNombres(nextNombres);
        if (nextApellidos) setApellidos(nextApellidos);

        setDocumentoValidado(true);

        if (payload.source === "api" && nextNombres) {
          setInfo(
            tipoDocumento === "dni"
              ? "DNI validado. Datos completados automáticamente."
              : "RUC validado. Razón social completada automáticamente.",
          );
        } else {
          setInfo(
            payload.message ||
              "Documento con formato válido. Completa nombres y apellidos manualmente.",
          );
        }
        return;
      }

      // Not found / API error — still allow manual if format was ok or allowManual
      if (payload.allowManual || response.status === 404) {
        setDocumentoValidado(true);
        setError(null);
        setInfo(
          payload.error ||
            "No encontramos datos en el padrón. Puedes completar nombres y apellidos a mano.",
        );
        return;
      }

      throw new Error(payload.error || "No se pudo validar el documento.");
    } catch (err) {
      setDocumentoValidado(false);
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos validar el documento. Intenta nuevamente.",
      );
    } finally {
      setValidatingDocumento(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const verified = await verifyTurnstile();
      if (!verified) {
        setLoading(false);
        return;
      }

      const config = getAuthgearConfig();
      if (!config) {
        throw new Error("Authgear no está configurado. Agrega NEXT_PUBLIC_AUTHGEAR_ISSUER y NEXT_PUBLIC_AUTHGEAR_CLIENT_ID.");
      }

      const discovery = await getAuthgearDiscovery();
      const authorizationEndpoint = discovery?.authorization_endpoint;

      if (!authorizationEndpoint) {
        throw new Error("No se pudo cargar la configuración de Authgear.");
      }

      const { verifier, challenge } = await createPkcePair();
      const state = window.btoa(`${Date.now()}-${Math.random().toString(16).slice(2)}`)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
      const nonce = window.btoa(`${Date.now()}-${Math.random().toString(16).slice(2)}`)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");

      sessionStorage.setItem("swp_authgear_pkce", verifier);
      sessionStorage.setItem("swp_authgear_state", state);
      sessionStorage.setItem("swp_authgear_mode", mode);
      sessionStorage.setItem("swp_authgear_nonce", nonce);

      const url = makeAuthgearAuthorizeUrl({
        state,
        nonce,
        codeChallenge: challenge,
        redirectUri: config.redirectUri,
        mode,
        clientId: config.clientId,
        authorizationEndpoint,
      });

      window.location.href = url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(message || "No pudimos iniciar la sesión de Authgear.");
      setLoading(false);
    }
  }; 

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-card">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-brand to-brand-light">
          <Zap className="size-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-text-primary">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p className="text-xs font-light text-text-tertiary">
            {mode === "login"
              ? "Accede a tu dashboard de socios"
              : "Únete al área de socios"}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">
        {mode === "signup" && (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                Tipo de documento
              </span>
              <select
                value={tipoDocumento}
                onChange={(e) => {
                  const nextTipo = e.target.value as "dni" | "ruc";
                  setTipoDocumento(nextTipo);
                  setDocumentoValidado(false);
                  setNombres("");
                  setApellidos("");
                  setDocumento("");
                  setError(null);
                  setInfo(null);
                }}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="dni">DNI</option>
                <option value="ruc">RUC</option>
              </select>
            </label>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="documento" className="text-xs font-medium text-text-primary uppercase tracking-wide">
                {tipoDocumento === "dni" ? "DNI" : "RUC"}
              </label>
              <div className="flex gap-2">
                <input
                  id="documento"
                  type="text"
                  inputMode="numeric"
                  value={documento}
                  onChange={(e) => {
                    setDocumento(e.target.value.replace(/\D/g, ""));
                    setDocumentoValidado(false);
                  }}
                  maxLength={tipoDocumento === "dni" ? 8 : 11}
                  className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
                  placeholder={
                    tipoDocumento === "dni"
                      ? "8 dígitos"
                      : "11 dígitos"
                  }
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="relative z-10 shrink-0 cursor-pointer"
                  onClick={validarDocumento}
                  disabled={validatingDocumento}
                >
                  {validatingDocumento ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Validar"
                  )}
                </Button>
              </div>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                {tipoDocumento === "dni" ? "Nombres" : "Razón social"}
              </span>
              <input
                type="text"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
                placeholder={
                  tipoDocumento === "dni"
                    ? "ej. María"
                    : "ej. Empresa XYZ S.A.C."
                }
              />
            </label>

            {tipoDocumento === "dni" && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                  Apellidos
                </span>
                <input
                  type="text"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
                  placeholder="ej. Torres García"
                />
              </label>
            )}
          </>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
            Correo
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
            placeholder="socio@correo.com"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
            Contraseña
          </span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
            placeholder="Mínimo 8 caracteres"
          />
        </label>

        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <div ref={turnstileRef} className="flex justify-center" />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {info}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          variant="dark"
          size="lg"
          className="mt-2"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {mode === "login" ? "Ingresar" : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm font-light text-text-tertiary">
        {mode === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <Link
              href="/socios/registro"
              className="font-medium text-brand hover:underline"
            >
              Crear cuenta
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/socios/login"
              className="font-medium text-brand hover:underline"
            >
              Iniciar sesión
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
