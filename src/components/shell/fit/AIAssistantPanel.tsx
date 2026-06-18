import { useEffect, useState } from "react";
import { Sparkles, X, ArrowUp, FileText } from "lucide-react";
import { aiSuggestions, aiSampleResponse } from "@/lib/fit-seed-extra";

export function AIAssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [streamed, setStreamed] = useState<number>(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (streamed >= aiSampleResponse.length) { setRunning(false); return; }
    const t = setTimeout(() => setStreamed((s) => s + 1), 380);
    return () => clearTimeout(t);
  }, [running, streamed]);

  function run(text: string) {
    setPrompt(text);
    setStreamed(0);
    setRunning(true);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="flex-1 bg-background/60 backdrop-blur-sm"
      />
      <aside
        className="flex h-full w-full max-w-[440px] flex-col border-l border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_92%,transparent)] backdrop-blur-2xl shadow-2xl"
        style={{ animation: "slide-in-right 360ms var(--ease-out-quint) both" }}
      >
        <header className="flex items-center justify-between border-b border-[color:var(--glass-stroke)] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-brand">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">Arca Coach Assistant</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Trained on your roster</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {!running && streamed === 0 && (
            <>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Try</p>
              <div className="space-y-2">
                {aiSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => run(s)}
                    className="w-full rounded-lg border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] p-3 text-left text-sm text-foreground/90 transition-colors hover:bg-[color:color-mix(in_oklab,var(--surface-glass)_75%,transparent)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {(running || streamed > 0) && (
            <div className="space-y-3">
              <div className="rounded-lg bg-[color:color-mix(in_oklab,var(--teal)_8%,transparent)] p-3 text-sm text-foreground">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--teal)]">You</p>
                <p className="mt-1">{prompt}</p>
              </div>
              {aiSampleResponse.slice(0, streamed).map((line, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 text-sm ${
                    line.kind === "cite"
                      ? "border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_45%,transparent)] text-[11px] text-muted-foreground"
                      : line.kind === "intent"
                      ? "border-[color:color-mix(in_oklab,var(--teal)_25%,transparent)] bg-[color:color-mix(in_oklab,var(--teal)_6%,transparent)] text-foreground"
                      : "border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_55%,transparent)] text-foreground/90"
                  }`}
                  style={{ animation: "fade-in 220ms var(--ease-out-quint) both" }}
                >
                  {line.kind === "cite" && <FileText className="mb-1 inline h-3 w-3 opacity-70" />} {line.text}
                </div>
              ))}
              {running && (
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--teal)]" />
                  drafting…
                </div>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); if (prompt.trim()) run(prompt); }}
          className="border-t border-[color:var(--glass-stroke)] p-3"
        >
          <div className="flex items-end gap-2 rounded-xl border border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--surface-glass)_60%,transparent)] p-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              placeholder="Ask, draft, summarize…"
              className="flex-1 resize-none bg-transparent px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <button
              type="submit"
              className="grid h-8 w-8 place-items-center rounded-lg gradient-brand text-white"
              aria-label="Send"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">Prototype · cites your client data</p>
        </form>
      </aside>
    </div>
  );
}
