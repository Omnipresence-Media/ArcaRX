import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { patients } from "@/lib/data/patients";
import {
  Send, Search, Phone, Video, MoreHorizontal, Paperclip, CheckCheck,
  Check, Clock, AlertCircle, Smile, MessageSquare, Filter, Star,
  ChevronRight, Image as ImageIcon,
} from "lucide-react";
import { TRACK_META } from "@/components/shell/TreatmentPanel";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — ARCA Rx" }] }),
  component: Messages,
});

type MsgStatus = "sending" | "sent" | "delivered" | "read";

interface Message {
  id: string;
  from: "clinic" | "patient";
  text: string;
  time: string;
  status: MsgStatus;
  attachment?: { name: string; type: "image" | "doc" };
}

interface Thread {
  patientId: string;
  unread: number;
  lastMsg: string;
  lastTime: string;
  pinned?: boolean;
  channel: "sms" | "portal";
  messages: Message[];
}

const TEMPLATES = [
  "Your lab results are ready — please log in to your portal to review them.",
  "Time for your follow-up! It's been 3 months since your last visit. Ready to book?",
  "Reminder: your appointment is tomorrow at {time}. Reply CONFIRM or CANCEL.",
  "Your prescription refill has been sent to the pharmacy. Allow 24–48 hours.",
  "We have a new treatment you might love — reply to learn more!",
];

const THREADS: Thread[] = patients.slice(0, 8).map((p, i) => ({
  patientId: p.id,
  unread: [2, 0, 1, 0, 3, 0, 0, 1][i],
  lastMsg: [
    "Can I push my Tuesday appointment 30 min?",
    "Thank you so much! See you next week 🙏",
    "Are my labs back yet?",
    "Got it, thanks! Just confirmed.",
    "What's the difference between semaglutide and tirzepatide?",
    "Booking link please?",
    "The injection site is a little sore — normal?",
    "I need to reschedule, something came up.",
  ][i],
  lastTime: ["2m", "14m", "1h", "2h", "3h", "Yesterday", "Yesterday", "2d"][i],
  pinned: i < 2,
  channel: i % 3 === 0 ? "portal" : "sms",
  messages: buildMessages(p.id, i),
}));

function buildMessages(patientId: string, idx: number): Message[] {
  const patient = patients.find((p) => p.id === patientId)!;
  const name = patient.firstName;
  const sets: Message[][] = [
    [
      { id: "1", from: "clinic",  text: "Hi! Confirming Tuesday at 9am still works for the neurotoxin touch-up?", time: "9:12 AM", status: "read" },
      { id: "2", from: "patient", text: "Yes! And can I add a HydraFacial after?", time: "9:14 AM", status: "read" },
      { id: "3", from: "clinic",  text: "Absolutely — booked you for 10am right after. Total ~90 min.", time: "9:15 AM", status: "read" },
      { id: "4", from: "patient", text: "Perfect, thank you 🙏", time: "9:16 AM", status: "read" },
      { id: "5", from: "patient", text: "Can I push my Tuesday appointment 30 min?", time: "9:58 AM", status: "delivered" },
    ],
    [
      { id: "1", from: "clinic",  text: `Hi ${name}! Your Restylane results look amazing based on the 2-week photos. Any bruising resolved?`, time: "Mon 10:00 AM", status: "read" },
      { id: "2", from: "patient", text: "Yes completely gone! I'm so happy with how it turned out.", time: "Mon 10:45 AM", status: "read" },
      { id: "3", from: "clinic",  text: "Wonderful! We'll book your 3-month touch-up check in September. You're all set.", time: "Mon 11:00 AM", status: "read" },
      { id: "4", from: "patient", text: "Thank you so much! See you next week 🙏", time: "Mon 11:02 AM", status: "read" },
    ],
    [
      { id: "1", from: "clinic",  text: "Hi! Your GLP-1 labs from June 10 were just reviewed by Dr. Patel.", time: "Today 8:30 AM", status: "read" },
      { id: "2", from: "clinic",  text: "Everything looks great — metabolic panel is improved across the board.", time: "Today 8:31 AM", status: "read" },
      { id: "3", from: "patient", text: "Are my labs back yet?", time: "Today 9:44 AM", status: "delivered" },
    ],
    [
      { id: "1", from: "clinic",  text: "Your testosterone injection appointment is confirmed for tomorrow at 11:15am with J. Reeves.", time: "Yesterday 3:00 PM", status: "read" },
      { id: "2", from: "patient", text: "Got it, thanks! Just confirmed.", time: "Yesterday 3:14 PM", status: "read" },
    ],
    [
      { id: "1", from: "patient", text: "Quick question — what's the difference between semaglutide and tirzepatide?", time: "Today 7:02 AM", status: "delivered" },
    ],
    [
      { id: "1", from: "patient", text: "Hey, can you send me the booking link?", time: "Yesterday 2:20 PM", status: "read" },
      { id: "2", from: "clinic",  text: "Of course! Here it is: arca-rx.com/book/imani", time: "Yesterday 2:35 PM", status: "read" },
    ],
    [
      { id: "1", from: "patient", text: "The injection site is a little sore — is that normal?", time: "Yesterday 6:10 PM", status: "read" },
      { id: "2", from: "clinic",  text: "Totally normal for 24–48 hours post-injection. If it worsens or you see redness spreading, let us know right away.", time: "Yesterday 6:45 PM", status: "read" },
    ],
    [
      { id: "1", from: "clinic",  text: "Looking forward to seeing you Friday for your consult!", time: "2d ago", status: "read" },
      { id: "2", from: "patient", text: "I need to reschedule, something came up.", time: "2d ago", status: "delivered" },
    ],
  ];
  return sets[idx] ?? sets[0];
}

