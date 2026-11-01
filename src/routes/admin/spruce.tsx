import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Eye, RefreshCw, Smartphone, Monitor } from "lucide-react";
import { PageHeader } from "@/components/shell/PageHeader";
import { SPRUCE_SCREENS, screenByKey, type SpruceScreen } from "@/features/spruce/screens";
import { addToCart, advanceToMonday, clearCart, reloadFromStorage, setScenario } from "@/features/spruce/store";

const GREEN = "#2F7D5B";
const GREEN_SOFT = "color-mix(in oklab, #2F7D5B 12%, transparent)";

export const Route = createFileRoute("/admin/spruce")({
  head: () => ({ meta: [{ title: "Spruce Micro Review - ARCA Rx" }, { name: "robots", content: "noindex, nofollow" }] }),
  validateSearch: (s: Record<string, unknown>): { screen?: string } =>
    typeof s.screen === "string" && screenByKey(s.screen) ? { screen: s.screen } : {},
  component: SpruceReview,
});

function SpruceReview() {
  const { screen: key } = Route.useSearch();
  const navigate = useNavigate();
  const idx = Math.max(0, SPRUCE_SCREENS.findIndex((s) => s.key === key));
  const screen = SPRUCE_SCREENS[idx];
  const [mobile, setMobile] = useState(screen.group === "patient");
  const [frameKey, setFrameKey] = useState(0);
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try { setReviewed(JSON.parse(localStorage.getItem("arca_spruce_reviewed") ?? "{}")); } catch { /* fresh */ }
  }, []);
  const mark = (k: string, v: boolean) => {
    const next = { ...reviewed, [k]: v };
    setReviewed(next);
    try { localStorage.setItem("arca_spruce_reviewed", JSON.stringify(next)); } catch { /* ignore */ }
  };

  // Put the demo in the right state before the frame loads this screen.
  useEffect(() => {
    reloadFromStorage();
    setScenario(screen.scenario);
    if (screen.monday) advanceToMonday();
    if (screen.cart) {
      clearCart();
      for (const l of screen.cart) addToCart(l.productId, l.qty);
    }
    setFrameKey((k) => k + 1);
    setMobile(screen.group === "patient");
  }, [screen]);

  const go = (s: SpruceScreen) => navigate({ to: "/admin/spruce", search: { screen: s.key } });
  const prev = SPRUCE_SCREENS[idx - 1];
  const next = SPRUCE_SCREENS[idx + 1];
  const done = useMemo(() => SPRUCE_SCREENS.filter((s) => reviewed[s.key]).length, [reviewed]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        eyebrow="Spruce Micro"
        title="Prototype review"
        description={`Step ${idx + 1} of ${SPRUCE_SCREENS.length}. Each step loads the live prototype in the right state. Say "looks good" or tell me what to change, then move on. ${done} marked as reviewed.`}
        actions={
          <div className="flex gap-2">
            <a href="/spruce" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <ExternalLink className="h-3.5 w-3.5" /> Open full prototype
            </a>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          {(["patient", "admin"] as const).map((g) => (
            <div key={g} className="rounded-xl border bg-card/70 p-2 surface-elevated">
              <div className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: GREEN }}>
                {g === "patient" ? "Patient portal" : "Staff admin"}
              </div>
              <ol className="space-y-0.5">
                {SPRUCE_SCREENS.map((s, i) => s.group === g && (
                  <li key={s.key}>
                    <button
                      onClick={() => go(s)}
                      className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-accent"
                      style={s.key === screen.key ? { background: GREEN_SOFT, color: GREEN, fontWeight: 600 } : undefined}
                    >
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold"
                        style={reviewed[s.key] ? { background: GREEN, color: "#fff" } : { background: GREEN_SOFT, color: GREEN }}
                      >
                        {reviewed[s.key] ? <Check className="h-3 w-3" /> : i + 1}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </aside>

        <section className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card/70 px-4 py-3 surface-elevated">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold" style={{ background: GREEN_SOFT, color: GREEN }}>
                  Step {idx + 1}
                </span>
                <h2 className="truncate text-base font-semibold">{screen.title}</h2>
              </div>
              <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {screen.look.map((l) => (
                  <li key={l} className="flex items-center gap-1.5"><Eye className="h-3 w-3 shrink-0" style={{ color: GREEN }} />{l}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setMobile((m) => !m)} title={mobile ? "Desktop width" : "Phone width"} className="rounded-md border p-1.5 hover:bg-accent">
                {mobile ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => setFrameKey((k) => k + 1)} title="Reload" className="rounded-md border p-1.5 hover:bg-accent">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <a href={screen.path} target="_blank" rel="noreferrer" title="Open in a tab" className="rounded-md border p-1.5 hover:bg-accent">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                onClick={() => mark(screen.key, !reviewed[screen.key])}
                className="ml-1 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white"
                style={{ background: reviewed[screen.key] ? "#5B6E63" : GREEN }}
              >
                <Check className="h-3.5 w-3.5" /> {reviewed[screen.key] ? "Reviewed" : "Looks good"}
              </button>
            </div>
          </div>

          <div className="flex justify-center rounded-xl border bg-[color:var(--muted)]/40 p-3 surface-elevated">
            <iframe
              key={`${screen.key}-${frameKey}`}
              title={screen.title}
              src={screen.path}
              className="rounded-lg border bg-white shadow-lg transition-[width] duration-200"
              style={{ width: mobile ? 400 : "100%", height: "min(78vh, 900px)", borderColor: GREEN_SOFT }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button disabled={!prev} onClick={() => prev && go(prev)} className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-40">
              <ArrowLeft className="h-3.5 w-3.5" /> {prev?.title ?? "Start"}
            </button>
            <Link to="/spruce" className="text-xs text-muted-foreground hover:underline">Scenario picker</Link>
            <button disabled={!next} onClick={() => next && go(next)} className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40" style={{ background: GREEN }}>
              {next?.title ?? "Done"} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
