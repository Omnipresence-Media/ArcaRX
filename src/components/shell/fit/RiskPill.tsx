import type { RiskLevel } from "@/lib/fit-seed-extra";

const STYLES: Record<RiskLevel, string> = {
  "Low":     "border-[color:color-mix(in_oklab,var(--data-pos)_30%,transparent)] text-[color:var(--data-pos)] bg-[color:color-mix(in_oklab,var(--data-pos)_10%,transparent)]",
  "Watch":   "border-[color:color-mix(in_oklab,var(--data-neutral)_40%,transparent)] text-foreground/80 bg-[color:color-mix(in_oklab,var(--data-neutral)_12%,transparent)]",
  "At-risk": "border-[color:color-mix(in_oklab,var(--data-neg)_35%,transparent)] text-[color:var(--data-neg)] bg-[color:color-mix(in_oklab,var(--data-neg)_12%,transparent)]",
};

export function RiskPill({ level, score, compact = false }: { level: RiskLevel; score?: number; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${STYLES[level]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${level === "Low" ? "bg-[color:var(--data-pos)]" : level === "At-risk" ? "bg-[color:var(--data-neg)]" : "bg-foreground/60"}`} />
      {level}
      {!compact && typeof score === "number" && <span className="font-mono opacity-70">· {score}</span>}
    </span>
  );
}
