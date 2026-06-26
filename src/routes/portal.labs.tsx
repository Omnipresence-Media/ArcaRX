import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, AlertTriangle, CheckCircle2, FlaskConical, Sparkles } from "lucide-react";
import { labPanels } from "@/features/portal/mockData";

export const Route = createFileRoute("/portal/labs")({
  head: () => ({ meta: [{ title: "Lab results - ARCA Rx Portal" }] }),
  component: Labs,
});

function Spark({ data, flag }: { data: number[]; flag: string }) {
  const min = Math.min(...data); const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / span) * 100}`).join(" ");
  const color = flag === "high" ? "var(--danger)" : flag === "low" ? "var(--warning)" : "var(--success)";
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-full">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Labs() {
  const [openId, setOpenId] = useState<string | null>(labPanels[0].id);

  return (
    <div className="space-y-5 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Lab results</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your values, with plain-language interpretations from your care team.</p>
      </div>

      <div className="space-y-3">
        {labPanels.map((p) => {
          const open = openId === p.id;
          return (
            <Card key={p.id} className="surface-elevated overflow-hidden">
              <button
                onClick={() => setOpenId(open ? null : p.id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[color:color-mix(in_oklab,var(--teal)_12%,transparent)]">
                    <FlaskConical className="h-5 w-5 text-[color:var(--teal)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{p.name}</p>
                      {p.status === "new" && <Badge className="badge-active text-[10px]">New</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">Collected {p.collectedOn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.flagged > 0 ? (
                    <Badge variant="outline" className="gap-1 border-[color:var(--warning)]/40 text-[color:var(--warning)]">
                      <AlertTriangle className="h-3 w-3" />{p.flagged} flagged
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 border-[color:var(--success)]/40 text-[color:var(--success)]">
                      <CheckCircle2 className="h-3 w-3" />All normal
                    </Badge>
                  )}
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
                </div>
              </button>

              {open && (
                <CardContent className="space-y-4 border-t bg-muted/10 pt-4">
                  <div className="rounded-md border border-[color:var(--teal)]/30 bg-[color:color-mix(in_oklab,var(--teal)_5%,transparent)] p-3">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--teal)]">
                      <Sparkles className="h-3 w-3" />What this means
                    </p>
                    <p className="mt-1 text-xs leading-relaxed">{p.interpretation}</p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {p.markers.map((m) => (
                      <div key={m.name} className="rounded-md border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium">{m.name}</p>
                          {m.flag === "high" && <AlertTriangle className="h-3 w-3 text-[color:var(--danger)]" />}
                          {m.flag === "low"  && <AlertTriangle className="h-3 w-3 text-[color:var(--warning)]" />}
                          {m.flag === "ok"   && <CheckCircle2  className="h-3 w-3 text-[color:var(--success)]" />}
                        </div>
                        <p className="mt-0.5 font-mono text-base font-semibold tabular-nums">
                          {m.value}<span className="ml-1 text-[10px] font-normal text-muted-foreground">{m.unit}</span>
                        </p>
                        <Spark data={m.trend} flag={m.flag} />
                        <p className="mt-1 text-[10px] text-muted-foreground">Ref {m.refLow}–{m.refHigh} {m.unit}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
