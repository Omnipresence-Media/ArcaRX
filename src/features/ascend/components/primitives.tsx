import { motion } from "framer-motion";
import { ReactNode } from "react";

// Concentric ring with animated arc fill (0..1).
export function Ring({
  size = 80,
  stroke = 6,
  pct,
  color = "var(--asc-teal)",
  trackColor = "rgba(255,255,255,0.08)",
  delay = 0,
  children,
}: {
  size?: number;
  stroke?: number;
  pct: number;
  color?: string;
  trackColor?: string;
  delay?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.max(0, Math.min(1, pct))) }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

export function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={`asc-card p-4 ${onClick ? "cursor-pointer active:scale-[0.99] transition-transform" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Pill({ children, color = "var(--asc-teal)" }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide"
      style={{ background: `color-mix(in oklab, ${color} 18%, transparent)`, color }}
    >
      {children}
    </span>
  );
}

export function TealButton({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${className}`}
      style={{ background: "var(--asc-teal)", color: "#062520" }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, className = "" }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all active:scale-95 ${className}`}
      style={{ background: "rgba(255,255,255,0.04)", color: "var(--asc-text)", border: "1px solid var(--asc-border)" }}
    >
      {children}
    </button>
  );
}

export function SegmentControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 p-1 rounded-xl asc-surface overflow-x-auto asc-scroll">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
            style={{
              background: active ? "var(--asc-card)" : "transparent",
              color: active ? "var(--asc-text)" : "var(--asc-muted)",
              boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`asc-shimmer rounded-xl ${className}`} />;
}

export function ProgressBar({ pct, color = "var(--asc-teal)" }: { pct: number; color?: string }) {
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

export function StaggerList({ children, delay = 0.04 }: { children: ReactNode[]; delay?: number }) {
  return (
    <>
      {children.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {c}
        </motion.div>
      ))}
    </>
  );
}
