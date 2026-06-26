import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TreatmentTrack } from "@/lib/data/types";
import {
  Syringe, Weight, FlaskConical, Sparkles, Droplets, Leaf,
  AlertTriangle, CheckCircle2, Clock, ChevronRight, TrendingDown,
  TrendingUp, Calendar, Zap, Heart, Activity,
} from "lucide-react";

export const TRACK_META: Record<TreatmentTrack, { label: string; color: string; icon: React.ElementType }> = {
  trt:        { label: "TRT",           color: "text-blue-400 border-blue-500/30 bg-blue-500/10",       icon: Syringe   },
  glp1:       { label: "GLP-1",         color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", icon: Weight },
  aesthetics: { label: "Aesthetics",    color: "text-violet-400 border-violet-500/30 bg-violet-500/10", icon: Sparkles  },
  skincare:   { label: "Skincare Rx",   color: "text-rose-400 border-rose-500/30 bg-rose-500/10",       icon: Leaf      },
  nad:        { label: "NAD+ / IV",     color: "text-amber-400 border-amber-500/30 bg-amber-500/10",    icon: Droplets  },
  hormone:    { label: "Hormone / HRT", color: "text-pink-400 border-pink-500/30 bg-pink-500/10",       icon: Heart     },
  general:    { label: "General",       color: "text-muted-foreground border-border bg-muted/40",        icon: Activity  },
};

// --- TRT panel ---
function TRTPanel() {
  const labs = [
    { name: "Total Testosterone", value: "724", unit: "ng/dL", ref: "300–1000", status: "ok", trend: "up" },
    { name: "Free Testosterone",  value: "18.2", unit: "pg/mL", ref: "9–30",    status: "ok", trend: "up" },
    { name: "Estradiol (E2)",     value: "38",   unit: "pg/mL", ref: "10–40",   status: "ok", trend: "flat" },
    { name: "Hematocrit",         value: "49.1", unit: "%",     ref: "38.3–50", status: "warn", trend: "up" },
    { name: "PSA",                value: "0.8",  unit: "ng/mL", ref: "<4.0",    status: "ok", trend: "flat" },
    { name: "SHBG",               value: "22",   unit: "nmol/L",ref: "10–57",   status: "ok", trend: "flat" },
  ];
  const protocol = { drug: "Testosterone Cypionate", dose: "200mg/mL", sig: "0.5mL IM q7d", pharmacy: "Empower Pharmacy", nextRefill: "Jul 14, 2026" };
  const nextLabs = "Jul 2, 2026";
  const hctWarning = parseFloat(labs[3].value) > 48;

  return (
    <div className="space-y-4">
      {hctWarning && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">Hematocrit {labs[3].value}% - approaching threshold. Consider blood donation referral if trending higher.</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {labs.map((l) => (
          <div key={l.name} className="rounded-md border bg-card/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{l.name}</p>
            <div className="flex items-end justify-between mt-1">
              <p className="text-lg font-semibold font-mono tabular-nums">{l.value}<span className="text-[10px] font-normal text-muted-foreground ml-1">{l.unit}</span></p>
              {l.status === "warn" ? <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> :
               l.trend === "up"   ? <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> :
               l.trend === "down" ? <TrendingDown className="h-3.5 w-3.5 text-red-400" /> :
               <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">Ref {l.ref}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-1.5"><Syringe className="h-3.5 w-3.5 text-blue-400" />Active protocol</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Medication</span><span className="font-medium">{protocol.drug}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Dose / Sig</span><span className="font-medium">{protocol.dose} · {protocol.sig}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pharmacy</span><span className="font-medium text-violet-400">{protocol.pharmacy}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Next refill</span><span className="font-medium text-amber-400">{protocol.nextRefill}</span></div>
          </CardContent>
        </Card>
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-1.5"><FlaskConical className="h-3.5 w-3.5 text-blue-400" />Lab schedule</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Next draw due</span><span className="font-medium text-[color:var(--teal)]">{nextLabs}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Cadence</span><span className="font-medium">Every 90 days</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Panel</span><span className="font-medium">Total T, Free T, E2, HCT, PSA</span></div>
            <Button size="sm" className="w-full h-7 text-xs mt-1 gradient-brand text-white">Order labs now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- GLP-1 panel ---
function GLP1Panel() {
  const weights = [
    { date: "Mar", weight: 248 }, { date: "Apr", weight: 241 }, { date: "May", weight: 235 },
    { date: "Jun", weight: 229 },
  ];
  const current = weights[weights.length - 1];
  const start = weights[0];
  const lost = start.weight - current.weight;
  const protocol = { drug: "Semaglutide", dose: "1.5mg", sig: "0.375mL SQ weekly", titrationNext: "2.0mg in 4 weeks", pharmacy: "Hallandale Pharmacy" };
  const sideEffects = [
    { issue: "Mild nausea", severity: "low", reported: "Week 2", resolved: true },
    { issue: "Constipation", severity: "med", reported: "Week 4", resolved: false },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Starting weight", value: `${start.weight} lbs`, sub: start.date },
          { label: "Current weight",  value: `${current.weight} lbs`, sub: current.date, accent: "text-emerald-400" },
          { label: "Total lost",      value: `-${lost} lbs`, sub: "3 months", accent: "text-emerald-400" },
          { label: "Weekly avg loss", value: `${(lost / 13).toFixed(1)} lbs`, sub: "on target" },
        ].map((s) => (
          <div key={s.label} className="rounded-md border bg-card/60 p-3 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className={`text-lg font-semibold font-mono mt-1 ${s.accent ?? ""}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-emerald-400" />Titration protocol</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Current dose</span><span className="font-semibold text-[color:var(--teal)]">{protocol.dose} · {protocol.sig}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Next step</span><span className="font-medium text-amber-400">{protocol.titrationNext}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Drug</span><span className="font-medium">{protocol.drug}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pharmacy</span><span className="font-medium text-violet-400">{protocol.pharmacy}</span></div>
          </CardContent>
        </Card>
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-amber-400" />Side effect log</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0">
            {sideEffects.map((s, i) => (
              <div key={i} className={`flex items-center justify-between rounded-md border p-2 text-xs ${s.severity === "med" ? "border-amber-500/20 bg-amber-500/5" : "border-border bg-card/60"}`}>
                <div>
                  <p className="font-medium">{s.issue}</p>
                  <p className="text-muted-foreground">Reported {s.reported}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${s.resolved ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20"}`}>
                  {s.resolved ? "Resolved" : "Ongoing"}
                </Badge>
              </div>
            ))}
            <Button size="sm" variant="outline" className="w-full h-7 text-xs mt-1">Log symptom</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- Aesthetics panel ---
function AestheticsPanel() {
  const treatments = [
    { zone: "Forehead",   product: "Botox",   units: 20, date: "May 14, 2026", nextDue: "Aug 14, 2026", daysLeft: 57 },
    { zone: "Crow's feet",product: "Botox",   units: 12, date: "May 14, 2026", nextDue: "Aug 14, 2026", daysLeft: 57 },
    { zone: "Glabella",   product: "Botox",   units: 25, date: "May 14, 2026", nextDue: "Aug 14, 2026", daysLeft: 57 },
    { zone: "Lip",        product: "Juvederm Ultra XC", units: null, volume: "0.5mL", date: "Feb 20, 2026", nextDue: "Aug 20, 2026", daysLeft: 63 },
    { zone: "Cheeks",     product: "Restylane Lyft",    units: null, volume: "1.0mL", date: "Feb 20, 2026", nextDue: "Feb 20, 2027", daysLeft: 246 },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card/60 overflow-hidden">
        <div className="grid grid-cols-5 gap-0 border-b bg-muted/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Zone</span><span>Product</span><span>Qty</span><span>Last treated</span><span>Next due</span>
        </div>
        {treatments.map((t) => {
          const urgent = t.daysLeft < 30;
          const soon = t.daysLeft < 60;
          return (
            <div key={t.zone} className="grid grid-cols-5 gap-0 border-b px-3 py-2.5 text-xs last:border-0 hover:bg-muted/20">
              <span className="font-medium">{t.zone}</span>
              <span className="text-muted-foreground">{t.product}</span>
              <span className="font-mono">{t.units ? `${t.units}u` : t.volume}</span>
              <span className="text-muted-foreground">{t.date}</span>
              <span className={urgent ? "text-red-400 font-semibold" : soon ? "text-amber-400" : "text-emerald-400"}>
                {t.nextDue} <span className="text-muted-foreground font-normal">({t.daysLeft}d)</span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="gradient-brand text-white h-8 text-xs"><Sparkles className="mr-1.5 h-3.5 w-3.5" />Book touchup</Button>
        <Button size="sm" variant="outline" className="h-8 text-xs">Add treatment zone</Button>
        <Button size="sm" variant="outline" className="h-8 text-xs">Before/after photos</Button>
      </div>
    </div>
  );
}

// --- Skincare panel ---
function SkincarePanel() {
  const profile = { fitzpatrick: "II", skinType: "Combination", concerns: ["Hyperpigmentation", "Fine lines", "Rosacea-prone"] };
  const treatments = [
    { name: "Morpheus8 RF",        session: "3 of 3", date: "Jun 13, 2026", nextDue: "Dec 13, 2026" },
    { name: "Chemical peel (VI)",  session: "2 of 4", date: "May 1, 2026",  nextDue: "Aug 1, 2026"  },
    { name: "HydraFacial",         session: "Monthly", date: "Jun 5, 2026", nextDue: "Jul 5, 2026"  },
  ];
  const rx = [
    { product: "Tretinoin 0.05%", sig: "Apply pea-size QHS", note: "Avoid retinoids 5d pre-laser" },
    { product: "Azelaic acid 15%", sig: "Apply AM, post-cleanse", note: "For PIH" },
    { product: "SPF 50 (mineral)", sig: "Every morning", note: "Non-negotiable with any laser" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md border bg-card/60 p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Fitzpatrick</p>
          <p className="text-2xl font-semibold mt-1">{profile.fitzpatrick}</p>
        </div>
        <div className="rounded-md border bg-card/60 p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Skin type</p>
          <p className="text-lg font-semibold mt-1">{profile.skinType}</p>
        </div>
        <div className="rounded-md border bg-card/60 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Concerns</p>
          <div className="flex flex-wrap gap-1">
            {profile.concerns.map((c) => <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>)}
          </div>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Device / treatment log</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0 text-xs">
            {treatments.map((t) => (
              <div key={t.name} className="flex items-start justify-between border-b border-border/30 pb-2 last:border-0">
                <div><p className="font-medium">{t.name}</p><p className="text-muted-foreground">Session {t.session} · {t.date}</p></div>
                <span className="text-[color:var(--teal)] shrink-0 ml-2">→ {t.nextDue}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Skincare Rx stack</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0 text-xs">
            {rx.map((r) => (
              <div key={r.product} className="rounded-md border bg-card/60 p-2">
                <p className="font-medium">{r.product}</p>
                <p className="text-muted-foreground">{r.sig}</p>
                {r.note && <p className="text-amber-400 text-[10px] mt-0.5">⚠ {r.note}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- NAD+ / IV panel ---
function NADPanel() {
  const sessions = [
    { date: "Jun 17, 2026", product: "NAD+ 500mg IV", duration: "90 min", provider: "S. Whitfield", notes: "Right AC - easy access" },
    { date: "May 19, 2026", product: "NAD+ 500mg IV", duration: "90 min", provider: "S. Whitfield", notes: "" },
    { date: "Apr 21, 2026", product: "NAD+ 250mg IV + Myers",  duration: "60 min", provider: "S. Whitfield", notes: "Added B12 push" },
  ];
  const access = { preferredArm: "Right", veinNote: "AC fossa - easy 22g", lastAccess: "Jun 17, 2026" };
  const packages = { total: 12, used: 7, remaining: 5, expires: "Dec 1, 2026" };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Sessions (pkg)", value: `${packages.used}/${packages.total}`, sub: `${packages.remaining} remaining` },
          { label: "Pkg expires",    value: packages.expires, sub: "" },
          { label: "Preferred arm",  value: access.preferredArm, sub: access.veinNote },
          { label: "Last session",   value: sessions[0].date, sub: sessions[0].product },
        ].map((s) => (
          <div key={s.label} className="rounded-md border bg-card/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="text-sm font-semibold mt-1">{s.value}</p>
            {s.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>
      <Card className="surface-elevated">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Infusion history</CardTitle></CardHeader>
        <CardContent className="space-y-2 pt-0">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border/30 pb-2 last:border-0 text-xs">
              <div>
                <p className="font-medium">{s.product}</p>
                <p className="text-muted-foreground">{s.date} · {s.duration} · {s.provider}</p>
                {s.notes && <p className="text-[color:var(--teal)] text-[10px]">{s.notes}</p>}
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-3" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Hormone / HRT panel ---
function HormonePanel() {
  const labs = [
    { name: "Estradiol (E2)", value: "64",   unit: "pg/mL", ref: "50–150", status: "ok" },
    { name: "Progesterone",   value: "8.2",  unit: "ng/mL", ref: "5–20",   status: "ok" },
    { name: "FSH",            value: "4.1",  unit: "mIU/mL",ref: "3–10",   status: "ok" },
    { name: "LH",             value: "5.8",  unit: "mIU/mL",ref: "2–15",   status: "ok" },
    { name: "DHEA-S",         value: "142",  unit: "μg/dL", ref: "65–380", status: "ok" },
    { name: "Cortisol (AM)",  value: "21",   unit: "μg/dL", ref: "6–23",   status: "ok" },
  ];
  const protocol = [
    { med: "Estradiol patch 0.075mg", sig: "Apply to abdomen 2x/wk", refill: "Jul 20, 2026" },
    { med: "Progesterone 100mg",      sig: "1 cap PO QHS",            refill: "Jul 20, 2026" },
    { med: "DHEA 25mg",               sig: "1 cap PO QAM",            refill: "Aug 1, 2026"  },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {labs.map((l) => (
          <div key={l.name} className="rounded-md border bg-card/60 p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{l.name}</p>
            <p className="text-lg font-semibold font-mono mt-1">{l.value}<span className="text-[10px] font-normal text-muted-foreground ml-1">{l.unit}</span></p>
            <p className="text-[10px] text-muted-foreground">Ref {l.ref}</p>
          </div>
        ))}
      </div>
      <Card className="surface-elevated">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-pink-400" />Active HRT protocol</CardTitle></CardHeader>
        <CardContent className="space-y-2 pt-0 text-xs">
          {protocol.map((p) => (
            <div key={p.med} className="flex items-center justify-between rounded-md border bg-card/60 p-2.5">
              <div><p className="font-medium">{p.med}</p><p className="text-muted-foreground">{p.sig}</p></div>
              <span className="text-amber-400 shrink-0 ml-2">Refill {p.refill}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

interface TreatmentPanelProps {
  track: TreatmentTrack;
}

export function TreatmentPanel({ track }: TreatmentPanelProps) {
  const meta = TRACK_META[track];
  const Icon = meta.icon;

  if (track === "general") return null;

  return (
    <Card className="surface-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Icon className="h-4 w-4" />
            {meta.label} Protocol
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`text-[10px] ${meta.color}`}>{meta.label}</Badge>
            <Button size="sm" variant="ghost" className="h-6 text-[11px] px-2 text-[color:var(--teal)]">
              Edit track <ChevronRight className="h-3 w-3 ml-0.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {track === "trt"        && <TRTPanel />}
        {track === "glp1"       && <GLP1Panel />}
        {track === "aesthetics" && <AestheticsPanel />}
        {track === "skincare"   && <SkincarePanel />}
        {track === "nad"        && <NADPanel />}
        {track === "hormone"    && <HormonePanel />}
      </CardContent>
    </Card>
  );
}
