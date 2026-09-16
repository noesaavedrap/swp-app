type ClientVideo = {
  id: string;
  label: string;
  handle: string;
};

export default function ClientVideoCard({ client }: { client: ClientVideo }) {
  return (
    <article className="swp-client-video-card w-[min(72vw,250px)] shrink-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#101216] shadow-[0_18px_50px_rgba(0,0,0,0.28)] md:w-[280px]">
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#08090c]">
        <iframe
          src={`https://www.tiktok.com/player/v1/${client.id}?description=1&music_info=1&rel=0`}
          title={`Video de ${client.label}`}
          loading="lazy"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          className="absolute inset-0 size-full border-0"
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{client.label}</p>
          <p className="mt-1 truncate text-xs text-white/45">{client.handle}</p>
        </div>
        <span className="size-2 shrink-0 rounded-full bg-brand shadow-[0_0_12px_rgba(212,255,0,0.8)]" aria-label="Cliente verificado" />
      </div>
    </article>
  );
}
