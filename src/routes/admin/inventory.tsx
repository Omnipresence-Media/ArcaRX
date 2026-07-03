import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Package, TrendingDown, ShoppingCart, BarChart3,
  Plus, RefreshCw, Search, Filter, CheckCircle2, Clock, Boxes,
} from "lucide-react";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({ meta: [{ title: "Inventory - ARCA Rx" }] }),
  component: InventoryPage,
});

type StockStatus = "ok" | "low" | "critical" | "reorder";

interface SKU {
  id: string;
  name: string;
  category: string;
  unit: string;
  stockQty: number;
  reorderPoint: number;
  reorderQty: number;
  unitCost: number;
  lotNumber: string;
  expires: string;
  usagePerWeek: number;
  supplier: string;
  treatmentTrack?: string;
}

const SKUS: SKU[] = [
  { id: "s-1",  name: "Testosterone Cypionate 200mg/mL",   category: "Injectable", unit: "10mL vial", stockQty: 14, reorderPoint: 8,  reorderQty: 24, unitCost: 62,  lotNumber: "TC2025-441", expires: "2026-11-30", usagePerWeek: 3.2, supplier: "Empower Pharmacy", treatmentTrack: "trt" },
  { id: "s-2",  name: "Semaglutide 2.5mg/mL",              category: "Injectable", unit: "5mL vial",  stockQty: 4,  reorderPoint: 6,  reorderQty: 20, unitCost: 148, lotNumber: "SEM-9921",   expires: "2026-09-15", usagePerWeek: 2.1, supplier: "Strive Pharmacy",  treatmentTrack: "glp1" },
  { id: "s-3",  name: "Tirzepatide 5mg/mL",                category: "Injectable", unit: "2mL vial",  stockQty: 2,  reorderPoint: 5,  reorderQty: 15, unitCost: 195, lotNumber: "TRZ-0038",   expires: "2026-08-20", usagePerWeek: 1.8, supplier: "Strive Pharmacy",  treatmentTrack: "glp1" },
  { id: "s-4",  name: "Onabotulinumtoxin A 100U",          category: "Aesthetic",  unit: "vial",      stockQty: 22, reorderPoint: 10, reorderQty: 30, unitCost: 589, lotNumber: "BOT-7712",   expires: "2026-12-01", usagePerWeek: 4.5, supplier: "Allergan Direct",  treatmentTrack: "aesthetics" },
  { id: "s-5",  name: "Hyaluronic Acid Filler 1mL",        category: "Aesthetic",  unit: "syringe",   stockQty: 18, reorderPoint: 8,  reorderQty: 24, unitCost: 290, lotNumber: "RES-5513",   expires: "2027-01-15", usagePerWeek: 2.8, supplier: "Galderma",        treatmentTrack: "aesthetics" },
  { id: "s-6",  name: "Tretinoin 0.025% Cream",            category: "Topical",    unit: "45g tube",  stockQty: 31, reorderPoint: 15, reorderQty: 40, unitCost: 28,  lotNumber: "TRE-1192",   expires: "2027-03-10", usagePerWeek: 5.2, supplier: "Nuo Pharmacy",    treatmentTrack: "skincare" },
  { id: "s-7",  name: "NAD+ 500mg/10mL",                   category: "Injectable", unit: "10mL vial", stockQty: 6,  reorderPoint: 8,  reorderQty: 24, unitCost: 88,  lotNumber: "NAD-3341",   expires: "2026-07-31", usagePerWeek: 2.0, supplier: "Vital Compounding", treatmentTrack: "nad" },
  { id: "s-8",  name: "Anastrozole 1mg",                   category: "Oral",       unit: "30-tab",    stockQty: 12, reorderPoint: 6,  reorderQty: 18, unitCost: 44,  lotNumber: "ANA-8820",   expires: "2026-10-01", usagePerWeek: 1.1, supplier: "Empower Pharmacy", treatmentTrack: "trt" },
  { id: "s-9",  name: "Estradiol Patch 0.1mg/day",         category: "Transdermal",unit: "8-pack",    stockQty: 9,  reorderPoint: 5,  reorderQty: 20, unitCost: 72,  lotNumber: "EST-6601",   expires: "2027-02-28", usagePerWeek: 1.5, supplier: "Empower Pharmacy", treatmentTrack: "hormone" },
  { id: "s-10", name: "Progesterone 200mg Capsules",        category: "Oral",       unit: "30-cap",    stockQty: 3,  reorderPoint: 5,  reorderQty: 15, unitCost: 56,  lotNumber: "PRG-4417",   expires: "2026-06-30", usagePerWeek: 1.2, supplier: "Nuo Pharmacy",    treatmentTrack: "hormone" },
  { id: "s-11", name: "IV Saline Drip 500mL",              category: "Injectable", unit: "bag",       stockQty: 48, reorderPoint: 20, reorderQty: 60, unitCost: 8,   lotNumber: "SAL-0012",   expires: "2027-05-01", usagePerWeek: 8.0, supplier: "Bound Tree Medical", },
  { id: "s-12", name: "Vitamin C 5000mg IV",               category: "Injectable", unit: "50mL vial", stockQty: 11, reorderPoint: 8,  reorderQty: 24, unitCost: 34,  lotNumber: "VTC-2231",   expires: "2026-09-15", usagePerWeek: 2.5, supplier: "Vital Compounding", treatmentTrack: "nad" },
  { id: "s-13", name: "HCG 10,000 IU/10mL",               category: "Injectable", unit: "vial",      stockQty: 7,  reorderPoint: 4,  reorderQty: 12, unitCost: 119, lotNumber: "HCG-5598",   expires: "2026-08-01", usagePerWeek: 0.9, supplier: "Strive Pharmacy",  treatmentTrack: "trt" },
  { id: "s-14", name: "Niacinamide 10% Serum",             category: "Topical",    unit: "30mL",      stockQty: 24, reorderPoint: 10, reorderQty: 30, unitCost: 18,  lotNumber: "NIA-9903",   expires: "2027-04-15", usagePerWeek: 3.1, supplier: "Nuo Pharmacy",    treatmentTrack: "skincare" },
  { id: "s-15", name: "Insulin Syringes 29G 1/2cc",        category: "Supplies",   unit: "100-pack",  stockQty: 19, reorderPoint: 8,  reorderQty: 24, unitCost: 22,  lotNumber: "SYR-1115",   expires: "2028-01-01", usagePerWeek: 3.8, supplier: "McKesson",        },
];

