import { createFileRoute } from "@tanstack/react-router";
import { SpruceAdminShell } from "@/features/spruce/SpruceAdminShell";

export const Route = createFileRoute("/spruce/admin")({
  head: () => ({ meta: [{ title: "Staff Admin - Spruce Micro" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: SpruceAdminShell,
});
