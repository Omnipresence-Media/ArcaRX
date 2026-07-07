import { useSyncExternalStore } from "react";
import { videos as seedVideos } from "@/lib/fit-seed";
import { exerciseLibrary } from "@/lib/fit-seed-extra";
import { clipFor, type DemoClip } from "@/features/coaching/exerciseVideos";

// Trainer video library. Every video belongs to a trainer and is either
// public (any coach on the platform can use it) or private (only the owner
// can). Client playback resolves an exercise to a *usable* video: the
// signed-in coach's own videos plus everyone's public ones. localStorage
// backed; swap internals for Supabase storage + rows later.
//
// Bulk ingest: a trainer hands over a Google Drive link (150 videos etc.),
// the ARCA team downloads and self-hosts them (public/videos/...) and
// registers them here under that trainer - same pipeline used for the
// existing demo clips. The in-app "Import from Drive" card records that
// request.

export type Visibility = "public" | "private";

export type TrainerVideo = {
  id: string;
  title: string;
  exercise: string; // exercise name this video demonstrates
  muscle: string;
  durationSec: number;
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  thumb: string;
  src: string;
  views: number;
  ownerId: string;
  ownerName: string;
  visibility: Visibility;
  source: "library" | "upload" | "drive";
};

export type DriveImport = {
  id: string;
  url: string;
  note?: string;
  requestedAt: string;
  status: "queued";
};

// Demo identity - swap for the auth user when the real backend lands.
export const CURRENT_COACH = { id: "t-mara", name: "Mara Ellis" };
const DIEGO = { id: "t-diego", name: "Diego Ramos" };

const STORAGE_KEY = "arca_trainer_videos";

let uid = 0;
const nid = (p: string) => `${p}-${Date.now().toString(36)}-${(uid++).toString(36)}`;

// Exercise name = the part of the seed title before the "·" cue suffix.
const exerciseOf = (title: string) => title.split("·")[0].trim();

function seed(): { videos: TrainerVideo[]; imports: DriveImport[] } {
  // Diego owns a handful; two stay private to demonstrate the sharing rule
  // (they never show up as usable for other coaches).
  const diegoIds = new Set(["v3", "v4", "v10", "v12", "v5", "v8"]);
  const privateIds = new Set(["v5", "v8"]);
  const videos: TrainerVideo[] = seedVideos.map((v) => {
    const diego = diegoIds.has(v.id);
    return {
      ...v,
      exercise: exerciseOf(v.title),
      ownerId: diego ? DIEGO.id : CURRENT_COACH.id,
      ownerName: diego ? DIEGO.name : CURRENT_COACH.name,
      visibility: privateIds.has(v.id) ? "private" : "public",
      source: "library",
    };
  });
  return { videos, imports: [] };
}

type StoreShape = ReturnType<typeof seed>;

let store: StoreShape = seed();
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreShape;
      if (parsed && Array.isArray(parsed.videos) && parsed.videos.length) {
        store = { videos: parsed.videos, imports: parsed.imports ?? [] };
      }
    }
  } catch {
    /* keep seed */
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    /* storage unavailable */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  hydrate();
  listeners.add(l);
  return () => listeners.delete(l);
}

const serverSeed = seed();

export function useAllVideos(): TrainerVideo[] {
  return useSyncExternalStore(subscribe, () => (hydrate(), store.videos), () => serverSeed.videos);
}

// The rule: a coach can use their own videos (any visibility) plus every
// public video from other trainers.
export function usableBy(v: TrainerVideo, coachId: string): boolean {
  return v.ownerId === coachId || v.visibility === "public";
}

export function useDriveImports(): DriveImport[] {
  return useSyncExternalStore(subscribe, () => (hydrate(), store.imports), () => serverSeed.imports);
}

export function addVideo(input: { title: string; exercise: string; muscle: string; src: string; thumb?: string; visibility: Visibility; source?: TrainerVideo["source"] }): string {
  hydrate();
  const id = nid("tv");
  store = {
    ...store,
    videos: [
      {
        id,
        title: input.title,
        exercise: input.exercise || exerciseOf(input.title),
        muscle: input.muscle,
        durationSec: 0,
        equipment: "-",
        difficulty: "Intermediate",
        thumb: input.thumb ?? "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=60",
        src: input.src,
        views: 0,
        ownerId: CURRENT_COACH.id,
        ownerName: CURRENT_COACH.name,
        visibility: input.visibility,
        source: input.source ?? "upload",
      },
      ...store.videos,
    ],
  };
  emit();
  return id;
}

export function setVideoVisibility(id: string, visibility: Visibility) {
  hydrate();
  store = { ...store, videos: store.videos.map((v) => (v.id === id ? { ...v, visibility } : v)) };
  emit();
}

