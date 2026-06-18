import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mrrSeries, membershipMix } from "@/lib/seed-data";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { Plus, Crown } from "lucide-react";

export const Route = createFileRoute("/admin/memberships")({
  head: () => ({ meta: [{ title: "Memberships — ARCA Rx" }] }),
  component: Memberships,
});

const plans = [
  { tier: "Platinum", price: 299, members: 218, perks: ["10 units neurotoxin/mo","1 IV/mo","20% off products","Priority booking"] },
  { tier: "Gold",     price: 149, members: 384, perks: ["5 units neurotoxin/mo","Quarterly HydraFacial","15% off products"] },
  { tier: "Silver",   price:  79, members: 245, perks: ["Quarterly skincare consult","10% off all services"] },
];

function Memberships() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Clients"
        title="Memberships"
        description="847 active members generating $48,279 MRR · 96.4% trailing retention."
        actions={<Button size="sm" className="h-9 gradient-brand text-white"><Plus className="mr-1.5 h-4 w-4" />New plan</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="surface-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">MRR · last 12 months</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mrrSeries} margin={{ left: -10 }}>
                <defs>
                  <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickFormatter={v=>`$${v/1000}k`} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="mrr" stroke="var(--chart-2)" strokeWidth={2} fill="url(#mrr)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="surface-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Member growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={mrrSeries} margin={{ left: -10 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="members" fill="var(--teal)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((p,i) => (
          <Card key={p.tier} className={`surface-elevated relative ${i===0?"ring-1 ring-[color:var(--teal)]/40":""}`}>
            {i===0 && <Badge className="absolute -top-2 right-4 gradient-brand text-white border-0">Most popular</Badge>}
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-[color:var(--warning)]" />
                <h3 className="text-base font-semibold">{p.tier}</h3>
              </div>
              <p className="mt-3 font-mono text-3xl font-semibold tabular-nums">
                ${p.price}<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="text-xs text-muted-foreground">{p.members} active members</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {p.perks.map(perk => (
                  <li key={perk} className="flex gap-2"><span className="text-[color:var(--teal)]">✓</span>{perk}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
