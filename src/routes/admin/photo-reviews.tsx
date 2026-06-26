import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Camera, CheckCircle2, Clock, Upload, Search, ChevronLeft,
  ChevronRight, Eye, Download, Share2, Lock, Star, Filter, ZoomIn,
} from "lucide-react";

export const Route = createFileRoute("/admin/photo-reviews")({
  head: () => ({ meta: [{ title: "Photo Reviews — ARCA Rx" }] }),
  component: PhotoReviews,
});

type ReviewStatus = "needs-review" | "approved" | "flagged";
type Track = "Morpheus8" | "Filler" | "HRT" | "Semaglutide" | "Botox" | "Skin" | "Baseline";

interface PhotoSet {
  id: string;
  patient: string;
  patientId: string;
  protocol: Track;
  session: string;
  date: string;
  status: ReviewStatus;
  provider: string;
  consentOnFile: boolean;
  notes?: string;
  beforeColor: string;
  afterColor: string;
  rating?: number;
}

const PHOTO_SETS: PhotoSet[] = [
  { id: "ps-1",  patient: "Eliana Ruiz",     patientId: "pat-1",  protocol: "Morpheus8",  session: "Session 3 / 3-month follow",  date: "Today",      status: "needs-review", provider: "Dr. Chen",    consentOnFile: true,  beforeColor: "#7c6f62", afterColor: "#c4a882" },
  { id: "ps-2",  patient: "Owen Pham",        patientId: "pat-2",  protocol: "Filler",     session: "2-week post Juvederm",        date: "Today",      status: "needs-review", provider: "S. Whitfield", consentOnFile: true, beforeColor: "#8a7060", afterColor: "#d4b896" },
  { id: "ps-3",  patient: "Naomi Carter",     patientId: "pat-3",  protocol: "HRT",        session: "90-day progress",             date: "Yesterday",  status: "approved",     provider: "Dr. Patel",   consentOnFile: true,  beforeColor: "#5a4e46", afterColor: "#8a7060", rating: 5 },
  { id: "ps-4",  patient: "Yusuf Aydin",      patientId: "pat-4",  protocol: "Semaglutide",session: "Month 3 body comp",           date: "Yesterday",  status: "approved",     provider: "J. Reeves",   consentOnFile: true,  beforeColor: "#6e6258", afterColor: "#a89070", rating: 4 },
  { id: "ps-5",  patient: "Harper Nakamura",  patientId: "pat-5",  protocol: "Baseline",   session: "Intake photos",               date: "2d ago",     status: "needs-review", provider: "Front Desk",  consentOnFile: false, beforeColor: "#9a8878", afterColor: "#9a8878" },
  { id: "ps-6",  patient: "Imani Brooks",     patientId: "pat-6",  protocol: "Morpheus8",  session: "Session 3 — post 4 weeks",    date: "3d ago",     status: "approved",     provider: "Dr. Chen",    consentOnFile: true,  beforeColor: "#4a3e36", afterColor: "#7a6254", rating: 5 },
  { id: "ps-7",  patient: "Mira Hollander",   patientId: "pat-10", protocol: "Botox",      session: "2-week follow",               date: "4d ago",     status: "approved",     provider: "Dr. Chen",    consentOnFile: true,  beforeColor: "#7e7268", afterColor: "#bea88c", rating: 4 },
  { id: "ps-8",  patient: "Theo Lindqvist",   patientId: "pat-9",  protocol: "Skin",       session: "Baseline",                    date: "5d ago",     status: "needs-review", provider: "D. Hart",     consentOnFile: true,  beforeColor: "#8a7c70", afterColor: "#8a7c70" },
  { id: "ps-9",  patient: "Priya Mehta",      patientId: "pat-17", protocol: "Filler",     session: "1-month lips",                date: "6d ago",     status: "approved",     provider: "S. Whitfield", consentOnFile: true, beforeColor: "#6a5a50", afterColor: "#c49a78", rating: 5 },
  { id: "ps-10", patient: "Sloane Vega",      patientId: "pat-8",  protocol: "Skin",       session: "Chemical peel — 1 week post", date: "1wk ago",    status: "approved",     provider: "D. Hart",     consentOnFile: true,  beforeColor: "#c8a090", afterColor: "#e8c8b0", rating: 3 },
];

