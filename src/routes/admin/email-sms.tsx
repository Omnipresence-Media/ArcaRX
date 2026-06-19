import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Zap, Mail, MessageSquare, Clock, CheckCircle2,
  Plus, Play, Pause, Edit3,
  Calendar, FlaskConical, Pill, AlertTriangle, Star, DollarSign,
  RefreshCw, Bell,
} from "lucide-react";

export const Route = createFileRoute("/admin/email-sms")({
  head: () => ({ meta: [{ title: "Automations — ARCA Rx" }] }),
  component: AutomationsPage,
});

type AutoStatus = "active" | "paused" | "draft";
type TriggerType = "appointment" | "no-show" | "labs" | "refill" | "membership" | "birthday" | "inactivity" | "post-visit" | "titration";
type Channel = "sms" | "email" | "both";

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  channel: Channel;
  status: AutoStatus;
  sent: number;
  openRate?: number;
  responseRate?: number;
  delay: string;
  treatmentTrack?: string;
  messagePreview: string;
}

const AUTOMATIONS: Automation[] = [
  {
    id: "a-1", name: "Appointment reminder",
    description: "Sends 24h before every scheduled appointment.",
    trigger: "appointment", channel: "both", status: "active",
    sent: 847, openRate: 94, responseRate: 68, delay: "24 hours before",
    messagePreview: "Hi {first_name}! Reminder: your {appointment_type} appointment is tomorrow at {time} with {provider}. Reply CONFIRM or CANCEL.",
  },
  {
    id: "a-2", name: "No-show recovery",
    description: "Sends 2 hours after a missed appointment with a rebooking link.",
    trigger: "no-show", channel: "sms", status: "active",
    sent: 124, openRate: 88, responseRate: 41, delay: "2 hours after",
    messagePreview: "Hi {first_name}, we missed you today! Life happens. Click here to rebook: {booking_link}",
  },
  {
    id: "a-3", name: "Lab results ready",
    description: "Notifies patient when provider marks labs as reviewed.",
    trigger: "labs", channel: "both", status: "active",
    sent: 312, openRate: 97, responseRate: 29, delay: "On event",
    messagePreview: "Your lab results have been reviewed by {provider}. Log in to view them: {portal_link}",
  },
  {
    id: "a-4", name: "Botox 3-month touchup reminder",
    description: "Reminds Botox patients to book their touchup appointment.",
    trigger: "post-visit", channel: "sms", status: "active",
    sent: 201, openRate: 91, responseRate: 52, delay: "90 days after Botox visit",
    treatmentTrack: "aesthetics",
    messagePreview: "Hi {first_name}! It's been about 3 months since your neurotoxin treatment — time for your touchup! Book here: {booking_link}",
  },
  {
    id: "a-5", name: "GLP-1 weekly check-in",
    description: "Weekly weight and side effect check-in for semaglutide/tirzepatide patients.",
    trigger: "titration", channel: "sms", status: "active",
    sent: 638, openRate: 83, responseRate: 71, delay: "Every 7 days",
    treatmentTrack: "glp1",
    messagePreview: "Hey {first_name}! Quick weekly check-in. Reply with your weight today and rate any side effects 1-5 (1=none, 5=severe).",
  },
  {
    id: "a-6", name: "TRT 90-day lab reminder",
    description: "Prompts TRT patients to schedule their quarterly lab draw.",
    trigger: "labs", channel: "both", status: "active",
    sent: 189, openRate: 89, responseRate: 44, delay: "85 days after last draw",
    treatmentTrack: "trt",
    messagePreview: "Hi {first_name}, your quarterly TRT labs are due in about 5 days. Book your lab draw here: {booking_link}",
  },
  {
    id: "a-7", name: "Prescription refill alert",
    description: "Notifies patient when a refill is due within 7 days.",
    trigger: "refill", channel: "sms", status: "active",
    sent: 445, openRate: 96, responseRate: 38, delay: "7 days before expiry",
    messagePreview: "Hi {first_name}, your {medication} refill is due soon. We'll send it to {pharmacy} — reply CONFIRM to authorize.",
  },
  {
    id: "a-8", name: "Membership renewal",
    description: "Sends 30 and 7 days before membership expiration.",
    trigger: "membership", channel: "email", status: "active",
    sent: 98, openRate: 72, responseRate: 31, delay: "30 days before renewal",
    messagePreview: "Your {tier} Membership renews on {renewal_date}. Thank you for being a valued member!",
  },
  {
    id: "a-9", name: "Filler 6-month follow-up",
    description: "Checks in with filler patients at 6 and 12 months.",
    trigger: "post-visit", channel: "sms", status: "active",
    sent: 77, openRate: 87, responseRate: 34, delay: "6 months after filler visit",
    treatmentTrack: "aesthetics",
    messagePreview: "Hi {first_name}! Checking in on your filler results at 6 months. Ready to refresh? {booking_link}",
  },
  {
    id: "a-10", name: "Inactive patient win-back",
    description: "Re-engages patients who haven't visited in 90+ days.",
    trigger: "inactivity", channel: "both", status: "paused",
    sent: 143, openRate: 61, responseRate: 18, delay: "90 days since last visit",
    messagePreview: "Hi {first_name}, we've been thinking about you! Come back and we'll do a complimentary check-in. Book here: {booking_link}",
  },
  {
    id: "a-11", name: "Birthday message",
    description: "Sends a birthday message with a special offer.",
    trigger: "birthday", channel: "sms", status: "active",
    sent: 214, openRate: 99, responseRate: 28, delay: "On birthday",
    messagePreview: "Happy birthday, {first_name}! Celebrate with 15% off your next visit this month — use code BDAY25.",
  },
  {
    id: "a-12", name: "Post-visit review request",
    description: "Requests a Google review 48 hours after a completed visit.",
    trigger: "post-visit", channel: "sms", status: "draft",
    sent: 0, delay: "48 hours after visit",
    messagePreview: "Hi {first_name}, we hope your visit went great! A quick Google review means the world to us: {review_link}",
  },
];

