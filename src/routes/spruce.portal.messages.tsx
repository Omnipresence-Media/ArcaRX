import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { practitionerName, sendMessage, useMe, useSpruce } from "@/features/spruce/store";
import { EmptyState, SpPage } from "@/features/spruce/ui";

export const Route = createFileRoute("/spruce/portal/messages")({
  head: () => ({ meta: [{ title: "Messages - Spruce Micro" }] }),
  component: Messages,
});

const MAX_PHOTOS = 3;

type Pending = { id: string; url: string };

function Messages() {
  const s = useSpruce();
  const me = useMe();
  const [body, setBody] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const mine = s.messages.filter((m) => m.patientId === s.meId);
  const name = practitionerName(s, me.practitionerId);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mine.length]);

  function onPick(files: FileList | null) {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (pending.length + incoming.length > MAX_PHOTOS) {
      toast.error(`You can attach up to ${MAX_PHOTOS} photos per message.`);
      return;
    }
    setPending((prev) => [
      ...prev,
      ...incoming.map((f, i) => ({ id: `${Date.now()}-${i}-${f.name}`, url: URL.createObjectURL(f) })),
    ]);
  }

  function removePhoto(id: string) {
    setPending((prev) => {
      const gone = prev.find((p) => p.id === id);
      if (gone) URL.revokeObjectURL(gone.url);
      return prev.filter((p) => p.id !== id);
    });
  }

  function send() {
    const text = body.trim();
    if (!text && pending.length === 0) return;
    sendMessage(me.id, "patient", text || "Photo attached", pending.length);
    pending.forEach((p) => URL.revokeObjectURL(p.url));
    setPending([]);
    setBody("");
    toast.success("Message sent");
  }

  return (
    <SpPage title="Messages" sub="Chat with your practitioner.">
      <div className="flex min-h-[70vh] flex-col overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted-foreground">Usually replies within 24 hours</p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {mine.length === 0 ? (
            <EmptyState
              title="Say hello to your practitioner"
              body="Ask a question or share a photo. Your practitioner will reply here."
            />
          ) : (
            mine.map((m) => {
              const isMe = m.from === "patient";
              return (
                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] space-y-1 sm:max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${
                        isMe ? "bg-primary text-primary-foreground" : "border bg-card"
                      }`}
                    >
                      {m.body}
                      {m.photos > 0 && (
                        <span
                          className={`mt-2 flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            isMe ? "bg-white/20" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Camera className="h-3 w-3" />
                          {m.photos} {m.photos === 1 ? "photo" : "photos"}
                        </span>
                      )}
                    </div>
                    <span className="px-1 text-[11px] text-muted-foreground">{m.at}</span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        <div className="space-y-2 border-t bg-card p-3">
          {pending.length > 0 && (
            <div className="flex gap-2">
              {pending.map((p) => (
                <div key={p.id} className="relative h-14 w-14 overflow-hidden rounded-lg border">
                  <img src={p.url} alt="Pending attachment" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(p.id)}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/70 text-white"
                    aria-label="Remove photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                onPick(e.target.files);
                e.target.value = "";
              }}
            />
            <Button type="button" variant="outline" size="icon" onClick={() => fileRef.current?.click()} aria-label="Attach photos">
              <Camera className="h-4 w-4" />
            </Button>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Write a message"
              rows={1}
              className="min-h-10 flex-1 resize-none"
            />
            <Button type="button" onClick={send} disabled={!body.trim() && pending.length === 0} aria-label="Send message">
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </SpPage>
  );
}