const PROTOCOL_COLORS: Record<Track, string> = {
  Morpheus8:   "text-violet-400 border-violet-500/20 bg-violet-500/10",
  Filler:      "text-pink-400 border-pink-500/20 bg-pink-500/10",
  HRT:         "text-rose-400 border-rose-500/20 bg-rose-500/10",
  Semaglutide: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  Botox:       "text-blue-400 border-blue-500/20 bg-blue-500/10",
  Skin:        "text-amber-400 border-amber-500/20 bg-amber-500/10",
  Baseline:    "text-muted-foreground border-border bg-muted/40",
};

function PhotoPlaceholder({ color, label, style }: { color: string; label: string; style?: React.CSSProperties }) {
  return (
    <div className="relative flex items-end justify-start overflow-hidden rounded-lg" style={{ background: `linear-gradient(135deg, ${color}88, ${color}cc)`, ...style }}>
      <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 40%, ${color}ff, ${color}66)` }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <Camera className="h-8 w-8 text-white/30" />
      </div>
      <span className="relative z-10 m-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">{label}</span>
    </div>
  );
}

function CompareSlider({ set }: { set: PhotoSet }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="space-y-2">
      <div className="relative h-64 overflow-hidden rounded-lg cursor-col-resize select-none"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setPos(Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100)));
        }}>
        {/* After (full) */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 40%, ${set.afterColor}ff, ${set.afterColor}66)` }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="h-10 w-10 text-white/20" />
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">AFTER</span>
        {/* Before (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <div className="absolute inset-0 min-w-[400px]" style={{ background: `radial-gradient(circle at 30% 40%, ${set.beforeColor}ff, ${set.beforeColor}66)` }} />
          <span className="absolute bottom-2 left-2 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">BEFORE</span>
        </div>
        {/* Divider */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
            <ChevronLeft className="h-3 w-3 text-gray-700" />
            <ChevronRight className="h-3 w-3 text-gray-700" />
          </div>
        </div>
      </div>
      <p className="text-[11px] text-center text-muted-foreground">Drag to compare before / after</p>
    </div>
  );
}

