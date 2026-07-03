import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { fitClients, trainer } from "@/lib/fit-seed";
import { ResultsReport } from "@/components/shell/fit/ResultsReport";
import { buildResults } from "@/features/coaching/resultsSeed";
import { Printer, Share2 } from "lucide-react";

export const Route = createFileRoute("/results/$id")({
  head: () => ({ meta: [{ title: "Progress Report - ARCA Rx" }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const { id } = Route.useParams();
  const client = fitClients.find((c) => c.id === id) ?? fitClients[0];
  const r = buildResults(client);

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  function share() {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(
        () => toast.success("Share link copied", { description: "Send it to the client — no login required to view." }),
        () => toast.info("Copy this URL to share", { description: url }),
      );
    } else {
      toast.info("Copy this URL to share", { description: url });
    }
  }

  return (
    <div className="min-h-screen bg-background" data-no-invert>
      <header className="border-b bg-card/60 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full gradient-brand" />
            <span className="text-lg font-semibold tracking-tight">ARCA Rx</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-full glass-panel-quiet px-3.5 py-1.5 text-xs font-semibold text-foreground">
              <Printer className="h-3.5 w-3.5" /> Print / PDF
            </button>
            <button onClick={share} className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background">
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <img src={client.avatar} alt="" className="h-16 w-16 rounded-full object-cover ring-1 ring-[color:var(--glass-stroke-strong)]" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--teal)]">Progress report</p>
            <h1 className="mt-0.5 text-2xl font-semibold tracking-tight">{client.name}</h1>
            <p className="text-sm text-muted-foreground">{client.program} · Week 0 → Week {r.weeks} · {today}</p>
          </div>
        </div>

        <ResultsReport client={client} />

        <footer className="border-t pt-4 text-center text-[11px] text-muted-foreground">
          Prepared by {trainer.name} · ARCA Rx · Generated {today}
        </footer>
      </main>
    </div>
  );
}
