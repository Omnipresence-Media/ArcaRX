import { Play, Clock } from "lucide-react";
import type { Video } from "@/lib/fit-seed";

export function VideoCard({ v, onOpen }: { v: Video; onOpen?: (v: Video) => void }) {
  const mm = Math.floor(v.durationSec / 60);
  const ss = String(v.durationSec % 60).padStart(2, "0");
  return (
    <button
      type="button"
      onClick={() => onOpen?.(v)}
      className="group glass-panel overflow-hidden p-0 text-left transition-transform duration-[var(--dur-base)] ease-[var(--ease-out-quint)] hover:-translate-y-0.5"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={v.thumb}
          alt={v.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
          <Clock className="h-3 w-3" />
          {mm}:{ss}
        </span>
        <span className="absolute left-2 top-2 rounded-full bg-[color:color-mix(in_oklab,var(--teal)_85%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
          {v.difficulty}
        </span>
        <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-foreground shadow-xl ring-2 ring-white/40">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="line-clamp-1 text-sm font-medium text-foreground">{v.title}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {v.muscle} · {v.equipment} · {v.views.toLocaleString()} views
        </p>
      </div>
    </button>
  );
}
