import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, FileText, LifeBuoy, MessageSquare, Package, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { practitionerName, useMe, useSpruce } from "@/features/spruce/store";
import { money } from "@/features/spruce/rules";
import { headingFont } from "@/features/spruce/theme";
import { EmptyState, Pill, SectionCard, SpPage, ToneImage } from "@/features/spruce/ui";

export const Route = createFileRoute("/spruce/portal/")({
  head: () => ({ meta: [{ title: "Home - Spruce Micro" }] }),
  component: Home,
});

const STATUS_PILL = {
  incomplete: { tone: "warning", label: "Setup incomplete" },
  active: { tone: "success", label: "Active" },
  past_due: { tone: "danger", label: "Past due" },
  paused: { tone: "warning", label: "Paused" },
  cancelled: { tone: "neutral", label: "Cancelled" },
} as const;

const QUICK = [
  { to: "/spruce/portal/orders", label: "Orders", icon: Package },
  { to: "/spruce/portal/learn", label: "Learn", icon: BookOpen },
  { to: "/spruce/portal/support", label: "Support", icon: LifeBuoy },
  { to: "/spruce/portal/emergency", label: "Emergency", icon: Siren },
  { to: "/spruce/portal/protocols", label: "Protocols", icon: FileText },
] as const;

function Home() {
  const s = useSpruce();
  const me = useMe();
  const first = me.name.split(" ")[0];
  const pill = STATUS_PILL[me.membership];

  const mine = s.checkIns.filter((c) => c.patientId === s.meId);
  const next = mine.find((c) => c.status === "open") ?? mine.find((c) => c.status === "scheduled") ?? mine.find((c) => c.status === "submitted");

  const protocol = s.protocols.find((p) => p.patientId === s.meId);
  const recommended = s.products.filter((p) => p.active && p.type === "non_rx").slice(0, 3);
  const myMessages = s.messages.filter((m) => m.patientId === s.meId);
  const lastMessage = myMessages[myMessages.length - 1];

  return (
    <SpPage title={`Welcome back, ${first}`} sub="Here is what is happening with your skin care plan.">
      <SectionCard title="Membership">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold" style={headingFont}>
              {me.membershipType === "in_clinic" ? "In-Clinic" : me.membershipType === "virtual" ? "Virtual" : "No plan selected"}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Renews {me.nextRenewal}</p>
          </div>
          <Pill tone={pill.tone}>{pill.label}</Pill>
        </div>
      </SectionCard>

      <SectionCard title="Next check-in">
        {!next ? (
          <EmptyState title="Your practitioner will schedule your next check-in" body="You will get a heads up as soon as it is on the calendar." />
        ) : next.status === "open" ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">Your check-in is open, due {next.dueLabel}</p>
            <Button asChild size="sm">
              <Link to="/spruce/portal/check-in">Start check-in <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        ) : next.status === "scheduled" ? (
          <p className="text-sm">Your next check-in opens {next.opensLabel}, due {next.dueLabel}</p>
        ) : (
          <p className="text-sm">Submitted, your practitioner is reviewing</p>
        )}
      </SectionCard>

      <SectionCard
        title="Latest protocol"
        right={<Link to="/spruce/portal/protocols" className="text-xs font-medium text-[color:var(--teal)] hover:underline">View all</Link>}
      >
        {protocol ? (
          <Link to="/spruce/portal/protocols" className="flex items-center justify-between gap-3 rounded-lg p-1 hover:bg-muted">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-[color:var(--teal)]"><FileText className="h-4 w-4" /></div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{protocol.title}</p>
                <p className="text-xs text-muted-foreground">Uploaded {protocol.uploadedLabel}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        ) : (
          <EmptyState title="No protocol yet" body="Your practitioner uploads your protocol after reviewing a check-in." />
        )}
      </SectionCard>

      <SectionCard
        title="Recommended for you"
        right={<Link to="/spruce/portal/store" className="text-xs font-medium text-[color:var(--teal)] hover:underline">Shop all</Link>}
      >
        <div className="grid grid-cols-3 gap-3">
          {recommended.map((p) => (
            <Link key={p.id} to="/spruce/portal/store" className="group space-y-1.5">
              <ToneImage tone={p.tone} className="aspect-square rounded-lg" />
              <p className="line-clamp-2 text-xs font-medium group-hover:underline">{p.name}</p>
              <p className="text-xs text-muted-foreground">{money(p.priceCents)}</p>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Latest message"
        right={<Link to="/spruce/portal/messages" className="text-xs font-medium text-[color:var(--teal)] hover:underline">Open</Link>}
      >
        {lastMessage ? (
          <Link to="/spruce/portal/messages" className="flex items-start gap-3 rounded-lg p-1 hover:bg-muted">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-[color:var(--teal)]"><MessageSquare className="h-4 w-4" /></div>
            <div className="min-w-0">
              <p className="text-xs font-semibold">
                {lastMessage.from === "practitioner" ? practitionerName(s, me.practitionerId) : "You"}
                <span className="ml-2 font-normal text-muted-foreground">{lastMessage.at}</span>
              </p>
              <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{lastMessage.body}</p>
            </div>
          </Link>
        ) : (
          <EmptyState title="No messages yet" body="Message your practitioner anytime with questions or photos." />
        )}
      </SectionCard>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {QUICK.map((q) => (
          <Link key={q.to} to={q.to} className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-colors hover:border-[color:var(--teal)]">
            <q.icon className="h-5 w-5 text-[color:var(--teal)]" />
            <span className="text-xs font-medium">{q.label}</span>
          </Link>
        ))}
      </div>
    </SpPage>
  );
}
