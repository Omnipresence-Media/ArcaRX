import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Edit3, Eye, Monitor, Tablet, Smartphone, ExternalLink, Activity, Sparkles } from "lucide-react";
import { HrtSite } from "@/features/sites/HrtSite";
import { MedSpaSite } from "@/features/sites/MedSpaSite";

export const Route = createFileRoute("/admin/website")({
  head: () => ({ meta: [{ title: "Website - ARCA Rx" }] }),
  component: Website,
});

type SiteKey = "hrt" | "medspa";
const SITES: Record<SiteKey, {
  name: string; domain: string; tag: string; icon: typeof Activity;
  accent: string; pages: string[]; visits: string; published: string;
}> = {
  hrt: {
    name: "Arcanum Hormone Co.",
    domain: "arcanumhormone.com",
    tag: "HRT brand",
    icon: Activity,
    accent: "oklch(0.72 0.14 195)",
    pages: ["Home","Protocols","Science","Molecules","Lab Markers","Providers","Coverage","Pricing","Journal","FAQ","Press","Book Consult","Contact"],
    visits: "22.4k", published: "1h ago",
  },
  medspa: {
    name: "Maison Lumière",
    domain: "maisonlumiere.co",
    tag: "Med Spa brand",
    icon: Sparkles,
    accent: "oklch(0.66 0.12 45)",
    pages: ["Home","Treatments","Injectables","Skin","Body","Membership","Team","Locations","Book"],
    visits: "31.8k", published: "4h ago",
  },
};

type Device = "desktop" | "tablet" | "mobile";

function Website() {
  const [active, setActive] = useState<SiteKey>("hrt");
  const [device, setDevice] = useState<Device>("desktop");
  const site = SITES[active];

  const deviceWidth = device === "desktop" ? "100%" : device === "tablet" ? 820 : 390;

  return (
    <div className="space-y-5 p-4 md:p-8">
      <PageHeader
        eyebrow="Growth"
        title="Websites"
        description={`Two brands, one workspace · ${site.domain} · ${site.visits} visits MTD · published ${site.published}.`}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9" onClick={() => toast.info("Preview site", { description: "Opens a live preview of your unpublished changes." })}><Eye className="mr-1.5 h-4 w-4" />Preview</Button>
            <Button size="sm" className="h-9 gradient-brand text-white" onClick={() => toast.success("Site published", { description: "Your latest changes are now live." })}><Globe className="mr-1.5 h-4 w-4" />Publish</Button>
          </>
        }
      />

      {/* Site switcher */}
      <div className="grid gap-3 md:grid-cols-2">
        {(Object.keys(SITES) as SiteKey[]).map((k) => {
          const s = SITES[k]; const Icon = s.icon; const on = active === k;
          return (
            <button key={k} onClick={() => setActive(k)}
              className={`group relative overflow-hidden rounded-xl border p-4 text-left transition ${on ? "border-primary shadow-md" : "border-border hover:border-foreground/30"}`}
              style={on ? { background: `linear-gradient(135deg, color-mix(in oklab, ${s.accent} 12%, transparent), transparent)` } : {}}
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg text-white" style={{ background: s.accent }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <Badge variant="outline" className="h-4 px-1.5 text-[9px] uppercase tracking-wide">{s.tag}</Badge>
                    {on && <Badge className="h-4 px-1.5 text-[9px]">active</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.domain} · {s.pages.length} pages · {s.visits} MTD</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        {/* Pages */}
        <Card className="surface-elevated">
          <CardContent className="space-y-1 p-3">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{site.name} · pages</p>
            {site.pages.map((p, i) => (
              <button key={p} className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${i === 0 ? "bg-muted font-medium" : "hover:bg-muted/50"}`}>
                <span>{p}</span>
                <Badge variant="outline" className="text-[10px]">live</Badge>
              </button>
            ))}
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => toast.info("Edit page blocks", { description: "Rearrange sections, edit copy, and swap media." })}><Edit3 className="mr-1.5 h-3.5 w-3.5" />Edit blocks</Button>
          </CardContent>
        </Card>

        {/* Browser frame */}
        <Card className="surface-elevated overflow-hidden">
          {/* chrome */}
          <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="flex items-center gap-1.5 rounded-md bg-background/60 px-3 py-1 text-[11px] text-muted-foreground ring-1 ring-border">
                <Globe className="h-3 w-3" />
                <span className="font-mono">https://{site.domain}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-background/60 p-0.5 ring-1 ring-border">
              {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([d, Icon]) => (
                <button key={d} onClick={() => setDevice(d)}
                  className={`grid h-6 w-7 place-items-center rounded ${device === d ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* preview area - true responsive at device width, no scaling */}
          <div className="relative h-[78vh] overflow-auto bg-[#1a1410]">
            <div
              className="mx-auto bg-background shadow-2xl"
              style={{
                width: device === "desktop" ? "100%" : deviceWidth,
                maxWidth: "100%",
              }}
            >
              {active === "hrt" ? <HrtSite /> : <MedSpaSite />}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
