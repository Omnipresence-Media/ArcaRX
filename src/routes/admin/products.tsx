import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/seed-data";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products - ARCA Rx" }] }),
  component: Page,
});

function Page() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Catalog"
        title="Products & Services"
        description="Every billable SKU - services, memberships, retail, and bundled programs."
        actions={<Button className="gradient-brand text-white">+ New product</Button>}
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.id} className="surface-elevated">
            <CardContent className="space-y-2 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <Badge variant="secondary" className="mt-1 text-[10px]">{s.category}</Badge>
                </div>
                <p className="font-mono text-lg font-semibold tabular-nums">${s.price}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="h-7 flex-1 text-xs">Edit</Button>
                <Button size="sm" variant="outline" className="h-7 flex-1 text-xs">Analytics</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
