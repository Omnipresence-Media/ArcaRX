import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText, CheckCircle2, Clock, Send, Plus, Eye, Copy, Trash2,
  Users, Link as LinkIcon, Shield, ClipboardList, Search, ChevronRight,
} from "lucide-react";
import { patients } from "@/lib/data/patients";

export const Route = createFileRoute("/admin/intake")({
  head: () => ({ meta: [{ title: "Intake & Consent - ARCA Rx" }] }),
  component: IntakeForms,
});

type FormStatus = "draft" | "active" | "archived";
type FormCategory = "intake" | "consent" | "assessment" | "hipaa";

interface FormTemplate {
  id: string;
  name: string;
  category: FormCategory;
  status: FormStatus;
  fields: number;
  completions: number;
  lastUsed: string;
  description: string;
  treatmentTrack?: string;
}

interface PatientFormSend {
  patientId: string;
  formId: string;
  sentAt: string;
  status: "pending" | "completed" | "expired";
  completedAt?: string;
}

const FORM_TEMPLATES: FormTemplate[] = [
  { id: "f-1",  name: "New Patient Medical History",      category: "intake",     status: "active",   fields: 42, completions: 187, lastUsed: "Today",      description: "Comprehensive medical history, medications, allergies, family history.", treatmentTrack: "general" },
  { id: "f-2",  name: "HIPAA Authorization",               category: "hipaa",      status: "active",   fields: 8,  completions: 201, lastUsed: "Today",      description: "HIPAA notice of privacy practices and authorization form." },
  { id: "f-3",  name: "HRT / Hormone Therapy Consent",    category: "consent",    status: "active",   fields: 12, completions: 94,  lastUsed: "Yesterday",  description: "Informed consent covering risks, benefits, and alternatives of hormone therapy.", treatmentTrack: "hormone" },
  { id: "f-4",  name: "GLP-1 Weight Management Consent",  category: "consent",    status: "active",   fields: 14, completions: 61,  lastUsed: "Yesterday",  description: "Semaglutide / Tirzepatide consent including titration protocol and monitoring.", treatmentTrack: "glp1" },
  { id: "f-5",  name: "TRT Informed Consent",              category: "consent",    status: "active",   fields: 13, completions: 48,  lastUsed: "3d ago",     description: "Testosterone replacement therapy risks, lab monitoring schedule, and expectations.", treatmentTrack: "trt" },
  { id: "f-6",  name: "Aesthetic Injectable Consent",      category: "consent",    status: "active",   fields: 11, completions: 139, lastUsed: "Today",      description: "Botox / neurotoxin and dermal filler combined consent form.", treatmentTrack: "aesthetics" },
  { id: "f-7",  name: "Morpheus8 RF Microneedling Consent",category: "consent",   status: "active",   fields: 10, completions: 52,  lastUsed: "2d ago",     description: "Device treatment consent covering energy settings, healing, and photosensitivity.", treatmentTrack: "skincare" },
  { id: "f-8",  name: "IV Therapy / NAD+ Consent",         category: "consent",    status: "active",   fields: 9,  completions: 73,  lastUsed: "Today",      description: "Infusion therapy consent including reaction protocols and package acknowledgment.", treatmentTrack: "nad" },
  { id: "f-9",  name: "PHQ-9 Depression Screener",         category: "assessment", status: "active",   fields: 10, completions: 44,  lastUsed: "1wk ago",    description: "Standard 9-question depression screening tool with score calculation." },
  { id: "f-10", name: "GLP-1 Pre-Visit Symptom Check-in", category: "assessment", status: "active",   fields: 8,  completions: 29,  lastUsed: "3d ago",     description: "Weekly/monthly symptom check for side effects, energy, appetite, and weight.", treatmentTrack: "glp1" },
  { id: "f-11", name: "Skin Type & Concern Assessment",    category: "assessment", status: "active",   fields: 15, completions: 38,  lastUsed: "4d ago",     description: "Fitzpatrick scale, skin type quiz, concern ranking, and current skincare routine.", treatmentTrack: "skincare" },
  { id: "f-12", name: "Aesthetic Photo Consent",           category: "consent",    status: "draft",    fields: 6,  completions: 0,   lastUsed: "-",          description: "Photography consent for before/after documentation and potential use in marketing." },
];

const PENDING_SENDS: PatientFormSend[] = [
  { patientId: "pat-5",  formId: "f-1",  sentAt: "Today 9:00 AM",   status: "pending" },
  { patientId: "pat-5",  formId: "f-2",  sentAt: "Today 9:00 AM",   status: "pending" },
  { patientId: "pat-5",  formId: "f-3",  sentAt: "Today 9:00 AM",   status: "pending" },
  { patientId: "pat-11", formId: "f-4",  sentAt: "Today 8:30 AM",   status: "pending" },
  { patientId: "pat-19", formId: "f-1",  sentAt: "Yesterday",       status: "completed", completedAt: "Yesterday 6:44 PM" },
  { patientId: "pat-19", formId: "f-2",  sentAt: "Yesterday",       status: "completed", completedAt: "Yesterday 6:45 PM" },
  { patientId: "pat-17", formId: "f-6",  sentAt: "2d ago",          status: "completed", completedAt: "2d ago" },
];

const CATEGORY_STYLE: Record<FormCategory, string> = {
  intake:     "text-blue-400 border-blue-500/20 bg-blue-500/10",
  consent:    "text-violet-400 border-violet-500/20 bg-violet-500/10",
  assessment: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  hipaa:      "text-red-400 border-red-500/20 bg-red-500/10",
};