export function updateVideo(id: string, patch: Partial<Pick<TrainerVideo, "title" | "exercise" | "muscle">>) {
  hydrate();
  store = { ...store, videos: store.videos.map((v) => (v.id === id ? { ...v, ...patch } : v)) };
  emit();
}

export function removeVideo(id: string) {
  hydrate();
  store = { ...store, videos: store.videos.filter((v) => v.id !== id) };
  emit();
}

// Record a Google Drive bulk-import request: the ARCA team ingests the
// folder, maps videos to exercises, and registers them under this trainer.
export function addDriveImport(url: string, note?: string): string {
  hydrate();
  const id = nid("imp");
  store = {
    ...store,
    imports: [{ id, url, note, requestedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }), status: "queued" }, ...store.imports],
  };
  emit();
  return id;
}

// ---- upload auto-naming -------------------------------------------------------

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();

// Filename keywords -> category, for files that don't match a library
// exercise ("battle-rope-30s.mp4" -> Full body).
const CATEGORY_KEYWORDS: [RegExp, string][] = [
  [/squat|lunge|leg press|leg extension|step ?up|pistol/i, "Quads"],
  [/deadlift|rdl|hinge|hamstring|leg curl|good ?morning|nordic/i, "Hamstrings"],
  [/hip thrust|glute|bridge|kickback/i, "Glutes"],
  [/bench|chest|push ?up|fly|dip/i, "Chest"],
  [/row|pull ?up|pull ?down|lat|chin ?up|pullover/i, "Back"],
  [/shoulder|lateral|raise|ohp|overhead|delt|press(?!.*(leg|bench))/i, "Shoulders"],
  [/curl|tricep|bicep|arm|skull ?crusher|push ?down/i, "Arms"],
  [/plank|crunch|ab|core|rollout|hollow|dead ?bug/i, "Core"],
  [/stretch|mobility|foam|warm ?up|cool ?down|yoga/i, "Mobility"],
  [/bike|row(er)?|run|sprint|burpee|jump|battle|sled|carry|swing|kettlebell|conditioning|hiit/i, "Full body"],
];

// Generic camera/file names that say nothing about the movement.
const NOISE_NAME = /^(img|image|mov|vid|video|clip|untitled|final|export|render|screen|rec(ording)?)?[\s_-]*\d*$/i;

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export type VideoMeta = { title: string; exercise: string; muscle: string };

// Work out title / exercise / category from a filename: use the file's own
// name as the title when it's meaningful, otherwise name it after the
// exercise being performed; category comes from the matched exercise (or
// keyword fallback).
export function detectVideoMeta(filename: string): VideoMeta {
  const cleaned = filename
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const n = norm(cleaned);

  const libMatch = exerciseLibrary.find((e) => {
    const en = norm(e.name);
    return n.includes(en) || en.includes(n);
  });

  const exercise = libMatch?.name ?? "";
  const muscle =
    libMatch?.muscle ??
    CATEGORY_KEYWORDS.find(([re]) => re.test(cleaned))?.[1] ??
    "Full body";

  // Meaningless camera names (IMG_4231...) take the exercise as the title;
  // if we can't detect one either, leave it blank so whatever the coach types
  // as the exercise becomes the name.
  const meaningless = !cleaned || NOISE_NAME.test(cleaned);
  const title = meaningless ? exercise : titleCase(cleaned);

  return { title, exercise: exercise || (meaningless ? "" : titleCase(cleaned)), muscle };
}

// ---- client playback resolution ---------------------------------------------

// Prefer a usable trainer video whose exercise matches, else fall back to the
// built-in keyword demo clips.
function resolveClip(exName: string, muscle: string): DemoClip {
  hydrate();
  const n = norm(exName);
  const match = store.videos.find(
    (v) => usableBy(v, CURRENT_COACH.id) && v.src && (norm(v.exercise) === n || n.includes(norm(v.exercise)) || norm(v.exercise).includes(n)),
  );
  if (match) return { src: match.src, poster: match.thumb, label: match.ownerId === CURRENT_COACH.id ? "Your coach's demo" : `${match.ownerName.split(" ")[0]}'s demo` };
  return clipFor(exName, muscle);
}

// Reactive version for the client player: re-resolves when the library
// changes (upload, visibility flip, delete).
const clipCache = new Map<string, DemoClip>();
export function useClipFor(exName: string, muscle: string): DemoClip {
  return useSyncExternalStore(
    subscribe,
    () => {
      const next = resolveClip(exName, muscle);
      const key = `${exName}|${muscle}`;
      const cached = clipCache.get(key);
      if (cached && cached.src === next.src && cached.label === next.label) return cached;
      clipCache.set(key, next);
      return next;
    },
    () => clipFor(exName, muscle),
  );
}
