import { useEffect, type CSSProperties } from "react";

// Spruce Micro tenant theme (forest green). The hex values are placeholders
// until the exact brand colors are confirmed from Spruce's guidelines.
export const SPRUCE_VARS: Record<string, string> = {
  "--teal": "#2F7D5B",
  "--teal-foreground": "#FFFFFF",
  "--primary": "#1F4D3A",
  "--primary-foreground": "#FFFFFF",
  "--accent": "#E4F1EA",
  "--accent-foreground": "#1F4D3A",
  "--ring": "#2F7D5B",
  "--background": "#FAFCFA",
  "--foreground": "#14241C",
  "--border": "#DCE7E0",
  "--muted": "#EDF3EF",
  "--muted-foreground": "#5B6E63",
};

// Inline style on the shell root: correct on first paint (SSR safe).
export const spruceStyle = SPRUCE_VARS as CSSProperties;

// Also applied to <html> while on Spruce routes so portaled UI (modals,
// toasts, sheets) picks up the tenant colors too.
export function useSpruceTheme() {
  useEffect(() => {
    const el = document.documentElement;
    const prev: Record<string, string> = {};
    for (const [k, v] of Object.entries(SPRUCE_VARS)) {
      prev[k] = el.style.getPropertyValue(k);
      el.style.setProperty(k, v);
    }
    return () => {
      for (const k of Object.keys(SPRUCE_VARS)) {
        if (prev[k]) el.style.setProperty(k, prev[k]);
        else el.style.removeProperty(k);
      }
    };
  }, []);
}

export const headingFont: CSSProperties = { fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" };