function StatusIcon({ status }: { status: MsgStatus }) {
  if (status === "sending")   return <Clock className="h-3 w-3 text-muted-foreground" />;
  if (status === "sent")      return <Check className="h-3 w-3 text-muted-foreground" />;
  if (status === "delivered") return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
  return <CheckCheck className="h-3 w-3 text-[color:var(--teal)]" />;
}

function Messages() {
  const [search, setSearch] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [threads, setThreads] = useState(THREADS);
  const [draft, setDraft] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "pinned">("all");
  const bottomRef = useRef<HTMLDivElement>(null);

  const filtered = threads.filter((t) => {
    const p = patients.find((x) => x.id === t.patientId);
    const nameMatch = p ? `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) : false;
    if (filter === "unread") return t.unread > 0 && nameMatch;
    if (filter === "pinned") return t.pinned && nameMatch;
    return nameMatch || search === "";
  });

  const active = filtered[selectedIdx] ?? filtered[0];
  const activePatient = active ? patients.find((p) => p.id === active.patientId) : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedIdx, threads]);

  function sendMessage() {
    if (!draft.trim() || !active) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const newMsg: Message = { id: String(Date.now()), from: "clinic", text: draft.trim(), time, status: "sent" };
    setThreads((prev) => prev.map((t) =>
      t.patientId === active.patientId
        ? { ...t, messages: [...t.messages, newMsg], lastMsg: draft.trim(), lastTime: "now" }
        : t
    ));
    setDraft("");
    setShowTemplates(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function markRead(idx: number) {
    setThreads((prev) => prev.map((t, i) => i === idx ? { ...t, unread: 0 } : t));
  }

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="border-b px-4 py-3 md:px-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Messages</h1>
          <p className="text-xs text-muted-foreground">Two-way SMS & portal · {totalUnread > 0 ? <span className="text-[color:var(--teal)] font-medium">{totalUnread} unread</span> : "All caught up"}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs">Bulk message</Button>
          <Button size="sm" className="h-8 text-xs gradient-brand text-white"><MessageSquare className="mr-1.5 h-3.5 w-3.5" />New thread</Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Thread list */}
        <div className="w-72 shrink-0 border-r flex flex-col overflow-hidden">
          <div className="p-2 space-y-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients…" className="h-8 pl-8 text-xs" />
            </div>
            <div className="flex gap-1">
              {(["all", "unread", "pinned"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`flex-1 rounded-md px-2 py-1 text-[10px] font-medium capitalize transition-colors ${filter === f ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}>
                  {f}{f === "unread" && totalUnread > 0 ? ` (${totalUnread})` : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((thread, i) => {
              const p = patients.find((x) => x.id === thread.patientId);
              if (!p) return null;
              const initials = `${p.firstName[0]}${p.lastName[0]}`;
              const isActive = active?.patientId === thread.patientId;
              return (
                <button key={thread.patientId} onClick={() => { setSelectedIdx(i); markRead(i); }}
                  className={`w-full border-b px-3 py-3 text-left transition-colors hover:bg-muted/40 ${isActive ? "bg-muted/60" : ""}`}>
                  <div className="flex items-start gap-2.5">
                    <div className="relative shrink-0">
                      <div className="h-9 w-9 rounded-full gradient-brand flex items-center justify-center text-[11px] font-semibold text-white">{initials}</div>
                      {thread.pinned && <Star className="absolute -top-0.5 -right-0.5 h-3 w-3 fill-amber-400 text-amber-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold truncate">{p.firstName} {p.lastName}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{thread.lastTime}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge variant="outline" className={`text-[9px] px-1 py-0 h-4 ${thread.channel === "portal" ? "text-[color:var(--teal)] border-[color:var(--teal)]/30" : "text-muted-foreground"}`}>{thread.channel.toUpperCase()}</Badge>
                        <p className={`text-xs truncate ${thread.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>{thread.lastMsg}</p>
                      </div>
                    </div>
                    {thread.unread > 0 && (
                      <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--teal)] text-[9px] font-bold text-white">{thread.unread}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        {active && activePatient ? (
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full gradient-brand flex items-center justify-center text-xs font-semibold text-white">
                  {activePatient.firstName[0]}{activePatient.lastName[0]}
                </div>
                <div>
                  <Link to="/admin/patients/$id" params={{ id: activePatient.id }} className="text-sm font-semibold hover:text-[color:var(--teal)]">
                    {activePatient.firstName} {activePatient.lastName}
                  </Link>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{activePatient.mrn}</span>
                    <span>·</span>
                    <span>{activePatient.phone}</span>
                    <span>·</span>
                    <Badge variant="outline" className={`text-[9px] px-1 py-0 h-4 ${active.channel === "portal" ? "text-[color:var(--teal)] border-[color:var(--teal)]/30" : "text-muted-foreground"}`}>{active.channel.toUpperCase()}</Badge>
                    {activePatient.treatmentTrack !== "general" && (
                      <Badge variant="outline" className={`text-[9px] px-1 py-0 h-4 ${TRACK_META[activePatient.treatmentTrack].color}`}>
                        {TRACK_META[activePatient.treatmentTrack].label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Phone className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Video className="h-4 w-4" /></Button>
                <Link to="/admin/patients/$id" params={{ id: activePatient.id }}>
                  <Button size="sm" variant="ghost" className="h-8 text-xs px-2">View chart <ChevronRight className="h-3 w-3 ml-0.5" /></Button>
                </Link>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {active.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "clinic" ? "justify-end" : "justify-start"}`}>
                  {msg.from === "patient" && (
                    <div className="h-7 w-7 rounded-full gradient-brand flex items-center justify-center text-[10px] font-semibold text-white mr-2 mt-1 shrink-0">
                      {activePatient.firstName[0]}{activePatient.lastName[0]}
                    </div>
                  )}
                  <div className={`max-w-[68%] ${msg.from === "clinic" ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                    {msg.attachment && (
                      <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs border ${msg.from === "clinic" ? "bg-[color:var(--teal)]/10 border-[color:var(--teal)]/20" : "bg-muted border-border"}`}>
                        {msg.attachment.type === "image" ? <ImageIcon className="h-4 w-4" /> : <Paperclip className="h-4 w-4" />}
                        {msg.attachment.name}
                      </div>
                    )}
                    <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.from === "clinic"
                        ? "bg-[color:var(--teal)]/15 border border-[color:var(--teal)]/25 text-foreground"
                        : "bg-muted text-foreground"
                    }`}>
                      {msg.text}
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] text-muted-foreground px-1 ${msg.from === "clinic" ? "justify-end" : ""}`}>
                      <span>{msg.time}</span>
                      {msg.from === "clinic" && <StatusIcon status={msg.status} />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Templates dropdown */}
            {showTemplates && (
              <div className="border-t bg-card/80 p-2 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 pb-1">Quick templates</p>
                {TEMPLATES.map((t, i) => (
                  <button key={i} onClick={() => { setDraft(t); setShowTemplates(false); }}
                    className="w-full text-left text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md px-2 py-1.5 transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            )}

            {/* Compose */}
            <div className="border-t p-3 flex gap-2 items-end">
              <div className="flex gap-1 shrink-0">
                <Button size="sm" variant="ghost" className="h-9 w-9 p-0" onClick={() => setShowTemplates((s) => !s)}>
                  <Smile className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="flex-1 resize-none rounded-md border border-input bg-card/60 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[color:var(--teal)] min-h-[36px] max-h-[120px]"
              />
              <Button onClick={sendMessage} disabled={!draft.trim()} className="h-9 w-9 p-0 gradient-brand text-white shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-10 w-10 mx-auto opacity-20 mb-3" />
              <p className="text-sm">Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
