import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatient } from "@/hooks/queries/usePatients";
import { useEncounters } from "@/hooks/queries/useEncounters";
import { useLabs } from "@/hooks/queries/useLabs";
import { usePrescriptions } from "@/hooks/queries/usePrescriptions";
import { useAppointments } from "@/hooks/queries/useAppointments";
import { useInvoices } from "@/hooks/queries/useInvoices";
import { useAuditLog } from "@/hooks/queries/useAudit";
import { getProvider } from "@/lib/data/providers";
import {
  ArrowLeft, Phone, Mail, Calendar, FileText, CreditCard, Sparkles,
  Pill, FlaskConical, Activity, Receipt, Shield, StickyNote, FolderOpen,
  CheckCircle2, Clock, AlertTriangle, TrendingUp, TrendingDown, Minus,
  Stethoscope, Zap, MessageSquare,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TreatmentPanel, TRACK_META } from "@/components/shell/TreatmentPanel";

export const Route = createFileRoute("/admin/patients/$id")({
  head: () => ({ meta: [{ title: "Patient profile - ArcaRX" }] }),
  component: PatientProfile,
});

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "encounters", label: "Encounters" },
  { id: "labs", label: "Labs" },
  { id: "prescriptions", label: "Prescriptions" },
  { id: "appointments", label: "Appointments" },
  { id: "invoices", label: "Invoices" },
  { id: "membership", label: "Membership" },
  { id: "notes", label: "Notes" },
  { id: "documents", label: "Documents" },
  { id: "activity", label: "Activity" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function flagColor(flag: string) {
  if (flag === "critical") return "text-red-400";
  if (flag === "high") return "text-amber-400";
  if (flag === "low") return "text-blue-400";
  return "text-emerald-400";
}

function statusColor(status: string) {
  if (status === "paid") return "text-emerald-400";
  if (status === "overdue") return "text-red-400";
  return "text-amber-400";
}

function PatientProfile() {
  const { id } = Route.useParams();
  const [tab, setTab] = useState<TabId>("overview");

  const { data: patient, isLoading: patientLoading } = usePatient(id);
  const { data: encounters = [], isLoading: encLoading } = useEncounters(id);
  const { data: labs = [], isLoading: labsLoading } = useLabs(id);
  const { data: prescriptions = [], isLoading: rxLoading } = usePrescriptions(id);
  const { data: appointments = [], isLoading: apptLoading } = useAppointments(id);
  const { data: invoices = [], isLoading: invLoading } = useInvoices(id);
  const { data: auditLog = [], isLoading: auditLoading } = useAuditLog(id);

  if (patientLoading) {
    return (
      <div className="space-y-5 p-4 md:p-8">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-5">
          <Skeleton className="h-64 w-80 shrink-0" />
          <Skeleton className="h-64 flex-1" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Patient not found.</p>
        <Link to="/admin/patients" className="text-[color:var(--teal)] text-sm mt-2 inline-block">Back to patients</Link>
      </div>
    );
  }

  const provider = getProvider(patient.providerId);
  const dob = new Date(patient.dob).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const age = Math.floor((Date.now() - new Date(patient.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`;
  const balance = invoices.reduce((s, i) => s + i.balance, 0);

  return (
    <div className="space-y-5 p-4 md:p-8">
      <Link to="/admin/patients" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />Back to patients
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row">
        <Card className="surface-elevated lg:w-80 shrink-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full gradient-brand flex items-center justify-center text-lg font-semibold text-white">
                {initials}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{patient.firstName} {patient.lastName}</h2>
                <p className="font-mono text-xs text-muted-foreground">{patient.mrn}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {(() => { const m = TRACK_META[patient.treatmentTrack]; return m && patient.treatmentTrack !== "general" ? <Badge variant="outline" className={`text-[10px] ${m.color}`}>{m.label}</Badge> : null; })()}
              {patient.tags.map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
              ))}
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{patient.phone}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{patient.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-3.5 w-3.5" />DOB: {dob} ({age}y)</div>
              {patient.insuranceName && (
                <div className="flex items-center gap-2 text-muted-foreground"><Shield className="h-3.5 w-3.5" />{patient.insuranceName}</div>
              )}
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              <p>PCP: {provider?.name ?? "Unassigned"}</p>
              {patient.allergies.length > 0 && (
                <p className="mt-1 text-amber-400">Allergies: {patient.allergies.join(", ")}</p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md border bg-card/60 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">LTV</p>
                <p className="mt-0.5 font-mono text-base font-semibold tabular-nums">${(patient.ltv / 1000).toFixed(1)}k</p>
              </div>
              <div className="rounded-md border bg-card/60 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Visits</p>
                <p className="mt-0.5 font-mono text-base font-semibold tabular-nums">{patient.visitCount}</p>
              </div>
              <div className="rounded-md border bg-card/60 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Balance</p>
                <p className={`mt-0.5 font-mono text-base font-semibold tabular-nums ${balance > 0 ? "text-amber-400" : ""}`}>
                  {balance > 0 ? `$${balance}` : "$0"}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button size="sm" className="w-full gradient-brand text-white"><Sparkles className="mr-1.5 h-4 w-4" />Book visit</Button>
              <Button size="sm" variant="outline" className="w-full"><CreditCard className="mr-1.5 h-4 w-4" />Charge / POS</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex flex-wrap gap-1 border-b pb-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${tab === t.id ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "overview" && <OverviewTab patient={patient} encounters={encounters} prescriptions={prescriptions} encLoading={encLoading} rxLoading={rxLoading} track={patient.treatmentTrack} />}
          {tab === "encounters" && <EncountersTab encounters={encounters} loading={encLoading} />}
          {tab === "labs" && <LabsTab labs={labs} loading={labsLoading} />}
          {tab === "prescriptions" && <PrescriptionsTab prescriptions={prescriptions} loading={rxLoading} />}
          {tab === "appointments" && <AppointmentsTab appointments={appointments} loading={apptLoading} />}
          {tab === "invoices" && <InvoicesTab invoices={invoices} loading={invLoading} />}
          {tab === "membership" && <MembershipTab patient={patient} />}
          {tab === "notes" && <NotesTab />}
          {tab === "documents" && <DocumentsTab patient={patient} />}
          {tab === "activity" && <ActivityTab events={auditLog} loading={auditLoading} />}
        </div>
      </div>
    </div>
  );
}

const VITALS_TREND: Record<string, { date: string; weight: number; bmi: number; sbp: number; dbp: number; hr: number }[]> = {
  default: [
    { date: "Jan", weight: 182, bmi: 27.4, sbp: 128, dbp: 82, hr: 74 },
    { date: "Feb", weight: 179, bmi: 26.9, sbp: 125, dbp: 80, hr: 72 },
    { date: "Mar", weight: 176, bmi: 26.5, sbp: 122, dbp: 78, hr: 70 },
    { date: "Apr", weight: 174, bmi: 26.2, sbp: 120, dbp: 76, hr: 69 },
    { date: "May", weight: 172, bmi: 25.9, sbp: 118, dbp: 75, hr: 68 },
    { date: "Jun", weight: 170, bmi: 25.6, sbp: 116, dbp: 74, hr: 67 },
  ],
};

function TrendIcon({ values }: { values: number[] }) {
  if (values.length < 2) return <Minus className="h-3 w-3 text-muted-foreground" />;
  const delta = values[values.length - 1] - values[0];
  if (Math.abs(delta) < 1) return <Minus className="h-3 w-3 text-muted-foreground" />;
  return delta < 0
    ? <TrendingDown className="h-3 w-3 text-emerald-400" />
    : <TrendingUp className="h-3 w-3 text-amber-400" />;
}

function OverviewTab({ patient, encounters, prescriptions, encLoading, rxLoading, track }: any) {
  const [noteText, setNoteText] = useState("");
  const activeRx = prescriptions.filter((r: any) => r.status === "active");
  const recentEnc = encounters.slice(0, 3);
  const vitals = VITALS_TREND.default;
  const latest = vitals[vitals.length - 1];

  const biomarkers = [
    { label: "Weight", value: `${latest.weight} lbs`, values: vitals.map((v) => v.weight), unit: "lbs", good: "down" },
    { label: "BMI", value: latest.bmi.toFixed(1), values: vitals.map((v) => v.bmi), unit: "", good: "down" },
    { label: "Systolic BP", value: `${latest.sbp}`, values: vitals.map((v) => v.sbp), unit: "mmHg", good: "down" },
    { label: "Resting HR", value: `${latest.hr}`, values: vitals.map((v) => v.hr), unit: "bpm", good: "down" },
  ];

  return (
    <div className="space-y-4">
      {/* Treatment-specific protocol panel */}
      <TreatmentPanel track={track} />

      {/* Biomarker strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {biomarkers.map((b) => {
          const delta = b.values[b.values.length - 1] - b.values[0];
          const improving = b.good === "down" ? delta < 0 : delta > 0;
          return (
            <Card key={b.label} className="surface-elevated">
              <CardContent className="p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{b.label}</p>
                <div className="flex items-end justify-between mt-1">
                  <p className="text-lg font-semibold font-mono tabular-nums">{b.value}</p>
                  <div className={`flex items-center gap-0.5 text-[10px] mb-0.5 ${improving ? "text-emerald-400" : Math.abs(delta) < 1 ? "text-muted-foreground" : "text-amber-400"}`}>
                    <TrendIcon values={b.values} />
                    {Math.abs(delta) >= 1 && <span>{Math.abs(delta).toFixed(delta % 1 === 0 ? 0 : 1)}{b.unit ? ` ${b.unit}` : ""}</span>}
                  </div>
                </div>
                <div className="mt-1.5 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={b.values.map((v, i) => ({ i, v }))}>
                      <Line type="monotone" dataKey="v" stroke={improving ? "var(--teal)" : "#fbbf24"} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Vitals chart */}
      <Card className="surface-elevated">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Blood pressure trend · 6 months</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={vitals}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[60, 145]} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="sbp" name="Systolic" stroke="var(--teal)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="dbp" name="Diastolic" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Active protocols */}
        <Card className="surface-elevated">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-[color:var(--teal)]" />Active protocols</CardTitle>
              <Button size="sm" variant="ghost" className="h-6 text-[11px] text-[color:var(--teal)] px-2">+ Prescribe</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0 text-sm">
            {rxLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              : activeRx.length === 0
              ? <p className="text-xs text-muted-foreground py-2">No active prescriptions.</p>
              : activeRx.map((rx: any) => (
                <div key={rx.id} className="flex items-center justify-between rounded-md border bg-card/60 p-2.5">
                  <div>
                    <p className="font-medium text-xs">{rx.medicationName} {rx.strength}</p>
                    <p className="text-[11px] text-muted-foreground">{rx.sig.slice(0, 55)}{rx.sig.length > 55 ? "…" : ""}</p>
                    {rx.isCompound && <span className="text-[10px] text-violet-400">Compound: {rx.compoundPharmacy}</span>}
                  </div>
                  <Badge variant="outline" className="badge-active text-[10px] ml-2 shrink-0">Active</Badge>
                </div>
              ))
            }
          </CardContent>
        </Card>

        {/* Recent encounters */}
        <Card className="surface-elevated">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5"><Stethoscope className="h-3.5 w-3.5 text-[color:var(--teal)]" />Recent encounters</CardTitle>
              <Button size="sm" variant="ghost" className="h-6 text-[11px] text-[color:var(--teal)] px-2">+ New visit</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0 text-sm">
            {encLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
              : recentEnc.length === 0
              ? <p className="text-xs text-muted-foreground py-2">No encounters on record.</p>
              : recentEnc.map((enc: any) => {
                const prov = getProvider(enc.providerId);
                const d = new Date(enc.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                return (
                  <div key={enc.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="font-medium text-xs">{enc.type}</p>
                        <p className="text-[11px] text-muted-foreground">{d} · {prov?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      <span className="font-mono text-xs tabular-nums">${enc.totalCharge}</span>
                      {enc.status === "signed" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Clock className="h-3.5 w-3.5 text-amber-400" />}
                    </div>
                  </div>
                );
              })
            }
          </CardContent>
        </Card>
      </div>

      {/* Quick note */}
      <Card className="surface-elevated">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-[color:var(--teal)]" />Quick note
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a clinical note, care instruction, or flag for the next provider…"
            rows={3}
            className="w-full rounded-md border border-input bg-card/60 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[color:var(--teal)] resize-none"
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setNoteText("")}>Clear</Button>
            <Button size="sm" className="h-7 text-xs gradient-brand text-white">Save note</Button>
          </div>
        </CardContent>
      </Card>

      {/* Patient information */}
      <Card className="surface-elevated">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Patient information</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:grid-cols-4">
            {[
              { label: "Sex", value: patient.sex === "M" ? "Male" : patient.sex === "F" ? "Female" : "Other" },
              { label: "Insurance", value: patient.insuranceName ?? "Self-pay" },
              { label: "Member ID", value: patient.insuranceMemberId ?? "N/A" },
              { label: "Location", value: patient.locationId === "loc-atx" ? "Austin" : patient.locationId === "loc-dal" ? "Dallas" : "Nashville" },
              { label: "Address", value: `${patient.address}, ${patient.city}, ${patient.state} ${patient.zip}` },
              { label: "Emergency contact", value: patient.emergencyContactName ?? "Not on file" },
              { label: "Emergency phone", value: patient.emergencyContactPhone ?? "Not on file" },
              { label: "Member since", value: patient.membershipSince ? new Date(patient.membershipSince).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Non-member" },
            ].map((item) => (
              <div key={item.label} className="py-1 border-b border-border/40">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="text-xs mt-0.5 font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EncountersTab({ encounters, loading }: any) {
  if (loading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>;
  if (encounters.length === 0) return <EmptyState icon={FileText} label="No encounters on record." />;

  return (
    <div className="space-y-3">
      {encounters.map((enc: any) => {
        const prov = getProvider(enc.providerId);
        const d = new Date(enc.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        return (
          <Card key={enc.id} className="surface-elevated">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">{enc.type}</p>
                    <Badge variant="outline" className={`text-[10px] ${enc.status === "signed" ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20"}`}>
                      {enc.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{d} · {prov?.name} · {enc.duration} min</p>
                  <p className="text-xs text-muted-foreground font-medium">Chief complaint</p>
                  <p className="text-xs mt-0.5 mb-2">{enc.chiefComplaint}</p>
                  <p className="text-xs text-muted-foreground font-medium">Assessment</p>
                  <p className="text-xs mt-0.5 line-clamp-2">{enc.assessment}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {enc.icdCodes.map((c: any) => (
                      <span key={c.code} className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">{c.code} {c.description}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-semibold">${enc.totalCharge}</p>
                  {enc.signedAt && <p className="text-[10px] text-muted-foreground mt-1">Signed {new Date(enc.signedAt).toLocaleDateString()}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function LabsTab({ labs, loading }: any) {
  if (loading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>;
  if (labs.length === 0) return <EmptyState icon={FlaskConical} label="No lab results on file." />;

  return (
    <div className="space-y-4">
      {labs.map((panel: any) => {
        const d = new Date(panel.resultDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
        const flagged = panel.results.filter((r: any) => r.flag !== "ok");
        return (
          <Card key={panel.id} className="surface-elevated">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{panel.panelName}</CardTitle>
                <div className="flex items-center gap-2">
                  {flagged.length > 0 && <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/20">{flagged.length} flagged</Badge>}
                  <span className="text-xs text-muted-foreground">{d}</span>
                </div>
              </div>
              {panel.notes && <p className="text-xs text-muted-foreground mt-1">{panel.notes}</p>}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1.5">
                {panel.results.map((r: any) => {
                  const pct = Math.max(0, Math.min(100, ((r.value - r.refLow * 0.7) / (r.refHigh * 1.3 - r.refLow * 0.7)) * 100));
                  return (
                    <div key={r.name} className="grid grid-cols-[160px_1fr_80px_60px] items-center gap-3 py-1 border-b border-border/30 last:border-0">
                      <span className="text-xs font-medium truncate">{r.name}</span>
                      <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="absolute h-full bg-muted-foreground/20 rounded-full"
                          style={{ left: `${((r.refLow - r.refLow * 0.7) / (r.refHigh * 1.3 - r.refLow * 0.7)) * 100}%`, width: `${((r.refHigh - r.refLow) / (r.refHigh * 1.3 - r.refLow * 0.7)) * 100}%` }}
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full -translate-x-1/2"
                          style={{ left: `${pct}%`, background: r.flag === "ok" ? "var(--success, #4ade80)" : r.flag === "critical" ? "#f87171" : "#fbbf24" }}
                        />
                      </div>
                      <span className={`font-mono text-xs text-right tabular-nums ${flagColor(r.flag)}`}>{r.value} {r.unit}</span>
                      <span className="text-[10px] text-muted-foreground text-right">{r.refLow}–{r.refHigh}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function PrescriptionsTab({ prescriptions, loading }: any) {
  if (loading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;
  if (prescriptions.length === 0) return <EmptyState icon={Pill} label="No prescriptions on file." />;

  const active = prescriptions.filter((r: any) => r.status === "active");
  const other = prescriptions.filter((r: any) => r.status !== "active");

  return (
    <div className="space-y-4">
      {active.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Active ({active.length})</p>
          <div className="space-y-2">
            {active.map((rx: any) => <RxCard key={rx.id} rx={rx} />)}
          </div>
        </div>
      )}
      {other.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Historical ({other.length})</p>
          <div className="space-y-2">
            {other.map((rx: any) => <RxCard key={rx.id} rx={rx} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function RxCard({ rx }: { rx: any }) {
  const expiry = new Date(rx.expirationDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const lastFilled = rx.lastFilledDate ? new Date(rx.lastFilledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Not yet filled";
  return (
    <Card className="surface-elevated">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm">{rx.medicationName} {rx.strength}</p>
              {rx.isCompound && <Badge variant="outline" className="text-[10px] text-violet-400 border-violet-500/20">Compound</Badge>}
              {rx.controlled && <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/20">Schedule {rx.scheduleClass}</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{rx.form} · {rx.sig}</p>
            <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              <span>Qty: {rx.quantity} · Refills: {rx.refillsRemaining}/{rx.refills}</span>
              <span>Last filled: {lastFilled}</span>
              <span>Exp: {expiry}</span>
              {rx.compoundPharmacy && <span className="text-violet-400">{rx.compoundPharmacy}</span>}
            </div>
          </div>
          <Badge variant="outline" className={`text-[10px] shrink-0 ${rx.status === "active" ? "text-emerald-400 border-emerald-500/20" : "text-muted-foreground"}`}>
            {rx.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentsTab({ appointments, loading }: any) {
  if (loading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;
  if (appointments.length === 0) return <EmptyState icon={Calendar} label="No appointments on record." />;

  const upcoming = appointments.filter((a: any) => a.status === "scheduled" || a.status === "checked-in" || a.status === "in-room");
  const past = appointments.filter((a: any) => a.status === "completed" || a.status === "no-show" || a.status === "cancelled");

  const ApptRow = ({ a }: { a: any }) => {
    const prov = getProvider(a.providerId);
    const d = new Date(a.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const statusStyle = a.status === "completed" ? "text-emerald-400" : a.status === "no-show" ? "text-red-400" : a.status === "cancelled" ? "text-muted-foreground" : "text-[color:var(--teal)]";
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
        <div>
          <p className="text-sm font-medium">{a.type}</p>
          <p className="text-xs text-muted-foreground">{d} at {a.time} · {prov?.name} · {a.duration}m</p>
        </div>
        <Badge variant="outline" className={`text-[10px] ${statusStyle}`}>{a.status}</Badge>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {upcoming.length > 0 && (
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Upcoming ({upcoming.length})</CardTitle></CardHeader>
          <CardContent className="pt-0">{upcoming.map((a: any) => <ApptRow key={a.id} a={a} />)}</CardContent>
        </Card>
      )}
      {past.length > 0 && (
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm">History ({past.length})</CardTitle></CardHeader>
          <CardContent className="pt-0">{past.map((a: any) => <ApptRow key={a.id} a={a} />)}</CardContent>
        </Card>
      )}
    </div>
  );
}

function InvoicesTab({ invoices, loading }: any) {
  if (loading) return <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;
  if (invoices.length === 0) return <EmptyState icon={Receipt} label="No invoices on file." />;

  const totalBilled = invoices.reduce((s: number, i: any) => s + i.total, 0);
  const totalPaid = invoices.reduce((s: number, i: any) => s + i.paid, 0);
  const outstanding = invoices.reduce((s: number, i: any) => s + i.balance, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total billed", value: `$${totalBilled.toLocaleString()}` },
          { label: "Total paid", value: `$${totalPaid.toLocaleString()}`, accent: "text-emerald-400" },
          { label: "Outstanding", value: `$${outstanding.toLocaleString()}`, accent: outstanding > 0 ? "text-amber-400" : "" },
        ].map((s) => (
          <Card key={s.label} className="surface-elevated">
            <CardContent className="p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className={`font-mono text-lg font-semibold mt-0.5 ${s.accent ?? ""}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        {invoices.map((inv: any) => {
          const d = new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          return (
            <Card key={inv.id} className="surface-elevated">
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{inv.id.toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground">{d}</span>
                      <Badge variant="outline" className={`text-[10px] ${statusColor(inv.status)}`}>{inv.status}</Badge>
                    </div>
                    {inv.lineItems.map((li: any, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground">{li.description}</p>
                    ))}
                    {inv.paymentMethod && <p className="text-[11px] text-muted-foreground mt-1">{inv.paymentMethod}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-semibold">${inv.total}</p>
                    {inv.balance > 0 && <p className="text-[11px] text-amber-400">Due: ${inv.balance}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function MembershipTab({ patient }: any) {
  const since = patient.membershipSince
    ? new Date(patient.membershipSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  if (patient.membershipTier === "None") {
    return (
      <Card className="surface-elevated">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground text-sm mb-3">This patient is not currently a member.</p>
          <Button size="sm" className="gradient-brand text-white">Enroll in membership</Button>
        </CardContent>
      </Card>
    );
  }

  const plans: Record<string, { price: number; perks: string[] }> = {
    Platinum: { price: 299, perks: ["Unlimited visits", "20% off all treatments", "Priority scheduling", "Annual comprehensive labs", "Monthly NAD+ IV included", "Dedicated care coordinator"] },
    Gold: { price: 149, perks: ["12 visits/year", "10% off treatments", "Priority scheduling", "Annual wellness labs", "Quarterly body composition scan"] },
    Silver: { price: 79, perks: ["6 visits/year", "5% off treatments", "Standard scheduling", "Annual basic labs"] },
  };

  const plan = plans[patient.membershipTier];

  return (
    <div className="space-y-4">
      <Card className="surface-elevated">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold">{patient.membershipTier} Membership</p>
              <p className="text-sm text-muted-foreground">Member since {since}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-mono font-semibold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/20">Active</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {plan.perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                {perk}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline">Pause membership</Button>
            <Button size="sm" variant="outline" className="text-red-400 border-red-500/20 hover:bg-red-500/10">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotesTab() {
  return (
    <Card className="surface-elevated">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Internal notes</p>
          <Button size="sm" variant="outline"><StickyNote className="mr-1.5 h-3.5 w-3.5" />Add note</Button>
        </div>
        <div className="space-y-3">
          {[
            { author: "Dr. Chen", date: "Jun 12, 2026", note: "Patient prefers afternoon appointments. Anxious about injections, go slow on first pass. Has responded well to topical numbing." },
            { author: "Front Desk", date: "Jun 1, 2026", note: "Patient's preferred contact is text. Do not leave voicemails. Her partner Carlos handles scheduling calls." },
          ].map((n, i) => (
            <div key={i} className="rounded-md border bg-card/60 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">{n.author}</span>
                <span className="text-[11px] text-muted-foreground">{n.date}</span>
              </div>
              <p className="text-xs text-muted-foreground">{n.note}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentsTab({ patient }: any) {
  const docs = [
    { name: "HIPAA Authorization", date: patient.createdAt, status: "signed" },
    { name: "Informed Consent - Hormone Therapy", date: "2025-09-15", status: "signed" },
    { name: "Informed Consent - Filler Treatment", date: "2026-06-05", status: "signed" },
    { name: "Intake Form - Medical History", date: patient.createdAt, status: "signed" },
    { name: "Insurance Card (front/back)", date: patient.createdAt, status: "on file" },
    { name: "Annual Lab Authorization", date: "2026-01-10", status: "signed" },
  ];

  return (
    <Card className="surface-elevated">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Documents ({docs.length})</CardTitle>
          <Button size="sm" variant="outline"><FolderOpen className="mr-1.5 h-3.5 w-3.5" />Upload</Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-1.5">
        {docs.map((d) => {
          const dt = new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          return (
            <div key={d.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground">{dt}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/20">{d.status}</Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ActivityTab({ events, loading }: any) {
  if (loading) return <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>;
  if (events.length === 0) return <EmptyState icon={Activity} label="No audit events recorded." />;

  return (
    <Card className="surface-elevated">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">PHI access audit log</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-1">
        {events.map((e: any) => {
          const dt = new Date(e.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
          return (
            <div key={e.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div>
                <p className="text-xs font-medium">{e.action}</p>
                <p className="text-[11px] text-muted-foreground">{e.userName} · {e.resource}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">{dt}</p>
                <p className="text-[10px] font-mono text-muted-foreground/60">{e.ipAddress}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function EmptyState({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
      <Icon className="h-8 w-8 opacity-30" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
