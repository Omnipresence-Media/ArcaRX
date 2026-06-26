import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { MacroRing } from "@/components/shell/fit/MacroRing";
import { mealPlans, sampleMeals, foodLibrary } from "@/lib/fit-seed";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/fit/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition - ARCA Fit" }] }),
  component: NutritionPage,
});

function NutritionPage() {
  const [selected, setSelected] = useState(mealPlans[0].id);
  const plan = mealPlans.find((p) => p.id === selected) ?? mealPlans[0];

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching"
        title="Nutrition plans"
        description="Macro targets, meal templates, and a searchable food library."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background">
            <Plus className="h-3.5 w-3.5" /> New plan
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="glass-panel p-3 self-start space-y-1.5">
          {mealPlans.map((p) => {
            const active = p.id === selected;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`w-full rounded-lg p-3 text-left transition-colors ${
                  active ? "bg-[color:color-mix(in_oklab,var(--teal)_14%,transparent)] ring-1 ring-[color:color-mix(in_oklab,var(--teal)_35%,transparent)]"
                         : "hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)]"
                }`}
              >
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{p.protocol}</p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-mono tabular-nums text-foreground/90">{p.calories} kcal</span>
                  <span className="text-muted-foreground">{p.assignedTo} clients</span>
                </div>
              </button>
            );
          })}
        </aside>

        <div className="space-y-5 min-w-0">
          <Panel title={`${plan.name} · daily targets`}>
            <MacroRing
              protein={plan.protein}
              carbs={plan.carbs}
              fat={plan.fat}
              proteinTarget={plan.protein}
              carbsTarget={plan.carbs}
              fatTarget={plan.fat}
              size={200}
            />
          </Panel>

          <Panel title="Sample day · meals">
            <div className="space-y-4">
              {sampleMeals.map((m) => {
                const total = m.items.reduce(
                  (acc, it) => ({ kcal: acc.kcal + it.kcal, p: acc.p + it.p, c: acc.c + it.c, f: acc.f + it.f }),
                  { kcal: 0, p: 0, c: 0, f: 0 }
                );
                return (
                  <div key={m.meal} className="rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{m.meal}</p>
                        <p className="text-[11px] text-muted-foreground">{m.time}</p>
                      </div>
                      <div className="text-right font-mono text-xs tabular-nums text-foreground/90">
                        {total.kcal} kcal
                        <span className="ml-2 text-muted-foreground">{total.p}p · {total.c}c · {total.f}f</span>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {m.items.map((it) => (
                        <div key={it.name} className="flex items-center justify-between border-t border-[color:var(--glass-stroke)] pt-1.5 text-xs">
                          <span className="text-foreground/90">{it.name} <span className="text-muted-foreground">· {it.grams}g</span></span>
                          <span className="font-mono tabular-nums text-muted-foreground">
                            {it.kcal} · {it.p}/{it.c}/{it.f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Food library">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--glass-stroke)] text-left text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    <th className="py-2.5 pr-3 font-semibold">Food</th>
                    <th className="py-2.5 pr-3 font-semibold">Tag</th>
                    <th className="py-2.5 pr-3 font-semibold">Serving</th>
                    <th className="py-2.5 pr-3 font-semibold text-right">Kcal</th>
                    <th className="py-2.5 pr-3 font-semibold text-right">P</th>
                    <th className="py-2.5 pr-3 font-semibold text-right">C</th>
                    <th className="py-2.5 pr-3 font-semibold text-right">F</th>
                  </tr>
                </thead>
                <tbody>
                  {foodLibrary.map((f) => (
                    <tr key={f.name} className="border-b border-[color:var(--glass-stroke)] last:border-0 hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)]">
                      <td className="py-2.5 pr-3 font-medium text-foreground">{f.name}</td>
                      <td className="py-2.5 pr-3 text-xs"><span className="rounded-full glass-panel-quiet px-2 py-0.5 text-[10px] text-foreground/80">{f.tag}</span></td>
                      <td className="py-2.5 pr-3 text-xs text-muted-foreground">{f.per}</td>
                      <td className="py-2.5 pr-3 text-right font-mono tabular-nums">{f.kcal}</td>
                      <td className="py-2.5 pr-3 text-right font-mono tabular-nums">{f.p}</td>
                      <td className="py-2.5 pr-3 text-right font-mono tabular-nums">{f.c}</td>
                      <td className="py-2.5 pr-3 text-right font-mono tabular-nums">{f.f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
