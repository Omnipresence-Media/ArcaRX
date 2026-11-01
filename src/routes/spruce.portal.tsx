import { createFileRoute } from "@tanstack/react-router";
import { SpruceShell } from "@/features/spruce/SpruceShell";

export const Route = createFileRoute("/spruce/portal")({
  head: () => ({
    meta: [
      { title: "Patient Portal - Spruce Micro" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Your skincare protocol, check-ins and store in one place." },
    ],
  }),
  component: SpruceShell,
});
