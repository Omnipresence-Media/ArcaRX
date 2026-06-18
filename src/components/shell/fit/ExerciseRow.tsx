import { Play } from "lucide-react";
import type { Exercise } from "@/lib/fit-seed";

export function ExerciseRow({ ex }: { ex: Exercise }) {
  return (
    <div className="group flex items-center gap-3 rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-2.5 transition-colors hover:border-[color:var(--glass-stroke-strong)]">
      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-[color:color-mix(in_oklab,var(--navy)_35%,transparent)] ring-1 ring-[color:var(--glass-stroke)]">
        <div className="absolute inset-0 grid place-items-center text-white/80 opacity-90 group-hover:opacity-100">
          <Play className="h-4 w-4 fill-current" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{ex.name}</p>
        <p className="text-[11px] text-muted-foreground">
          {ex.muscle} · {ex.equipment}
        </p>
      </div>
      <div className="flex items-center gap-4 text-right">
        <Stat label="Sets" value={String(ex.sets)} />
        <Stat label="Reps" value={ex.reps} />
        <Stat label="RPE"  value={String(ex.rpe)} />
        <Stat label="Rest" value={ex.rest} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[40px]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="font-mono text-sm tabular-nums text-foreground">{value}</p>
    </div>
  );
}
