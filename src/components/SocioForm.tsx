"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tipo: tipoDocumento, numero }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "No se pudo validar el documento.");
      }

      const nextNombres = String(payload.nombres || "").trim();
      const nextApellidos = String(payload.apellidos || "").trim();

      if (!nextNombres) {
        throw new Error("La consulta devolvió datos incompletos.");
      }

      setNombres(nextNombres);
      setApellidos(nextApellidos);
      setDocumentoValidado(true);
      setInfo(
        tipoDocumento === "dni"
          ? "DNI validado correctamente. Se completaron tus datos de registro."
          : "RUC validado correctamente. Se completaron los datos de la empresa."
      );
    } catch (err) {
      setDocumentoValidado(false);
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos validar el documento. Intenta nuevamente."
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
      const supabase = getSupabase();

      if (mode === "signup") {
        if (!documento.trim()) {
          setError("Ingresa tu DNI o RUC para continuar.");
          setLoading(false);
          return;
        }

        if (!documentoValidado) {
          setError("Debes validar tu documento antes de crear la cuenta.");
          setLoading(false);
          return;
        }

        const trimmedNombres = nombres.trim();
        const trimmedApellidos = apellidos.trim();

        if (!trimmedNombres) {
          setError("Ingresa el nombre o razón social para registrarte.");
          setLoading(false);
          return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nombres: trimmedNombres,
              apellidos: trimmedApellidos,
              documento,
              tipo_documento: tipoDocumento,
            },
          },
        });

        if (signUpError) throw signUpError;

        const user = signUpData.user;
        if (user) {
          const { error: profileError } = await supabase
            .from("socios")
            .upsert(
              {
                id: user.id,
                nombres: trimmedNombres,
                apellidos: trimmedApellidos,
                documento,
                rol: "socio",
              },
              { onConflict: "id" },
            );

          if (profileError) throw profileError;
        }

        setInfo(
          "Cuenta creada. Revisa tu correo para confirmar el registro, luego inicia sesión."
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/socios/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos completar el registro. Intenta nuevamente.",
      );
    } finally {
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
                }}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="dni">DNI</option>
                <option value="ruc">RUC</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                {tipoDocumento === "dni" ? "DNI" : "RUC"}
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={documento}
                  onChange={(e) => {
                    setDocumento(e.target.value);
                    setDocumentoValidado(false);
                  }}
                  className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
                  placeholder={tipoDocumento === "dni" ? "Ingrese 8 dígitos" : "Ingrese 11 dígitos"}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={validarDocumento}
                  disabled={validatingDocumento}
                >
                  {validatingDocumento ? <Loader2 className="size-4 animate-spin" /> : "Validar"}
                </Button>
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-text-primary uppercase tracking-wide">
                {tipoDocumento === "dni" ? "Nombres" : "Razón social"}
              </span>
              <input
                type="text"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand"
                placeholder={tipoDocumento === "dni" ? "ej. María López" : "ej. Empresa XYZ S.A.C."}
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

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        {info && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p>
        )}

        <Button type="submit" disabled={loading} variant="dark" size="lg" className="mt-2">
          {loading && <Loader2 className="size-4 animate-spin" />}
          {mode === "login" ? "Ingresar" : "Crear cuenta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm font-light text-text-tertiary">
        {mode === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <Link href="/socios/registro" className="font-medium text-brand hover:underline">
              Crear cuenta
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/socios/login" className="font-medium text-brand hover:underline">
              Iniciar sesión
            </Link>
          </>
        )}
      </p>
    </div>
  );
}