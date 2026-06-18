import { useState } from "react";
import { Bell, Search, HelpCircle, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { alerts } from "@/lib/seed-data";
import { AIAssistantPanel } from "@/components/shell/fit/AIAssistantPanel";
import { ViewToggle } from "@/components/shell/ViewToggle";

export function TopBar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_65%,transparent)] px-3 backdrop-blur-xl md:px-6">
      <SidebarTrigger />
      <ViewToggle />
      <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
        <span>ARCA Rx</span>
        <span>/</span>
        <span className="text-foreground">Command Center</span>
      </div>

      <button
        onClick={onOpenCommand}
        className="ml-auto flex h-9 w-full max-w-md items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search patients, visits, actions…</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium">
          ⌘K
        </kbd>
      </button>

      <button
        onClick={() => setAiOpen(true)}
        className="group inline-flex items-center gap-1.5 rounded-full border border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--teal)_12%,transparent)] px-3 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-[color:color-mix(in_oklab,var(--teal)_20%,transparent)]"
        title="Arca Coach Assistant"
      >
        <Sparkles className="h-3.5 w-3.5 text-[color:var(--teal)]" />
        <span className="hidden sm:inline">Coach AI</span>
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="border-b p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Notifications</p>
              <Badge variant="secondary" className="text-[10px]">
                {alerts.length} new
              </Badge>
            </div>
          </div>
          <ul className="max-h-80 divide-y overflow-y-auto">
            {alerts.map((a) => (
              <li key={a.id} className="p-3 text-sm hover:bg-muted/50">
                <p className="font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.meta}</p>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <Button variant="ghost" size="icon">
        <HelpCircle className="h-4 w-4" />
      </Button>

      <AIAssistantPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </header>
  );
}
