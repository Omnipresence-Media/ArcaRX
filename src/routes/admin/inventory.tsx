import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inventory } from "@/lib/seed-data";
import { Plus, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({ meta: [{ title: "Inventory — ARCA Rx" }] }),
  component: Inventory,
});

function Inventory() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Operations"
        title="Inventory"
        description="Live counts across 3 locations · 2 SKUs below par."
        actions={<Button size="sm" className="h-9 gradient-brand text-white"><Plus className="mr-1.5 h-4 w-4" />Receive PO</Button>}
      />
      <Card className="surface-elevated">
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead><TableHead>Name</TableHead>
                <TableHead className="text-right">On hand</TableHead>
                <TableHead className="text-right">Par</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Unit cost</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map(i => {
                const low = i.onHand < i.par * 0.5;
                return (
                  <TableRow key={i.id}>
                    <TableCell className="font-mono text-xs">{i.sku}</TableCell>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{i.onHand}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums text-muted-foreground">{i.par}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{i.supplier}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">${i.cost}</TableCell>
                    <TableCell className="text-right">
                      {low ? <Badge variant="outline" className="badge-risk-high"><AlertTriangle className="mr-1 h-3 w-3" />Low</Badge>
                           : <Badge variant="outline" className="badge-active">OK</Badge>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