function PhotoCard({ set, onClick }: { set: PhotoSet; onClick: () => void }) {
  return (
    <Card className="surface-elevated overflow-hidden cursor-pointer hover:border-[color:var(--teal)]/40 transition-colors" onClick={onClick}>
      <div className="grid grid-cols-2 gap-0.5 bg-border">
        <PhotoPlaceholder color={set.beforeColor} label="BEFORE" style={{ height: 120 }} />
        <PhotoPlaceholder color={set.afterColor}  label="AFTER"  style={{ height: 120 }} />
      </div>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{set.patient}</p>
            <p className="text-xs text-muted-foreground truncate">{set.session}</p>
          </div>
          <Badge variant="outline" className={`text-[10px] shrink-0 ${
            set.status === "needs-review" ? "text-amber-400 border-amber-500/20" :
            set.status === "flagged"      ? "text-red-400 border-red-500/20" :
            "text-emerald-400 border-emerald-500/20"
          }`}>
            {set.status === "needs-review" ? "Review" : set.status === "flagged" ? "Flagged" : "Approved"}
          </Badge>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="outline" className={`text-[10px] ${PROTOCOL_COLORS[set.protocol]}`}>{set.protocol}</Badge>
          <span className="text-[10px] text-muted-foreground">{set.date}</span>
          {!set.consentOnFile && <Lock className="h-3 w-3 text-red-400" />}
        </div>
        {set.rating && (
          <div className="mt-1.5 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < set.rating! ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DetailPanel({ set, onClose, onApprove }: { set: PhotoSet; onClose: () => void; onApprove: () => void }) {
  const [note, setNote] = useState(set.notes ?? "");
  const [localStatus, setLocalStatus] = useState(set.status);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <p className="font-semibold">{set.patient}</p>
          <p className="text-xs text-muted-foreground">{set.session} · {set.date} · {set.provider}</p>
        </div>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>✕</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <CompareSlider set={set} />

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={`text-[10px] ${PROTOCOL_COLORS[set.protocol]}`}>{set.protocol}</Badge>
          {set.consentOnFile
            ? <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/20"><CheckCircle2 className="h-3 w-3 mr-1" />Consent on file</Badge>
            : <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/20"><Lock className="h-3 w-3 mr-1" />No consent — cannot share</Badge>
          }
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Provider note</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add clinical notes about this photo set…"
            rows={3}
            className="w-full rounded-md border border-input bg-card/60 px-3 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[color:var(--teal)] resize-none"
          />
        </div>

        {localStatus === "approved" && (
          <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-400">
            <CheckCircle2 className="h-4 w-4 inline mr-1.5" />Approved by {set.provider}
          </div>
        )}
      </div>
      <div className="border-t p-4 flex flex-wrap gap-2">
        {localStatus === "needs-review" && (
          <Button size="sm" className="gradient-brand text-white h-8 text-xs" onClick={() => { setLocalStatus("approved"); onApprove(); }}>
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Approve
          </Button>
        )}
        {set.consentOnFile && (
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Share2 className="mr-1.5 h-3.5 w-3.5" />Share to portal
          </Button>
        )}
        <Button size="sm" variant="outline" className="h-8 text-xs">
          <Download className="mr-1.5 h-3.5 w-3.5" />Download
        </Button>
        <Link to="/admin/patients/$id" params={{ id: set.patientId }}>
          <Button size="sm" variant="ghost" className="h-8 text-xs">View chart</Button>
        </Link>
      </div>
    </div>
  );
}

function PhotoReviews() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | ReviewStatus>("all");
  const [filterProtocol, setFilterProtocol] = useState<Track | "all">("all");
  const [selected, setSelected] = useState<PhotoSet | null>(null);
  const [sets, setSets] = useState(PHOTO_SETS);

  const needsReview = sets.filter((s) => s.status === "needs-review").length;

  const filtered = sets.filter((s) => {
    const matchSearch = s.patient.toLowerCase().includes(search.toLowerCase()) || s.session.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const matchProtocol = filterProtocol === "all" || s.protocol === filterProtocol;
    return matchSearch && matchStatus && matchProtocol;
  });

  function approve(id: string) {
    setSets((prev) => prev.map((s) => s.id === id ? { ...s, status: "approved" as ReviewStatus } : s));
  }

  return (
    <div className="p-4 md:p-8 space-y-5">
      <PageHeader
        eyebrow="Clinical"
        title="Photo reviews"
        description={`Before & after management · ${needsReview} set${needsReview !== 1 ? "s" : ""} awaiting review`}
        actions={
          <Button size="sm" className="h-9 gradient-brand text-white">
            <Upload className="mr-1.5 h-4 w-4" />Upload photos
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patient or session…" className="h-9 pl-8 w-56 text-sm" />
        </div>
        <div className="flex gap-1 rounded-md border p-1">
          {(["all", "needs-review", "approved"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-2.5 py-1 text-[11px] rounded capitalize transition-colors ${filterStatus === s ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {s === "needs-review" ? "Needs review" : s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {(["all", "Morpheus8", "Filler", "Botox", "Semaglutide", "HRT", "Skin"] as const).map((p) => (
            <button key={p} onClick={() => setFilterProtocol(p)}
              className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${filterProtocol === p ? "bg-muted border-border font-semibold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {p === "all" ? "All protocols" : p}
            </button>
          ))}
        </div>
      </div>

      <div className={`grid gap-4 ${selected ? "grid-cols-[1fr_380px]" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
        <div className={`grid gap-4 ${selected ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
          {filtered.map((set) => (
            <PhotoCard key={set.id} set={set} onClick={() => setSelected(set)} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <Camera className="h-8 w-8 opacity-20" />
              <p className="text-sm">No photo sets match your filters.</p>
            </div>
          )}
        </div>

        {selected && (
          <Card className="surface-elevated overflow-hidden sticky top-4 h-[calc(100vh-140px)] flex flex-col">
            <DetailPanel
              set={selected}
              onClose={() => setSelected(null)}
              onApprove={() => approve(selected.id)}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
