import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { patients } from "@/lib/seed-data";
import { Plus, Search, Filter, Download } from "lucide-react";

export const Route = createFileRoute("/admin/patients")({
  head: () => ({ meta: [{ title: "Patients — ARCA Rx" }] }),
  component: PatientsPage,
});

function riskBadge(r: string) {
  return r === "high" ? "badge-risk-high" : r === "med" ? "badge-risk-med" : "badge-risk-low";
}

function PatientsPage() {
  const stats = [
    { label: "Total patients", value: "2,147" },
    { label: "Active members", value: "847" },
    { label: "New this month", value: "+62" },
    { label: "Avg LTV", value: "$8,420" },
  ];
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Clients"
        title="Patients"
        description="Search, segment, and triage your roster. 2,147 records across 3 locations."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9"><Download className="mr-1.5 h-4 w-4" />Export</Button>
            <Button size="sm" className="h-9 gradient-brand text-white"><Plus className="mr-1.5 h-4 w-4" />Add patient</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="surface-elevated">
            <CardContent className="p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1.5 text-2xl font-semibold tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, MRN, phone, email..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm" className="h-9"><Filter className="mr-1.5 h-4 w-4" />Filters</Button>
            {["All","Members","Active","High value","At risk"].map((t,i) => (
              <Badge key={t} variant={i===0?"default":"outline"} className="cursor-pointer">{t}</Badge>
            ))}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>MRN</TableHead>
                <TableHead>Last visit</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">LTV</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map(p => (
                <TableRow key={p.id} className="cursor-pointer">
                  <TableCell>
                    <Link to="/admin/patients/$id" params={{ id: p.id }} className="font-medium hover:text-[color:var(--teal)]">{p.name}</Link>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.mrn}</TableCell>
                  <TableCell className="text-xs">{p.lastVisit}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{p.tag}</Badge></TableCell>
                  <TableCell className="text-right font-mono tabular-nums">${p.ltv.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{p.balance > 0 ? `$${p.balance}` : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={riskBadge(p.risk)}>{p.risk}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