const TRIGGER_ICONS: Record<TriggerType, React.ElementType> = {
  appointment: Calendar, "no-show": AlertTriangle, labs: FlaskConical,
  refill: Pill, membership: Star, birthday: Bell, inactivity: Clock,
  "post-visit": CheckCircle2, titration: RefreshCw,
};

const TRACK_COLORS: Record<string, string> = {
  glp1: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  trt:  "text-blue-400 border-blue-500/20 bg-blue-500/10",
  aesthetics: "text-violet-400 border-violet-500/20 bg-violet-500/10",
};

function AutomationCard({ auto, onToggle }: { auto: Automation; onToggle: () => void }) {
  const TriggerIcon = TRIGGER_ICONS[auto.trigger];
  return (
    <Card className={`surface-elevated transition-colors ${auto.status === "paused" ? "opacity-70" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              auto.status === "active" ? "bg-[color:var(--teal)]/10" : "bg-muted"
            }`}>
              <TriggerIcon className={`h-4 w-4 ${auto.status === "active" ? "text-[color:var(--teal)]" : "text-muted-foreground"}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold">{auto.name}</p>
                <Badge variant="outline" className={`text-[10px] ${
                  auto.status === "active" ? "text-emerald-400 border-emerald-500/20" :
                  auto.status === "paused" ? "text-amber-400 border-amber-500/20" :
                  "text-muted-foreground border-border"
                }`}>{auto.status}</Badge>
                {auto.treatmentTrack && (
                  <Badge variant="outline" className={`text-[10px] ${TRACK_COLORS[auto.treatmentTrack] ?? ""}`}>
                    {auto.treatmentTrack.toUpperCase()}
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px]">
                  {auto.channel === "both" ? "SMS + Email" : auto.channel.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{auto.description}</p>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />{auto.delay}
              </p>
              <div className="mt-2 rounded-md bg-muted/40 border border-border/40 px-2.5 py-1.5 text-[11px] text-muted-foreground italic">
                &ldquo;{auto.messagePreview.slice(0, 110)}{auto.messagePreview.length > 110 ? "…" : ""}&rdquo;
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onToggle}>
              {auto.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Edit3 className="h-4 w-4" /></Button>
          </div>
        </div>
        {auto.sent > 0 && (
          <div className="mt-3 flex gap-4 border-t border-border/30 pt-3 text-[11px] text-muted-foreground">
            <span><MessageSquare className="h-3 w-3 inline mr-1" />{auto.sent.toLocaleString()} sent</span>
            {auto.openRate && <span className="text-emerald-400">{auto.openRate}% open rate</span>}
            {auto.responseRate && <span className="text-[color:var(--teal)]">{auto.responseRate}% response</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AutomationsPage() {
  const [autos, setAutos] = useState(AUTOMATIONS);
  const [filterStatus, setFilterStatus] = useState<AutoStatus | "all">("all");
  const [filterTrack, setFilterTrack] = useState<string>("all");

  function toggle(id: string) {
    setAutos((prev) => prev.map((a) => a.id === id
      ? { ...a, status: (a.status === "active" ? "paused" : "active") as AutoStatus }
      : a
    ));
  }

  const filtered = autos.filter((a) => {
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchTrack = filterTrack === "all" || a.treatmentTrack === filterTrack || (filterTrack === "general" && !a.treatmentTrack);
    return matchStatus && matchTrack;
  });

  const totalSent = autos.reduce((s, a) => s + a.sent, 0);
  const active = autos.filter((a) => a.status === "active").length;
  const withOpenRate = autos.filter((a) => a.openRate);
  const avgOpen = withOpenRate.length
    ? Math.round(withOpenRate.reduce((s, a) => s + (a.openRate ?? 0), 0) / withOpenRate.length)
    : 0;

  return (
    <div className="p-4 md:p-8 space-y-5">
      <PageHeader
        eyebrow="Growth"
        title="Automations"
        description="Rule-based SMS & email flows that run while you focus on patients."
        actions={
          <Button size="sm" className="h-9 gradient-brand text-white">
            <Plus className="mr-1.5 h-4 w-4" />New automation
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Active automations", value: active.toString(),            icon: Zap,          accent: "text-[color:var(--teal)]" },
          { label: "Total messages sent", value: totalSent.toLocaleString(), icon: MessageSquare, accent: "" },
          { label: "Avg open rate",       value: `${avgOpen}%`,              icon: Mail,          accent: "text-emerald-400" },
          { label: "Est. revenue/mo",     value: "$4,200",                   icon: DollarSign,    accent: "text-emerald-400" },
        ].map((s) => (
          <Card key={s.label} className="surface-elevated">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`h-5 w-5 shrink-0 ${s.accent || "text-muted-foreground"}`} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className={`text-lg font-semibold font-mono mt-0.5 ${s.accent}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 rounded-md border p-1">
          {(["all", "active", "paused", "draft"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 text-[11px] rounded capitalize transition-colors ${filterStatus === s ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {["all", "general", "glp1", "trt", "aesthetics"].map((t) => (
            <button key={t} onClick={() => setFilterTrack(t)}
              className={`px-2.5 py-1 text-[11px] rounded border capitalize transition-colors ${filterTrack === t ? "bg-muted border-border font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t === "all" ? "All tracks" : t === "general" ? "General" : t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => <AutomationCard key={a.id} auto={a} onToggle={() => toggle(a.id)} />)}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Zap className="h-8 w-8 opacity-20" />
            <p className="text-sm">No automations match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
