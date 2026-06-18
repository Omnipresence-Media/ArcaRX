import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/features/portal/PortalShell";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Patient Portal — ARCA Rx" },
      { name: "description", content: "Your care, your meds, your results — all in one place." },
    ],
  }),
  component: PortalShell,
});
