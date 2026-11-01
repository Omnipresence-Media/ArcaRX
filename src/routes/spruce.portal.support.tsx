import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SpPage, SectionCard, Pill, EmptyState } from "@/features/spruce/ui";
import { createTicket, useSpruce, type Ticket } from "@/features/spruce/store";

export const Route = createFileRoute("/spruce/portal/support")({
  head: () => ({ meta: [{ title: "Support - Spruce Micro" }] }),
  validateSearch: (s: Record<string, unknown>): { order?: string } => ({ order: typeof s.order === "string" ? s.order : undefined }),
  component: Support,
});

const TOPICS: { value: Ticket["topic"]; label: string }[] = [
  { value: "pharmacy_order", label: "Pharmacy order" },
  { value: "billing", label: "Billing" },
  { value: "technical", label: "Technical" },
  { value: "other", label: "Other" },
];
const STATUS: Record<Ticket["status"], { label: string; tone: "warning" | "info" | "success" }> = {
  open: { label: "Open", tone: "warning" },
  in_progress: { label: "In progress", tone: "info" },
  closed: { label: "Closed", tone: "success" },
};

const selectCls = "h-9 w-full rounded-md border bg-card px-3 text-sm";

function Support() {
  const s = useSpruce();
  const search = Route.useSearch();
  const myOrders = s.orders.filter((o) => o.patientId === s.meId);
  const myTickets = s.tickets.filter((t) => t.patientId === s.meId);

  const initialOrder = search.order && myOrders.some((o) => o.id === search.order) ? search.order : "";
  const [topic, setTopic] = useState<Ticket["topic"]>(initialOrder ? "pharmacy_order" : "other");
  const [orderId, setOrderId] = useState<string>(initialOrder);
  const [body, setBody] = useState("");

  const submit = () => {
    if (!body.trim()) {
      toast.error("Please describe what you need help with.");
      return;
    }
    createTicket(topic, body.trim(), orderId || undefined);
    setBody("");
    toast.success("Support request sent");
  };

  return (
    <SpPage title="Support" sub="Questions about an order, billing or the app. We usually reply within one business day.">
      <SectionCard title="New request">
        <div className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="sp-topic" className="text-xs font-medium">Topic</label>
            <select id="sp-topic" className={selectCls} value={topic} onChange={(e) => setTopic(e.target.value as Ticket["topic"])}>
              {TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="sp-order" className="text-xs font-medium">Order (optional)</label>
            <select id="sp-order" className={selectCls} value={orderId} onChange={(e) => setOrderId(e.target.value)}>
              <option value="">Not about a specific order</option>
              {myOrders.map((o) => <option key={o.id} value={o.id}>{o.id} - {o.createdLabel}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="sp-body" className="text-xs font-medium">Message</label>
            <Textarea id="sp-body" rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Tell us what is going on. Please do not include card numbers." />
          </div>
          <Button onClick={submit} className="w-full sm:w-auto">Send request</Button>
        </div>
      </SectionCard>

      <SectionCard title="Your requests">
        {myTickets.length === 0 ? (
          <EmptyState title="No requests yet" body="When you send a request it will show up here with its status." />
        ) : (
          <ul className="divide-y">
            {myTickets.map((t) => (
              <li key={t.id} className="space-y-1 py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{TOPICS.find((x) => x.value === t.topic)?.label ?? "Other"}</span>
                  <Pill tone={STATUS[t.status].tone}>{STATUS[t.status].label}</Pill>
                </div>
                <p className="text-sm text-muted-foreground">{t.body}</p>
                <p className="text-xs text-muted-foreground">{t.at}{t.orderId ? ` - Order ${t.orderId}` : ""}</p>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </SpPage>
  );
}
