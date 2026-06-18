import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, AlertTriangle, CheckCircle2, Lock, Eye, Download, Users, FileKey, Bell, Server } from "lucide-react";
import { useAuditLog } from "@/hooks/queries/useAudit";
import { patients } from "@/lib/data/patients";

export const Route = createFileRoute("/admin/hipaa")({
  head: () => ({ meta: [{ title: "HIPAA Compliance — ArcaRX" }] }),
  component: Hipaa,
});

const ROLES = [
  {
    role: "Medical Director",
    users: ["Dr. Amelia Chen"],
    permissions: ["All patient records", "Prescribe", "Sign encounters", "Admin panel", "Billing", "User management"],
    badge: "Physician",
  },
  {
    role: "Provider (MD/NP)",
    users: ["Dr. Marcus Patel", "Sara Whitfield NP", "Dr. James Osei"],
    permissions: ["Assigned patients", "Prescribe", "Sign encounters", "Lab orders"],
    badge: "Clinical",
  },
  {
    role: "Billing Coordinator",
    users: ["Jordan Lee", "Maria Santos"],
    permissions: ["Invoice records", "Insurance verification", "Payment processing", "No clinical notes"],
    badge: "Billing",
  },
  {
    role: "Front Desk",
    users: ["Taylor Kim", "Chris Rivera"],
    permissions: ["Appointment scheduling", "Check-in", "Demographic updates", "No medication data"],
    badge: "Admin",
  },
  {
    role: "Read-Only Auditor",
    users: ["Compliance@ArcaRX"],
    permissions: ["Audit log only", "No PHI access", "Export reports"],
    badge: "Audit",
  },
];

const SAFEGUARDS = [
  { section: "§164.312(a)(1)", title: "Access control", status: "pass", detail: "Unique user ID, emergency access procedure, auto-logoff 15min, encryption/decryption" },
  { section: "§164.312(b)", title: "Audit controls", status: "pass", detail: "Hardware/software/procedural mechanisms to record and examine access — active" },
  { section: "§164.312(c)(1)", title: "Integrity controls", status: "pass", detail: "PHI not improperly altered or destroyed — SHA-256 checksums on all records" },
  { section: "§164.312(d)", title: "Person/entity authentication", status: "pass", detail: "MFA enforced for all clinical users. SSO via enterprise IdP" },
  { section: "§164.312(e)(1)", title: "Transmission security", status: "pass", detail: "TLS 1.3 in transit, AES-256 at rest. All PHI encrypted end-to-end" },
  { section: "§164.308(a)(5)", title: "Security awareness training", status: "warn", detail: "2 of 11 staff members have not completed 2026 HIPAA refresher — due Jun 30" },
  { section: "§164.308(a)(6)", title: "Security incident procedures", status: "pass", detail: "Incident response plan updated 2026-03-01. BAA with all vendors current" },
  { section: "§164.308(a)(7)", title: "Contingency plan", status: "pass", detail: "Backup daily to geo-redundant storage. RTO 4h, RPO 1h. DR tested 2026-04-15" },
];

const UPCOMING = [
  { title: "HIPAA annual training deadline", due: "Jun 30, 2026", urgent: true, affected: "2 staff members" },
  { title: "BAA renewal — Quest Diagnostics", due: "Jul 15, 2026", urgent: false, affected: "Lab integrations" },
  { title: "Penetration test (annual)", due: "Aug 1, 2026", urgent: false, affected: "All systems" },
  { title: "Risk assessment review", due: "Sep 1, 2026", urgent: false, affected: "HIPAA Security Officer" },
];

