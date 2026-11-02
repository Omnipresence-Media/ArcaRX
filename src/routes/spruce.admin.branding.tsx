import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, FileText, Home, ShoppingBag, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard, SpPage } from "@/features/spruce/ui";
import { DEFAULT_BRANDING, resetBranding, updateBranding, useSpruce, type Branding } from "@/features/spruce/store";
import { headingFont, spruceStyleFor } from "@/features/spruce/theme";

export const Route = createFileRoute("/spruce/admin/branding")({
  head: () => ({ meta: [{ title: "Branding - Spruce Micro" }] }),
  component: BrandingPage,
});

const PRESETS: { name: string; primary: string; accent: string; background: string }[] = [
  { name: "Forest", primary: "#1F4D3A", accent: "#2F7D5B", background: "#FAFCFA" },
  { name: "Sage", primary: "#3F5A4A", accent: "#7FA68A", background: "#F7F9F6" },
  { name: "Terracotta", primary: "#7A3E2E", accent: "#C8653F", background: "#FDF8F5" },
  { name: "Slate", primary: "#1E293B", accent: "#0EA5A4", background: "#F8FAFC" },
  { name: "Plum", primary: "#4A2545", accent: "#9D5C8A", background: "#FBF7FA" },
];

const HEX = /^#[0-9a-fA-F]{6}$/;
const MAX_LOGO_BYTES = 300 * 1024;

function BrandingPage() {
  const saved = useSpruce().branding;
  const [draft, setDraft] = useState<Branding>(saved);
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => setDraft(saved), [saved]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const valid = HEX.test(draft.primary) && HEX.test(draft.accent) && HEX.test(draft.background) && draft.name.trim().length > 0;

  const pickLogo = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Choose an image file."); return; }
    if (file.size > MAX_LOGO_BYTES) { toast.error("Keep the logo under 300 KB for the prototype."); return; }
    const r = new FileReader();
    r.onload = () => setDraft((d) => ({ ...d, logoDataUrl: String(r.result) }));
    r.readAsDataURL(file);
  };

  const save = () => {
    if (!valid) { toast.error("Enter a name and three six-digit hex colors."); return; }
    updateBranding({ ...draft, name: draft.name.trim() });
    toast.success("Branding saved. The patient portal is restyled.");
  };

  return (
    <SpPage title="Branding" sub="Name, logo and colors for the patient portal. Changes apply everywhere patients look." actions={
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => { resetBranding(); toast("Back to the placeholder brand."); }}>Reset</Button>
        <Button type="button" size="sm" onClick={save} disabled={!dirty || !valid}>Save</Button>
      </div>
    }>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <SectionCard title="Name and logo">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="br-name">Portal name</Label>
                <Input id="br-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Logo</Label>
                <div className="flex items-center gap-3">
                  {draft.logoDataUrl
                    ? <img src={draft.logoDataUrl} alt="Logo preview" className="h-12 w-12 rounded-lg border object-contain" />
                    : <div className="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold text-white" style={{ background: draft.primary, ...headingFont }}>{draft.name.charAt(0) || "?"}</div>}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickLogo(e.target.files?.[0])} />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}><Upload className="mr-1.5 h-3.5 w-3.5" />Upload</Button>
                  {draft.logoDataUrl && <Button type="button" variant="ghost" size="sm" onClick={() => setDraft({ ...draft, logoDataUrl: null })}><X className="mr-1 h-3.5 w-3.5" />Remove</Button>}
                </div>
                <p className="text-xs text-muted-foreground">PNG or SVG, square works best. Without a logo the first letter of the name is used.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Colors">
            <div className="grid gap-3 sm:grid-cols-3">
              {([["primary", "Primary", "Buttons, headings, nav"], ["accent", "Accent", "Links, badges, highlights"], ["background", "Background", "Page background"]] as const).map(([k, label, hint]) => (
                <div key={k} className="space-y-1.5">
                  <Label htmlFor={`br-${k}`}>{label}</Label>
                  <div className="flex items-center gap-2">
                    <input aria-label={`${label} color`} type="color" value={HEX.test(draft[k]) ? draft[k] : "#000000"} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} className="h-9 w-10 cursor-pointer rounded border bg-transparent p-0.5" />
                    <Input id={`br-${k}`} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} className="font-mono uppercase" maxLength={7} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{hint}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Presets</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button key={p.name} type="button" onClick={() => setDraft({ ...draft, primary: p.primary, accent: p.accent, background: p.background })} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                    <span className="h-3.5 w-3.5 rounded-full" style={{ background: p.primary }} />
                    <span className="h-3.5 w-3.5 rounded-full" style={{ background: p.accent }} />
                    {p.name}
                  </button>
                ))}
                <button type="button" onClick={() => setDraft({ ...draft, ...DEFAULT_BRANDING, name: draft.name, logoDataUrl: draft.logoDataUrl })} className="rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-muted">Placeholder</button>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Live preview" right={<span className="text-xs text-muted-foreground">{dirty ? "Unsaved" : "Saved"}</span>}>
          <div style={spruceStyleFor(draft)} className="overflow-hidden rounded-xl border bg-background text-foreground">
            <div className="flex h-12 items-center gap-2 border-b bg-card px-3">
              {draft.logoDataUrl
                ? <img src={draft.logoDataUrl} alt="" className="h-7 w-7 rounded-md object-contain" />
                : <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground" style={headingFont}>{draft.name.charAt(0)}</div>}
              <span className="text-sm font-semibold" style={headingFont}>{draft.name || "Portal"}</span>
              <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}>Active member</span>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <h3 className="text-lg font-semibold" style={headingFont}>Welcome back, Taylor</h3>
                <p className="text-xs text-muted-foreground">Your next check-in opens Monday, Nov 2.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[["Check-in", Camera], ["Protocol", FileText], ["Store", ShoppingBag], ["Home", Home]].map(([label, Icon]) => {
                  const I = Icon as typeof Camera;
                  return (
                    <div key={label as string} className="flex items-center gap-2 rounded-lg border bg-card p-2.5 text-xs font-medium">
                      <I className="h-3.5 w-3.5" style={{ color: "var(--teal)" }} />{label as string}
                    </div>
                  );
                })}
              </div>
              <button type="button" className="h-9 w-full rounded-md bg-primary text-xs font-semibold text-primary-foreground">Start check-in</button>
              <p className="text-[11px]"><span style={{ color: "var(--teal)" }} className="underline">View your protocol</span> from Oct 23</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </SpPage>
  );
}
