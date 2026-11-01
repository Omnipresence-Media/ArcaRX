import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Send, Paperclip, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, Pill, SectionCard, SpPage } from "@/features/spruce/ui";
import { setEmergencyStatus, sendMessage, setTicketStatus, useSpruce, type Emergency, type Message, type Ticket } from "@/features/spruce/store";

export const Route = createFileRoute("/spruce/admin/inbox")({
  head: () => ({ meta: [{ title: "Inbox - Spruce Micro" }] }),
  component: Inbox,
});

const TOPIC_LABEL: Record<Ticket["topic"], string> = {
  pharmacy_order: "Pharmacy order",
  billing: "Billing",
  technical: "Technical",
  other: "Other",
};

const EMERGENCY_TONE: Record<Emergency["status"], "danger" | "warning" | "success"> = {
  open: "danger",
  acknowledged: "warning",
  resolved: "success",
};

const EMERGENCY_LABEL: Record<Emergency["status"], string> = {
  open: "Open",
  acknowledged: "Acknowledged",
  resolved: "Resolved",
};

const TICKET_LABEL: Record<Ticket["status"], string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed",
};

function CountBadge({ n, hot = false }: { n: number; hot?: boolean }) {
  return (
    <span className={`ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${hot && n > 0 ? "bg-red-100 text-red-700" : "bg-muted text-muted-foreground"}`}>
      {n}
    </span>
  );
}

