import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Square, Sparkles, FileText, Pill, FlaskConical, Activity, AlertTriangle, CheckCircle2, ChevronRight, Send, RotateCcw, User, Stethoscope } from "lucide-react";
import { patients } from "@/lib/data/patients";
import { providers } from "@/lib/data/providers";

export const Route = createFileRoute("/admin/scribe")({
  head: () => ({ meta: [{ title: "AI Scribe - ArcaRX" }] }),
  component: Scribe,
});

const TRANSCRIPT_LINES = [
  { who: "Dr. Chen", text: "Good morning Eliana, how have you been since the last visit?" },
  { who: "Patient", text: "Mostly good. The headaches are gone, but I've had some fatigue in the afternoons." },
  { who: "Dr. Chen", text: "How's your sleep? Still around 6 to 7 hours? And the morning workouts?" },
  { who: "Patient", text: "Sleep is about 6 hours. I missed two workouts this week, knee is sore." },
  { who: "Dr. Chen", text: "Let's check vitals and go over your labs. Your TSH came back at 3.8, free T4 is in normal range." },
  { who: "Patient", text: "And the cholesterol panel?" },
  { who: "Dr. Chen", text: "LDL is 142, slightly elevated. HDL is good at 58. We'll address with lifestyle first before adding a statin." },
  { who: "Patient", text: "What about my vitamin D? I've been taking the supplements." },
  { who: "Dr. Chen", text: "Still low at 22. We're going to bump you up to 5,000 IU daily and recheck in 12 weeks." },
  { who: "Patient", text: "Okay. Should I be worried about the TSH?" },
  { who: "Dr. Chen", text: "Not yet. It's borderline. We'll watch it closely over the next couple draws and discuss low-dose therapy if it keeps trending up." },
];

const DIFFERENTIAL = [
  { dx: "Subclinical hypothyroidism", icd: "E03.9", prob: 64, evidence: "TSH 3.8 trending up over 3 draws, fatigue, weight stable" },
  { dx: "Iron-deficiency anemia", icd: "D50.9", prob: 28, evidence: "Ferritin 28 trending down, fatigue, recommend CBC + ferritin" },
  { dx: "Sleep deprivation syndrome", icd: "G47.00", prob: 22, evidence: "Self-reported avg 6h sleep x 4 weeks" },
  { dx: "Vitamin D deficiency", icd: "E55.9", prob: 18, evidence: "25-OH Vitamin D 22 ng/mL, well below optimal 50-80" },
  { dx: "Hyperlipidemia", icd: "E78.5", prob: 14, evidence: "LDL 142 mg/dL, trending up over 6 months" },
];

const SUGGESTED_ORDERS = [
  { kind: "Lab", name: "CBC with differential", cpt: "85025", checked: true },
  { kind: "Lab", name: "Ferritin, serum", cpt: "82728", checked: true },
  { kind: "Lab", name: "Lipid panel (recheck 12wk)", cpt: "80061", checked: true },
  { kind: "Lab", name: "TSH reflex free T4", cpt: "84443", checked: true },
  { kind: "Med", name: "Vitamin D3 5,000 IU daily", cpt: "", checked: true },
  { kind: "Ref", name: "Sleep medicine consult", cpt: "", checked: false },
  { kind: "Ref", name: "Orthopedic: right knee", cpt: "", checked: false },
];

const TRENDS = [
  { label: "TSH", unit: "mIU/L", ref: "0.4-4.0", values: [2.1, 2.4, 2.8, 3.1, 3.5, 3.8], flag: "high" },
  { label: "LDL-C", unit: "mg/dL", ref: "<100", values: [128, 134, 130, 138, 140, 142], flag: "high" },
  { label: "HDL-C", unit: "mg/dL", ref: ">40", values: [54, 55, 56, 57, 58, 58], flag: "ok" },
  { label: "HbA1c", unit: "%", ref: "<5.7", values: [5.4, 5.5, 5.4, 5.5, 5.6, 5.6], flag: "ok" },
  { label: "Vit D", unit: "ng/mL", ref: "30-80", values: [28, 26, 25, 24, 22, 22], flag: "low" },
  { label: "Ferritin", unit: "ng/mL", ref: "30-200", values: [42, 38, 36, 32, 30, 28], flag: "low" },
];

