import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Eye, RefreshCw, Smartphone, Monitor, X } from "lucide-react";
import { PageHeader } from "@/components/shell/PageHeader";
import { SPRUCE_SCREENS, screenByKey, type SpruceScreen } from "@/features/spruce/screens";
import { REQUIREMENTS, STATUS_LABEL, type ReqStatus } from "@/features/spruce/requirements";
import { addToCart, advanceToMonday, clearCart, reloadFromStorage, setScenario } from "@/features/spruce/store";

const GREEN = "#2F7D5B";
const SOFT = "color-mix(in oklab, #2F7D5B 12%, transparent)";
const STATUS_STYLE: Record<ReqStatus, { bg: string; fg: string }> = {
  built: { bg: SOFT, fg: GREEN },
  demo: { bg: "color-mix(in oklab, #B7791F 14%, transparent)", fg: "#8A5A0B" },
  backend: { bg: "color-mix(in oklab, #475569 12%, transparent)", fg: "#334155" },
  question: { bg: "color-mix(in oklab, #7C3AED 12%, transparent)", fg: "#5B21B6" },
};

type Search = { section?: number; screen?: string };

export const Route = createFileRoute("/admin/spruce")({
  head: () => ({ meta: [{ title: "Spruce Micro Review - ARCA Rx" }, { name: "robots", content: "noindex, nofollow" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    section: typeof s.section === "number" && REQUIREMENTS.some((r) => r.n === s.section) ? s.section : undefined,
    screen: typeof s.screen === "string" && screenByKey(s.screen) ? s.screen : undefined,
  }),
  component: SpruceReview,
});

function StatusPill({ status }: { status: ReqStatus }) {
  const st = STATUS_STYLE[status];
  return (
    <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: st.bg, color: st.fg }}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function SpruceReview() {
  const { section: secN, screen: key } = Route.useSearch();
  const navigate = useNavigate();
  const section = REQUIREMENTS.find((r) => r.n === secN) ?? null;
  const screen = screenByKey(key) ?? null;
  const [mobile, setMobile] = useState(true);
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

  // Put the demo in the right state before the frame loads the screen.
  useEffect(() => {
    if (!screen) return;
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

  const go = (s: Search) => navigate({ to: "/admin/spruce", search: s });
  const idx = screen ? SPRUCE_SCREENS.indexOf(screen) : -1;
  const prevScreen: SpruceScreen | undefined = idx > 0 ? SPRUCE_SCREENS[idx - 1] : undefined;
  const nextScreen: SpruceScreen | undefined = idx >= 0 ? SPRUCE_SCREENS[idx + 1] : undefined;
  const counts = useMemo(() => {
    const c: Record<ReqStatus, number> = { built: 0, demo: 0, backend: 0, question: 0 };
    for (const r of REQUIREMENTS) for (const i of r.items) c[i.status]++;
    return c;
  }, []);
  const total = counts.built + counts.demo + counts.backend + counts.question;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        eyebrow="Spruce Micro"
        title={section ? `${section.n}. ${section.title}` : "Dawn's outline, item by item"}
        description={section
          ? section.summary
          : `Every item from the Oct 28 outline (${total} total): ${counts.built} built, ${counts.demo} demo only, ${counts.backend} need the backend, ${counts.question} are her open questions. Pick a section, then View each item.`}
        actions={
          <div className="flex gap-2">
            <a href="/spruce" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent">
              <ExternalLink className="h-3.5 w-3.5" /> Open full prototype
            </a>
          </div>
        }
      />

      <div className={`grid gap-5 ${screen ? "xl:grid-cols-[minmax(0,1fr)_460px]" : ""}`}>
        <div className="min-w-0 space-y-4">
          {!section && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {REQUIREMENTS.map((r) => {
                const built = r.items.filter((i) => i.status === "built").length;
                return (
                  <button key={r.n} onClick={() => go({ section: r.n })} className="rounded-xl border bg-card/70 p-4 text-left transition-colors hover:bg-accent surface-elevated">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold" style={{ background: SOFT, color: GREEN }}>{r.n}</span>
                      <span className="text-sm font-semibold">{r.title}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{r.summary}</p>
                    <p className="mt-2 text-[11px] font-medium" style={{ color: GREEN }}>{built} of {r.items.length} built in the prototype</p>
                  </button>
                );
              })}
            </div>
          )}

          {section && (
            <>
              <ol className="space-y-2">
                {section.items.map((item, i) => {
                  const sc = screenByKey(item.screen);
                  const active = sc && screen && sc.key === screen.key;
                  return (
                    <li key={i} className="rounded-xl border bg-card/70 p-3.5 surface-elevated" style={active ? { borderColor: GREEN, background: SOFT } : undefined}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-start gap-2.5">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold" style={{ background: SOFT, color: GREEN }}>{i + 1}</span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold">{item.title}</span>
                              <StatusPill status={item.status} />
                            </div>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.where}</p>
                          </div>
                        </div>
                        {sc && (
                          <button
                            onClick={() => go({ section: section.n, screen: sc.key })}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white"
                            style={{ background: GREEN }}
                          >
                            <Eye className="h-3.5 w-3.5" /> View: {sc.title}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="flex items-center justify-between">
                <button disabled={section.n === 1} onClick={() => go({ section: section.n - 1 })} className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-40">
                  <ArrowLeft className="h-3.5 w-3.5" /> Previous section
                </button>
                <button onClick={() => go({})} className="text-xs text-muted-foreground hover:underline">All sections</button>
                <button disabled={section.n === REQUIREMENTS.length} onClick={() => go({ section: section.n + 1 })} className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40" style={{ background: GREEN }}>
                  Next section <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          )}
        </div>

        {screen && (
          <aside className="space-y-3 xl:sticky xl:top-4 xl:self-start">
            <div className="rounded-xl border bg-card/70 px-3.5 py-3 surface-elevated">
              <div className="flex items-center justify-between gap-2">
                <h2 className="truncate text-sm font-semibold">{screen.title}</h2>
                <div className="flex items-center gap-1">
                  <button onClick={() => setMobile((m) => !m)} title={mobile ? "Desktop width" : "Phone width"} className="rounded-md border p-1.5 hover:bg-accent">
                    {mobile ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => setFrameKey((k) => k + 1)} title="Reload" className="rounded-md border p-1.5 hover:bg-accent"><RefreshCw className="h-3.5 w-3.5" /></button>
                  <a href={screen.path} target="_blank" rel="noreferrer" title="Open in a tab" className="rounded-md border p-1.5 hover:bg-accent"><ExternalLink className="h-3.5 w-3.5" /></a>
                  <button onClick={() => go({ section: section?.n })} title="Close" className="rounded-md border p-1.5 hover:bg-accent"><X className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                {screen.look.map((l) => <li key={l} className="flex items-center gap-1.5"><Eye className="h-3 w-3 shrink-0" style={{ color: GREEN }} />{l}</li>)}
              </ul>
              <div className="mt-2 flex items-center justify-between gap-2">
                <button disabled={!prevScreen} onClick={() => prevScreen && go({ section: section?.n, screen: prevScreen.key })} className="rounded-md border px-2 py-1 text-[11px] hover:bg-accent disabled:opacity-40">Prev screen</button>
                <button
                  onClick={() => mark(screen.key, !reviewed[screen.key])}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-[11px] font-semibold text-white"
                  style={{ background: reviewed[screen.key] ? "#5B6E63" : GREEN }}
                >
                  <Check className="h-3 w-3" /> {reviewed[screen.key] ? "Reviewed" : "Looks good"}
                </button>
                <button disabled={!nextScreen} onClick={() => nextScreen && go({ section: section?.n, screen: nextScreen.key })} className="rounded-md border px-2 py-1 text-[11px] hover:bg-accent disabled:opacity-40">Next screen</button>
              </div>
            </div>
            <div className="flex justify-center rounded-xl border bg-[color:var(--muted)]/40 p-2 surface-elevated">
              <iframe
                key={`${screen.key}-${frameKey}`}
                title={screen.title}
                src={screen.path}
                className="rounded-lg border bg-white shadow-lg"
                style={{ width: mobile ? 400 : "100%", maxWidth: "100%", height: "min(72vh, 860px)", borderColor: SOFT }}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
