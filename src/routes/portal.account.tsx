import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Smartphone, LogOut, Pencil, FileText } from "lucide-react";
import { patient, consents, devices } from "@/features/portal/mockData";

export const Route = createFileRoute("/portal/account")({
  head: () => ({ meta: [{ title: "Account - ARCA Rx Portal" }] }),
  component: Account,
});

function Account() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Profile, insurance, consents, and connected devices.</p>
      </div>

      {/* Profile */}
      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-brand text-xl font-semibold text-white">
                {patient.avatarInitials}
              </div>
              <div>
                <p className="text-lg font-semibold">{patient.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{patient.mrn} · DOB {patient.dob}</p>
                <p className="mt-1 text-xs text-muted-foreground">{patient.email} · {patient.phone}</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs"><Pencil className="mr-1 h-3.5 w-3.5" />Edit</Button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border bg-card/60 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Primary provider</p>
              <p className="mt-0.5 text-sm font-medium">{patient.primaryProvider}</p>
              <p className="text-[11px] text-muted-foreground">{patient.carePod}</p>
            </div>
            <div className="rounded-md border bg-card/60 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Member since</p>
              <p className="mt-0.5 text-sm font-medium">{patient.memberSince}</p>
              <p className="text-[11px] text-muted-foreground">{patient.membership}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance */}
      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Insurance</p>
            <Button size="sm" variant="ghost" className="h-8 text-xs"><Pencil className="mr-1 h-3.5 w-3.5" />Update</Button>
          </div>
          <div className="mt-3 rounded-lg border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-white">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Payer</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">PPO</p>
            </div>
            <p className="mt-1 text-lg font-semibold">{patient.insurance.payer}</p>
            <div className="mt-4 flex justify-between font-mono text-sm">
              <div>
                <p className="text-[10px] uppercase text-white/60">Member ID</p>
                <p>{patient.insurance.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/60">Group</p>
                <p>{patient.insurance.group}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consents */}
      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[color:var(--teal)]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Consents & documents</p>
          </div>
          <div className="mt-3 space-y-2">
            {consents.map((c) => (
              <div key={c.name} className="flex items-center justify-between rounded-md border bg-card/60 px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">Signed {c.signedOn}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-[color:var(--success)]/40 text-[color:var(--success)]">Current</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Devices */}
      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-[color:var(--teal)]" />
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connected devices</p>
          </div>
          <div className="mt-3 space-y-2">
            {devices.map((d) => (
              <div key={d.name} className="flex items-center justify-between rounded-md border bg-card/60 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-[11px] text-muted-foreground">{d.last}</p>
                </div>
                {d.status === "connected" ? (
                  <Badge className="badge-active">Connected</Badge>
                ) : (
                  <Button size="sm" variant="outline" className="h-7 text-xs">Connect</Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full text-[color:var(--danger)] hover:bg-[color:color-mix(in_oklab,var(--danger)_8%,transparent)]">
        <LogOut className="mr-2 h-4 w-4" />Sign out
      </Button>
    </div>
  );
}
