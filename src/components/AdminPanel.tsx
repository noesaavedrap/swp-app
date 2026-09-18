import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPanelProps {
  user: {
    email?: string;
    name?: string;
    picture?: string;
    sub?: string;
  };
}

export default function AdminPanel({ user }: AdminPanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
            Panel de Administración
          </h1>
          <p className="mt-1 text-sm font-light text-text-tertiary">
            Acceso restringido — sesión verificada con Authgear.
          </p>
        </div>
        <Button variant="dark" size="sm" asChild>
          <a href="/api/auth/logout">Cerrar sesión</a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-brand to-brand-light">
              <Zap className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
                Identidad
              </p>
              <p className="text-sm font-medium text-text-primary">{user.name || "Administrador"}</p>
            </div>
          </div>
          <p className="mt-4 text-sm font-light text-text-secondary break-all">
            {user.email}
          </p>
          {user.picture && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.picture}
              alt="Avatar"
              className="mt-4 size-12 rounded-full border border-border"
            />
          )}
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
            Authgear Subject ID
          </p>
          <p className="mt-2 text-sm font-mono text-text-primary break-all">
            {user.sub}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-card">
          <p className="text-xs font-light text-text-tertiary uppercase tracking-wide">
            Estado
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand" />
            <span className="text-sm font-medium text-text-primary">
              Autenticado (Authgear)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}