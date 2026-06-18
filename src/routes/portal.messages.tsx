import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { threads } from "@/features/portal/mockData";

export const Route = createFileRoute("/portal/messages")({
  head: () => ({ meta: [{ title: "Messages — ARCA Rx Portal" }] }),
  component: Messages,
});

function Messages() {
  const [activeId, setActiveId] = useState(threads[0].id);
  const [draft, setDraft] = useState("");
  const active = threads.find((t) => t.id === activeId)!;

  return (
    <div className="flex h-[calc(100vh-3.5rem-5rem)] flex-col p-4 md:h-[calc(100vh-3.5rem)] md:flex-row md:gap-4 md:p-8">
      {/* Thread list */}
      <Card className="surface-elevated md:w-72 md:shrink-0 mb-3 md:mb-0">
        <CardContent className="p-2">
          <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conversations</p>
          <div className="space-y-1">
            {threads.map((t) => {
              const active = t.id === activeId;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={`flex w-full items-start gap-3 rounded-md p-2.5 text-left transition-colors ${
                    active ? "bg-[color:color-mix(in_oklab,var(--teal)_12%,transparent)]" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-brand text-[10px] font-semibold text-white">
                    {t.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-sm font-medium">{t.with}</p>
                      <span className="text-[10px] text-muted-foreground">{t.lastAt}</span>
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">{t.preview}</p>
                  </div>
                  {t.unread > 0 && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[color:var(--teal)]" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conversation */}
      <Card className="surface-elevated flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-3 border-b p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-brand text-[11px] font-semibold text-white">
            {active.initials}
          </div>
          <div>
            <p className="text-sm font-semibold">{active.with}</p>
            <p className="text-[11px] text-muted-foreground">{active.role}</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {active.messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm ${
                m.from === "me"
                  ? "gradient-brand text-white"
                  : "border bg-card"
              }`}>
                <p className="leading-relaxed">{m.text}</p>
                <p className={`mt-1 text-[10px] ${m.from === "me" ? "text-white/70" : "text-muted-foreground"}`}>{m.at}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t p-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            className="flex-1"
          />
          <Button size="sm" className="h-9 gradient-brand text-white" disabled={!draft.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
