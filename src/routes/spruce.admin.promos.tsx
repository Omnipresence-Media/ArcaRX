import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateModal } from "@/components/shell/CreateButton";
import { EmptyState, SectionCard, SpPage } from "@/features/spruce/ui";
import { newPromoId, removePromo, upsertPromo, useSpruce, type Promo } from "@/features/spruce/store";

export const Route = createFileRoute("/spruce/admin/promos")({
  head: () => ({ meta: [{ title: "Promo codes - Spruce Micro" }] }),
  component: Promos,
});

function Promos() {
  const s = useSpruce();
  const [modal, setModal] = useState<{ mode: "add" } | { mode: "edit"; promo: Promo } | null>(null);
  const [deleting, setDeleting] = useState<Promo | null>(null);

  const editing = modal?.mode === "edit" ? modal.promo : undefined;

  function save(values: Record<string, string>) {
    const code = (values.code ?? "").trim().toUpperCase();
    const raw = parseFloat(values.percentOff ?? "");
    const ends = (values.endsLabel ?? "").trim();
    if (!code) { toast.error("Enter a promo code"); return false; }
    if (!Number.isFinite(raw) || raw < 1 || raw > 90) { toast.error("Percent off must be between 1 and 90"); return false; }
    const percentOff = Math.min(90, Math.max(1, Math.round(raw)));
    if (s.promos.some((p) => p.code === code && p.id !== editing?.id)) { toast.error(`${code} already exists`); return false; }
    if (editing) {
      upsertPromo({ ...editing, code, percentOff, endsLabel: ends || editing.endsLabel });
    } else {
      upsertPromo({ id: newPromoId(), code, percentOff, endsLabel: ends || "No end date", active: true, redemptions: 0 });
    }
  }

  return (
    <SpPage
      title="Promo codes"
      sub="Codes patients can use at checkout."
      actions={
        <Button onClick={() => setModal({ mode: "add" })} className="bg-[color:var(--teal)] text-white hover:bg-[color:var(--teal)]/90">
          <Plus className="mr-1.5 h-4 w-4" />New promo code
        </Button>
      }
    >
      <SectionCard>
        <p className="text-sm text-muted-foreground">
          Patients get either the automatic tier discount (20% under $350, 30% at $350 and up) or one promo code, never both. The better one is preselected at checkout.
        </p>
      </SectionCard>

      {s.promos.length === 0 ? (
        <EmptyState title="No promo codes yet" body="Create a code and patients can pick it instead of the automatic tier discount at checkout." />
      ) : (
        <div className="space-y-2">
          {s.promos.map((p) => (
            <div key={p.id} className={`flex flex-wrap items-center gap-4 rounded-xl border bg-card p-4 ${p.active ? "" : "opacity-70"}`}>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-semibold tracking-wide">{p.code}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Ends {p.endsLabel}</p>
              </div>
              <p className="text-sm font-semibold">{p.percentOff}% off</p>
              <p className="w-28 text-xs text-muted-foreground">{p.redemptions} {p.redemptions === 1 ? "redemption" : "redemptions"}</p>
              <div className="flex items-center gap-2">
                <Switch
                  checked={p.active}
                  aria-label={`${p.code} active`}
                  onCheckedChange={(v) => { upsertPromo({ ...p, active: v }); toast.success(`${p.code} ${v ? "activated" : "deactivated"}`); }}
                />
                <Button size="sm" variant="outline" onClick={() => setModal({ mode: "edit", promo: p })}><Pencil className="mr-1 h-3.5 w-3.5" />Edit</Button>
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
        title={editing ? "Edit promo code" : "New promo code"}
        description="Codes are saved in upper case and must be unique."
        submitLabel={editing ? "Save changes" : "Create code"}
        successMessage="Promo code saved"
        onSubmit={save}
        fields={[
          { name: "code", label: "Code", defaultValue: editing?.code, placeholder: "WELCOME15" },
          { name: "percentOff", label: "Percent off (1 to 90)", type: "number", defaultValue: editing ? String(editing.percentOff) : undefined, placeholder: "15" },
          { name: "endsLabel", label: "Ends", defaultValue: editing?.endsLabel, placeholder: "Dec 31" },
        ]}
      />

      <Dialog open={deleting !== null} onOpenChange={(o) => { if (!o) setDeleting(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete promo code</DialogTitle>
            <DialogDescription>{deleting ? `${deleting.code} will stop working at checkout.` : ""}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleting) { removePromo(deleting.id); toast.success(`${deleting.code} deleted`); }
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
