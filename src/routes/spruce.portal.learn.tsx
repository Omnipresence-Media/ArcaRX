import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { ARTICLES, useSpruce, type Article } from "@/features/spruce/store";
import { EmptyState, Pill, SectionCard, SpPage, VideoEmbed } from "@/features/spruce/ui";
import { headingFont } from "@/features/spruce/theme";

export const Route = createFileRoute("/spruce/portal/learn")({
  head: () => ({ meta: [{ title: "Learn - Spruce Micro" }] }),
  validateSearch: (s: Record<string, unknown>): { slug?: string } => ({
    slug: typeof s.slug === "string" ? s.slug : undefined,
  }),
  component: Learn,
});

function Learn() {
  const { slug } = Route.useSearch();
  if (slug) return <ArticleView slug={slug} />;
  return <Library />;
}

function ArticleCard({ a, highlight }: { a: Article; highlight?: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate({ to: "/spruce/portal/learn", search: { slug: a.slug } })}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors hover:border-[color:var(--teal)] ${
        highlight ? "bg-accent" : "bg-card"
      }`}
    >
      <div className="min-w-0 space-y-1">
        <Pill tone={a.category === "microneedling" ? "brand" : "neutral"}>
          {a.category === "microneedling" ? "Microneedling" : "General"}
        </Pill>
        <p className="text-sm font-semibold" style={headingFont}>{a.title}</p>
        <p className="text-xs text-muted-foreground">{a.summary}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function Library() {
  const s = useSpruce();
  const micro = ARTICLES.filter((a) => a.category === "microneedling");
  const general = ARTICLES.filter((a) => a.category === "general");
  const products = s.products.filter((p) => p.active);

  return (
    <SpPage title="Learn" sub="Guides to help you get the most from your care.">
      {micro.length > 0 && (
        <section className="space-y-3 rounded-xl border border-[color:var(--teal)]/40 bg-accent/40 p-4 md:p-5">
          <div>
            <h2 className="text-base font-semibold" style={headingFont}>Microneedling</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              New to microneedling? Read the rules before your first session.
            </p>
          </div>
          <div className="space-y-2">
            {micro.map((a) => (
              <ArticleCard key={a.slug} a={a} highlight />
            ))}
          </div>
        </section>
      )}

      {general.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">General</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {general.map((a) => (
              <ArticleCard key={a.slug} a={a} />
            ))}
          </div>
        </section>
      )}

      <SectionCard title="Product guides">
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">No products available right now.</p>
        ) : (
          <ul className="divide-y">
            {products.map((p) => (
              <li key={p.id}>
                <Link
                  to="/spruce/portal/store"
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.blurb}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </SpPage>
  );
}

function ArticleView({ slug }: { slug: string }) {
  const a = ARTICLES.find((x) => x.slug === slug);
  const back = (
    <Link
      to="/spruce/portal/learn"
      search={{ slug: undefined }}
      className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--teal)]"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Learn
    </Link>
  );

  if (!a) {
    return (
      <SpPage title="Learn">
        <EmptyState title="We could not find that article" body="It may have been moved or removed." action={back} />
      </SpPage>
    );
  }

  return (
    <SpPage title={a.title} sub={a.summary} actions={back}>
      <SectionCard>
        <div className="space-y-4">
          {a.videoId && <VideoEmbed id={a.videoId} title={a.title} />}
          <ul className="space-y-3 text-sm leading-relaxed">
            {a.body.map((para, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--teal)]" />
                <span>{para}</span>
              </li>
            ))}
          </ul>
        </div>
      </SectionCard>
    </SpPage>
  );
}
