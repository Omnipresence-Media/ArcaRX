import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video, Heart, Activity, Droplet, Scale, Watch, Phone, AlertTriangle,
  Wifi, Mic, MicOff, VideoOff, Monitor, MessageSquare, FileText,
  CheckSquare, Square, Clock, ChevronRight, Users, X, Maximize2,
} from "lucide-react";

export const Route = createFileRoute("/admin/telehealth")({
  head: () => ({ meta: [{ title: "Telehealth & RPM - ARCA Rx" }] }),
  component: Telehealth,
});

const WAITING = [
  { id: "w-1", patient: "Eliana Ruiz",     treatmentTrack: "hormone", reason: "HRT follow-up",    wait: "0:42", provider: "Dr. Chen",    status: "ready",     age: 45, dob: "1979-03-14", lastVisit: "2026-05-12", meds: ["Estradiol patch 0.1mg", "Progesterone 200mg"] },
  { id: "w-2", patient: "Naomi Carter",    treatmentTrack: "glp1",    reason: "Lab review",       wait: "2:18", provider: "Dr. Patel",   status: "ready",     age: 38, dob: "1988-07-22", lastVisit: "2026-05-28", meds: ["Semaglutide 1.0mg/wk", "Metformin 500mg"] },
  { id: "w-3", patient: "Harper Nakamura", treatmentTrack: "trt",     reason: "Med titration",    wait: "-",    provider: "S. Whitfield", status: "scheduled", age: 52, dob: "1974-01-09", lastVisit: "2026-04-30", meds: ["Testosterone Cyp 200mg/wk"] },
  { id: "w-4", patient: "Yusuf Aydin",     treatmentTrack: "glp1",    reason: "Post-visit check", wait: "-",    provider: "Dr. Chen",    status: "scheduled", age: 41, dob: "1985-11-03", lastVisit: "2026-06-01", meds: ["Tirzepatide 5mg/wk"] },
];

const RPM_DEVICES = [
  { kind: "BP cuff",     n: 142, active: 128, color: "text-[color:var(--teal)]",  icon: Heart   },
  { kind: "CGM",         n:  98, active:  92, color: "text-blue-400",             icon: Droplet },
  { kind: "Smart scale", n: 184, active: 156, color: "text-emerald-400",          icon: Scale   },
  { kind: "Wearable HR", n: 221, active: 198, color: "text-violet-400",           icon: Watch   },
];

const RPM_ALERTS = [
  { patient: "Eliana Ruiz",    metric: "BP",      reading: "168/102",         trend: "↑ 14d", severity: "high",   action: "Med adjust"   },
  { patient: "Marcus Kim",     metric: "Glucose", reading: "238 mg/dL",      trend: "↑ 7d",  severity: "high",   action: "Call patient" },
  { patient: "Devon Park",     metric: "HR",      reading: "108 bpm resting", trend: "↑ 3d",  severity: "medium", action: "Review meds"  },
  { patient: "Owen Pham",      metric: "Weight",  reading: "+4.2 lbs",       trend: "↑ wk",  severity: "low",    action: "Check in"     },
  { patient: "Sloane Vega",    metric: "BP",      reading: "142/88",         trend: "↑ 5d",  severity: "medium", action: "Lifestyle Rx" },
];

const PRE_CALL_CHECKLIST = [
  "Patient intake reviewed",
  "Labs reviewed (if applicable)",
  "Prior visit notes read",
  "Camera & mic tested",
  "Prescription pad ready",
];

const TRACK_COLORS: Record<string, string> = {
  glp1:       "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  trt:        "text-blue-400 border-blue-500/20 bg-blue-500/10",
  hormone:    "text-pink-400 border-pink-500/20 bg-pink-500/10",
  aesthetics: "text-violet-400 border-violet-500/20 bg-violet-500/10",
};

