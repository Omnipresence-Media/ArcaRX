import { Send } from "lucide-react";

export function WeeklyDigestCard({
  client,
  week = 8,
  weightDelta = -1.4,
  adherence = 94,
  prs = ["Bench +5lb", "Squat +10lb"],
  wins = ["Hit 3/3 protein targets", "All sessions completed"],
}: {
  client: string;
  week?: number;
  weightDelta?: number;
  adherence?: number;
  prs?: string[];
  wins?: string[];
}) {
  return (
    <div className="glass-panel relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--teal)] to-transparent opacity-60" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Weekly digest · auto</p>
          <h4 className="mt-1 text-base font-semibold text-foreground">{client} · Week {week}</h4>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--teal)_14%,transparent)] px-3 py-1 text-[11px] font-semibold text-[color:var(--teal)]">
          <Send className="h-3 w-3" /> Send to client
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Weight Δ</p>
          <p className="metric-numeral text-2xl text-[color:var(--data-pos)]">{weightDelta} lb</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Adherence</p>
          <p className="metric-numeral text-2xl text-foreground">{adherence}%</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">PRs</p>
          <p className="text-xs text-foreground/85">{prs.join(" · ")}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Top wins</p>
          <ul className="text-xs text-foreground/85">
            {wins.map((w) => <li key={w}>· {w}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