function getStatus(sku: SKU): StockStatus {
  const weeksLeft = sku.usagePerWeek > 0 ? sku.stockQty / sku.usagePerWeek : 99;
  if (sku.stockQty <= 0) return "critical";
  if (sku.stockQty <= sku.reorderPoint * 0.5) return "critical";
  if (sku.stockQty <= sku.reorderPoint) return "low";
  if (weeksLeft < 2) return "reorder";
  return "ok";
}

function weeksRemaining(sku: SKU) {
  if (sku.usagePerWeek <= 0) return "-";
  const w = sku.stockQty / sku.usagePerWeek;
  return w < 1 ? "<1 wk" : `${Math.round(w)} wk${Math.round(w) === 1 ? "" : "s"}`;
}

const STATUS_STYLE: Record<StockStatus, { badge: string; dot: string; label: string }> = {
  ok:       { badge: "text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400", label: "In stock" },
  low:      { badge: "text-amber-400 border-amber-500/20",    dot: "bg-amber-400",   label: "Low stock" },
  critical: { badge: "text-red-400 border-red-500/20",        dot: "bg-red-400",     label: "Critical" },
  reorder:  { badge: "text-orange-400 border-orange-500/20",  dot: "bg-orange-400",  label: "Reorder soon" },
};

const TRACK_COLORS: Record<string, string> = {
  glp1: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  trt:  "text-blue-400 border-blue-500/20 bg-blue-500/10",
  aesthetics: "text-violet-400 border-violet-500/20 bg-violet-500/10",
  skincare: "text-rose-400 border-rose-500/20 bg-rose-500/10",
  nad: "text-amber-400 border-amber-500/20 bg-amber-500/10",
  hormone: "text-pink-400 border-pink-500/20 bg-pink-500/10",
};