const SOAP_DRAFT = {
  subjective: "39 yo F presents for hormone optimization follow-up. Chief complaint: intermittent afternoon fatigue x 3 weeks. Reports headaches have resolved since last visit. Sleep approximately 6 hours nightly, missing 2 morning workouts this week secondary to right knee soreness. Denies chest pain, palpitations, hot flashes, or mood changes. Currently on HRT (Estradiol 0.075mg patch, Progesterone 100mg nightly) and Semaglutide 1.5mg weekly.",
  objective: "VS: BP 118/74 mmHg, HR 68 bpm, Temp 98.4F, Weight 142 lbs (stable), BMI 23.1. Gen: well-appearing, NAD. Neck: thyroid non-tender, no goiter palpated. Heart: RRR, no murmurs. Labs reviewed: TSH 3.8 mIU/L (trending up), Free T4 1.1 ng/dL (normal range), LDL-C 142 mg/dL (elevated), HDL 58 mg/dL, HbA1c 5.6%, Vitamin D 25-OH 22 ng/mL (deficient), Ferritin 28 ng/mL (low-normal). Estradiol 64 pg/mL (therapeutic).",
  assessment: "1. Subclinical hypothyroidism (E03.9) - TSH trending upward over 3 consecutive draws, now 3.8. Monitor vs. initiate low-dose therapy at next visit.\n2. Vitamin D deficiency (E55.9) - 25-OH at 22 ng/mL, below optimal range of 50-80 ng/mL. Initiating supplementation.\n3. Possible iron-deficiency or depletion (D50.9) - Ferritin trending down to 28, CBC ordered to evaluate.\n4. Hyperlipidemia (E78.5) - LDL 142, lifestyle intervention first given age and low overall cardiovascular risk score.\n5. Fatigue, multifactorial (R53.83) - likely combination of sleep restriction, borderline thyroid, and micronutrient deficiencies.",
  plan: "1. Vitamin D3 5,000 IU PO daily x 12 weeks, recheck 25-OH Vitamin D at next visit.\n2. CBC with differential + serum ferritin ordered today to evaluate for iron-deficiency anemia.\n3. Continue current HRT: Estradiol 0.075mg transdermal patch, Progesterone 100mg PO nightly. Estradiol levels therapeutic.\n4. Repeat TSH + Free T4 + anti-TPO antibodies in 6 weeks. Discuss low-dose levothyroxine if TSH exceeds 4.5.\n5. Lifestyle counseling: target 7-8h sleep nightly, Mediterranean dietary pattern to address LDL elevation, RICE protocol for right knee.\n6. Lipid panel recheck in 12 weeks. If LDL remains >130, begin statin discussion.\n7. Follow-up in 6 weeks or sooner if symptoms worsen.",
};

