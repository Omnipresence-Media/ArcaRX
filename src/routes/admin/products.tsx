import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateModal } from "@/components/shell/CreateButton";
import { services } from "@/lib/seed-data";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products - ARCA Rx" }] }),
  component: Page,
});

const PRODUCT_FIELDS = [
  { name: "name", label: "Product name", placeholder: "e.g. Neurotoxin · per unit" },
  { name: "category", label: "Category", type: "select" as const, options: ["Service", "Membership", "Retail", "Bundle", "Injectable", "IV therapy"] },
  { name: "price", label: "Price (USD)", type: "number" as const, placeholder: "12" },
  { name: "notes", label: "Notes", type: "textarea" as const, placeholder: "Description, duration, or bundle contents…" },
];

function Page() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="space-y-5 p-4 md:p-8">
      <CreateModal open={creating} onClose={() => setCreating(false)} title="New product" description="Add a service, membership, retail item, or bundle." submitLabel="Create product" fields={PRODUCT_FIELDS} />
      <CreateModal open={editing !== null} onClose={() => setEditing(null)} title={`Edit ${editing ?? ""}`} description="Update the details for this product." submitLabel="Save changes" successMessage={`${editing} updated`} fields={PRODUCT_FIELDS} />

      <PageHeader
        eyebrow="Catalog"
        title="Products & Services"
        description="Every billable SKU - services, memberships, retail, and bundled programs."
        actions={<Button className="gradient-brand text-white" onClick={() => setCreating(true)}>+ New product</Button>}
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
                <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={() => setEditing(s.name)}>Edit</Button>
                <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={() => toast.info(`${s.name} analytics`, { description: "Revenue, volume, and margin trends.", action: { label: "Open analytics", onClick: () => navigate({ to: "/admin/analytics" }) } })}>Analytics</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
