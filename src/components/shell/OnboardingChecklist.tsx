import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Circle } from "lucide-react";
import { onboardingTasks } from "@/lib/seed-data";

export function OnboardingChecklist() {
  const done = onboardingTasks.filter((t) => t.done).length;
  const pct = Math.round((done / onboardingTasks.length) * 100);

  return (
    <Card className="surface-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Practice setup</CardTitle>
          <span className="text-xs text-muted-foreground">
            {done} of {onboardingTasks.length}
          </span>
        </div>
        <Progress value={pct} className="mt-2 h-1.5" />
      </CardHeader>
      <CardContent className="space-y-1.5 pt-0">
        {onboardingTasks.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
          >
            {t.done ? (
              <Check className="h-4 w-4 text-[var(--success)]" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground/60" />
            )}
            <span className={t.done ? "text-muted-foreground line-through" : ""}>
              {t.label}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
