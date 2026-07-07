import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shell/PageHeader";
import { CreateModal } from "@/components/shell/CreateButton";
import {
  useAllVideos, useDriveImports, usableBy, addVideo, setVideoVisibility, removeVideo,
  addDriveImport, CURRENT_COACH, type TrainerVideo,
} from "@/features/coaching/videoStore";
import { Upload, X, Play, Globe2, Lock, Trash2, FolderDown, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/fit/videos")({
  head: () => ({ meta: [{ title: "Video library - ARCA Fit" }] }),
  component: VideosPage,
});

type Scope = "usable" | "mine" | "community";

function VideosPage() {
  const all = useAllVideos();
  const imports = useDriveImports();
  const [scope, setScope] = useState<Scope>("usable");
  const [muscle, setMuscle] = useState("All");
  const [open, setOpen] = useState<TrainerVideo | null>(null);
  const [driveOpen, setDriveOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const mine = all.filter((v) => v.ownerId === CURRENT_COACH.id);
  const usable = all.filter((v) => usableBy(v, CURRENT_COACH.id));
  const community = all.filter((v) => v.ownerId !== CURRENT_COACH.id && v.visibility === "public");

  const scoped = scope === "mine" ? mine : scope === "community" ? community : usable;
  const muscles = useMemo(() => ["All", ...Array.from(new Set(usable.map((v) => v.muscle)))], [usable]);
  const filtered = scoped.filter((v) => muscle === "All" || v.muscle === muscle);
  const publicCount = mine.filter((v) => v.visibility === "public").length;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setPendingFile(f);
    e.target.value = "";
  }

  function saveUpload(v: Record<string, string>) {
    if (!pendingFile) return;
    const src = URL.createObjectURL(pendingFile);
    addVideo({
      title: v.title || pendingFile.name.replace(/\.[a-z0-9]+$/i, ""),
      exercise: v.exercise || v.title || pendingFile.name,
      muscle: v.muscle || "Full body",
      visibility: (v.visibility === "Public - any coach can use it" ? "public" : "private"),
      src,
      source: "upload",
    });
    setPendingFile(null);
    toast.success("Video added to your library", { description: v.visibility?.startsWith("Public") ? "Visible to every coach on the platform." : "Private - only you can use it." });
  }

  function requestDriveImport(v: Record<string, string>) {
    if (!v.url?.trim()) return;
    addDriveImport(v.url.trim(), v.note);
    toast.success("Drive import queued", {
      description: "The ARCA team ingests the folder, maps each video to its exercise, and they appear here under your account.",
    });
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-10">
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
      <CreateModal
        open={!!pendingFile}
        onClose={() => setPendingFile(null)}
        title="Add video details"
        description={pendingFile ? `Uploading "${pendingFile.name}" to your library.` : ""}
        submitLabel="Add to library"
        onSubmit={saveUpload}
        fields={[
          { name: "title", label: "Title", placeholder: pendingFile?.name.replace(/\.[a-z0-9]+$/i, "") ?? "e.g. Barbell squat - setup & depth" },
          { name: "exercise", label: "Exercise it demonstrates", placeholder: "e.g. Back Squat" },
          { name: "muscle", label: "Category", type: "select", options: ["Chest", "Back", "Quads", "Hamstrings", "Glutes", "Shoulders", "Arms", "Core", "Full body", "Mobility"] },
          { name: "visibility", label: "Who can use it", type: "select", options: ["Private - only me", "Public - any coach can use it"] },
        ]}
      />
      <CreateModal
        open={driveOpen}
        onClose={() => setDriveOpen(false)}
        title="Bulk import from Google Drive"
        description="Share a Drive folder with your exercise videos (50, 150, whatever you've got). We download them, host them on ARCA, map each one to its exercise, and they land in your library - private by default."
        submitLabel="Queue import"
        onSubmit={requestDriveImport}
        fields={[
          { name: "url", label: "Google Drive folder link", placeholder: "https://drive.google.com/drive/folders/..." },
          { name: "note", label: "Notes for the team (optional)", type: "textarea", placeholder: "e.g. File names match exercise names. Make the squat series public." },
        ]}
      />

      <PageHeader
        eyebrow="Coaching"
        title="Video library"
        description={`${mine.length} videos of yours (${publicCount} public · ${mine.length - publicCount} private) · ${community.length} community videos you can use.`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDriveOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full glass-panel-quiet px-3.5 py-1.5 text-xs font-semibold text-foreground"
            >
              <FolderDown className="h-3.5 w-3.5" /> Import from Drive
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background"
            >
              <Upload className="h-3.5 w-3.5" /> Upload video
            </button>
          </div>
        }
      />

      {imports.length > 0 && (
        <div className="rounded-xl border border-[color:var(--glass-stroke)] bg-[color:color-mix(in_oklab,var(--surface-glass)_45%,transparent)] p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Drive imports in progress</p>
          <ul className="mt-2 space-y-1.5">
            {imports.map((i) => (
              <li key={i.id} className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-[color:color-mix(in_oklab,var(--warning)_16%,transparent)] px-2 py-0.5 text-[10px] font-semibold text-[color:var(--warning)]">Queued</span>
                <span className="truncate font-mono text-muted-foreground">{i.url}</span>
                <span className="ml-auto shrink-0 text-muted-foreground">{i.requestedAt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {/* Scope tabs */}
        <div className="flex items-center gap-1 rounded-full glass-panel-quiet p-1">
          {([["usable", `All usable · ${usable.length}`], ["mine", `Mine · ${mine.length}`], ["community", `Community · ${community.length}`]] as [Scope, string][]).map(([s, label]) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${scope === s ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Muscle chips */}
        <div className="flex flex-wrap items-center gap-1 rounded-full glass-panel-quiet p-1">
          {muscles.map((m) => (
            <button
              key={m}
              onClick={() => setMuscle(m)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${muscle === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((v) => {
          const own = v.ownerId === CURRENT_COACH.id;
          return (
            <div key={v.id} className="group glass-panel overflow-hidden p-0">
              <button type="button" onClick={() => setOpen(v)} className="relative block aspect-video w-full overflow-hidden text-left">
                <img src={v.thumb} alt={v.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                {v.durationSec > 0 && (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    <Clock className="h-3 w-3" />{Math.floor(v.durationSec / 60)}:{String(v.durationSec % 60).padStart(2, "0")}
                  </span>
                )}
                <span className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white ${v.visibility === "public" ? "bg-[color:color-mix(in_oklab,var(--teal)_85%,transparent)]" : "bg-black/60"}`}>
                  {v.visibility === "public" ? <Globe2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  {v.visibility === "public" ? "Public" : "Private"}
                </span>
                <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-foreground shadow-xl ring-2 ring-white/40">
                    <Play className="h-5 w-5 fill-current" />
                  </div>
                </div>
              </button>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-medium text-foreground">{v.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {v.muscle} · {own ? "Yours" : `By ${v.ownerName}`}{v.views > 0 ? ` · ${v.views.toLocaleString()} views` : ""}
                </p>
                {own && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const next = v.visibility === "public" ? "private" : "public";
                        setVideoVisibility(v.id, next);
                        toast.success(next === "public" ? "Made public" : "Made private", {
                          description: next === "public" ? "Any coach on the platform can now use this video." : "Only you can use this video now.",
                        });
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-[color:var(--glass-stroke)] px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
                    >
                      {v.visibility === "public" ? <><Lock className="h-3 w-3" /> Make private</> : <><Globe2 className="h-3 w-3" /> Make public</>}
                    </button>
                    <button
                      onClick={() => { removeVideo(v.id); toast(`"${v.title}" removed from your library`); }}
                      aria-label={`Delete ${v.title}`}
                      className="ml-auto rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">No videos here yet - upload one or import a Drive folder.</p>
        )}
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
                {open.exercise} · {open.muscle} · {open.ownerId === CURRENT_COACH.id ? "Your video" : `By ${open.ownerName}`} ·{" "}
                <span className={open.visibility === "public" ? "text-[color:var(--teal)]" : ""}>{open.visibility === "public" ? "Public" : "Private"}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