function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [reordered, setReordered] = useState<Set<string>>(new Set());

  const categories = ["all", ...Array.from(new Set(SKUS.map((s) => s.category)))];

  const filtered = SKUS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.lotNumber.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || s.category === filterCat;
    return matchSearch && matchCat;
  });

  const alerts = SKUS.filter((s) => getStatus(s) !== "ok");
  const criticals = SKUS.filter((s) => getStatus(s) === "critical");
  const totalValue = SKUS.reduce((s, sku) => s + sku.stockQty * sku.unitCost, 0);

  function placeReorder(id: string) {
    setReordered((prev) => new Set([...prev, id]));
  }

  return (
    <div className="p-4 md:p-8 space-y-5">
      <PageHeader
        eyebrow="Operations"
        title="Inventory"
        description="Stock levels, lot tracking, reorder alerts, and usage rates."
        actions={
          <Button size="sm" className="h-9 gradient-brand text-white" onClick={() => toast.info("Add SKU", { description: "Add a product with lot tracking, reorder point, and usage rate." })}>
            <Plus className="mr-1.5 h-4 w-4" />Add SKU
          </Button>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total SKUs",        value: SKUS.length.toString(),          icon: Boxes,         accent: "" },
          { label: "Alerts",            value: alerts.length.toString(),         icon: AlertTriangle, accent: alerts.length > 0 ? "text-amber-400" : "" },
          { label: "Critical / reorder",value: criticals.length.toString(),      icon: TrendingDown,  accent: criticals.length > 0 ? "text-red-400" : "" },
          { label: "Inventory value",   value: `$${(totalValue / 1000).toFixed(1)}k`, icon: BarChart3, accent: "text-[color:var(--teal)]" },
        ].map((s) => (
          <Card key={s.label} className="surface-elevated">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 shrink-0 ${s.accent || "text-muted-foreground"}`} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className={`text-lg font-semibold font-mono mt-0.5 ${s.accent}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert panel */}
      {alerts.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              {alerts.length} item{alerts.length !== 1 ? "s" : ""} need attention
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            {alerts.map((sku) => {
              const status = getStatus(sku);
              const st = STATUS_STYLE[status];
              const done = reordered.has(sku.id);
              return (
                <div key={sku.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${st.dot}`} />
                    <span className="text-sm truncate">{sku.name}</span>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${st.badge}`}>{st.label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px] text-muted-foreground">
                    <span>{sku.stockQty} {sku.unit}s</span>
                    {done ? (
                      <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" />Ordered</span>
                    ) : (
                      <Button size="sm" variant="outline" className="h-6 px-2 text-[11px]" onClick={() => placeReorder(sku.id)}>
                        <ShoppingCart className="h-3 w-3 mr-1" />Reorder {sku.reorderQty}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            className="h-8 w-full rounded-md border bg-transparent pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Search name or lot #…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-2.5 py-1 text-[11px] rounded border capitalize transition-colors ${filterCat === c ? "bg-muted border-border font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="surface-elevated">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-medium">Item</th>
                <th className="px-4 py-3 text-left font-medium">Lot / Expires</th>
                <th className="px-4 py-3 text-right font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Reorder pt</th>
                <th className="px-4 py-3 text-right font-medium">Usage/wk</th>
                <th className="px-4 py-3 text-right font-medium">Runway</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Track</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((sku) => {
                const status = getStatus(sku);
                const st = STATUS_STYLE[status];
                const done = reordered.has(sku.id);
                const expiresDate = new Date(sku.expires);
                const daysToExpiry = Math.ceil((expiresDate.getTime() - Date.now()) / 86_400_000);
                return (
                  <tr key={sku.id} className={`hover:bg-muted/20 transition-colors ${status === "critical" ? "bg-red-500/5" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{sku.name}</p>
                      <p className="text-[11px] text-muted-foreground">{sku.supplier} · {sku.unit}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]">
                      <p>{sku.lotNumber}</p>
                      <p className={`${daysToExpiry < 90 ? "text-amber-400" : "text-muted-foreground"}`}>
                        {daysToExpiry < 90 ? <AlertTriangle className="h-2.5 w-2.5 inline mr-0.5" /> : null}
                        Exp {sku.expires}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold">{sku.stockQty}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground font-mono">{sku.reorderPoint}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground font-mono">{sku.usagePerWeek}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs">{weeksRemaining(sku)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-[10px] ${st.badge}`}>
                        <span className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${st.dot}`} />
                        {st.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {sku.treatmentTrack && (
                        <Badge variant="outline" className={`text-[10px] ${TRACK_COLORS[sku.treatmentTrack] ?? ""}`}>
                          {sku.treatmentTrack.toUpperCase()}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {status !== "ok" && (
                        done ? (
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />Ordered
                          </span>
                        ) : (
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => placeReorder(sku.id)}>
                            <ShoppingCart className="h-3 w-3 mr-1" />Reorder
                          </Button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
