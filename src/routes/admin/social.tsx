import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Instagram, Facebook, Linkedin, Youtube, Twitter, Music2,
  CalendarDays, Image as ImageIcon, Sparkles, Clock, CheckCircle2,
  ChevronLeft, ChevronRight, Plus, TrendingUp, Eye, Heart, MessageCircle, Share2,
} from "lucide-react";

export const Route = createFileRoute("/admin/social")({
  head: () => ({ meta: [{ title: "Social Calendar - ARCA Rx" }] }),
  component: SocialCalendar,
});

type Channel = "instagram" | "facebook" | "tiktok" | "linkedin" | "youtube" | "twitter";

const channelMeta: Record<Channel, { label: string; icon: any; color: string }> = {
  instagram: { label: "Instagram", icon: Instagram, color: "var(--primary)" },
  facebook:  { label: "Facebook",  icon: Facebook,  color: "var(--info)"    },
  tiktok:    { label: "TikTok",    icon: Music2,    color: "var(--foreground)" },
  linkedin:  { label: "LinkedIn",  icon: Linkedin,  color: "var(--teal)"    },
  youtube:   { label: "YouTube",   icon: Youtube,   color: "var(--danger,#dc2626)" },
  twitter:   { label: "X / Twitter", icon: Twitter, color: "var(--foreground)" },
};

type Post = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  channels: Channel[];
  caption: string;
  status: "scheduled" | "draft" | "published" | "needs-approval";
  campaign?: string;
  asset?: string; // emoji as placeholder
  reach?: number;
  engagement?: number;
};

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const seedPosts: Post[] = [
  { id: "p1", date: iso(addDays(today, -2)), time: "09:00", channels: ["instagram","facebook"], caption: "Glow-up Monday: 3 patient transformations from our new Morpheus8 protocol. Swipe →", status: "published", campaign: "Spring Skin", asset: "✨", reach: 12400, engagement: 642 },
  { id: "p2", date: iso(addDays(today, -1)), time: "17:30", channels: ["tiktok","instagram"], caption: "POV: your aesthetician explains why double cleansing actually matters 🧼", status: "published", campaign: "Education", asset: "🎬", reach: 28900, engagement: 1850 },
  { id: "p3", date: iso(today), time: "11:00", channels: ["instagram"], caption: "Meet Dr. Chen - board-certified, 12 years of hormone optimization expertise. Book a consult this week and get $100 toward labs.", status: "scheduled", campaign: "Provider Spotlight", asset: "👩‍⚕️" },
  { id: "p4", date: iso(today), time: "15:00", channels: ["linkedin"], caption: "Why concierge medicine is the future of preventative care - our founder on the membership model.", status: "needs-approval", campaign: "Thought Leadership", asset: "📰" },
  { id: "p5", date: iso(addDays(today, 1)), time: "10:30", channels: ["instagram","facebook","tiktok"], caption: "Botox myth-busting Tuesday: no, it does NOT make your face frozen. Here's what actually happens →", status: "scheduled", campaign: "Education", asset: "💉" },
  { id: "p6", date: iso(addDays(today, 2)), time: "12:00", channels: ["youtube"], caption: "Full RF microneedling treatment, start to finish - what to expect (10 min walkthrough).", status: "scheduled", campaign: "Long-form", asset: "🎥" },
  { id: "p7", date: iso(addDays(today, 3)), time: "08:30", channels: ["instagram"], caption: "Reel: 7 days of glass skin - patient journal, no filter.", status: "draft", campaign: "Spring Skin", asset: "🪞" },
  { id: "p8", date: iso(addDays(today, 4)), time: "16:00", channels: ["instagram","facebook"], caption: "Last week to lock in our Spring Membership rate - $100/mo off forever. Link in bio.", status: "scheduled", campaign: "Promo", asset: "🌸" },
  { id: "p9", date: iso(addDays(today, 5)), time: "13:00", channels: ["linkedin","twitter"], caption: "We're hiring: aesthetic NP, full-time, Austin. DM or apply via link.", status: "draft", campaign: "Hiring", asset: "💼" },
  { id: "p10", date: iso(addDays(today, 7)), time: "10:00", channels: ["instagram","tiktok"], caption: "Behind the scenes: a day in the life of our front desk lead (it's chaotic and we love her).", status: "scheduled", campaign: "Culture", asset: "🎀" },
  { id: "p11", date: iso(addDays(today, 9)), time: "18:00", channels: ["instagram"], caption: "Patient Q&A live tonight at 6pm CT - bring your hormone questions.", status: "scheduled", campaign: "Live", asset: "🎙️" },
  { id: "p12", date: iso(addDays(today, 12)), time: "11:30", channels: ["facebook","instagram"], caption: "New service drop: GLP-1 medical weight management, now bookable.", status: "needs-approval", campaign: "Launch", asset: "💊" },
];

