import { createFileRoute } from "@tanstack/react-router";
import { fitClients } from "@/lib/fit-seed";
import { useClientPrograms, type ProgramKey } from "@/features/coaching/programsStore";
import { ClientCoachingView } from "@/features/coaching/ClientCoachingView";
import { Flame } from "lucide-react";

// Standalone client coaching portal - shareable/previewable per client.
// The same experience is embedded in the patient portal at /portal/coaching.
export const Route = createFileRoute("/coaching/$id")({
  head: () => ({ meta: [{ title: "My Coaching - ARCA Rx" }] }),
  component: ClientCoachingPortal,
});

function ClientCoachingPortal() {
  const { id } = Route.useParams();
  const client = fitClients.find((c) => c.id === id) ?? fitClients[0];
  const programs = useClientPrograms(id);
  const enabledCount = (Object.keys(programs) as ProgramKey[]).filter((k) => programs[k]).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full gradient-brand" />
            <span className="text-lg font-semibold tracking-tight">ARCA Rx</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <img src={client.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            <span className="hidden font-medium sm:inline">{client.name.split(" ")[0]}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--teal)]">Your coaching</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Welcome back, {client.name.split(" ")[0]}.</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-[color:var(--warning)]" />
            Week {client.startedWeeksAgo} · {enabledCount} active program{enabledCount !== 1 ? "s" : ""}
          </p>
        </div>
        <ClientCoachingView clientId={id} />
      </main>
    </div>
  );
}
