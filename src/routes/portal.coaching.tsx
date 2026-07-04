import { createFileRoute } from "@tanstack/react-router";
import { ClientCoachingView } from "@/features/coaching/ClientCoachingView";
import { useClientPrograms, type ProgramKey } from "@/features/coaching/programsStore";
import { Flame } from "lucide-react";

// The coaching program lives INSIDE the patient portal - this is how a real
// user reaches their training: log in, tap Coaching. Demo identity maps the
// portal patient to coaching client c1; swap for the auth user id when the
// real backend lands.
const DEMO_CLIENT_ID = "c1";

export const Route = createFileRoute("/portal/coaching")({
  head: () => ({ meta: [{ title: "Coaching - ARCA Rx Portal" }] }),
  component: PortalCoaching,
});

function PortalCoaching() {
  const programs = useClientPrograms(DEMO_CLIENT_ID);
  const enabledCount = (Object.keys(programs) as ProgramKey[]).filter((k) => programs[k]).length;

  return (
    <div className="space-y-5 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Coaching</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Flame className="h-3.5 w-3.5 text-[color:var(--warning)]" />
          {enabledCount > 0
            ? `${enabledCount} active program${enabledCount !== 1 ? "s" : ""} · log your work as you go`
            : "Your programs will appear here once your coach enables them"}
        </p>
      </div>
      <ClientCoachingView clientId={DEMO_CLIENT_ID} />
    </div>
  );
}
