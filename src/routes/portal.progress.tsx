import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateModal } from "@/components/shell/CreateButton";
import { Camera, TrendingDown } from "lucide-react";
import { weightLog, checkIns, photoSessions } from "@/features/portal/mockData";

const GRADIENTS = ["from-teal-400 to-cyan-600", "from-violet-400 to-indigo-600", "from-amber-400 to-orange-600", "from-emerald-400 to-teal-600"];
function todayLabel() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const Route = createFileRoute("/portal/progress")({
  head: () => ({ meta: [{ title: "Progress - ARCA Rx Portal" }] }),
  component: Progress,
});

function Chart({ data }: { data: { d: string; w: number }[] }) {
  const vals = data.map((p) => p.w);
  const min = Math.min(...vals) - 2;
  const max = Math.max(...vals) + 2;
  const span = max - min;
  const w = 600;
  const h = 180;
  const pts = data.map((p, i) => {
    const x = (i / (data.length - 1)) * (w - 40) + 28;
    const y = h - 24 - ((p.w - min) / span) * (h - 40);
    return [x, y] as const;
  });
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const area = `${path} L ${pts[pts.length - 1][0]} ${h - 24} L ${pts[0][0]} ${h - 24} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full">
      <defs>
        <linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#wfill)" />
      <path d={path} fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="var(--teal)" />
      ))}
      {data.map((p, i) => (
        <text key={i} x={pts[i][0]} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">{p.d}</text>
      ))}
    </svg>
  );
}

function Progress() {
  const [comparing, setComparing] = useState(50);
  const [log, setLog] = useState(weightLog);
  const [entries, setEntries] = useState(checkIns);
  const [photos, setPhotos] = useState(photoSessions);
  const [loggingWeight, setLoggingWeight] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const startWeight = log[0].w;
  const currentWeight = log[log.length - 1].w;
  const delta = (currentWeight - startWeight).toFixed(1);

  function addWeight(v: Record<string, string>) {
    const w = Number(v.weight);
    if (!w) return;
    setLog((prev) => [...prev, { d: todayLabel(), w }]);
  }

  function addCheckIn(v: Record<string, string>) {
    setEntries((prev) => [
      { date: todayLabel(), energy: Number(v.energy) || 7, mood: Number(v.mood) || 7, sleep: Number(v.sleep) || 7, libido: Number(v.libido) || 7 },
      ...prev,
    ]);
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    setPhotos((prev) => [
      ...prev,
      { id: `p-${Date.now()}`, label: `Week ${prev.length * 4}`, date: todayLabel(), color: GRADIENTS[prev.length % GRADIENTS.length] },
    ]);
    toast.success("Photo added", { description: "It's in your progress timeline." });
    e.target.value = "";
  }

  return (
    <div className="space-y-5 p-4 md:p-8">
      <CreateModal
        open={loggingWeight}
        onClose={() => setLoggingWeight(false)}
        title="Log today's weight"
        description="Weigh in at the same time each day for the cleanest trend."
        submitLabel="Log weight"
        onSubmit={addWeight}
        fields={[{ name: "weight", label: "Weight (lb)", type: "number", placeholder: `${currentWeight}` }]}
      />
      <CreateModal
        open={newCheckIn}
        onClose={() => setNewCheckIn(false)}
        title="Weekly check-in"
        description="Rate each 1–10 so your care team can spot trends."
        submitLabel="Save check-in"
        onSubmit={addCheckIn}
        fields={[
          { name: "energy", label: "Energy (1–10)", type: "number", placeholder: "7" },
          { name: "mood", label: "Mood (1–10)", type: "number", placeholder: "7" },
          { name: "sleep", label: "Sleep (hours)", type: "number", placeholder: "7" },
          { name: "libido", label: "Libido (1–10)", type: "number", placeholder: "7" },
        ]}
      />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your journey - weight, photos, and how you feel.</p>
      </div>

      {/* Weight trend */}
      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weight</p>
              <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">{currentWeight}<span className="ml-1 text-sm text-muted-foreground">lb</span></p>
              <p className="mt-1 flex items-center gap-1 text-xs text-[color:var(--success)]">
                <TrendingDown className="h-3 w-3" />{delta} lb since {weightLog[0].d}
              </p>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setLoggingWeight(true)}>+ Log weight</Button>
          </div>
          <div className="mt-3"><Chart data={log} /></div>
        </CardContent>
      </Card>

      {/* Photo compare */}
      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Photos</p>
              <p className="text-sm">Compare {photos[0].label} vs {photos[photos.length - 1].label}</p>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => fileRef.current?.click()}><Camera className="mr-1 h-3.5 w-3.5" />Upload</Button>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border">
            <div className={`absolute inset-0 bg-gradient-to-br ${photos[photos.length - 1].color}`}>
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-white/60">{photos[photos.length - 1].label} · {photos[photos.length - 1].date}</div>
            </div>
            <div className={`absolute inset-y-0 left-0 overflow-hidden bg-gradient-to-br ${photos[0].color}`} style={{ width: `${comparing}%` }}>
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-white/60">{photos[0].label} · {photos[0].date}</div>
            </div>
            <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg" style={{ left: `${comparing}%` }} />
          </div>
          <input
            type="range" min={0} max={100} value={comparing} onChange={(e) => setComparing(Number(e.target.value))}
            className="w-full accent-[color:var(--teal)]"
          />
          <div className="flex gap-2">
            {photos.map((p) => (
              <div key={p.id} className="flex-1 rounded-md border bg-card p-2 text-center">
                <div className={`mx-auto h-12 w-12 rounded-md bg-gradient-to-br ${p.color}`} />
                <p className="mt-1.5 text-xs font-medium">{p.label}</p>
                <p className="text-[10px] text-muted-foreground">{p.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Check-ins */}
      <Card className="surface-elevated">
        <CardContent className="p-4 md:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weekly check-ins</p>
            <Button size="sm" className="h-8 gradient-brand text-xs text-white" onClick={() => setNewCheckIn(true)}>+ New check-in</Button>
          </div>
          <div className="mt-3 overflow-hidden rounded-md border">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-right">Energy</th>
                  <th className="px-3 py-2 text-right">Mood</th>
                  <th className="px-3 py-2 text-right">Sleep</th>
                  <th className="px-3 py-2 text-right">Libido</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entries.map((c, i) => (
                  <tr key={`${c.date}-${i}`}>
                    <td className="px-3 py-2 font-medium">{c.date}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{c.energy}/10</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{c.mood}/10</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{c.sleep}h</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{c.libido}/10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
