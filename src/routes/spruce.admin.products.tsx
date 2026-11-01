import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateModal } from "@/components/shell/CreateButton";
import { EmptyState, Pill, SpPage, ToneImage } from "@/features/spruce/ui";
import { money } from "@/features/spruce/rules";
import { newProductId, removeProduct, upsertProduct, useSpruce, type Product } from "@/features/spruce/store";

export const Route = createFileRoute("/spruce/admin/products")({
  head: () => ({ meta: [{ title: "Products - Spruce Micro" }] }),
  component: Products,
});

type Filter = "all" | "rx" | "non_rx";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "rx", label: "Prescription" },
  { id: "non_rx", label: "Essentials" },
];

const TYPE_LABEL = { rx: "Prescription", non_rx: "Essentials" } as const;

function Products() {
  const s = useSpruce();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [modal, setModal] = useState<{ mode: "add" } | { mode: "edit"; product: Product } | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const rows = s.products.filter((p) => {
    if (filter !== "all" && p.type !== filter) return false;
    const needle = q.trim().toLowerCase();
    return !needle || p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle);
  });

  function save(values: Record<string, string>) {
    const name = (values.name ?? "").trim();
    const price = Math.round(parseFloat(values.price ?? "") * 100);
    if (!name || !Number.isFinite(price) || price < 0) {
      toast.error("Add a name and a valid price");
      return false;
    }
    const type: Product["type"] = values.type === "Prescription" ? "rx" : "non_rx";
    const videoId = (values.videoId ?? "").trim();
    const base = {
      name,
      sku: (values.sku ?? "").trim().toUpperCase(),
      type,
      priceCents: price,
      blurb: (values.blurb ?? "").trim(),
      education: (values.education ?? "").trim(),
      videoId: videoId || undefined,
    };
    if (modal?.mode === "edit") {
      const p = modal.product;
      upsertProduct({ ...p, ...base });
    } else {
      upsertProduct({ id: newProductId(), tone: "from-emerald-100 to-teal-200", active: true, ...base });
    }
  }

  const editing = modal?.mode === "edit" ? modal.product : undefined;

  return (
    <SpPage
      title="Products"
      sub="The catalog patients see in the store."
      actions={
        <Button onClick={() => setModal({ mode: "add" })} className="bg-[color:var(--teal)] text-white hover:bg-[color:var(--teal)]/90">
          <Plus className="mr-1.5 h-4 w-4" />Add product
        </Button>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or SKU" className="pl-8" />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${filter === f.id ? "border-[color:var(--teal)] bg-[color:var(--teal)] text-white" : "bg-card text-muted-foreground hover:bg-muted"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No products found" body="Try a different search or filter, or add a new product to the catalog." />
      ) : (
        <div className="space-y-2">
          {rows.map((p) => (
            <div key={p.id} className={`flex flex-wrap items-center gap-4 rounded-xl border bg-card p-3 ${p.active ? "" : "opacity-70"}`}>
              <ToneImage tone={p.tone} className="h-14 w-14 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <Pill tone={p.type === "rx" ? "info" : "neutral"}>{TYPE_LABEL[p.type]}</Pill>
                  {!p.active && <Pill tone="warning">Hidden</Pill>}
                </div>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{p.sku}</p>
                {p.type === "rx" && <p className="mt-1 text-xs text-muted-foreground">Ships from the pharmacy, requires an active prescription or a doctor visit</p>}
              </div>
              <p className="w-20 text-right text-sm font-semibold">{money(p.priceCents)}</p>
              <div className="flex items-center gap-2">
                <Switch
                  checked={p.active}
                  aria-label={`${p.name} active`}
                  onCheckedChange={(v) => { upsertProduct({ ...p, active: v }); toast.success(`${p.name} ${v ? "is now visible" : "is now hidden"} in the store`); }}
                />
                <Button size="sm" variant="outline" onClick={() => setModal({ mode: "edit", product: p })}><Pencil className="mr-1 h-3.5 w-3.5" />Edit</Button>
                <Button size="sm" variant="outline" onClick={() => setDeleting(p)}><Trash2 className="mr-1 h-3.5 w-3.5" />Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateModal
        key={editing?.id ?? "new"}
        open={modal !== null}
        onClose={() => setModal(null)}
        title={editing ? "Edit product" : "Add product"}
        description="Prescription products ship from the pharmacy and need an active prescription or a doctor visit."
        submitLabel={editing ? "Save changes" : "Add product"}
        successMessage="Product saved"
        onSubmit={save}
        fields={[
          { name: "name", label: "Name", defaultValue: editing?.name },
          { name: "sku", label: "SKU", defaultValue: editing?.sku },
          { name: "type", label: "Type", type: "select", options: ["Prescription", "Essentials"], defaultValue: editing ? TYPE_LABEL[editing.type] : "Essentials" },
          { name: "price", label: "Price (USD)", type: "number", defaultValue: editing ? (editing.priceCents / 100).toFixed(2) : undefined, placeholder: "0.00" },
          { name: "blurb", label: "Short description", defaultValue: editing?.blurb },
          { name: "education", label: "Education text", type: "textarea", defaultValue: editing?.education },
          { name: "videoId", label: "YouTube video id (optional)", defaultValue: editing?.videoId },
        ]}
      />

      <Dialog open={deleting !== null} onOpenChange={(o) => { if (!o) setDeleting(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
            <DialogDescription>{deleting ? `${deleting.name} will be removed from the catalog. Past orders keep their history.` : ""}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) { removeProduct(deleting.id); toast.success(`${deleting.name} deleted`); }
                setDeleting(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SpPage>
  );
}
