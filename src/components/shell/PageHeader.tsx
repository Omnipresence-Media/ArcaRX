import { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--glass-stroke-strong)] bg-[color:color-mix(in_oklab,var(--surface-glass)_60%,transparent)] px-2.5 py-1 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--teal)]">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="mt-3 metric-numeral text-[34px] md:text-[44px] text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
