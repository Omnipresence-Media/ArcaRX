import { Link } from "@tanstack/react-router";

export type Product = "rx" | "pro";

export function Logo({ light = false, product = "rx" }: { light?: boolean; product?: Product }) {
  const wordColor = light ? "#FFFFFF" : "#0F1F3D";
  const to = product === "rx" ? "/" : "/arca";
  const suffix = product === "rx" ? "Rx" : "Pro";
  return (
    <Link to={to} className="flex items-center gap-1.5" aria-label={`ARCA ${suffix} home`}>
      <svg width="26" height="22" viewBox="0 0 26 22" fill="none" aria-hidden>
        <path
          d="M2 19 C 4 6, 14 2, 24 7"
          stroke="#00B5A4"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span
        className="font-bold tracking-tight leading-none"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, color: wordColor }}
      >
        ARCA
        <sup
          className="ml-0.5 font-bold"
          style={{ fontSize: 11, color: "#00B5A4", top: "-0.55em", position: "relative" }}
        >
          {suffix}
        </sup>
      </span>
    </Link>
  );
}
