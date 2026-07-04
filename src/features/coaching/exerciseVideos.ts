// Maps exercises to demo video clips (self-hosted, generated in-house) with
// muscle-group fallbacks and Unsplash posters. Drop new clips into
// public/videos/ and extend BY_KEYWORD to give any exercise its own footage.

export type DemoClip = { src: string; poster: string; label: string };

const poster = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=60`;

const CLIPS = {
  bench: { src: "/videos/demo-bench.mp4", poster: poster("photo-1534438327276-14e5300c3a48"), label: "Press demo" },
  squat: { src: "/videos/demo-squat.mp4", poster: poster("photo-1517836357463-d25dfeac3438"), label: "Squat demo" },
  row: { src: "/videos/demo-row.mp4", poster: poster("photo-1581009137042-c552e485697a"), label: "Pull demo" },
  lateral: { src: "/videos/demo-lateral.mp4", poster: poster("photo-1517344884509-a0c97ec11bcc"), label: "Raise demo" },
} satisfies Record<string, DemoClip>;

// Keyword → clip. First match wins; order matters.
const BY_KEYWORD: [RegExp, DemoClip][] = [
  [/bench|press(?!.*leg)|push ?down|dip|extension.*tricep|tricep/i, CLIPS.bench],
  [/squat|leg press|lunge|split squat|leg extension|calf/i, CLIPS.squat],
  [/row|pull|deadlift|rdl|curl|face pull|shrug|hip thrust|ham/i, CLIPS.row],
  [/raise|lateral|shoulder|ohp|overhead|delt|fly/i, CLIPS.lateral],
];

const BY_MUSCLE: Record<string, DemoClip> = {
  Chest: CLIPS.bench,
  Triceps: CLIPS.bench,
  Quads: CLIPS.squat,
  Calves: CLIPS.squat,
  Back: CLIPS.row,
  Hamstrings: CLIPS.row,
  Glutes: CLIPS.row,
  Biceps: CLIPS.row,
  Shoulders: CLIPS.lateral,
};

export function clipFor(exName: string, muscle: string): DemoClip {
  for (const [re, clip] of BY_KEYWORD) if (re.test(exName)) return clip;
  return BY_MUSCLE[muscle] ?? CLIPS.bench;
}
