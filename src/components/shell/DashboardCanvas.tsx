import { ReactNode } from "react";

/**
 * Fixed, full-viewport backdrop with two soft brand blooms (Arca teal +
 * navy) and a subtle 1px grid. Sits behind every admin route and re-tints
 * itself for dark vs light via CSS tokens.
 */
export function DashboardCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-full">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bloom-bg"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-60 [mask-image:radial-gradient(80%_60%_at_50%_30%,black,transparent)]"
      />
      {children}
    </div>
  );
}
