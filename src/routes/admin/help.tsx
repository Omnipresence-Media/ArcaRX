import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shell/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HELP_PARTS, GLOSSARY, type Lesson } from "@/features/help/helpContent";
import { Search, ArrowRight, BookOpen, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/admin/help")({
  head: () => ({ meta: [{ title: "Help Center - ARCA Rx" }] }),
  component: HelpCenter,
});

function lessonMatches(l: Lesson, q: string) {
  const hay = `${l.title} ${l.what} ${(l.steps ?? []).join(" ")} ${l.tip ?? ""}`.toLowerCase();
  return hay.includes(q);
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Card className="surface-elevated">
      <CardContent className="p-4 md:p-5 space-y-3">
        <h3 className="text-sm font-semibold">{lesson.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{lesson.what}</p>
        {lesson.steps && (
          <ol className="space-y-1.5">
            {lesson.steps.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--teal)_14%,transparent)] font-mono text-[11px] font-semibold text-[color:var(--teal)]">
                  {i + 1}
                </span>
                <span className="text-foreground/90">{s}</span>
              </li>
            ))}
          </ol>
        )}
        {lesson.tip && (
          <p className="flex items-start gap-2 rounded-md border border-[color:var(--warning)]/25 bg-[color:color-mix(in_oklab,var(--warning)_7%,transparent)] p-2.5 text-xs leading-relaxed text-foreground/85">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--warning)]" />
            {lesson.tip}
          </p>
        )}
        {lesson.to && (
          lesson.to.startsWith("/admin") ? (
            <Link
              to={lesson.to}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--teal)] hover:underline"
            >
              {lesson.toLabel ?? "Take me there"} <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <a
              href={lesson.to}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--teal)] hover:underline"
            >
              {lesson.toLabel ?? "Take me there"} <ArrowRight className="h-3 w-3" />
            </a>
          )
        )}
      </CardContent>
    </Card>
  );
}

function HelpCenter() {
  const [query, setQuery] = useState("");
  const [activePart, setActivePart] = useState<string>(HELP_PARTS[0].id);

  const q = query.trim().toLowerCase();
  const searching = q.length > 1;

  const results = useMemo(() => {
    if (!searching) return [];
    return HELP_PARTS.flatMap((p) =>
      p.lessons.filter((l) => lessonMatches(l, q)).map((l) => ({ part: p, lesson: l })),
    );
  }, [q, searching]);

  const part = HELP_PARTS.find((p) => p.id === activePart) ?? HELP_PARTS[0];

  return (
    <div className="p-4 md:p-8 space-y-5">
      <PageHeader
        eyebrow="Support"
        title="Help Center"
        description="The complete playbook, in plain English. Work through the parts in order - or search for what you need right now."
      />

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the playbook... (e.g. 'book appointment', 'refund', 'toggle')"
          className="h-10 pl-9"
        />
      </div>

      {searching ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {results.length} result{results.length !== 1 && "s"} for "{query.trim()}"
          </p>
          {results.length === 0 ? (
            <Card className="surface-elevated">
              <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
                <BookOpen className="h-6 w-6 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Nothing matched. Try a shorter word - like "book", "photo", or "note".</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {results.map(({ part: p, lesson }) => (
                <div key={lesson.id} className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{p.label} · {p.title}</p>
                  <LessonCard lesson={lesson} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Part navigator */}
          <nav className="space-y-1 self-start lg:sticky lg:top-4">
            {HELP_PARTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePart(p.id)}
                className={`flex w-full flex-col rounded-md px-3 py-2 text-left transition-colors ${
                  p.id === activePart
                    ? "bg-[color:color-mix(in_oklab,var(--teal)_12%,transparent)]"
                    : "hover:bg-muted/50"
                }`}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--teal)]">{p.label}</span>
                <span className={`text-sm ${p.id === activePart ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{p.title}</span>
              </button>
            ))}
            <button
              onClick={() => setActivePart("glossary")}
              className={`flex w-full flex-col rounded-md px-3 py-2 text-left transition-colors ${
                activePart === "glossary"
                  ? "bg-[color:color-mix(in_oklab,var(--teal)_12%,transparent)]"
                  : "hover:bg-muted/50"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--teal)]">Reference</span>
              <span className={`text-sm ${activePart === "glossary" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>Glossary</span>
            </button>
          </nav>

          {/* Active part */}
          {activePart === "glossary" ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Glossary</h2>
                <p className="mt-1 text-sm text-muted-foreground">Every term in this system, in one plain-English line each.</p>
              </div>
              <Card className="surface-elevated">
                <CardContent className="divide-y p-0">
                  {GLOSSARY.map((g) => (
                    <div key={g.term} className="flex items-baseline gap-4 px-4 py-2.5">
                      <span className="w-36 shrink-0 text-sm font-semibold">{g.term}</span>
                      <span className="text-sm text-muted-foreground">{g.def}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">{part.label} · {part.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{part.intro}</p>
              </div>
              <div className="grid gap-3 xl:grid-cols-2">
                {part.lessons.map((l) => <LessonCard key={l.id} lesson={l} />)}
              </div>
              {/* Next part nudge */}
              {(() => {
                const idx = HELP_PARTS.findIndex((p) => p.id === part.id);
                const next = HELP_PARTS[idx + 1];
                return next ? (
                  <button
                    onClick={() => { setActivePart(next.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium text-foreground hover:border-[color:var(--teal)]/40"
                  >
                    Continue to {next.label}: {next.title} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : null;
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