function IntakeForms() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<FormCategory | "all">("all");
  const [sendModal, setSendModal] = useState<FormTemplate | null>(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [sends, setSends] = useState(PENDING_SENDS);

  const filtered = FORM_TEMPLATES.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || f.category === filterCat;
    return matchSearch && matchCat;
  });

  const pending = sends.filter((s) => s.status === "pending");
  const completed = sends.filter((s) => s.status === "completed");

  function sendForm() {
    if (!sendModal || !selectedPatient) return;
    setSends((prev) => [...prev, {
      patientId: selectedPatient, formId: sendModal.id,
      sentAt: "Just now", status: "pending",
    }]);
    setSendModal(null);
    setSelectedPatient("");
  }

  return (
    <div className="p-4 md:p-8 space-y-5">
      <PageHeader
        eyebrow="Clinical"
        title="Intake & consent forms"
        description={`${pending.length} forms pending completion · ${completed.length} completed recently`}
        actions={
          <Button size="sm" className="h-9 gradient-brand text-white">
            <Plus className="mr-1.5 h-4 w-4" />New form
          </Button>
        }
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Active templates",  value: FORM_TEMPLATES.filter((f) => f.status === "active").length.toString(), icon: FileText },
          { label: "Pending completion",value: pending.length.toString(), icon: Clock, accent: pending.length > 0 ? "text-amber-400" : "" },
          { label: "Completed (30d)",   value: "47", icon: CheckCircle2, accent: "text-emerald-400" },
          { label: "Avg completion",    value: "4.2 min", icon: Users },
        ].map((s) => (
          <Card key={s.label} className="surface-elevated">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.accent ?? "text-muted-foreground"}`} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className={`text-lg font-semibold font-mono mt-0.5 ${s.accent ?? ""}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Templates */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search forms…" className="h-9 pl-8 text-sm" />
            </div>
            <div className="flex gap-1 rounded-md border p-1">
              {(["all", "intake", "consent", "assessment", "hipaa"] as const).map((c) => (
                <button key={c} onClick={() => setFilterCat(c)}
                  className={`px-2 py-1 text-[11px] rounded capitalize transition-colors ${filterCat === c ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((form) => (
              <Card key={form.id} className="surface-elevated hover:border-[color:var(--teal)]/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{form.name}</p>
                        <Badge variant="outline" className={`text-[10px] ${CATEGORY_STYLE[form.category]}`}>{form.category}</Badge>
                        {form.status === "draft" && <Badge variant="outline" className="text-[10px] text-muted-foreground">Draft</Badge>}
                        {form.treatmentTrack && form.treatmentTrack !== "general" && (
                          <Badge variant="secondary" className="text-[10px]">{form.treatmentTrack.toUpperCase()}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{form.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                        <span>{form.fields} fields</span>
                        <span>{form.completions} completions</span>
                        <span>Last used {form.lastUsed}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Copy className="h-3.5 w-3.5" /></Button>
                      {form.status === "active" && (
                        <Button size="sm" variant="outline" className="h-8 text-xs px-2" onClick={() => setSendModal(form)}>
                          <Send className="mr-1 h-3 w-3" />Send
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Activity panel */}
        <div className="space-y-4">
          <Card className="surface-elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" />Pending ({pending.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {pending.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">All forms completed.</p>
              ) : pending.map((s, i) => {
                const p = patients.find((x) => x.id === s.patientId);
                const form = FORM_TEMPLATES.find((f) => f.id === s.formId);
                if (!p || !form) return null;
                return (
                  <div key={i} className="rounded-md border border-amber-500/20 bg-amber-500/5 p-2.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate">{p.firstName} {p.lastName}</p>
                      <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/20">Pending</Badge>
                    </div>
                    <p className="text-muted-foreground mt-0.5 truncate">{form.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Sent {s.sentAt}</p>
                    <Button size="sm" variant="ghost" className="h-6 text-[10px] px-1 mt-1 text-[color:var(--teal)]">
                      <LinkIcon className="h-3 w-3 mr-1" />Resend link
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="surface-elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />Completed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {completed.map((s, i) => {
                const p = patients.find((x) => x.id === s.patientId);
                const form = FORM_TEMPLATES.find((f) => f.id === s.formId);
                if (!p || !form) return null;
                return (
                  <div key={i} className="flex items-center justify-between border-b border-border/30 pb-2 last:border-0 text-xs">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{p.firstName} {p.lastName}</p>
                      <p className="text-muted-foreground truncate">{form.name}</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 ml-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Send modal */}
      {sendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="surface-elevated w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Send className="h-4 w-4 text-[color:var(--teal)]" />Send form to patient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Form</p>
                <p className="text-sm font-medium">{sendModal.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Select patient</p>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full rounded-md border border-input bg-card/60 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[color:var(--teal)]"
                >
                  <option value="">Choose patient…</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} · {p.mrn}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 rounded-md border bg-card/60 p-3 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-[color:var(--teal)] shrink-0" />
                Patient will receive a secure portal link via SMS and email. HIPAA-compliant.
              </div>
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setSendModal(null)}>Cancel</Button>
                <Button size="sm" className="h-8 text-xs gradient-brand text-white" disabled={!selectedPatient} onClick={sendForm}>
                  <Send className="mr-1.5 h-3 w-3" />Send via portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
