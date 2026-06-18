import { Link } from "@tanstack/react-router";
import type { Product } from "./Logo";

export function ProductToggle({ active }: { active: Product }) {
  const base = {
    fontFamily: "Inter, sans-serif",
    fontSize: 12,
    fontWeight: 600 as const,
    letterSpacing: "0.04em",
    padding: "5px 11px",
    borderRadius: 999,
    transition: "all 180ms ease",
  };
  const on = {
    background: "white",
    color: "#0F1F3D",
    boxShadow: "0 1px 3px rgba(15,31,61,0.12), 0 0 0 1px rgba(15,31,61,0.04)",
  };
  const off = { background: "transparent", color: "#64748B" };

  return (
    <div
      className="hidden sm:inline-flex items-center"
      style={{
        background: "#F1F4F7",
        border: "1px solid #E2E8F0",
        borderRadius: 999,
        padding: 3,
        marginLeft: 12,
      }}
      role="tablist"
      aria-label="Switch product"
    >
      <Link to="/" style={{ ...base, ...(active === "rx" ? on : off) }} role="tab" aria-selected={active === "rx"}>
        Rx
      </Link>
      <Link to="/arca" style={{ ...base, ...(active === "pro" ? on : off) }} role="tab" aria-selected={active === "pro"}>
        Pro
      </Link>
    </div>
  );
}
