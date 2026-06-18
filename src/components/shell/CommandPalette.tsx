import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { patients, todaySchedule, quickActions } from "@/lib/seed-data";
import {
  Calendar,
  LayoutDashboard,
  Users,
  Receipt,
  Boxes,
  TrendingUp,
} from "lucide-react";

const destinations = [
  { label: "Command Center", url: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Schedule", url: "/admin/schedule", icon: Calendar },
  { label: "Patients", url: "/admin/patients", icon: Users },
  { label: "Billing", url: "/admin/billing", icon: Receipt },
  { label: "Growth", url: "/admin/growth", icon: TrendingUp },
  { label: "Inventory", url: "/admin/inventory", icon: Boxes },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const go = (url: string) => {
    onOpenChange(false);
    navigate({ to: url });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search patients, schedule, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick actions">
          {quickActions.map((a) => (
            <CommandItem key={a.id} onSelect={() => onOpenChange(false)}>
              <span>{a.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{a.hint}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Go to">
          {destinations.map((d) => (
            <CommandItem key={d.url} onSelect={() => go(d.url)}>
              <d.icon className="mr-2 h-4 w-4" />
              <span>{d.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Patients">
          {patients.map((p) => (
            <CommandItem key={p.id} onSelect={() => onOpenChange(false)}>
              <Users className="mr-2 h-4 w-4" />
              <span>{p.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{p.mrn}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Today's schedule">
          {todaySchedule.slice(0, 5).map((s, i) => (
            <CommandItem key={i} onSelect={() => onOpenChange(false)}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {s.time} — {s.patient}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">{s.provider}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
