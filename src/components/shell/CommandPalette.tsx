import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { patients, todaySchedule } from "@/lib/seed-data";
import { useState } from "react";
import {
  Calendar, LayoutDashboard, Users, Receipt, Boxes, MessageSquare,
  Stethoscope, Video, ClipboardList, Camera, Activity, Mic, FlaskConical,
  Zap, Plus, FileText, Send, Search, ChevronRight,
} from "lucide-react";

const NAV_DESTINATIONS = [
  { label: "Command Center",   url: "/admin/dashboard",     icon: LayoutDashboard },
  { label: "Calendar",         url: "/admin/calendar",      icon: Calendar },
  { label: "Patients / Members", url: "/admin/patients",   icon: Users },
  { label: "Messages",         url: "/admin/messages",      icon: MessageSquare },
  { label: "AI Scribe",        url: "/admin/scribe",        icon: Mic },
  { label: "Charts / EMR",     url: "/admin/charts",        icon: Stethoscope },
  { label: "Intake & Consent", url: "/admin/intake",        icon: ClipboardList },
  { label: "Photo Reviews",    url: "/admin/photo-reviews", icon: Camera },
  { label: "Telehealth & RPM", url: "/admin/telehealth",   icon: Video },
  { label: "Automations",      url: "/admin/email-sms",     icon: Zap },
  { label: "Inventory",        url: "/admin/inventory",     icon: Boxes },
  { label: "Billing",          url: "/admin/billing",       icon: Receipt },
  { label: "Population Health",url: "/admin/population",    icon: Activity },
];

const QUICK_ACTIONS = [
  { label: "New appointment",        icon: Plus,       url: "/admin/calendar",      hint: "⌘N" },
  { label: "Add patient",            icon: Users,      url: "/admin/patients",      hint: "⌘P" },
  { label: "Start AI scribe",        icon: Mic,        url: "/admin/scribe",        hint: "⌘R" },
  { label: "Send message",           icon: Send,       url: "/admin/messages",      hint: "⌘M" },
  { label: "Lab order",              icon: FlaskConical, url: "/admin/charts",      hint: "" },
  { label: "Write prescription",     icon: FileText,   url: "/admin/charts",        hint: "" },
  { label: "Start telehealth room",  icon: Video,      url: "/admin/telehealth",    hint: "" },
  { label: "Send intake form",       icon: ClipboardList, url: "/admin/intake",     hint: "" },
  { label: "New automation rule",    icon: Zap,        url: "/admin/email-sms",     hint: "" },
  { label: "Inventory reorder",      icon: Boxes,      url: "/admin/inventory",     hint: "" },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function go(url: string) {
    onOpenChange(false);
    setQuery("");
    navigate({ to: url });
  }

  const q = query.toLowerCase();

  const filteredPatients = q.length >= 1
    ? patients.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        (p.treatmentTrack ?? "").toLowerCase().includes(q)
      )
    : patients.slice(0, 6);

  const filteredActions = q.length >= 1
    ? QUICK_ACTIONS.filter((a) => a.label.toLowerCase().includes(q))
    : QUICK_ACTIONS;

  const filteredNav = q.length >= 1
    ? NAV_DESTINATIONS.filter((d) => d.label.toLowerCase().includes(q))
    : NAV_DESTINATIONS;

  const filteredSchedule = q.length >= 1
    ? todaySchedule.filter((s) => s.patient.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q))
    : todaySchedule.slice(0, 5);

  return (
    <CommandDialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setQuery(""); }}>
      <CommandInput
        placeholder="Search patients, go to a page, or run an action…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-20" />
            No results for &ldquo;{query}&rdquo;
          </div>
        </CommandEmpty>

        {filteredActions.length > 0 && (
          <CommandGroup heading="Quick actions">
            {filteredActions.map((a) => (
              <CommandItem key={a.label} onSelect={() => go(a.url)} className="flex items-center gap-2">
                <a.icon className="h-4 w-4 text-[color:var(--teal)] shrink-0" />
                <span>{a.label}</span>
                {a.hint && <span className="ml-auto text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{a.hint}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredPatients.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Patients">
              {filteredPatients.map((p) => (
                <CommandItem key={p.id} onSelect={() => go(`/admin/patients/${p.id}`)} className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold shrink-0">
                    {p.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <span>{p.name}</span>
                  <span className="text-[10px] text-muted-foreground">{p.mrn}</span>
                  {p.treatmentTrack && p.treatmentTrack !== "general" && (
                    <span className="ml-auto text-[10px] text-muted-foreground">{p.treatmentTrack.toUpperCase()}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {filteredSchedule.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Today's schedule">
              {filteredSchedule.map((s, i) => (
                <CommandItem key={i} onSelect={() => go("/admin/calendar")} className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{s.time} — {s.patient}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{s.provider}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {filteredNav.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Navigate to">
              {filteredNav.map((d) => (
                <CommandItem key={d.url} onSelect={() => go(d.url)} className="flex items-center gap-2">
                  <d.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>{d.label}</span>
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground opacity-40" />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

