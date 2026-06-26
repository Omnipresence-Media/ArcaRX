import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Activity, Sparkles, Scale } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings - ARCA Rx" }] }),
  component: Settings,
});

type Feat = { key: string; name: string; desc: string; on: boolean; tag?: string };

const HRT_FEATURES: Feat[] = [
  { key: "hrt-titration",  name: "Dose titration calculator", desc: "Auto-suggest dose changes from latest labs & symptoms.", on: true },
  { key: "hrt-symptoms",   name: "Symptom tracker",           desc: "Energy, mood, libido, sleep, hot flashes.", on: true },
  { key: "hrt-protocols",  name: "Lab-driven protocols",      desc: "TSH, E2, Total/Free T, SHBG, DHEA branching rules.", on: true },
  { key: "hrt-inject",     name: "Injection scheduler",       desc: "IM/SubQ cadence + site rotation map.", on: true },
  { key: "hrt-pellet",     name: "Pellet insertion tracking", desc: "Insertion dates, dosing, re-pellet reminders.", on: false, tag: "beta" },
  { key: "hrt-compound",   name: "Compounding pharmacy routing", desc: "Route Rx by formulation + state license.", on: true },
  { key: "hrt-refill",     name: "Lab-gated auto-refill",     desc: "Refills require labs within N days of expiration.", on: true },
  { key: "hrt-followup",   name: "Telehealth follow-up cadence", desc: "Auto-schedule 6-week and quarterly reviews.", on: true },
];

const MEDSPA_FEATURES: Feat[] = [
  { key: "spa-plan",       name: "Treatment plan builder",     desc: "Multi-modality plans: tox, filler, laser, microneedling.", on: true },
  { key: "spa-mapping",    name: "Injection mapping",          desc: "Face/body diagrams with units per site.", on: true },
  { key: "spa-photos",     name: "Before/after gallery",       desc: "Consent-gated photo capture + side-by-side review.", on: true },
  { key: "spa-membership", name: "Membership & banked units",  desc: "Monthly unit banking, rollover rules, upgrades.", on: true },
  { key: "spa-consents",   name: "Per-procedure consents",     desc: "Auto-attach correct consent by service code.", on: true },
  { key: "spa-touchup",    name: "Touch-up windows",           desc: "14-day touch-up tracking with auto outreach.", on: false },
  { key: "spa-commission", name: "Provider commission rules",  desc: "% by service, tier, and product line.", on: true },
  { key: "spa-lots",       name: "Vendor lot tracking",        desc: "Allergan / Galderma / Merz lot + expiry.", on: true, tag: "compliance" },
];

const GLP_FEATURES: Feat[] = [
  { key: "wl-glp1",        name: "GLP-1 titration ladder",     desc: "Semaglutide / tirzepatide step-ups with side-effect gating.", on: true },
  { key: "wl-weigh",       name: "Weekly weigh-in & body comp", desc: "Scale / Withings sync, % change, trend.", on: true },
  { key: "wl-sides",       name: "Side-effect monitoring",      desc: "Nausea, constipation, fatigue - escalate to RN.", on: true },
  { key: "wl-checkins",    name: "Meal & habit check-ins",      desc: "Daily protein, water, steps prompts.", on: false },
  { key: "wl-measure",     name: "Body measurement tracking",   desc: "Waist, hip, neck; photos optional.", on: true },
  { key: "wl-routing",     name: "Compounded vs branded routing", desc: "Switch supply lane by stock, state, and cost.", on: true, tag: "beta" },
  { key: "wl-priorauth",   name: "Insurance prior auth",        desc: "Auto-build PA packets for Wegovy / Zepbound.", on: false },
  { key: "wl-plateau",     name: "Plateau alerts",              desc: "Notify care team after 3+ weeks of stalled progress.", on: true },
];

