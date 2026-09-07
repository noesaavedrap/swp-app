import { Zap } from "lucide-react";

export default function SociosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary">
      {children}
      <footer className="border-t border-border bg-white py-6">
        <div className="mx-auto flex max-w-[76rem] items-center justify-between px-4 xl:px-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand">
              <Zap className="size-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-medium text-text-tertiary">
              SWP Finance
            </span>
          </div>
          <p className="text-xs text-text-tertiary">
            &copy; 2026 SWP. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
