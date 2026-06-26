import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { messageThreads, sampleConversation, fitClients, checkInCard } from "@/lib/fit-seed";
import { Search, Paperclip, Send } from "lucide-react";

export const Route = createFileRoute("/admin/fit/messages")({
  head: () => ({ meta: [{ title: "Messages - ARCA Fit" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const [selected, setSelected] = useState(messageThreads[0].id);
  const thread = messageThreads.find((t) => t.id === selected) ?? messageThreads[0];
  const client = fitClients.find((c) => c.name === thread.client);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching"
        title="Messages"
        description="Two-way chat with check-in cards inline."
      />

      <div className="glass-panel grid grid-cols-1 lg:grid-cols-[320px_1fr] overflow-hidden" style={{ minHeight: 600 }}>
        {/* Threads */}
        <aside className="border-r border-[color:var(--glass-stroke)] p-3">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search threads…" className="h-9 w-full rounded-full glass-panel-quiet pl-9 pr-3 text-xs outline-none placeholder:text-muted-foreground" />
          </div>
          <div className="space-y-1">
            {messageThreads.map((t) => {
              const active = t.id === selected;
              const c = fitClients.find((x) => x.name === t.client);
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`w-full rounded-lg p-2.5 text-left transition-colors flex items-center gap-2.5 ${
                    active ? "bg-[color:color-mix(in_oklab,var(--teal)_14%,transparent)]"
                           : "hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)]"
                  }`}
                >
                  {c && <img src={c.avatar} className="h-9 w-9 rounded-full object-cover ring-1 ring-[color:var(--glass-stroke-strong)]" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-foreground">{t.client}</p>
                      <span className="text-[10px] text-muted-foreground">{t.when}</span>
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">{t.last}</p>
                  </div>
                  {t.unread > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[color:var(--teal)] px-1.5 text-[10px] font-semibold text-white">
                      {t.unread}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Conversation */}
        <div className="flex flex-col min-w-0">
          <header className="flex items-center gap-3 border-b border-[color:var(--glass-stroke)] p-4">
            {client && <img src={client.avatar} className="h-10 w-10 rounded-full object-cover ring-1 ring-[color:var(--glass-stroke-strong)]" />}
            <div>
              <p className="text-sm font-semibold text-foreground">{thread.client}</p>
              <p className="text-[11px] text-muted-foreground">{client?.program} · {client?.goal}</p>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {sampleConversation.map((m, i) => (
              <div key={i} className={`flex ${m.from === "trainer" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.from === "trainer"
                    ? "bg-foreground text-background rounded-br-sm"
                    : "glass-panel-quiet text-foreground rounded-bl-sm"
                }`}>
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[10px] ${m.from === "trainer" ? "text-background/60" : "text-muted-foreground"}`}>{m.when}</p>
                </div>
              </div>
            ))}

            {/* Inline check-in card */}
            <div className="flex justify-start">
              <div className="glass-panel max-w-[80%] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--teal)]">Week {checkInCard.week} check-in</p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  <Cell label="Weight"  value={`${checkInCard.weight}`} />
                  <Cell label="Δ"        value={`${checkInCard.weightDelta}`} />
                  <Cell label="Mood"    value={`${checkInCard.mood}/10`} />
                  <Cell label="Energy"  value={`${checkInCard.energy}/10`} />
                  <Cell label="Sleep"   value={`${checkInCard.sleep}h`} />
                  <Cell label="Steps"   value={`${(checkInCard.steps/1000).toFixed(1)}k`} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  {checkInCard.photos.map((p, i) => (
                    <img key={i} src={p} className="aspect-square w-full rounded-md object-cover" />
                  ))}
                </div>
                <p className="mt-3 text-xs text-foreground/80 italic">"{checkInCard.notes}"</p>
              </div>
            </div>
          </div>

          <footer className="border-t border-[color:var(--glass-stroke)] p-3">
            <div className="flex items-center gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-full glass-panel-quiet text-muted-foreground hover:text-foreground">
                <Paperclip className="h-4 w-4" />
              </button>
              <input placeholder="Type a message…" className="h-10 flex-1 rounded-full glass-panel-quiet px-4 text-sm outline-none placeholder:text-muted-foreground" />
              <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
                <Send className="h-3.5 w-3.5" /> Send
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[color:var(--glass-stroke)] p-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="metric-numeral mt-0.5 text-base text-foreground">{value}</p>
    </div>
  );
}
