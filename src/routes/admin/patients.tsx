import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { usePatients, usePatientStats } from "@/hooks/queries/usePatients";
import { Plus, Search, Filter, Download, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/patients")({
  head: () => ({ meta: [{ title: "Patients — ArcaRX" }] }),
  component: PatientsPage,
});

const FILTERS = ["All", "Members", "High risk", "High value", "New"] as const;
type Filter = (typeof FILTERS)[number];

function riskBadge(r: string) {
  return r === "high" ? "badge-risk-high" : r === "med" ? "badge-risk-med" : "badge-risk-low";
}

function memberBadge(tier: string) {
  if (tier === "Platinum") return "bg-violet-500/10 text-violet-400 border-violet-500/20";
  if (tier === "Gold") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (tier === "Silver") return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  return "bg-muted text-muted-foreground";
}

function PatientsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  const { data: stats, isLoading: statsLoading } = usePatientStats();
  const { data: allPatients = [], isLoading: patientsLoading } = usePatients({ search });

  const filtered = allPatients.filter((p) => {
    if (activeFilter === "Members") return p.membershipTier !== "None";
    if (activeFilter === "High risk") return p.risk === "high";
    if (activeFilter === "High value") return p.ltv >= 10000;
    if (activeFilter === "New") return p.visitCount <= 2;
    return true;
  });

  const statCards = [
    { label: "Total patients", value: statsLoading ? null : stats!.total.toLocaleString() },
    { label: "Active members", value: statsLoading ? null : stats!.members.toLocaleString() },
    { label: "New this month", value: statsLoading ? null : `+${stats!.thisMonth}` },
    { label: "Avg LTV", value: statsLoading ? null : `$${stats!.avgLtv.toLocaleString()}` },
  ];

  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Clients"
        title="Patients"
        description="Search, segment, and triage your roster across all locations."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9"><Download className="mr-1.5 h-4 w-4" />Export</Button>
            <Button size="sm" className="h-9 gradient-brand text-white"><Plus className="mr-1.5 h-4 w-4" />Add patient</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="surface-elevated">
            <CardContent className="p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
              {s.value === null
                ? <Skeleton className="mt-2 h-7 w-20" />
                : <p className="mt-1.5 text-2xl font-semibold tabular-nums">{s.value}</p>
              }
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, MRN, phone, email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9"><Filter className="mr-1.5 h-4 w-4" />Filters</Button>
            {FILTERS.map((t) => (
              <Badge
                key={t}
                variant={activeFilter === t ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setActiveFilter(t)}
              >
                {t}
              </Badge>
            ))}
          </div>

          {patientsLoading ? (
            <div className="space-y-2 pt-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <AlertCircle className="h-8 w-8 opacity-40" />
              <p className="text-sm">No patients found{search ? ` for "${search}"` : ""}.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Last visit</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">LTV</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const locLabel = p.locationId === "loc-atx" ? "Austin" : p.locationId === "loc-dal" ? "Dallas" : "Nashville";
                  const lastVisit = new Date(p.lastVisitDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  return (
                    <TableRow key={p.id} className="cursor-pointer">
                      <TableCell>
                        <Link to="/admin/patients/$id" params={{ id: p.id }} className="font-medium hover:text-[color:var(--teal)]">
                          {p.firstName} {p.lastName}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{p.mrn}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{lastVisit}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${memberBadge(p.membershipTier)}`}>
                          {p.membershipTier === "None" ? "No plan" : p.membershipTier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{locLabel}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">${p.ltv.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {p.balance > 0 ? <span className="text-amber-400">${p.balance}</span> : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={riskBadge(p.risk)}>{p.risk}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {!patientsLoading && (
            <p className="text-right text-xs text-muted-foreground pt-1">
              Showing {filtered.length} of {allPatients.length} patients
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