function Spark({ data, flag }: { data: number[]; flag: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / span) * 100}`).join(" ");
  const color = flag === "high" ? "var(--chart-red)" : flag === "low" ? "var(--chart-amber)" : "var(--chart-emerald)";
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-9 w-full">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LiveWave({ active }: { active: boolean }) {
  return (
    <div className="flex h-10 items-end gap-[2px]">
      {Array.from({ length: 32 }).map((_, i) => {
        const baseH = 4 + Math.abs(Math.sin(i * 0.7) * 18) + (i % 5) * 1.5;
        return (
          <div
            key={i}
            className="w-[3px] rounded-full transition-all duration-500"
            style={{
              height: active ? `${Math.min(baseH, 32)}px` : "4px",
              background: active ? "var(--teal, #2dd4bf)" : "hsl(var(--muted-foreground))",
              opacity: active ? 0.7 + (i % 3) * 0.1 : 0.3,
              transitionDelay: `${(i % 8) * 40}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Scribe() {
  const [recording, setRecording] = useState(false);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [transcriptLines, setTranscriptLines] = useState<typeof TRANSCRIPT_LINES>([]);
  const [orders, setOrders] = useState(SUGGESTED_ORDERS.map(o => ({ ...o })));
  const [soap, setSoap] = useState({ subjective: "", objective: "", assessment: "", plan: "" });
  const [draftReady, setDraftReady] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState("pat-1");
  const [selectedProviderId, setSelectedProviderId] = useState("prov-1");
  const [pushed, setPushed] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lineIdx = useRef(0);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      transcriptTimerRef.current = setInterval(() => {
        if (lineIdx.current < TRANSCRIPT_LINES.length) {
          setTranscriptLines(prev => [...prev, TRANSCRIPT_LINES[lineIdx.current]]);
          lineIdx.current++;
        } else {
          clearInterval(transcriptTimerRef.current!);
        }
      }, 1800);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (transcriptTimerRef.current) clearInterval(transcriptTimerRef.current);
    };
  }, [recording]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcriptLines]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  function startRecording() {
    setStarted(true);
    setRecording(true);
    setTranscriptLines([]);
    lineIdx.current = 0;
    setElapsed(0);
    setDraftReady(false);
    setSoap({ subjective: "", objective: "", assessment: "", plan: "" });
    setPushed(false);
  }

  function stopAndDraft() {
    setRecording(false);
    setTimeout(() => {
      setDraftReady(true);
      setSoap(SOAP_DRAFT);
    }, 1200);
  }

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const selectedProvider = providers.find(p => p.id === selectedProviderId);
  const wordCount = transcriptLines.reduce((s, l) => s + l.text.split(" ").length, 0);

  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Clinical AI · Ambient Scribe"
        title="Encounter copilot"
        description="Listens during the visit. Drafts SOAP note, differential, and orders. Provider reviews and signs."
        actions={
          <div className="flex gap-2">
            {draftReady && !pushed && (
              <>
                <Button variant="outline" size="sm" className="h-9" onClick={() => { setStarted(false); setDraftReady(false); }}>
                  <RotateCcw className="mr-1.5 h-4 w-4" />Discard
                </Button>
                <Button size="sm" className="h-9 gradient-brand text-white" onClick={async () => {
                  try {
                    await supabase.from("encounters").insert({
                      patient_id: selectedPatientId,
                      provider_id: selectedProviderId,
                      location_id: "loc-atx",
                      date: new Date().toISOString().split("T")[0],
                      type: "Ambient Visit",
                      status: "draft",
                      chief_complaint: soap.subjective.split(".")[0] ?? "Visit",
                      subjective: soap.subjective,
                      objective: soap.objective,
                      assessment: soap.assessment,
                      plan: soap.plan,
                      icd_codes: [],
                      cpt_codes: [],
                      total_charge: 0,
                      duration: elapsed,
                    });
                  } catch { /* non-blocking */ }
                  setPushed(true);
                }}>
                  <Send className="mr-1.5 h-4 w-4" />Push to chart
                </Button>
              </>
            )}
            {pushed && (
              <Badge variant="outline" className="h-9 px-3 text-emerald-400 border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />Encounter draft saved to chart
              </Badge>
            )}
          </div>
        }
      />

      {/* Patient + Provider selectors */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select patient" /></SelectTrigger>
            <SelectContent>
              {patients.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.firstName} {p.lastName} · {p.mrn}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Stethoscope className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={selectedProviderId} onValueChange={setSelectedProviderId}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select provider" /></SelectTrigger>
            <SelectContent>
              {providers.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}, {p.credentials}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recording status bar */}
      <Card className={`surface-elevated transition-colors ${recording ? "border-red-500/40" : draftReady ? "border-emerald-500/30" : "border-border"}`}>
        <CardContent className="flex items-center gap-4 p-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${recording ? "bg-red-500/10" : draftReady ? "bg-emerald-500/10" : "bg-muted"}`}>
            {recording
              ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
              : draftReady
              ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              : <Mic className="h-5 w-5 text-muted-foreground" />
            }
          </div>
          <div className="flex-1 min-w-0">
            {!started ? (
              <p className="text-sm text-muted-foreground">Select patient and provider above, then start recording to begin transcription.</p>
            ) : (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">
                    {recording ? "Recording" : draftReady ? "Draft ready" : "Processing..."} · {selectedPatient?.firstName} {selectedPatient?.lastName}
                  </p>
                  <Badge variant="outline" className="text-[10px]">{selectedProvider?.name}</Badge>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {formatTime(elapsed)} elapsed · {wordCount} words transcribed · {transcriptLines.length} exchanges
                </p>
              </>
            )}
          </div>
          <LiveWave active={recording} />
          <div className="flex gap-2 shrink-0">
            {!started ? (
              <Button size="sm" className="h-9 gradient-brand text-white" onClick={startRecording}>
                <Mic className="mr-1.5 h-4 w-4" />Start session
              </Button>
            ) : recording ? (
              <Button size="sm" variant="outline" className="h-9 border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={stopAndDraft}>
                <Square className="mr-1.5 h-4 w-4" />Stop and draft
              </Button>
            ) : !draftReady ? (
              <Button size="sm" disabled className="h-9"><Sparkles className="mr-1.5 h-4 w-4 animate-spin" />Drafting...</Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Main 3-panel layout */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Transcript */}
        <Card className="surface-elevated lg:col-span-4 flex flex-col">
          <CardHeader className="pb-2 shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Live transcript</CardTitle>
              {transcriptLines.length > 0 && <Badge variant="outline" className="text-[10px]">{transcriptLines.length} lines</Badge>}
            </div>
          </CardHeader>
          <CardContent className="pt-0 flex-1 min-h-0">
            <div ref={transcriptRef} className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {transcriptLines.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                  <Mic className="h-8 w-8 opacity-20" />
                  <p className="text-xs text-center">Transcript will appear here as the visit progresses.</p>
                </div>
              ) : (
                transcriptLines.map((t, i) => (
                  <div key={i} className={`rounded-md border p-2.5 text-sm ${t.who === "Patient" ? "bg-card ml-4" : "bg-card/30"}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{t.who}</p>
                    <p className="leading-relaxed">{t.text}</p>
                  </div>
                ))
              )}
              {recording && transcriptLines.length > 0 && (
                <p className="text-center text-[11px] italic text-muted-foreground pt-1 animate-pulse">Listening...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SOAP Draft */}
        <Card className="surface-elevated lg:col-span-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[color:var(--teal)]" />
              <CardTitle className="text-sm font-semibold">SOAP draft</CardTitle>
              {draftReady && <Badge variant="outline" className="text-[10px]">AI · 94% confidence</Badge>}
            </div>
            {draftReady && <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.success("Regenerating note", { description: "Re-running the transcript through the scribe for a fresh draft." })}>Regenerate</Button>}
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {!draftReady ? (
              <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                <FileText className="h-8 w-8 opacity-20" />
                <p className="text-xs text-center">SOAP note will be drafted when you stop the recording.</p>
              </div>
            ) : (
              (["subjective", "objective", "assessment", "plan"] as const).map((section) => (
                <div key={section}>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--teal)] mb-1">{section}</p>
                  <Textarea
                    value={soap[section]}
                    onChange={e => setSoap(prev => ({ ...prev, [section]: e.target.value }))}
                    className="min-h-[80px] text-xs resize-none bg-card/60"
                    rows={section === "plan" || section === "assessment" ? 5 : 3}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Right column - Differential + Orders */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="surface-elevated">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[color:var(--teal)]" />
                <CardTitle className="text-sm font-semibold">AI differential</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {DIFFERENTIAL.map((d) => (
                <div key={d.dx} className="rounded-md border bg-card p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium leading-snug">{d.dx}</p>
                    <span className="font-mono text-[10px] text-muted-foreground ml-1 shrink-0">{d.icd}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-[color:var(--teal)] transition-all duration-700" style={{ width: draftReady ? `${d.prob}%` : "0%" }} />
                    </div>
                    <span className="w-8 text-right font-mono text-[10px]">{draftReady ? `${d.prob}%` : "--"}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground leading-snug">{d.evidence}</p>
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
              {orders.map((o, i) => (
                <label key={o.name} className="flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 text-xs cursor-pointer hover:bg-muted/30">
                  <input
                    type="checkbox"
                    checked={o.checked}
                    onChange={() => setOrders(prev => prev.map((x, j) => j === i ? { ...x, checked: !x.checked } : x))}
                    className="h-3.5 w-3.5 shrink-0"
                  />
                  <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] shrink-0 ${o.kind === "Lab" ? "bg-blue-500/10 text-blue-400" : o.kind === "Med" ? "bg-violet-500/10 text-violet-400" : "bg-amber-500/10 text-amber-400"}`}>
                    {o.kind}
                  </span>
                  <span className="flex-1 leading-snug">{o.name}</span>
                  {o.cpt && <span className="font-mono text-[10px] text-muted-foreground shrink-0">{o.cpt}</span>}
                </label>
              ))}
              <Button size="sm" className="mt-2 w-full gradient-brand text-white" disabled={!draftReady} onClick={() => toast.success("Orders queued", { description: `${orders.filter(o => o.checked).length} labs, meds, and referrals sent for provider sign-off.` })}>
                <ChevronRight className="mr-1 h-3.5 w-3.5" />Queue {orders.filter(o => o.checked).length} orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lab trends for patient context */}
      <Card className="surface-elevated">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-[color:var(--teal)]" />
            <CardTitle className="text-sm font-semibold">Patient lab trends · context</CardTitle>
          </div>
          {selectedPatient && (
            <Link to="/admin/patients/$id" params={{ id: selectedPatientId }} className="text-xs text-[color:var(--teal)] hover:underline flex items-center gap-1">
              Full chart <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </CardHeader>
        <CardContent className="grid gap-3 pt-0 sm:grid-cols-2 lg:grid-cols-6">
          {TRENDS.map((t) => (
            <div key={t.label} className="rounded-md border bg-card p-3">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-xs font-medium">{t.label}</p>
                {t.flag === "high" && <AlertTriangle className="h-3 w-3 text-red-400" />}
                {t.flag === "low" && <AlertTriangle className="h-3 w-3 text-amber-400" />}
                {t.flag === "ok" && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
              </div>
              <p className="font-mono text-lg font-semibold tabular-nums">
                {t.values[t.values.length - 1]}
                <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">{t.unit}</span>
              </p>
              <Spark data={t.values} flag={t.flag} />
              <p className="mt-0.5 text-[10px] text-muted-foreground">Ref {t.ref}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
