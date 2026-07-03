import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { VideoCard } from "@/components/shell/fit/VideoCard";
import { CreateButton } from "@/components/shell/CreateButton";
import { videos, type Video } from "@/lib/fit-seed";
import { Upload, X } from "lucide-react";

export const Route = createFileRoute("/admin/fit/videos")({
  head: () => ({ meta: [{ title: "Video library - ARCA Fit" }] }),
  component: VideosPage,
});

function VideosPage() {
  const muscles = ["All", ...Array.from(new Set(videos.map((v) => v.muscle)))];
  const [muscle, setMuscle] = useState("All");
  const [open, setOpen] = useState<Video | null>(null);

  const filtered = videos.filter((v) => muscle === "All" || v.muscle === muscle);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <PageHeader
        eyebrow="Coaching"
        title="Video library"
        description={`${videos.length} exercise demos, form breakdowns, and coaching clips.`}
        actions={
          <CreateButton
            title="Upload video"
            description="Add an exercise demo or form breakdown to your library."
            submitLabel="Add to library"
            fields={[
              { name: "title", label: "Title", placeholder: "e.g. Barbell squat — setup & depth" },
              { name: "muscle", label: "Category", type: "select", options: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full body", "Mobility"] },
              { name: "url", label: "Video URL or file", placeholder: "Paste a link or upload" },
            ]}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background"
          >
            <Upload className="h-3.5 w-3.5" /> Upload video
          </CreateButton>
        }
      />

      <div className="flex flex-wrap items-center gap-1 rounded-full glass-panel-quiet p-1 w-fit">
        {muscles.map((m) => {
          const active = muscle === m;
          return (
            <button
              key={m}
              onClick={() => setMuscle(m)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((v) => (
          <VideoCard key={v.id} v={v} onOpen={setOpen} />
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setOpen(null)}>
          <div className="glass-panel w-full max-w-3xl overflow-hidden p-0" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video bg-black">
              <video src={open.src} poster={open.thumb} controls autoPlay className="h-full w-full object-cover" />
              <button onClick={() => setOpen(null)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-foreground">{open.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {open.muscle} · {open.equipment} · {open.difficulty} · {open.views.toLocaleString()} views
              </p>
              <div className="mt-4 border-t border-[color:var(--glass-stroke)] pt-4 text-sm text-foreground/90">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Transcript</p>
                <p className="mt-1.5 leading-relaxed">
                  Set up with feet flat, brace your core, retract your shoulder blades and pin them to the bench. Take a deep breath
                  before unracking. Lower the bar under control to mid-chest, pause briefly, then press back up while driving your feet
                  into the floor. Keep your elbows tucked at about 60 degrees…
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
