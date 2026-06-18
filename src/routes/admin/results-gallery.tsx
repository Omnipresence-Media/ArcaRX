import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/results-gallery")({
  head: () => ({ meta: [{ title: "Results Gallery — ARCA Rx" }] }),
  component: Page,
});

const results = [
  { title: "Morpheus8 Full Face · 3 sessions", category: "Skin Tightening", consent: true },
  { title: "Lip Filler · 1mL", category: "Injectables", consent: true },
  { title: "Semaglutide · 6 months", category: "Weight", consent: true },
  { title: "Testosterone · 90 days", category: "Hormones", consent: false },
  { title: "HydraFacial Platinum series", category: "Skin", consent: true },
  { title: "Cheek Filler · 2mL", category: "Injectables", consent: true },
  { title: "NAD+ Longevity 3mo", category: "IV", consent: true },
  { title: "Botox · 40u Glabella", category: "Injectables", consent: true },
];

function Page() {
  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Marketing"
        title="Results Gallery"
        description="Curated outcome library with consent tracking — publish to web, socials, or in-clinic displays."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {results.map((r, i) => (
          <Card key={i} className="surface-elevated overflow-hidden">
            <div className="relative aspect-[4/5] bg-gradient-to-br from-[color:var(--teal)]/20 via-muted to-[color:var(--chart-2)]/20">
              <div className="absolute inset-0 flex items-end p-3">
                <Badge className="text-[10px] bg-background/80 backdrop-blur text-foreground">{r.category}</Badge>
              </div>
            </div>
            <CardContent className="space-y-1 p-3">
              <p className="text-xs font-semibold leading-tight">{r.title}</p>
              <p className="text-[10px] text-muted-foreground">{r.consent ? "✓ Consent on file" : "Consent pending"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
