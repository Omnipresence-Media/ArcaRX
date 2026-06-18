import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/billing")({
  head: () => ({ meta: [{ title: "Billing — ARCA Rx" }] }),
  component: Billing,
});

const invoices = [
  { id: "INV-10421", patient: "Eliana Ruiz",    date: "Jun 5", amount: 850,  status: "paid"  },
  { id: "INV-10420", patient: "Owen Pham",      date: "Jun 5", amount: 1280, status: "paid"  },
  { id: "INV-10419", patient: "Naomi Carter",   date: "Jun 4", amount: 289,  status: "paid"  },
  { id: "INV-10418", patient: "Mira Hollander", date: "Jun 4", amount: 1850, status: "open"  },
  { id: "INV-10417", patient: "Yusuf Aydin",    date: "Jun 3", amount: 399,  status: "paid"  },
  { id: "INV-10416", patient: "Theo Lindqvist", date: "Jun 3", amount: 1700, status: "overdue" },
];

function Billing() {
  const kpis = [
    { label: "Collected MTD", value: "$127,840" },
    { label: "Outstanding",   value: "$8,420"   },
    { label: "Overdue >30d",  value: "$1,700"   },
    { label: "Refunds",       value: "$240"     },
  ];
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader eyebrow="Revenue" title="Billing" description="Invoices, payment plans, write-offs, and Stripe reconciliation." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map(k => (
          <Card key={k.label} className="surface-elevated">
            <CardContent className="p-4">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</p>
              <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="surface-elevated">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recent invoices</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Invoice</TableHead><TableHead>Patient</TableHead><TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {invoices.map(i => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs">{i.id}</TableCell>
                  <TableCell className="font-medium">{i.patient}</TableCell>
                  <TableCell className="text-xs">{i.date}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">${i.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={
                      i.status === "paid" ? "badge-active" : i.status === "overdue" ? "badge-risk-high" : "badge-risk-med"
                    }>{i.status}</Badge>
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
