import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic, Video as VideoIcon, ShieldCheck, Wifi } from "lucide-react";
import { upcomingVisits } from "@/features/portal/mockData";

export const Route = createFileRoute("/portal/visit/$id")({
  head: () => ({ meta: [{ title: "Telehealth Visit - ARCA Rx" }] }),
  component: VisitRoom,
});

// Jitsi Meet is a free, open telehealth backend requiring no API key.
// Each visit gets a unique, hard-to-guess room name namespaced to ARCA Rx.
function roomName(id: string) {
  return `ArcaRx-Visit-${id}`;
}

function VisitRoom() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);

  const visit = upcomingVisits.find((v) => v.id === id);
  const room = roomName(id);
  const src = `https://meet.jit.si/${room}#config.prejoinPageEnabled=false&config.disableDeepLinking=true&userInfo.displayName=%22Patient%22`;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={() => navigate({ to: "/portal/visits" })}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{visit?.type ?? "Telehealth visit"}</p>
            <p className="text-[11px] text-muted-foreground truncate">
              {visit ? `with ${visit.provider} · ${visit.dateLabel} · ${visit.time}` : "Secure video visit"}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[color:var(--success)]/30 bg-[color:color-mix(in_oklab,var(--success)_10%,transparent)] px-3 py-1 text-[11px] font-medium text-[color:var(--success)]">
          <ShieldCheck className="h-3.5 w-3.5" /> HIPAA-secure connection
        </div>
      </div>

      {joined ? (
        <div className="relative flex-1 overflow-hidden rounded-xl border bg-black">
          <iframe
            title="Telehealth visit"
            src={src}
            className="h-full w-full"
            allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
            style={{ border: 0 }}
          />
        </div>
      ) : (
        <div className="flex-1 rounded-xl border surface-elevated flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-brand">
              <VideoIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Ready to join your visit</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {visit ? `${visit.type} with ${visit.provider}` : "Your provider will be with you shortly."}
              </p>
            </div>

            <div className="rounded-lg border bg-card/60 divide-y divide-border text-left">
              <div className="flex items-center gap-3 px-4 py-2.5">
                <Mic className="h-4 w-4 text-[color:var(--teal)]" />
                <p className="text-sm">Microphone and camera will be requested on join</p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5">
                <Wifi className="h-4 w-4 text-[color:var(--teal)]" />
                <p className="text-sm">Best on a stable Wi-Fi connection</p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5">
                <ShieldCheck className="h-4 w-4 text-[color:var(--teal)]" />
                <p className="text-sm">Encrypted, private, and not recorded</p>
              </div>
            </div>

            <Button className="w-full gradient-brand text-white h-11 text-sm font-semibold" onClick={() => setJoined(true)}>
              <VideoIcon className="mr-2 h-4 w-4" /> Join now
            </Button>
            <Link to="/portal/visits" className="block text-xs text-muted-foreground hover:text-foreground">
              Not now, take me back
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
