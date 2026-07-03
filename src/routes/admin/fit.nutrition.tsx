import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { MacroRing } from "@/components/shell/fit/MacroRing";
import { foodLibrary } from "@/lib/fit-seed";
import {
  useMealPlans, createMealPlan, updatePlanTargets, addMeal, removeMeal, renameMeal,
  addFoodItem, removeFoodItem, mealTotals, planTotals,
} from "@/features/coaching/builderStore";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/fit/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition - ARCA Fit" }] }),
  component: NutritionPage,
});

function parsePerGrams(per: string): number {
  const n = parseInt(per, 10);
  return Number.isFinite(n) && n > 0 ? n : 100;
}

function AddFoodRow({ planId, mealId }: { planId: string; mealId: string }) {
  const [foodName, setFoodName] = useState(foodLibrary[0].name);
  const [grams, setGrams] = useState(100);

  function add() {
    const f = foodLibrary.find((x) => x.name === foodName);
    if (!f) return;
    const scale = grams / parsePerGrams(f.per);
    addFoodItem(planId, mealId, {
      name: f.name,
      grams,
      kcal: Math.round(f.kcal * scale),
      p: Math.round(f.p * scale),
      c: Math.round(f.c * scale),
      f: Math.round(f.f * scale),
    });
    toast.success(`${f.name} added`, { description: `${grams}g · macros computed automatically.` });
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[color:var(--glass-stroke)] pt-2">
      <select
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        className="min-w-0 flex-1 rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 text-[11px] text-foreground outline-none"
        aria-label="Food"
      >
        {foodLibrary.map((f) => <option key={f.name} value={f.name}>{f.name}</option>)}
      </select>
      <div className="flex items-center gap-1">
        <input
          type="number" min={5} step={5}
          value={grams}
          onChange={(e) => setGrams(Math.max(5, Number(e.target.value) || 100))}
          className="w-16 rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1 text-right font-mono text-[11px] tabular-nums text-foreground outline-none"
          aria-label="Grams"
        />
        <span className="text-[10px] text-muted-foreground">g</span>
      </div>
      <button onClick={add} className="inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold text-background">
        <Plus className="h-3 w-3" /> Add food
      </button>
    </div>
  );
}

function NutritionPage() {
  const plans = useMealPlans();
  const [selected, setSelected] = useState<string | null>(null);
  const plan = plans.find((p) => p.id === selected) ?? plans[0];
  const built = planTotals(plan);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching · Health"
        title="Nutrition plans"
        description="Build fully custom meal plans - targets, meals, and foods with macros computed for you."
        actions={
          <button
            onClick={() => {
              const id = createMealPlan("New plan", 2200, 180, 220, 70);
              setSelected(id);
              toast.success("Plan created", { description: "Edit the targets and add meals below - everything saves as you type." });
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background"
          >
            <Plus className="h-3.5 w-3.5" /> New plan
          </button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* Plan list */}
        <aside className="glass-panel p-3 self-start space-y-1.5">
          {plans.map((p) => {
            const active = p.id === plan.id;
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
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-mono tabular-nums text-foreground/90">{p.calories} kcal target</span>
                  <span className="text-muted-foreground">{p.meals.length} meals</span>
                </div>
              </button>
            );
          })}
        </aside>

        <div className="space-y-5 min-w-0">
          {/* Editable targets */}
          <Panel title="Daily targets" actions={<span className="text-[11px] text-muted-foreground">edits save automatically</span>}>
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 self-start">
                <label className="col-span-2 block sm:col-span-5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Plan name</span>
                  <input
                    value={plan.name}
                    onChange={(e) => updatePlanTargets(plan.id, { name: e.target.value })}
                    className="mt-0.5 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1.5 text-sm font-semibold text-foreground outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
                  />
                </label>
                {([
                  ["Calories", "calories"],
                  ["Protein g", "protein"],
                  ["Carbs g", "carbs"],
                  ["Fat g", "fat"],
                ] as const).map(([label, key]) => (
                  <label key={key} className="block">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
                    <input
                      type="number" min={0}
                      value={plan[key]}
                      onChange={(e) => updatePlanTargets(plan.id, { [key]: Math.max(0, Number(e.target.value) || 0) })}
                      className="mt-0.5 w-full rounded-md border border-[color:var(--glass-stroke)] bg-transparent px-2 py-1.5 text-right font-mono text-[13px] tabular-nums text-foreground outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
                    />
                  </label>
                ))}
                <div className="col-span-2 rounded-md border border-[color:var(--glass-stroke)] p-2 text-[11px] text-muted-foreground sm:col-span-5">
                  Built so far: <span className="font-mono tabular-nums text-foreground/90">{built.kcal} kcal · {built.p}p · {built.c}c · {built.f}f</span>
                  {" "}vs target <span className="font-mono tabular-nums">{plan.calories} kcal</span>
                </div>
              </div>
              <div className="justify-self-center">
                <MacroRing
                  protein={built.p}
                  carbs={built.c}
                  fat={built.f}
                  proteinTarget={plan.protein}
                  carbsTarget={plan.carbs}
                  fatTarget={plan.fat}
                  size={180}
                />
              </div>
            </div>
          </Panel>

          {/* Meals builder */}
          <Panel
            title="Meals"
            actions={
              <button
                onClick={() => { addMeal(plan.id); toast.success("Meal added"); }}
                className="inline-flex items-center gap-1 rounded-full glass-panel-quiet px-2.5 py-1 text-[11px] text-foreground"
              >
                <Plus className="h-3 w-3" /> Add meal
              </button>
            }
          >
            <div className="space-y-4">
              {plan.meals.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">No meals yet - click Add meal to start building the day.</p>
              )}
              {plan.meals.map((m) => {
                const total = mealTotals(m);
                return (
                  <div key={m.id} className="rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <input
                          value={m.name}
                          onChange={(e) => renameMeal(plan.id, m.id, { name: e.target.value })}
                          className="w-32 bg-transparent text-sm font-semibold text-foreground outline-none"
                          aria-label="Meal name"
                        />
                        <input
                          value={m.time}
                          onChange={(e) => renameMeal(plan.id, m.id, { time: e.target.value })}
                          className="w-14 bg-transparent text-[11px] text-muted-foreground outline-none"
                          aria-label="Meal time"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-right font-mono text-xs tabular-nums text-foreground/90">
                          {total.kcal} kcal
                          <span className="ml-2 text-muted-foreground">{total.p}p · {total.c}c · {total.f}f</span>
                        </span>
                        <button
                          onClick={() => { removeMeal(plan.id, m.id); toast(`${m.name} removed`); }}
                          aria-label={`Remove ${m.name}`}
                          className="rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1.5">
                      {m.items.map((it) => (
                        <div key={it.id} className="flex items-center justify-between gap-2 border-t border-[color:var(--glass-stroke)] pt-1.5 text-xs">
                          <span className="min-w-0 truncate text-foreground/90">{it.name} <span className="text-muted-foreground">· {it.grams}g</span></span>
                          <span className="flex items-center gap-2">
                            <span className="font-mono tabular-nums text-muted-foreground">{it.kcal} · {it.p}/{it.c}/{it.f}</span>
                            <button
                              onClick={() => removeFoodItem(plan.id, m.id, it.id)}
                              aria-label={`Remove ${it.name}`}
                              className="rounded p-0.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>

                    <AddFoodRow planId={plan.id} mealId={m.id} />
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* Food library reference */}
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