function VideoRoom({ patient, onClose }: { patient: typeof WAITING[0]; onClose: () => void }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [checklist, setChecklist] = useState<boolean[]>(PRE_CALL_CHECKLIST.map(() => false));
  const [soapNote, setSoapNote] = useState("");
  const [callStarted, setCallStarted] = useState(false);

  const allChecked = checklist.every(Boolean);

  function toggleCheck(i: number) {
    setChecklist((prev) => prev.map((v, idx) => idx === i ? !v : v));
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-card">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
          <span className="text-sm font-semibold">Telehealth Room</span>
          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/20">
            {callStarted ? "Live" : "Pre-call"}
          </Badge>
        </div>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main video area */}
        <div className="flex-1 bg-zinc-950 relative flex items-center justify-center">
          {/* Patient video placeholder */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground space-y-2">
              <div className="h-24 w-24 rounded-full bg-zinc-800 mx-auto flex items-center justify-center text-3xl font-bold text-zinc-600">
                {patient.patient.split(" ").map((n) => n[0]).join("")}
              </div>
              <p className="text-sm">{patient.patient}</p>
              <p className="text-xs text-zinc-600">{callStarted ? "Connected" : "Waiting for patient…"}</p>
            </div>
          </div>

          {/* Provider self-view pip */}
          <div className="absolute bottom-4 right-4 h-28 w-44 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
            {camOn ? (
              <p className="text-xs text-zinc-500">Your camera</p>
            ) : (
              <VideoOff className="h-5 w-5 text-zinc-600" />
            )}
          </div>

          {/* Controls bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-zinc-900/90 backdrop-blur rounded-xl px-4 py-2.5 border border-zinc-800">
            <button onClick={() => setMicOn((v) => !v)}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${micOn ? "bg-zinc-700 hover:bg-zinc-600" : "bg-red-600 hover:bg-red-500"}`}>
              {micOn ? <Mic className="h-4 w-4 text-white" /> : <MicOff className="h-4 w-4 text-white" />}
            </button>
            <button onClick={() => setCamOn((v) => !v)}
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${camOn ? "bg-zinc-700 hover:bg-zinc-600" : "bg-red-600 hover:bg-red-500"}`}>
              {camOn ? <Video className="h-4 w-4 text-white" /> : <VideoOff className="h-4 w-4 text-white" />}
            </button>
            <button onClick={() => toast("Screen share started")} className="h-10 w-10 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center" aria-label="Share screen">
              <Monitor className="h-4 w-4 text-white" />
            </button>
            <button onClick={() => toast("Chat panel opened")} className="h-10 w-10 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center" aria-label="Open chat">
              <MessageSquare className="h-4 w-4 text-white" />
            </button>
            {callStarted ? (
              <button onClick={() => setCallStarted(false)}
                className="h-10 px-5 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white text-sm font-medium transition-colors">
                End call
              </button>
            ) : (
              <button onClick={() => setCallStarted(true)} disabled={!allChecked}
                className={`h-10 px-5 rounded-full flex items-center gap-1.5 text-white text-sm font-medium transition-colors ${allChecked ? "bg-emerald-600 hover:bg-emerald-500" : "bg-zinc-700 cursor-not-allowed opacity-60"}`}>
                <Video className="h-4 w-4" />Start call
              </button>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-80 border-l border-border/50 bg-card flex flex-col overflow-y-auto">
          {/* Patient info */}
          <div className="p-4 border-b border-border/30 space-y-1">
            <p className="font-semibold">{patient.patient}</p>
            <p className="text-xs text-muted-foreground">DOB {patient.dob} · Age {patient.age}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="outline" className={`text-[10px] ${TRACK_COLORS[patient.treatmentTrack] ?? ""}`}>
                {patient.treatmentTrack.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">{patient.reason}</span>
            </div>
            <p className="text-xs text-muted-foreground">Last visit {patient.lastVisit}</p>
          </div>

          {/* Active meds */}
          <div className="p-4 border-b border-border/30">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Active meds</p>
            <div className="space-y-1">
              {patient.meds.map((m) => (
                <p key={m} className="text-xs flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--teal)] shrink-0" />
                  {m}
                </p>
              ))}
            </div>
          </div>

          {/* Pre-call checklist */}
          {!callStarted && (
            <div className="p-4 border-b border-border/30">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Pre-call checklist</p>
              <div className="space-y-2">
                {PRE_CALL_CHECKLIST.map((item, i) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer group">
                    <button onClick={() => toggleCheck(i)} className="shrink-0">
                      {checklist[i]
                        ? <CheckSquare className="h-4 w-4 text-[color:var(--teal)]" />
                        : <Square className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />}
                    </button>
                    <span className={`text-xs ${checklist[i] ? "line-through text-muted-foreground" : ""}`}>{item}</span>
                  </label>
                ))}
              </div>
              {!allChecked && (
                <p className="text-[10px] text-amber-400 mt-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />Complete checklist to start call
                </p>
              )}
            </div>
          )}

          {/* SOAP note */}
          <div className="p-4 flex-1 flex flex-col">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Visit note (SOAP)</p>
            <textarea
              className="flex-1 min-h-40 rounded-md border border-border bg-transparent p-2.5 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              placeholder={"S: Chief complaint...\n\nO: Vitals, exam...\n\nA: Assessment...\n\nP: Plan..."}
              value={soapNote}
              onChange={(e) => setSoapNote(e.target.value)}
            />
            <Button size="sm" className="mt-2 gradient-brand text-white h-8" disabled={!soapNote.trim()} onClick={() => { toast.success("Note saved to chart"); setSoapNote(""); }}>
              <FileText className="h-3.5 w-3.5 mr-1.5" />Save to chart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Telehealth() {
  const [activeRoom, setActiveRoom] = useState<typeof WAITING[0] | null>(null);

  if (activeRoom) {
    return <VideoRoom patient={activeRoom} onClose={() => setActiveRoom(null)} />;
  }

  return (
    <div className="p-4 md:p-8 space-y-5">
      <PageHeader
        eyebrow="Clinical"
        title="Telehealth & RPM"
        description="Virtual visit queue, pre-call checklists, and remote patient monitoring."
        actions={
          <Button size="sm" className="h-9 gradient-brand text-white" onClick={() => toast.success("Virtual room created", { description: "Share the secure link with your patient to begin the visit." })}>
            <Video className="mr-1.5 h-4 w-4" />New room
          </Button>
        }
      />

      <Tabs defaultValue="waiting">
        <TabsList>
          <TabsTrigger value="waiting">Waiting room</TabsTrigger>
          <TabsTrigger value="rpm">RPM devices</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="waiting" className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "In queue",   value: WAITING.filter(w => w.status === "ready").length.toString(),     icon: Users, accent: "text-[color:var(--teal)]" },
              { label: "Scheduled",  value: WAITING.filter(w => w.status === "scheduled").length.toString(), icon: Clock, accent: "" },
              { label: "In session", value: "1",                                                             icon: Video, accent: "text-emerald-400" },
              { label: "Completed",  value: "3",                                                             icon: Activity, accent: "" },
            ].map((s) => (
              <Card key={s.label} className="surface-elevated">
                <CardContent className="p-4 flex items-center gap-3">
                  <s.icon className={`h-5 w-5 shrink-0 ${s.accent || "text-muted-foreground"}`} />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className={`text-lg font-semibold font-mono mt-0.5 ${s.accent}`}>{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            {WAITING.map((w) => (
              <Card key={w.id} className="surface-elevated">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${w.status === "ready" ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{w.patient}</p>
                        <Badge variant="outline" className={`text-[10px] ${TRACK_COLORS[w.treatmentTrack] ?? ""}`}>
                          {w.treatmentTrack.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] ${w.status === "ready" ? "text-emerald-400 border-emerald-500/20" : "text-muted-foreground border-border"}`}>
                          {w.status === "ready" ? "Ready" : "Scheduled"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{w.reason} · {w.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {w.wait !== "-" && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />{w.wait}
                      </span>
                    )}
                    <Button size="sm" onClick={() => setActiveRoom(w)}
                      className={w.status === "ready" ? "gradient-brand text-white h-8" : "h-8"}
                      variant={w.status === "ready" ? "default" : "outline"}>
                      <Video className="h-3.5 w-3.5 mr-1.5" />
                      {w.status === "ready" ? "Join now" : "Pre-call"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rpm" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {RPM_DEVICES.map((d) => (
              <Card key={d.kind} className="surface-elevated">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <d.icon className={`h-4 w-4 ${d.color}`} />
                    <p className="text-sm font-medium">{d.kind}</p>
                  </div>
                  <p className="text-2xl font-semibold font-mono">{d.active}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    active of {d.n} enrolled
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-[color:var(--teal)]" style={{ width: `${Math.round(d.active / d.n * 100)}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4 space-y-2">
          {RPM_ALERTS.map((a, i) => (
            <Card key={i} className={`surface-elevated border-l-2 ${a.severity === "high" ? "border-l-red-500" : a.severity === "medium" ? "border-l-amber-500" : "border-l-blue-500"}`}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-4 w-4 shrink-0 ${a.severity === "high" ? "text-red-400" : a.severity === "medium" ? "text-amber-400" : "text-blue-400"}`} />
                  <div>
                    <p className="text-sm font-medium">{a.patient}</p>
                    <p className="text-xs text-muted-foreground">{a.metric}: {a.reading} <span className="text-amber-400">{a.trend}</span></p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8 shrink-0" onClick={() => toast.success(`${a.action} · ${a.patient}`, { description: `${a.metric}: ${a.reading}` })}>{a.action}</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
