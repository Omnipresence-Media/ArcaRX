import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/photo-reviews")({
  head: () => ({ meta: [{ title: "Photo Reviews — ARCA Rx" }] }),
  component: Page,
});

const reviews = [
  { patient: "Eliana Ruiz", protocol: "Morpheus8 · Session 2", date: "Today", status: "needs-review", provider: "Dr. Chen" },
  { patient: "Owen Pham", protocol: "Filler · 2-wk follow", date: "Today", status: "needs-review", provider: "S. Whitfield" },
  { patient: "Naomi Carter", protocol: "HRT · 90d photos", date: "Yesterday", status: "approved", provider: "Dr. Patel" },
  { patient: "Yusuf Aydin", protocol: "Semaglutide · M3", date: "2d ago", status: "approved", provider: "J. Reeves" },
  { patient: "Harper Nakamura", protocol: "Baseline intake", date: "2d ago", status: "needs-review", provider: "Front Desk" },
  { patient: "Imani Brooks", protocol: "Morpheus8 · Session 3", date: "3d ago", status: "approved", provider: "Dr. Chen" },
  { patient: "Mira Hollander", protocol: "Botox · 2-wk", date: "4d ago", status: "approved", provider: "Dr. Chen" },
  { patient: "Theo Lindqvist", protocol: "Skin baseline", date: "5d ago", status: "needs-review", provider: "D. Hart" },
];

const tone = (s: string) =>
  s === "needs-review" ? "bg-[var(--warning)]/15 text-[var(--warning)]" : "bg-[var(--success)]/15 text-[var(--success)]";

function Page() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Clinical"
        title="Photo Reviews"
        description="Before/after photo queue with provider approvals, consent tracking, and outcome tagging."
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((r, i) => (
          <Card key={i} className="surface-elevated overflow-hidden">
            <div className="grid grid-cols-2 gap-0.5 bg-muted">
              <div className="aspect-square bg-gradient-to-br from-muted to-muted-foreground/20" />
              <div className="aspect-square bg-gradient-to-br from-muted-foreground/20 to-muted" />
            </div>
            <CardContent className="space-y-1.5 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{r.patient}</p>
                <Badge className={`text-[10px] ${tone(r.status)}`}>{r.status === "needs-review" ? "Pending" : "Approved"}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{r.protocol}</p>
              <p className="text-[11px] text-muted-foreground">{r.provider} · {r.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
