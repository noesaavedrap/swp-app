import { Wrench } from "lucide-react";

export default function MaintenanceBanner() {
  return (
    <div className="swp-maintenance-banner" role="status">
      <div className="mx-auto flex max-w-[76rem] items-center justify-center gap-2 px-4 text-center">
        <Wrench className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
        <p>
          Estamos en mantenimiento hasta el <strong>2 de DICIEMBRE del 2026</strong>.
        </p>
      </div>
    </div>
  );
}
