import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, Square, Sparkles, FileText, Pill, FlaskConical, Activity, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/scribe")({
  head: () => ({ meta: [{ title: "AI Scribe — ARCA Rx" }] }),
  component: Scribe,
});

function Wave() {
  return (
    <div className="flex h-10 items-center gap-[3px]">
      {Array.from({ length: 56 }).map((_, i) => {
        const h = 8 + Math.abs(Math.sin(i * 0.7) * 22) + (i % 7) * 2;
        return <div key={i} className="w-[3px] rounded-full bg-[color:var(--teal)]/70" style={{ height: `${Math.min(h, 36)}px` }} />;
      })}
    </div>
  );
}

const transcript = [
  { who: "Dr. Chen", t: "00:14", text: "Good morning Eliana, how have you been since the last visit?" },
  { who: "Patient", t: "00:18", text: "Mostly good. The headaches are gone, but I've had some fatigue in the afternoons." },
  { who: "Dr. Chen", t: "00:34", text: "How's your sleep — still around 6 to 7 hours? And the morning workouts?" },
  { who: "Patient", t: "00:41", text: "Sleep is 6 hours. I missed two workouts this week, knee is sore." },
  { who: "Dr. Chen", t: "01:02", text: "Let's check vitals and labs. Your TSH came back at 3.8, free T4 is normal range." },
  { who: "Patient", t: "01:18", text: "And the cholesterol panel?" },
  { who: "Dr. Chen", t: "01:22", text: "LDL is 142, slightly elevated. HDL good at 58. We'll address with lifestyle first." },
];

const differential = [
  { dx: "Subclinical hypothyroidism",      icd: "E03.9",   prob: 64, evidence: "TSH 3.8 ↑, fatigue, weight stable" },
  { dx: "Iron-deficiency anemia",          icd: "D50.9",   prob: 28, evidence: "Recommend CBC + ferritin"          },
  { dx: "Sleep deprivation syndrome",      icd: "G47.00",  prob: 22, evidence: "Avg 6h sleep ×4 wk"                },
  { dx: "Vitamin D deficiency",            icd: "E55.9",   prob: 18, evidence: "Last 25-OH was 22 ng/mL"           },
];

const orders = [
  { kind: "Lab",  name: "CBC w/ differential",        cpt: "85025",  sel: true  },
  { kind: "Lab",  name: "Ferritin, serum",            cpt: "82728",  sel: true  },
  { kind: "Lab",  name: "Lipid panel (recheck 12wk)", cpt: "80061",  sel: true  },
  { kind: "Med",  name: "Vit D3 5,000 IU daily",      cpt: "—",      sel: true  },
  { kind: "Ref",  name: "Sleep medicine consult",     cpt: "—",      sel: false },
];

const trends = [
  { label: "TSH",          unit: "mIU/L", ref: "0.4–4.0",  values: [2.1, 2.4, 2.8, 3.1, 3.5, 3.8], flag: "high" },
  { label: "LDL-C",        unit: "mg/dL", ref: "<100",     values: [128, 134, 130, 138, 140, 142], flag: "high" },
  { label: "HDL-C",        unit: "mg/dL", ref: ">40",      values: [54, 55, 56, 57, 58, 58],       flag: "ok"   },
  { label: "HbA1c",        unit: "%",     ref: "<5.7",     values: [5.4, 5.5, 5.4, 5.5, 5.6, 5.6], flag: "ok"   },
  { label: "Vitamin D",    unit: "ng/mL", ref: "30–80",    values: [28, 26, 25, 24, 22, 22],       flag: "low"  },
  { label: "Ferritin",     unit: "ng/mL", ref: "30–200",   values: [42, 38, 36, 32, 30, 28],       flag: "low"  },
];

