import { leadStages, leads, type LeadStage } from "@/lib/fit-seed-extra";

const STAGE_TONE: Record<LeadStage, string> = {
  Inquiry:     "border-[color:var(--glass-stroke-strong)]",
  Consult:     "border-[color:color-mix(in_oklab,var(--data-neutral)_40%,transparent)]",
  Onboarding:  "border-[color:color-mix(in_oklab,var(--teal)_35%,transparent)]",
  Active:      "border-[color:color-mix(in_oklab,var(--data-pos)_35%,transparent)]",
};

export function LeadKanban() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {leadStages.map((stage) => {
        const items = leads.filter((l) => l.stage === stage);
        const total = items.reduce((s, l) => s + l.value, 0);
        return (
          <div key={stage} className={`glass-panel-quiet flex flex-col gap-2 rounded-xl border p-3 ${STAGE_TONE[stage]}`}>
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/90">{stage}</p>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{items.length} · ${total.toLocaleString()}</span>
            </div>
            {items.map((l) => (
              <div key={l.id} className="rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_70%,transparent)] p-2.5">
                <p className="text-sm font-medium text-foreground">{l.name}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{l.source} · {l.age}</p>
                <p className="metric-numeral mt-1.5 text-lg text-foreground">${l.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