function Hipaa() {
  const [attested, setAttested] = useState(false);
  const [attestCheck, setAttestCheck] = useState(false);
  const { data: auditEvents = [], isLoading } = useAuditLog();

  const passCount = SAFEGUARDS.filter(s => s.status === "pass").length;
  const warnCount = SAFEGUARDS.filter(s => s.status === "warn").length;

  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Compliance · Security"
        title="HIPAA compliance center"
        description="Tamper-evident audit trail · access controls · technical safeguards · RBAC · 30-day PHI retention with nightly cold storage export."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9"><Download className="mr-1.5 h-4 w-4" />Export log</Button>
            {!attested
              ? null
              : <Badge variant="outline" className="h-9 px-3 text-emerald-400 border-emerald-500/20 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />Annual attestation complete · 2026
                </Badge>
            }
          </div>
        }
      />

      {/* Compliance score cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Technical safeguards", value: `${passCount}/${SAFEGUARDS.length}`, sub: "requirements passed", icon: ShieldCheck, ok: warnCount === 0 },
          { label: "Access events · 7d", value: "12,847", sub: "logged events", icon: Eye, ok: true },
          { label: "Failed auth attempts", value: "0", sub: "last 30 days", icon: Lock, ok: true },
          { label: "PHI exports", value: "284", sub: "last 7 days · tracked", icon: FileKey, ok: true },
        ].map(s => (
          <Card key={s.label} className="surface-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.ok ? "text-emerald-400" : "text-amber-400"}`} />
              </div>
              <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming tasks alert */}
      {UPCOMING.some(u => u.urgent) && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-400">Action required</p>
            {UPCOMING.filter(u => u.urgent).map(u => (
              <p key={u.title} className="text-xs text-muted-foreground">{u.title} — due {u.due} · {u.affected}</p>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="audit"><Eye className="mr-1.5 h-3.5 w-3.5" />Audit trail</TabsTrigger>
          <TabsTrigger value="safeguards"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Technical safeguards</TabsTrigger>
          <TabsTrigger value="rbac"><Users className="mr-1.5 h-3.5 w-3.5" />RBAC · roles</TabsTrigger>
          <TabsTrigger value="tasks"><Bell className="mr-1.5 h-3.5 w-3.5" />Compliance tasks</TabsTrigger>
        </TabsList>

        {/* AUDIT LOG */}
        <TabsContent value="audit">
          <Card className="surface-elevated">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <CardTitle className="text-sm font-semibold">PHI access audit log</CardTitle>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-[10px]">SHA-256 verified</Badge>
                <Button variant="outline" size="sm" className="h-7 text-xs"><Download className="mr-1 h-3 w-3" />Export CSV</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-0">
              {isLoading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading audit events...</div>
              ) : auditEvents.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No audit events found.</div>
              ) : auditEvents.map((e) => {
                const pat = patients.find(p => p.id === e.patientId);
                return (
                  <div key={e.id} className="flex items-center justify-between border-b py-3 text-sm last:border-0 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate">
                        <span className="font-medium">{e.userName}</span>
                        {" "}<span className="text-muted-foreground">{e.action}</span>
                        {" "}<span className="text-[color:var(--resource)]">{e.resource}</span>
                        {pat && <span className="text-muted-foreground"> · {pat.firstName} {pat.lastName}</span>}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        IP {e.ipAddress} · {new Date(e.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/20 shrink-0">verified</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TECHNICAL SAFEGUARDS */}
        <TabsContent value="safeguards">
          <div className="space-y-3">
            {SAFEGUARDS.map((s) => (
              <div key={s.section} className={`flex items-start gap-3 rounded-lg border p-4 ${s.status === "pass" ? "bg-card" : "border-amber-500/20 bg-amber-500/5"}`}>
                {s.status === "pass"
                  ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  : <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{s.title}</p>
                    <Badge variant="outline" className="font-mono text-[10px]">{s.section}</Badge>
                    <Badge variant="outline" className={`text-[10px] ${s.status === "pass" ? "text-emerald-400 border-emerald-500/20" : "text-amber-400 border-amber-500/20"}`}>
                      {s.status === "pass" ? "Pass" : "Action needed"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* RBAC */}
        <TabsContent value="rbac">
          <div className="space-y-3">
            {ROLES.map((r) => (
              <Card key={r.role} className="surface-elevated">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium text-sm">{r.role}</p>
                        <Badge variant="outline" className="text-[10px]">{r.badge}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {r.permissions.map(p => (
                          <span key={p} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{p}</span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {r.users.map(u => (
                          <span key={u} className="flex items-center gap-1 rounded-full border bg-card px-2 py-0.5 text-[11px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{u}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs shrink-0">Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* COMPLIANCE TASKS */}
        <TabsContent value="tasks">
          <div className="space-y-3">
            {UPCOMING.map((u) => (
              <div key={u.title} className={`flex items-center justify-between rounded-lg border p-4 gap-3 ${u.urgent ? "border-amber-500/20 bg-amber-500/5" : "bg-card"}`}>
                <div className="flex items-start gap-3">
                  {u.urgent
                    ? <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    : <Bell className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  }
                  <div>
                    <p className="text-sm font-medium">{u.title}</p>
                    <p className="text-xs text-muted-foreground">Due {u.due} · {u.affected}</p>
                  </div>
                </div>
                <Button size="sm" variant={u.urgent ? "default" : "outline"} className={`h-7 text-xs shrink-0 ${u.urgent ? "gradient-brand text-white" : ""}`}>
                  {u.urgent ? "Resolve" : "Schedule"}
                </Button>
              </div>
            ))}

            {/* Annual attestation */}
            <Card className={`surface-elevated border ${attested ? "border-emerald-500/30" : "border-border"}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Server className={`h-5 w-5 shrink-0 mt-0.5 ${attested ? "text-emerald-400" : "text-muted-foreground"}`} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Annual HIPAA attestation · 2026</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      By submitting this attestation, I confirm that ArcaRX has implemented and maintains all required HIPAA Security Rule technical, physical, and administrative safeguards as of June 18, 2026. I have reviewed all policies and procedures and certify compliance to the best of my knowledge.
                    </p>
                    {!attested && (
                      <label className="mt-3 flex items-center gap-2 cursor-pointer text-xs">
                        <input type="checkbox" checked={attestCheck} onChange={e => setAttestCheck(e.target.checked)} className="h-4 w-4" />
                        I am the covered entity's HIPAA Security Officer or designee and I understand my attestation is a legally binding declaration.
                      </label>
                    )}
                    <div className="mt-3">
                      {attested
                        ? <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 flex items-center gap-1.5 w-fit">
                            <CheckCircle2 className="h-3.5 w-3.5" />Attested · Dr. Amelia Chen · Jun 18, 2026
                          </Badge>
                        : <Button
                            size="sm"
                            className="h-8 gradient-brand text-white"
                            disabled={!attestCheck}
                            onClick={() => setAttested(true)}
                          >
                            <ShieldCheck className="mr-1.5 h-4 w-4" />Submit attestation
                          </Button>
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
