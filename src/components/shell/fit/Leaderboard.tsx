import { Crown, Flame } from "lucide-react";
import { leaderboard } from "@/lib/fit-seed-extra";

export function Leaderboard() {
  return (
    <ul className="space-y-1.5">
      {leaderboard.map((r) => (
        <li
          key={r.rank}
          className="flex items-center gap-3 rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] px-3 py-2"
        >
          <span className={`grid h-7 w-7 place-items-center rounded-full font-mono text-[11px] tabular-nums ${
            r.rank === 1 ? "bg-[color:color-mix(in_oklab,var(--teal)_28%,transparent)] text-foreground" :
            r.rank <= 3 ? "bg-[color:color-mix(in_oklab,var(--teal)_14%,transparent)] text-foreground/90" :
            "bg-[color:color-mix(in_oklab,var(--surface-glass)_70%,transparent)] text-muted-foreground"
          }`}>
            {r.rank === 1 ? <Crown className="h-3.5 w-3.5" /> : r.rank}
          </span>
          <p className="flex-1 truncate text-sm font-medium text-foreground">{r.client}</p>
          <span className="inline-flex items-center gap-1 text-[11px] text-[color:var(--data-neg)]">
            <Flame className="h-3 w-3" /> {r.streak}d
          </span>
          <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{r.prs} PR</span>
          <span className="metric-numeral text-base text-foreground">{r.points}</span>
        </li>
      ))}
    </ul>
  );
}