function ModuleCard({
  title, eyebrow, icon: Icon, accent, blurb, features, defaultMaster,
}: {
  title: string;
  eyebrow: string;
  icon: typeof Activity;
  accent: string;
  blurb: string;
  features: Feat[];
  defaultMaster: boolean;
}) {
  const [master, setMaster] = useState(defaultMaster);
  const [state, setState] = useState<Record<string, boolean>>(
    () => Object.fromEntries(features.map((f) => [f.key, f.on])),
  );
  const enabledCount = Object.values(state).filter(Boolean).length;

  return (
    <Card className="surface-elevated overflow-hidden">
      <div
        className="flex items-start justify-between gap-4 border-b p-4"
        style={{ background: `linear-gradient(135deg, color-mix(in oklab, ${accent} 14%, transparent), transparent)` }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
            style={{ background: accent }}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {eyebrow}
            </p>
            <p className="text-base font-semibold">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{blurb}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Switch checked={master} onCheckedChange={setMaster} />
          <span className="text-[10px] text-muted-foreground">
            {master ? `${enabledCount}/${features.length} on` : "off"}
          </span>
        </div>
      </div>

      <CardContent className={`space-y-1.5 p-3 transition-opacity ${master ? "" : "pointer-events-none opacity-40"}`}>
        {features.map((f) => (
          <div
            key={f.key}
            className="flex items-center justify-between gap-3 rounded-md border bg-card/60 px-3 py-2.5"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">{f.name}</p>
                {f.tag && (
                  <Badge variant="outline" className="h-4 px-1.5 text-[9px] uppercase tracking-wide">
                    {f.tag}
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{f.desc}</p>
            </div>
            <Switch
              checked={state[f.key]}
              onCheckedChange={(v) => setState((s) => ({ ...s, [f.key]: v }))}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Settings() {
  const integrations = [
    { name: "Stripe",      desc: "Payments & subscriptions",  on: true },
    { name: "Twilio SMS",  desc: "Two-way messaging",          on: true },
    { name: "QuickBooks",  desc: "Accounting sync",            on: true },
    { name: "Mailchimp",   desc: "Email campaigns",            on: false },
    { name: "Google Cal",  desc: "Provider calendar sync",     on: true },
    { name: "Stedi 837",   desc: "Insurance EDI",              on: false },
  ];
  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        eyebrow="Settings"
        title="Workspace"
        description="Brand, team, integrations, industry modules & billing."
      />

      {/* Industry modules */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-base font-semibold">Industry modules</h2>
            <p className="text-xs text-muted-foreground">
              Turn on the toolset for each clinical line. Disabling a module hides its workflows from staff and patients.
            </p>
          </div>
          <Badge variant="outline" className="badge-active text-[10px]">3 of 3 active</Badge>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <ModuleCard
            eyebrow="Hormone replacement"
            title="HRT"
            icon={Activity}
            accent="oklch(0.62 0.16 200)"
            blurb="Bioidentical & traditional HRT for men and women."
            features={HRT_FEATURES}
            defaultMaster
          />
          <ModuleCard
            eyebrow="Aesthetics"
            title="Med Spa"
            icon={Sparkles}
            accent="oklch(0.66 0.18 340)"
            blurb="Injectables, lasers, skin & body."
            features={MEDSPA_FEATURES}
            defaultMaster
          />
          <ModuleCard
            eyebrow="Metabolic"
            title="Weight Loss Clinic"
            icon={Scale}
            accent="oklch(0.68 0.16 150)"
            blurb="GLP-1 programs, body comp, lifestyle."
            features={GLP_FEATURES}
            defaultMaster
          />
        </div>
      </section>

      {/* Existing practice + integrations */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Practice</CardTitle></CardHeader>
          <CardContent className="space-y-3 pt-0 text-sm">
            {[
              ["Practice name", "Apex Aesthetics Group"],
              ["Tax ID",        "84-1029384"],
              ["Time zone",     "America/Chicago"],
              ["Currency",      "USD"],
              ["Plan",          "ARCA Rx · Scale"],
            ].map(([k,v]) => (
              <div key={k} className="flex items-center justify-between border-b py-2 last:border-0">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="surface-elevated">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Integrations</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-0">
            {integrations.map(i => (
              <div key={i.name} className="flex items-center justify-between rounded-md border bg-card/60 p-3">
                <div>
                  <p className="font-medium text-sm">{i.name}</p>
                  <p className="text-[11px] text-muted-foreground">{i.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  {i.on && <Badge variant="outline" className="badge-active text-[10px]">connected</Badge>}
                  <Switch defaultChecked={i.on} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
