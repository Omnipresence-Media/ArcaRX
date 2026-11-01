import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { accessLevel } from "@/features/spruce/rules";
import { useMe, useSpruce, type Protocol } from "@/features/spruce/store";
import { headingFont } from "@/features/spruce/theme";
import { EmptyState, Pill, SectionCard, SpPage } from "@/features/spruce/ui";

export const Route = createFileRoute("/spruce/portal/protocols")({
  head: () => ({ meta: [{ title: "Protocols - Spruce Micro" }] }),
  component: Protocols,
});

const SECTIONS: { title: string; lines: string[] }[] = [
  { title: "Morning", lines: ["Rinse with lukewarm water or use a gentle cleanser.", "Apply a hydrating serum to damp skin.", "Finish with moisturizer and a broad spectrum SPF."] },
  { title: "Evening", lines: ["Cleanse thoroughly, then pat dry.", "Apply your treatment product as directed by your practitioner.", "Seal with a barrier repair moisturizer."] },
  { title: "Microneedling schedule", lines: ["Once a week on a non-treatment evening.", "Skip retinoids the night of and the night after.", "Sanitize your device before and after every use."] },
  { title: "Notes", lines: ["Introduce changes one at a time.", "Message your practitioner if you notice lasting redness or irritation."] },
];

function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast.success(`Downloaded ${filename}`);
}

const protocolText = (title: string) =>
  [title, "", ...SECTIONS.flatMap((s) => [s.title.toUpperCase(), ...s.lines.map((l) => `- ${l}`), ""])].join("\n");

function Protocols() {
  const s = useSpruce();
  const me = useMe();
  const [open, setOpen] = useState<Protocol | null>(null);
  const mine = s.protocols.filter((p) => p.patientId === s.meId);
  const restricted = accessLevel(me) === "restricted";

  return (
    <SpPage title="Protocols" sub="Your personal plans from your practitioner, newest first.">
      {restricted && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Your membership is not active, but your protocols and records stay available to you here.
        </p>
      )}

      {mine.length === 0 ? (
        <EmptyState title="No protocols yet" body="After you submit a check-in, your practitioner will upload your protocol here." />
      ) : (
        <div className="space-y-3">
          {mine.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-[color:var(--teal)]"><FileText className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-muted-foreground">Uploaded {p.uploadedLabel}</p>
                </div>
                {p.uploadedLabel === "Just now" && <Pill tone="brand">New</Pill>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setOpen(p)}><Eye className="mr-1 h-4 w-4" />View</Button>
                <Button size="sm" variant="outline" onClick={() => download(`${p.title}.txt`, protocolText(p.title))}><Download className="mr-1 h-4 w-4" />Download</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SectionCard title="Records">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-[color:var(--teal)]"><FileText className="h-5 w-5" /></div>
            <p className="text-sm font-medium">Consent and agreement v2, signed</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => download("Consent and agreement v2.txt", `Consent and agreement, version 2\nSigned by ${me.name}\n`)}
          >
            <Download className="mr-1 h-4 w-4" />Download
          </Button>
        </div>
      </SectionCard>

      <Dialog open={open !== null} onOpenChange={(o) => { if (!o) setOpen(null); }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{open?.title}</DialogTitle>
            <DialogDescription>Uploaded {open?.uploadedLabel}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold" style={headingFont}>{open?.title}</h3>
            {SECTIONS.map((sec) => (
              <div key={sec.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--teal)]">{sec.title}</h4>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm">
                  {sec.lines.map((l) => <li key={l}>{l}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </SpPage>
  );
}