const statusStyle: Record<Post["status"], string> = {
  scheduled:        "bg-[color:var(--info)]/12 text-[color:var(--info)] ring-1 ring-[color:var(--info)]/30",
  draft:            "bg-muted text-muted-foreground ring-1 ring-border",
  published:        "bg-[color:var(--success)]/12 text-[color:var(--success)] ring-1 ring-[color:var(--success)]/30",
  "needs-approval": "bg-[color:var(--warning)]/15 text-[color:var(--warning)] ring-1 ring-[color:var(--warning)]/30",
};

const campaigns = [
  { name: "Spring Skin",       posts: 14, reach: "184K", color: "var(--primary)" },
  { name: "Education",         posts: 22, reach: "412K", color: "var(--teal)"    },
  { name: "Provider Spotlight",posts:  8, reach: " 96K", color: "var(--info)"    },
  { name: "Promo",             posts:  6, reach: " 48K", color: "var(--warning)" },
  { name: "Culture",           posts:  9, reach: " 71K", color: "var(--success)" },
];

const bestTimes = [
  { day: "Mon", hour: "9 AM",  score: 92 },
  { day: "Tue", hour: "12 PM", score: 88 },
  { day: "Wed", hour: "5 PM",  score: 95 },
  { day: "Thu", hour: "11 AM", score: 81 },
  { day: "Fri", hour: "3 PM",  score: 86 },
  { day: "Sat", hour: "10 AM", score: 78 },
  { day: "Sun", hour: "7 PM",  score: 84 },
];

