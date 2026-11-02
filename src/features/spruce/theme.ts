import { useEffect, type CSSProperties } from "react";
import { DEFAULT_BRANDING, type Branding } from "./store";

// Tenant theme derived from the staff-editable branding (two hex colors and a
// background). Everything else is mixed from those so one change restyles
// the whole patient portal.
export function varsFor(b: Branding): Record<string, string> {
  const p = b.primary;
  const a = b.accent;
  return {
    "--teal": a,
    "--teal-foreground": "#FFFFFF",
    "--primary": p,
    "--primary-foreground": "#FFFFFF",
    "--accent": `color-mix(in oklab, ${a} 14%, white)`,
    "--accent-foreground": p,
    "--ring": a,
    "--background": b.background,
    "--foreground": `color-mix(in oklab, ${p} 80%, black)`,
    "--border": `color-mix(in oklab, ${p} 12%, white)`,
    "--muted": `color-mix(in oklab, ${p} 7%, white)`,
    "--muted-foreground": `color-mix(in oklab, ${p} 55%, #6B7280)`,
  };
}

export const SPRUCE_VARS = varsFor(DEFAULT_BRANDING);

// Inline style for a shell root: correct on first paint (SSR safe).
export const spruceStyleFor = (b: Branding) => varsFor(b) as CSSProperties;
export const spruceStyle = spruceStyleFor(DEFAULT_BRANDING);

// Also applied to <html> while on Spruce routes so portaled UI (modals,
// toasts, sheets) picks up the tenant colors too.
export function useSpruceTheme(b: Branding = DEFAULT_BRANDING) {
  const vars = varsFor(b);
  const sig = JSON.stringify(vars);
  useEffect(() => {
    const el = document.documentElement;
    const prev: Record<string, string> = {};
    for (const [k, v] of Object.entries(vars)) {
      prev[k] = el.style.getPropertyValue(k);
      el.style.setProperty(k, v);
    }
    return () => {
      for (const k of Object.keys(vars)) {
        if (prev[k]) el.style.setProperty(k, prev[k]);
        else el.style.removeProperty(k);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
}

export const headingFont: CSSProperties = { fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" };
