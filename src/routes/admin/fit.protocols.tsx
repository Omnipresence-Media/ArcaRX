import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel, SimpleTable } from "@/components/shell/AnalyticsSubPage";
import { PROTOCOL_LIBRARY, type ProtocolTemplate } from "@/features/coaching/protocolSeed";
import { useGoToast } from "@/lib/coachToast";
import { CreateButton } from "@/components/shell/CreateButton";
import { Plus, Sparkle } from "lucide-react";

export const Route = createFileRoute("/admin/fit/protocols")({
  head: () => ({ meta: [{ title: "Protocols - ARCA Coaching" }] }),
  component: ProtocolsPage,
});

const CATEGORY_COLOR: Record<ProtocolTemplate["category"], string> = {
  Skincare: "var(--chart-violet, #a78bfa)",
  HRT: "var(--chart-blue, #60a5fa)",
  "Weight loss": "var(--chart-emerald, #4ade80)",
  Longevity: "var(--chart-amber, #fbbf24)",
};

function ProtocolsPage() {
  const go = useGoToast();
  const [selectedId, setSelectedId] = useState(PROTOCOL_LIBRARY[0].id);
  const p = PROTOCOL_LIBRARY.find((x) => x.id === selectedId) ?? PROTOCOL_LIBRARY[0];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching · Protocol"
        title="Protocol library"
        description="Skincare and clinical regimens, supplement stacks, and dosing schedules you can assign to clients."
        actions={
          <CreateButton
            title="New protocol"
            description="Build a regimen with steps, supplements, and dosing."
            submitLabel="Create protocol"
            fields={[
              { name: "name", label: "Protocol name", placeholder: "e.g. Brightening Skincare" },
              { name: "category", label: "Category", type: "select", options: ["Skincare", "HRT", "Weight loss", "Longevity"] },
              { name: "weeks", label: "Duration (weeks)", type: "number", placeholder: "12" },
              { name: "summary", label: "Summary", type: "textarea", placeholder: "What this regimen does and who it's for…" },
            ]}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background"
          >
            <Plus className="h-3.5 w-3.5" /> New protocol
          </CreateButton>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Library list */}
        <div className="space-y-2">
          {PROTOCOL_LIBRARY.map((t) => {
            const active = t.id === selectedId;
            const color = CATEGORY_COLOR[t.category];
            return (
              <button
                key={t.id}
                onClick={() => setSelectedId(t.id)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  active
                    ? "border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--surface-glass)_65%,transparent)]"
                    : "border-[color:var(--glass-stroke)] hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_45%,transparent)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: `color-mix(in oklab, ${color} 16%, transparent)`, color }}>
                    {t.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{t.durationWeeks} wk</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{t.name}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{t.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="space-y-5">
          <Panel
            title={p.name}
            actions={<span className="text-[11px] text-muted-foreground">{p.category} · {p.durationWeeks} weeks</span>}
          >
            <p className="text-sm text-muted-foreground">{p.summary}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => go(`Assign "${p.name}"`, { description: "Pick a client, then enable their Protocol program to apply it.", to: "/admin/fit/clients", label: "Choose client" })}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
              >
                <Sparkle className="h-3.5 w-3.5" /> Assign to client
              </button>
              <button
                onClick={() => toast.info("Duplicate protocol", { description: "Create an editable copy of this template." })}
                className="rounded-full glass-panel-quiet px-4 py-2 text-xs font-semibold text-foreground"
              >
                Duplicate
              </button>
            </div>
          </Panel>

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Regimen">
              <div className="space-y-2">
                {p.regimen.map((r) => (
                  <div key={r.step} className="flex items-start gap-3 rounded-lg border border-[color:var(--glass-stroke)] p-2.5">
                    <span className="mt-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: "color-mix(in oklab, var(--chart-violet, #a78bfa) 16%, transparent)", color: "var(--chart-violet, #a78bfa)" }}>{r.time}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground">{r.product}</p>
                      <p className="text-[11px] text-muted-foreground">{r.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <div className="space-y-5">
              <Panel title="Supplements">
                <SimpleTable headers={["Supplement", "Dose", "Timing"]} rows={p.supplements.map((s) => [s.name, s.dose, s.timing])} />
              </Panel>
              {p.dosing.length > 0 && (
                <Panel title="Dosing schedule">
                  <SimpleTable headers={["Medication", "Schedule", "Route"]} rows={p.dosing.map((d) => [d.med, d.schedule, d.route])} />
                </Panel>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
