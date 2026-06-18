import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, ThumbsUp, ExternalLink, Send, TrendingUp, MapPin, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/reputation")({
  head: () => ({ meta: [{ title: "Reputation & Acquisition — ARCA Rx" }] }),
  component: Reputation,
});

const sources = [
  { name: "Google",   rating: 4.8, count: 384, color: "var(--teal)",    delta: "+12" },
  { name: "Yelp",     rating: 4.6, count: 142, color: "var(--warning)", delta: "+4"  },
  { name: "RealSelf", rating: 4.9, count:  89, color: "var(--primary)", delta: "+6"  },
  { name: "Healthgrades", rating: 4.7, count: 71, color: "var(--info)", delta: "+2"  },
  { name: "Vitals",   rating: 4.5, count:  48, color: "var(--success)", delta: "+1"  },
];

const reviews = [
  { src: "Google",   stars: 5, who: "Sarah K.",     when: "2d ago", text: "Dr. Chen and the team are exceptional. The membership program has actually saved me money and my skin has never looked better.",        replied: true,  sentiment: "praise" },
  { src: "Yelp",     stars: 3, who: "Anonymous",    when: "3d ago", text: "Front desk wait was 25 minutes past my appointment time. Provider was good once I was seen.",                                            replied: false, sentiment: "ops"    },
  { src: "Google",   stars: 5, who: "Marcus T.",    when: "4d ago", text: "Best results I've had with hormone optimization. Marcus is thorough and explains everything.",                                            replied: true,  sentiment: "praise" },
  { src: "RealSelf", stars: 5, who: "VerifiedPt",   when: "6d ago", text: "Filler work was natural and balanced. Nurse Whitfield is an artist.",                                                                     replied: true,  sentiment: "praise" },
  { src: "Google",   stars: 2, who: "Jenna M.",     when: "1w ago", text: "Was charged for a service I didn't receive. Billing took 3 calls to fix. Care was fine.",                                                  replied: false, sentiment: "billing"},
  { src: "Healthgrades", stars: 5, who: "Owen P.",  when: "1w ago", text: "Telehealth follow-up was seamless and saved me a trip. Notes were in my portal within an hour.",                                          replied: true,  sentiment: "praise" },
];

const funnel = [
  { stage: "Profile views",    n: 28400, pct: 100, color: "var(--info)"    },
  { stage: "Bio reads",         n: 12180, pct:  43, color: "var(--teal)"    },
  { stage: "Booking opened",    n:  4820, pct:  17, color: "var(--primary)" },
  { stage: "Booked",            n:   894, pct:   3, color: "var(--success)" },
  { stage: "First visit done",  n:   612, pct:   2, color: "var(--warning)" },
];

