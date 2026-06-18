import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { patients } from "@/lib/seed-data";
import { Send } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Messages — ARCA Rx" }] }),
  component: Messages,
});

function Messages() {
  return (
    <div className="p-4 md:p-8 space-y-5">
      <PageHeader eyebrow="Clients" title="Messages" description="Two-way SMS & email · 12 unread · avg response 4m." />
      <div className="grid gap-4 lg:grid-cols-12 h-[calc(100vh-220px)]">
        <Card className="surface-elevated lg:col-span-4 overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b p-3"><Input placeholder="Search conversations..." className="h-8" /></div>
            <div className="max-h-[60vh] overflow-y-auto">
              {patients.map((p,i) => (
                <button key={p.id} className={`w-full border-b px-3 py-3 text-left hover:bg-muted/50 ${i===0?"bg-muted/40":""}`}>
                  <div className="flex justify-between"><span className="text-sm font-medium">{p.name}</span><span className="text-[10px] text-muted-foreground">{i*7+2}m</span></div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{["See you Tuesday!","Can I push 30 min?","Thank you 🙏","Refill ready?","Booking link?","Got it, thanks!"][i]}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="surface-elevated lg:col-span-8 flex flex-col overflow-hidden">
          <CardContent className="flex flex-1 flex-col p-0">
            <div className="border-b p-3">
              <p className="text-sm font-semibold">{patients[0].name}</p>
              <p className="text-[11px] text-muted-foreground">{patients[0].mrn} · SMS</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {[
                { me: false, t: "Hi! Confirming Tuesday at 9am still works for the neurotoxin touch-up?", time: "9:12 AM" },
                { me: true,  t: "Yes! And can I add a HydraFacial after?", time: "9:14 AM" },
                { me: false, t: "Absolutely — booked you for 10am right after. Total ~90 min.", time: "9:15 AM" },
                { me: true,  t: "Perfect, thank you 🙏", time: "9:16 AM" },
              ].map((m,i) => (
                <div key={i} className={`flex ${m.me?"justify-end":""}`}>
                  <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${m.me?"bg-[color:var(--teal)]/15 border border-[color:var(--teal)]/30":"bg-muted"}`}>
                    {m.t}
                    <div className="mt-1 text-[10px] text-muted-foreground">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3 flex gap-2">
              <Input placeholder="Type a message..." className="h-10" />
              <Button className="h-10 gradient-brand text-white"><Send className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