function Spark({ data, flag }: { data: number[]; flag: string }) {
  const min = Math.min(...data); const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / span) * 100}`).join(" ");
  const color = flag === "high" ? "var(--danger)" : flag === "low" ? "var(--warning)" : "var(--success)";
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-9 w-full">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Scribe() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Clinical AI · Ambient Scribe"
        title="Encounter copilot"
        description="Listens during the visit, drafts the SOAP note, suggests a differential, queues orders & coding — provider reviews and signs."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9">Discard</Button>
            <Button size="sm" className="h-9 gradient-brand text-white"><CheckCircle2 className="mr-1.5 h-4 w-4" />Sign & finalize</Button>
          </div>
        }
      />

      {/* Live recorder bar */}
      <Card className="surface-elevated border-[color:var(--teal)]/30">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--danger)]/10">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[color:var(--danger)]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">Recording · Eliana Ruiz · Follow-up</p>
              <Badge variant="outline" className="text-[10px]">Encounter E-4821</Badge>
              <Badge variant="outline" className="text-[10px]">Dr. Chen</Badge>
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">04:12 elapsed · 1,284 words transcribed · drift 0.3s</p>
          </div>
          <Wave />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9"><Mic className="mr-1.5 h-4 w-4" />Pause</Button>
            <Button size="sm" className="h-9"><Square className="mr-1.5 h-4 w-4" />Stop & draft</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Transcript */}
        <Card className="surface-elevated lg:col-span-4">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Live transcript</CardTitle></CardHeader>
          <CardContent className="space-y-2.5 pt-0">
            {transcript.map((t, i) => (
              <div key={i} className={`rounded-md border p-2.5 ${t.who === "Dr. Chen" ? "bg-[color:var(--teal)]/[0.04]" : "bg-card"}`}>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="font-medium uppercase tracking-[0.12em]">{t.who}</span>
                  <span className="font-mono">{t.t}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed">{t.text}</p>
              </div>
            ))}
            <p className="pt-1 text-center text-[11px] italic text-muted-foreground">… listening</p>
          </CardContent>
        </Card>

        {/* SOAP Draft */}
        <Card className="surface-elevated lg:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[color:var(--teal)]" />
              <CardTitle className="text-sm font-semibold">SOAP draft</CardTitle>
              <Badge variant="outline" className="text-[10px]">AI · 94% confidence</Badge>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs">Regenerate</Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-sm">
            {[
              { label: "Subjective", body: "39 yo F follows up for hormone optimization, c/o intermittent afternoon fatigue x 3 wk. Headaches resolved. Sleep ~6 h, missed 2 workouts due to R knee soreness. Denies CP, palpitations, mood changes." },
              { label: "Objective", body: "VS: BP 118/74, HR 68, BMI 24.1. Gen: well-appearing, NAD. Neck: thyroid non-tender, no goiter. Heart RRR. Labs (today): TSH 3.8 (↑), free T4 WNL, LDL 142 (↑), HDL 58, A1c 5.6, Vit D 22 (↓), ferritin 28 (↓)." },
              { label: "Assessment", body: "1) Subclinical hypothyroidism — borderline TSH, monitor.\n2) Vitamin D deficiency.\n3) Iron-low / suspected mild IDA.\n4) Hyperlipidemia, dietary.\n5) R knee strain, activity-related." },
              { label: "Plan", body: "• Repeat TSH + free T4 + reflex anti-TPO in 6 wk\n• CBC w/ diff + ferritin today\n• Vit D3 5,000 IU PO daily, recheck 25-OH in 12 wk\n• Lifestyle counseling: Mediterranean pattern, sleep ≥7 h, reduce sat fat\n• PT referral for R knee\n• F/u 6 wk" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--teal)]">{s.label}</p>
                <p className="mt-1 whitespace-pre-line leading-relaxed">{s.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Differential + orders */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="surface-elevated">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[color:var(--teal)]" />
                <CardTitle className="text-sm font-semibold">Differential</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {differential.map((d) => (
                <div key={d.dx} className="rounded-md border bg-card p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{d.dx}</p>
                    <span className="font-mono text-[10px] text-muted-foreground">{d.icd}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-[color:var(--teal)]" style={{ width: `${d.prob}%` }} />
                    </div>
                    <span className="w-8 text-right font-mono text-[10px]">{d.prob}%</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{d.evidence}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-elevated">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Pill className="h-4 w-4 text-[color:var(--teal)]" />
                <CardTitle className="text-sm font-semibold">Suggested orders</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5 pt-0">
              {orders.map((o) => (
                <label key={o.name} className="flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 text-xs">
                  <input type="checkbox" defaultChecked={o.sel} className="h-3.5 w-3.5" />
                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">{o.kind}</span>
                  <span className="flex-1 truncate">{o.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{o.cpt}</span>
                </label>
              ))}
              <Button size="sm" className="mt-2 w-full"><ChevronRight className="mr-1 h-3.5 w-3.5" />Queue 4 orders</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lab trends */}
      <Card className="surface-elevated">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-[color:var(--teal)]" />
            <CardTitle className="text-sm font-semibold">Lab trends — 6 most recent</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs"><FileText className="mr-1 h-3.5 w-3.5" />Full results</Button>
        </CardHeader>
        <CardContent className="grid gap-3 pt-0 sm:grid-cols-2 lg:grid-cols-6">
          {trends.map((t) => (
            <div key={t.label} className="rounded-md border bg-card p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">{t.label}</p>
                {t.flag === "high" && <AlertTriangle className="h-3 w-3 text-[color:var(--danger)]" />}
                {t.flag === "low"  && <AlertTriangle className="h-3 w-3 text-[color:var(--warning)]" />}
                {t.flag === "ok"   && <CheckCircle2  className="h-3 w-3 text-[color:var(--success)]" />}
              </div>
              <p className="font-mono text-base font-semibold tabular-nums">{t.values[t.values.length - 1]}<span className="ml-1 text-[10px] font-normal text-muted-foreground">{t.unit}</span></p>
              <Spark data={t.values} flag={t.flag} />
              <p className="mt-0.5 text-[10px] text-muted-foreground">Ref {t.ref}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
