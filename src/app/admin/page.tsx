import { redirect } from "next/navigation";
import { currentUser } from "@authgear/nextjs/server";
import { authgearConfig } from "@/lib/authgear";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminStatsSection from "@/components/admin/AdminStatsSection";
import AdminSociosTable from "@/components/admin/AdminSociosTable";
import AdminTransaccionesTable from "@/components/admin/AdminTransaccionesTable";

export default async function AdminPage() {
  const sessionUser = await currentUser(authgearConfig);
  if (!sessionUser) redirect("/api/auth/login?returnTo=/admin");

  const user = {
    email: sessionUser.email,
    name: sessionUser.name,
    picture: sessionUser.picture,
    sub: sessionUser.sub,
  };

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-brand to-brand-light">
                <Zap className="size-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-text-primary tracking-tight">
                SWP Admin
              </span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {user.picture && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.picture}
                  alt="Avatar"
                  className="size-8 rounded-full border border-border"
                />
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-text-primary leading-tight">
                  {user.name || "Administrador"}
                </p>
                <p className="text-xs font-light text-text-tertiary truncate max-w-[180px]">
                  {user.email}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <a href="/api/auth/logout">Salir</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Panel de Administración
          </h1>
          <p className="mt-1 text-sm font-light text-text-tertiary">
            Gestiona socios, transacciones y configuración de SWP Finance.
          </p>
        </div>

        <AdminStatsSection />

        <div className="mt-8 grid gap-6 lg:grid-cols-1">
          <AdminSociosTable />
          <AdminTransaccionesTable />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-card">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Información de sesión
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
                Email
              </p>
              <p className="mt-1 text-sm font-medium text-text-primary break-all">
                {user.email}
              </p>
            </div>
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
                Authgear Subject
              </p>
              <p className="mt-1 text-sm font-mono text-text-primary break-all">
                {user.sub}
              </p>
            </div>
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
                Estado
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="size-2 rounded-full bg-brand" />
                <span className="text-sm font-medium text-text-primary">
                  Autenticado (Authgear)
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
