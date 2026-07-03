import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { Panel } from "@/components/shell/AnalyticsSubPage";
import { packageCatalog, invoices } from "@/lib/fit-seed-extra";

export const Route = createFileRoute("/admin/fit/billing")({
  head: () => ({ meta: [{ title: "Billing - ARCA Fit" }] }),
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-10">
      <PageHeader
        eyebrow="Business"
        title="Packages & invoices"
        description="Manage coaching offers and subscriber billing."
        actions={<button onClick={() => toast.success("New package", { description: "Name it, set the price and billing cadence, and choose included programs." })} className="rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background">+ New package</button>}
      />

      <Panel title="Package catalog">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {packageCatalog.map((p) => (
            <div key={p.id} className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-4 transition-transform hover:-translate-y-0.5">
              <div className="flex items-baseline justify-between">
                <span className="rounded-full bg-[color:color-mix(in_oklab,var(--teal)_14%,transparent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--teal)]">{p.active} active</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">{p.name}</p>
              <p className="metric-numeral mt-1 text-3xl text-foreground">
                ${p.price.toLocaleString()}<span className="text-xs text-muted-foreground">{p.period}</span>
              </p>
              <ul className="mt-3 space-y-0.5 text-[11px] text-muted-foreground">
                {p.includes.map((it) => <li key={it}>· {it}</li>)}
              </ul>
              <button onClick={() => toast.info(`Edit ${p.name}`, { description: "Update pricing, cadence, and included programs." })} className="mt-4 w-full rounded-full border border-[color:var(--glass-stroke-strong)] py-1.5 text-[11px] font-semibold text-foreground hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_75%,transparent)]">
                Edit
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Recent invoices">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--glass-stroke)] text-left text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="py-2 font-semibold">Invoice</th>
                <th className="font-semibold">Client</th>
                <th className="font-semibold">Package</th>
                <th className="text-right font-semibold">Amount</th>
                <th className="text-right font-semibold">Status</th>
                <th className="text-right font-semibold">When</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[color:var(--glass-stroke)] last:border-0">
                  <td className="py-2.5 font-mono text-[11px] tabular-nums text-foreground">{inv.id}</td>
                  <td className="text-foreground/90">{inv.client}</td>
                  <td className="text-muted-foreground">{inv.pkg}</td>
                  <td className="text-right font-mono tabular-nums text-foreground">${inv.amount.toLocaleString()}</td>
                  <td className="text-right">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      inv.status === "Paid"     ? "border-[color:color-mix(in_oklab,var(--data-pos)_30%,transparent)] text-[color:var(--data-pos)]" :
                      inv.status === "Failed"   ? "border-[color:color-mix(in_oklab,var(--data-neg)_30%,transparent)] text-[color:var(--data-neg)]" :
                                                  "border-[color:var(--glass-stroke-strong)] text-muted-foreground"
                    }`}>{inv.status}</span>
                  </td>
                  <td className="text-right text-muted-foreground">{inv.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