function monthMatrix(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const startWeekday = first.getDay(); // 0 = Sun
  const daysInMonth = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < startWeekday; i++) {
    const d = addDays(first, -(startWeekday - i));
    cells.push({ date: d, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(anchor.getFullYear(), anchor.getMonth(), d), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({ date: addDays(last, 1), inMonth: false });
  }
  return cells;
}

function SocialCalendar() {
  const [anchor, setAnchor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [activeChannels, setActiveChannels] = useState<Channel[]>(Object.keys(channelMeta) as Channel[]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Partial<Post>>({ channels: ["instagram"], status: "scheduled", date: iso(today), time: "10:00" });

  const cells = useMemo(() => monthMatrix(anchor), [anchor]);
  const monthLabel = anchor.toLocaleString(undefined, { month: "long", year: "numeric" });

  const filtered = posts.filter((p) => p.channels.some((c) => activeChannels.includes(c)));
  const postsByDate = useMemo(() => {
    const map: Record<string, Post[]> = {};
    filtered.forEach((p) => { (map[p.date] ||= []).push(p); });
    return map;
  }, [filtered]);

  const stats = {
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    drafts:    posts.filter((p) => p.status === "draft").length,
    approval:  posts.filter((p) => p.status === "needs-approval").length,
    published: posts.filter((p) => p.status === "published").length,
  };

  function toggleChannel(c: Channel) {
    setActiveChannels((cur) => cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]);
  }

  function createPost() {
    if (!draft.caption || !draft.date || !draft.time) return;
    const np: Post = {
      id: "p" + Math.random().toString(36).slice(2, 8),
      date: draft.date!, time: draft.time!,
      channels: (draft.channels ?? ["instagram"]) as Channel[],
      caption: draft.caption!,
      status: (draft.status as Post["status"]) ?? "scheduled",
      campaign: draft.campaign || "Untitled",
      asset: "📝",
    };
    setPosts((p) => [np, ...p]);
    setOpen(false);
    setDraft({ channels: ["instagram"], status: "scheduled", date: iso(today), time: "10:00" });
  }

  return (
    <>
      <PageHeader
        title="Social Calendar"
        description="Plan, schedule, and orchestrate every channel from one calendar."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Sparkles className="h-4 w-4 mr-1.5" />AI generate week</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />New post</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Schedule a new post</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Caption</label>
                    <Textarea value={draft.caption ?? ""} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} placeholder="Write something on-brand…" rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Date</label>
                      <Input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Time</label>
                      <Input type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Channels</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(Object.keys(channelMeta) as Channel[]).map((c) => {
                        const m = channelMeta[c]; const Icon = m.icon;
                        const active = (draft.channels ?? []).includes(c);
                        return (
                          <button key={c} type="button"
                            onClick={() => setDraft({ ...draft, channels: active ? draft.channels!.filter((x) => x !== c) : [...(draft.channels ?? []), c] })}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs ring-1 transition ${active ? "bg-foreground text-background ring-foreground" : "bg-card text-foreground ring-border hover:bg-muted"}`}>
                            <Icon className="h-3.5 w-3.5" />{m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Campaign</label>
                      <Input value={draft.campaign ?? ""} onChange={(e) => setDraft({ ...draft, campaign: e.target.value })} placeholder="Spring Skin" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Status</label>
                      <Select value={draft.status as string} onValueChange={(v) => setDraft({ ...draft, status: v as Post["status"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="needs-approval">Needs approval</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={createPost}>Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Scheduled",      val: stats.scheduled, icon: Clock,         color: "var(--info)"    },
            { label: "Drafts",         val: stats.drafts,    icon: ImageIcon,     color: "var(--muted-foreground)" },
            { label: "Needs approval", val: stats.approval,  icon: Sparkles,      color: "var(--warning)" },
            { label: "Published 30d",  val: stats.published, icon: CheckCircle2,  color: "var(--success)" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ background: `color-mix(in oklab, ${s.color} 14%, transparent)`, color: s.color as string }}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-semibold tracking-tight">{s.val}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Channel filter bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-1">Channels:</span>
          {(Object.keys(channelMeta) as Channel[]).map((c) => {
            const m = channelMeta[c]; const Icon = m.icon; const active = activeChannels.includes(c);
            return (
              <button key={c} onClick={() => toggleChannel(c)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ring-1 transition ${active ? "bg-card text-foreground ring-border shadow-sm" : "bg-muted/40 text-muted-foreground ring-transparent"}`}>
                <Icon className="h-3.5 w-3.5" style={{ color: active ? (m.color as string) : undefined }} />
                {m.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
          {/* Calendar */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">{monthLabel}</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" className="h-7" onClick={() => setAnchor(new Date(today.getFullYear(), today.getMonth(), 1))}>Today</Button>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                  <div key={d} className="px-2 py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map(({ date, inMonth }) => {
                  const key = iso(date);
                  const dayPosts = postsByDate[key] ?? [];
                  const isToday = key === iso(today);
                  return (
                    <div key={key} className={`min-h-[110px] rounded-md border p-1.5 ${inMonth ? "bg-card" : "bg-muted/30"} ${isToday ? "ring-2 ring-[color:var(--teal)]/60" : ""}`}>
                      <div className={`text-[11px] font-medium ${inMonth ? "text-foreground" : "text-muted-foreground/60"}`}>{date.getDate()}</div>
                      <div className="mt-1 space-y-1">
                        {dayPosts.slice(0, 3).map((p) => (
                          <div key={p.id} className={`text-[10px] leading-tight rounded px-1.5 py-1 ${statusStyle[p.status]}`}>
                            <div className="flex items-center gap-1">
                              <span>{p.asset}</span>
                              <span className="font-medium">{p.time}</span>
                              <span className="ml-auto flex items-center gap-0.5">
                                {p.channels.slice(0, 3).map((c) => {
                                  const Icon = channelMeta[c].icon;
                                  return <Icon key={c} className="h-2.5 w-2.5" />;
                                })}
                              </span>
                            </div>
                            <div className="truncate mt-0.5">{p.caption}</div>
                          </div>
                        ))}
                        {dayPosts.length > 3 && <div className="text-[10px] text-muted-foreground px-1">+{dayPosts.length - 3} more</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Right column */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" />Best times to post</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {bestTimes.map((b) => (
                  <div key={b.day} className="flex items-center gap-3 text-xs">
                    <div className="w-9 font-medium">{b.day}</div>
                    <div className="w-14 text-muted-foreground">{b.hour}</div>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${b.score}%`, background: "var(--teal)" }} />
                    </div>
                    <div className="w-8 text-right tabular-nums">{b.score}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" />Active campaigns</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {campaigns.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full" style={{ background: c.color }} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-[11px] text-muted-foreground">{c.posts} posts · {c.reach} reach</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Live</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming queue */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Upcoming queue</CardTitle></CardHeader>
          <CardContent>
            <div className="divide-y">
              {filtered
                .filter((p) => p.status !== "published")
                .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
                .slice(0, 8)
                .map((p) => (
                  <div key={p.id} className="py-3 flex items-start gap-3">
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-2xl shrink-0">{p.asset}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{new Date(p.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
                        <span>·</span><span>{p.time}</span>
                        {p.campaign && (<><span>·</span><span>{p.campaign}</span></>)}
                        <span className="ml-2 flex items-center gap-1">
                          {p.channels.map((c) => { const Icon = channelMeta[c].icon; return <Icon key={c} className="h-3 w-3" />; })}
                        </span>
                      </div>
                      <div className="text-sm mt-0.5 line-clamp-2">{p.caption}</div>
                    </div>
                    <Badge className={`text-[10px] ${statusStyle[p.status]}`} variant="outline">{p.status.replace("-", " ")}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent performance */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Recently published</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {posts.filter((p) => p.status === "published").map((p) => (
                <div key={p.id} className="rounded-md border p-3 flex gap-3">
                  <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center text-3xl shrink-0">{p.asset}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      {p.channels.map((c) => { const Icon = channelMeta[c].icon; return <Icon key={c} className="h-3 w-3" />; })}
                      <span>· {new Date(p.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                    </div>
                    <div className="text-sm mt-0.5 line-clamp-2">{p.caption}</div>
                    <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.reach?.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{Math.round((p.engagement ?? 0) * 0.7)}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{Math.round((p.engagement ?? 0) * 0.2)}</span>
                      <span className="flex items-center gap-1"><Share2 className="h-3 w-3" />{Math.round((p.engagement ?? 0) * 0.1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
