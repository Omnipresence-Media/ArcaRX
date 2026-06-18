import { useRef, useState } from "react";

export function ProgressPhotoCompare({
  before,
  after,
  beforeLabel = "Week 0",
  afterLabel = "Week 8",
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const onMove = (clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, x)));
  };

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-xl ring-1 ring-[color:var(--glass-stroke-strong)] select-none"
      onMouseMove={(e) => dragging.current && onMove(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
    >
      <img src={before} alt="before" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <img src={after} alt="after" className="h-full w-full object-cover" />
      </div>
      <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
        {beforeLabel}
      </span>
      <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
        {afterLabel}
      </span>
      <div
        className="absolute top-0 bottom-0 w-px bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
        style={{ left: `${pos}%` }}
      />
      <button
        type="button"
        onMouseDown={() => (dragging.current = true)}
        onTouchStart={() => (dragging.current = true)}
        className="absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-foreground shadow-lg ring-2 ring-white/40 cursor-ew-resize"
        style={{ left: `${pos}%` }}
        aria-label="Drag to compare"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M8 8 L4 12 L8 16" />
          <path d="M16 8 L20 12 L16 16" />
        </svg>
      </button>
    </div>
  );
}
