import { useRef, type ReactNode } from "react";
import { Camera, Check } from "lucide-react";
import { headingFont } from "./theme";

// Small shared kit so every Spruce screen looks consistent.

export function SpPage({ title, sub, actions, children }: { title: string; sub?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight" style={headingFont}>{title}</h1>
          {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function SectionCard({ title, right, children, className = "" }: { title?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border bg-card p-4 md:p-5 ${className}`}>
      {(title || right) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";
const TONES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
  info: "bg-sky-100 text-sky-800",
  brand: "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",
};

export function Pill({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TONES[tone]}`}>{children}</span>;
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card/50 px-6 py-10 text-center">
      <p className="text-sm font-semibold">{title}</p>
      {body && <p className="max-w-sm text-xs text-muted-foreground">{body}</p>}
      {action}
    </div>
  );
}

// Photo slots with a real file picker. Previews are kept by the caller (object
// URLs do not persist), the store only keeps counts.
export function PhotoSlots({ labels, previews, onPick }: { labels: string[]; previews: (string | null)[]; onPick: (i: number, url: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  return (
    <div className="grid grid-cols-3 gap-2">
      {labels.map((label, i) => {
        const url = previews[i];
        return (
          <div key={label} className="space-y-1">
            <button
              type="button"
              onClick={() => refs.current[i]?.click()}
              className={`relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed text-muted-foreground transition-colors hover:border-[color:var(--teal)] ${url ? "border-solid border-[color:var(--teal)]" : ""}`}
              aria-label={`Add ${label} photo`}
            >
              {url ? (
                <>
                  <img src={url} alt={label} className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--teal)] text-white"><Check className="h-3 w-3" /></span>
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5" />
                  <span className="mt-1 text-[10px]">Tap to add</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] font-medium">{label}</p>
            <input
              ref={(el) => { refs.current[i] = el; }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPick(i, URL.createObjectURL(f));
                e.target.value = "";
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// Placeholder product / article image.
export function ToneImage({ tone, label, className = "" }: { tone: string; label?: string; className?: string }) {
  return (
    <div className={`flex items-end bg-gradient-to-br ${tone} ${className}`}>
      {label && <span className="m-2 rounded bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold text-foreground/80">{label}</span>}
    </div>
  );
}

// youtube-nocookie only. No tracking on logged-in pages.
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  // Staff type this id into the catalog, so only a plain 11 character YouTube
  // id may reach the embed path.
  if (!/^[\w-]{11}$/.test(id)) return null;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
