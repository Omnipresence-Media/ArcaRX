import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortalShell } from "@/features/portal/PortalShell";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/portal")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Patient Portal - ARCA Rx" },
      { name: "description", content: "Your care, your meds, your results - all in one place." },
    ],
  }),
  component: PortalShell,
});