function Inbox() {
  const s = useSpruce();
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const patientName = (id: string) => s.patients.find((p) => p.id === id)?.name ?? "Unknown patient";
  const patientCode = (id: string) => s.patients.find((p) => p.id === id)?.code ?? "";

  const threads = useMemo(() => {
    const byPatient = new Map<string, Message[]>();
    for (const m of s.messages) {
      const list = byPatient.get(m.patientId) ?? [];
      list.push(m);
      byPatient.set(m.patientId, list);
    }
    return [...byPatient.entries()]
      .map(([patientId, msgs]) => {
        const last = msgs[msgs.length - 1];
        const needsReply = last.from === "patient";
        return {
          patientId,
          msgs,
          last,
          needsReply,
          photos: msgs.filter((m) => m.from === "patient").reduce((a, m) => a + m.photos, 0),
        };
      })
      .sort((a, b) => Number(b.needsReply) - Number(a.needsReply));
  }, [s.messages]);

  const activeId = selected ?? threads[0]?.patientId ?? null;
  const active = threads.find((t) => t.patientId === activeId);

  const emergencies = [...s.emergencies].sort((a, b) => Number(b.status === "open") - Number(a.status === "open"));
  const openEmergencies = s.emergencies.filter((e) => e.status === "open").length;
  const openTickets = s.tickets.filter((t) => t.status !== "closed").length;
  const awaiting = threads.filter((t) => t.needsReply).length;

  function reply() {
    const body = draft.trim();
    if (!activeId || !body) {
      toast.error("Write a reply first");
      return;
    }
    sendMessage(activeId, "practitioner", body);
    setDraft("");
    toast.success(`Reply sent to ${patientName(activeId)}`);
  }

  return (
    <SpPage title="Inbox" sub="Patient messages, emergency requests and support tickets in one place.">
      <Tabs defaultValue="messages">
        <TabsList>
          <TabsTrigger value="messages">Messages<CountBadge n={awaiting} hot /></TabsTrigger>
          <TabsTrigger value="emergencies">Emergencies<CountBadge n={openEmergencies} hot /></TabsTrigger>
          <TabsTrigger value="tickets">Support tickets<CountBadge n={openTickets} /></TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="mt-4">
          {threads.length === 0 ? (
            <EmptyState title="No messages yet" body="When a patient writes to their practitioner, the conversation shows up here." />
          ) : (
            <div className="grid gap-4 md:grid-cols-[300px_1fr]">
              <div className="space-y-2">
                {threads.map((t) => (
                  <button
                    key={t.patientId}
                    onClick={() => setSelected(t.patientId)}
                    className={`w-full rounded-xl border bg-card p-3 text-left transition-colors hover:bg-muted/40 ${t.patientId === activeId ? "border-[color:var(--teal)] ring-1 ring-[color:var(--teal)]" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{patientName(t.patientId)} <span className="font-mono text-xs font-normal text-muted-foreground">{patientCode(t.patientId)}</span></p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{t.last.at}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.last.from === "practitioner" ? "You: " : ""}{t.last.body}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {t.needsReply && (t.last.overdue === true
                        ? <Pill tone="danger"><AlertTriangle className="h-3 w-3" />No reply in 24h+</Pill>
                        : <Pill tone="neutral">Needs reply</Pill>)}
                      {t.photos > 0 && <Pill tone="info"><Paperclip className="h-3 w-3" />{t.photos} {t.photos === 1 ? "photo" : "photos"}</Pill>}
                    </div>
                  </button>
                ))}
              </div>

              {active && (
                <SectionCard
                  title={`${patientName(active.patientId)} ${patientCode(active.patientId)}`}
                  right={active.photos > 0 ? <Pill tone="info"><Paperclip className="h-3 w-3" />{active.photos} {active.photos === 1 ? "photo" : "photos"} from patient</Pill> : undefined}
                >
                  <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                    {active.msgs.map((m) => {
                      const mine = m.from === "practitioner";
                      return (
                        <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${mine ? "rounded-br-sm bg-[color:var(--teal)] text-white" : "rounded-bl-sm bg-muted"}`}>
                            <p>{m.body}</p>
                            <p className={`mt-1 flex items-center gap-1.5 text-[10px] ${mine ? "text-white/80" : "text-muted-foreground"}`}>
                              {m.at}
                              {m.photos > 0 && <span className="inline-flex items-center gap-0.5"><Paperclip className="h-3 w-3" />{m.photos}</span>}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 space-y-2 border-t pt-4">
                    <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a reply to the patient" rows={3} />
                    <div className="flex justify-end">
                      <Button onClick={reply} className="bg-[color:var(--teal)] text-white hover:bg-[color:var(--teal)]/90">
                        <Send className="mr-1.5 h-4 w-4" />Send reply
                      </Button>
                    </div>
                  </div>
                </SectionCard>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="emergencies" className="mt-4 space-y-3">
          {emergencies.length === 0 ? (
            <EmptyState title="No emergency requests" body="Urgent requests from patients land here first and notify the emergency managers." />
          ) : (
            emergencies.map((e) => (
              <div key={e.id} className={`rounded-xl border p-4 ${e.status === "open" ? "border-red-200 bg-red-50" : "bg-card"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{patientName(e.patientId)} <span className="font-mono text-xs font-normal text-muted-foreground">{patientCode(e.patientId)}</span></p>
                    <p className="mt-1 text-sm">{e.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{e.at}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Pill tone={EMERGENCY_TONE[e.status]}>{EMERGENCY_LABEL[e.status]}</Pill>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={e.status !== "open"}
                        onClick={() => { setEmergencyStatus(e.id, "acknowledged"); toast.success(`Emergency from ${patientName(e.patientId)} acknowledged`); }}
                      >
                        Acknowledge
                      </Button>
                      <Button
                        size="sm"
                        disabled={e.status === "resolved"}
                        onClick={() => { setEmergencyStatus(e.id, "resolved"); toast.success(`Emergency from ${patientName(e.patientId)} resolved`); }}
                        className="bg-[color:var(--teal)] text-white hover:bg-[color:var(--teal)]/90"
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="tickets" className="mt-4 space-y-3">
          {s.tickets.length === 0 ? (
            <EmptyState title="No support tickets" body="Patient questions about orders, billing or the app will appear here." />
          ) : (
            s.tickets.map((t) => (
              <div key={t.id} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone="brand">{TOPIC_LABEL[t.topic]}</Pill>
                      <p className="text-sm font-semibold">{patientName(t.patientId)} <span className="font-mono text-xs font-normal text-muted-foreground">{patientCode(t.patientId)}</span></p>
                      {t.orderId && <span className="font-mono text-xs text-muted-foreground">{t.orderId}</span>}
                    </div>
                    <p className="mt-1.5 text-sm">{t.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.at}</p>
                  </div>
                  <Select
                    value={t.status}
                    onValueChange={(v) => { setTicketStatus(t.id, v as Ticket["status"]); toast.success(`Ticket marked ${TICKET_LABEL[v as Ticket["status"]].toLowerCase()}`); }}
                  >
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Slack alerts are PHI-free: they carry only a patient code and a link back here. See them in the Demo outbox.
      </p>
    </SpPage>
  );
}
