import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/marketing/StubPage";

const NAMES: Record<string, string> = {
  mangomint: "Mangomint",
  vagaro: "Vagaro",
  "aesthetic-record": "Aesthetic Record",
};

export const Route = createFileRoute("/compare/$competitor")({
  head: ({ params }) => {
    const n = NAMES[params.competitor] ?? params.competitor;
    return {
      meta: [
        { title: `ARCA Rx vs ${n} — Side-by-Side Comparison` },
        { name: "description", content: `See how ARCA Rx compares to ${n} on EMR, analytics, HIPAA, and pricing.` },
      ],
    };
  },
  component: ComparePage,
});

function ComparePage() {
  const { competitor } = Route.useParams();
  const n = NAMES[competitor] ?? competitor;
  return (
    <StubPage
      title={`ARCA Rx vs ${n}`}
      subtitle={`A side-by-side breakdown of ARCA Rx and ${n} across clinical EMR, growth analytics, HIPAA compliance, pricing, and migration. See why practices are switching.`}
    />
  );
}