const providers = [
  { name: "Dr. Amelia Chen, MD",  views: 8240, bookings: 264, conv: 3.2, rating: 4.9, reviews: 142 },
  { name: "Dr. Marcus Patel, MD", views: 6180, bookings: 198, conv: 3.2, rating: 4.8, reviews: 98  },
  { name: "Sara Whitfield, NP",   views: 5420, bookings: 172, conv: 3.2, rating: 4.9, reviews: 84  },
  { name: "Jonah Reeves, PA-C",   views: 3940, bookings:  98, conv: 2.5, rating: 4.6, reviews: 41  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= n ? "fill-[color:var(--warning)] text-[color:var(--warning)]" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

function Reputation() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Acquisition · Reputation OS"
        title="Reputation & provider directory"
        description="Reviews, public provider pages, online booking funnel — the front door of the practice."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9"><ExternalLink className="mr-1.5 h-4 w-4" />View public site</Button>
            <Button size="sm" className="h-9 gradient-brand text-white"><Send className="mr-1.5 h-4 w-4" />Send review requests (38)</Button>
          </div>
        }
      />

      {/* Hero: overall + by source */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="surface-elevated lg:col-span-2 bg-gradient-to-br from-[color:var(--teal)]/10 via-card to-card">
          <CardContent className="p-6">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Composite rating</p>
            <div className="mt-2 flex items-baseline gap-3">
              <p className="font-mono text-5xl font-semibold tabular-nums">4.78</p>
              <Stars n={5} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">734 reviews across 5 platforms · <span className="text-[color:var(--success)]">+25 this month</span></p>
            <div className="mt-4 space-y-1.5">
              {[5,4,3,2,1].map((s) => {
                const pct = [78, 14, 5, 2, 1][5-s];
                return (
                  <div key={s} className="flex items-center gap-2 text-[11px]">
                    <span className="w-3 font-mono">{s}</span>
                    <Star className="h-3 w-3 fill-[color:var(--warning)] text-[color:var(--warning)]" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-[color:var(--warning)]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-mono text-muted-foreground">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 lg:col-span-3 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((s) => (
            <Card key={s.name} className="surface-elevated">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">{s.name}</p>
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <p className="font-mono text-2xl font-semibold tabular-nums">{s.rating}</p>
                  <Star className="h-4 w-4 fill-[color:var(--warning)] text-[color:var(--warning)]" />
                </div>
                <p className="text-[11px] text-muted-foreground">{s.count} reviews · <span className="text-[color:var(--success)]">{s.delta}</span></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Funnel + reviews */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="surface-elevated lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Review inbox</CardTitle>
            <Badge variant="outline" className="text-[10px]"><AlertCircle className="mr-1 h-3 w-3" />2 need response</Badge>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-md border bg-card p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stars n={r.stars} />
                    <span className="text-xs font-medium">{r.who}</span>
                    <Badge variant="outline" className="text-[10px]">{r.src}</Badge>
                    {r.sentiment === "ops"     && <Badge variant="outline" className="border-[color:var(--warning)]/40 text-[10px] text-[color:var(--warning)]">Ops issue</Badge>}
                    {r.sentiment === "billing" && <Badge variant="outline" className="border-[color:var(--danger)]/40 text-[10px] text-[color:var(--danger)]">Billing</Badge>}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{r.when}</span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
                <div className="mt-2 flex items-center justify-end gap-2">
                  {r.replied
                    ? <span className="flex items-center gap-1 text-[10px] text-[color:var(--success)]"><ThumbsUp className="h-3 w-3" />Replied</span>
                    : <Button size="sm" variant="outline" className="h-7 text-xs"><MessageSquare className="mr-1 h-3 w-3" />Draft reply</Button>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Online booking funnel · 30d</CardTitle></CardHeader>
          <CardContent className="space-y-3 pt-0">
            {funnel.map((f) => (
              <div key={f.stage}>
                <div className="flex items-center justify-between text-xs">
                  <span>{f.stage}</span>
                  <span className="font-mono tabular-nums">{f.n.toLocaleString()} <span className="text-muted-foreground">· {f.pct}%</span></span>
                </div>
                <div className="mt-1 h-6 overflow-hidden rounded bg-muted">
                  <div className="flex h-full items-center justify-end pr-2 text-[10px] font-mono text-white" style={{ width: `${f.pct}%`, background: f.color }}>
                    {f.pct >= 10 && `${f.pct}%`}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-2 rounded-md border bg-gradient-to-br from-[color:var(--teal)]/8 to-transparent p-3">
              <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Bio → booking drop</p>
              <p className="mt-1 text-sm">Conversion <span className="font-mono font-semibold">7.3%</span> · industry <span className="font-mono text-muted-foreground">11%</span></p>
              <p className="mt-0.5 text-[11px] text-[color:var(--teal)]">AI: simplify bio CTA + add 2 sample slots above the fold</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Provider directory */}
      <Card className="surface-elevated">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-semibold">Provider directory performance</CardTitle>
            <p className="text-[11px] text-muted-foreground">Public profile pages — views, bookings, ratings</p>
          </div>
          <Button variant="outline" size="sm" className="h-8"><MapPin className="mr-1.5 h-3.5 w-3.5" />Manage profiles</Button>
        </CardHeader>
        <CardContent className="grid gap-3 pt-0 sm:grid-cols-2 lg:grid-cols-4">
          {providers.map((p) => (
            <div key={p.name} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--teal)]/30 to-[color:var(--primary)]/30 text-xs font-semibold">
                  {p.name.split(" ").slice(0,2).map(s => s[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Star className="h-3 w-3 fill-[color:var(--warning)] text-[color:var(--warning)]" />
                    {p.rating} · {p.reviews} reviews
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div><p className="text-[10px] text-muted-foreground">Views</p><p className="font-mono text-sm tabular-nums">{(p.views/1000).toFixed(1)}k</p></div>
                <div><p className="text-[10px] text-muted-foreground">Booked</p><p className="font-mono text-sm tabular-nums">{p.bookings}</p></div>
                <div><p className="text-[10px] text-muted-foreground">Conv</p><p className="font-mono text-sm tabular-nums">{p.conv}%</p></div>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 h-7 w-full justify-between text-xs">
                Open profile <TrendingUp className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
