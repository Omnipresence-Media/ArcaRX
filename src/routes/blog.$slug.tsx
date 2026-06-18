import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { BLOG_POSTS, type BlogPost as BlogPostT } from "@/lib/marketing-content";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.post;
    return {
      meta: [
        { title: p ? `${p.title} | ARCA Rx Blog` : "Article — ARCA Rx" },
        { name: "description", content: p?.excerpt ?? "" },
        { property: "og:title", content: p?.title ?? "" },
        { property: "og:description", content: p?.excerpt ?? "" },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: p?.publishedAt ?? "" },
        { property: "article:author", content: p?.author.name ?? "" },
      ],
      links: p
        ? [{ rel: "canonical", href: `https://arca-rx.lovable.app/blog/${params.slug}` }]
        : [],
      scripts: p
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: p.title,
                description: p.excerpt,
                author: { "@type": "Person", name: p.author.name },
                datePublished: p.publishedAt,
                publisher: { "@type": "Organization", name: "ARCA Rx" },
              }),
            },
          ]
        : [],
    };
  },
  component: BlogPost,
  notFoundComponent: () => (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />
      <div className="mx-auto text-center" style={{ padding: "200px 40px", maxWidth: 600 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 48, fontWeight: 700, color: "#0F1F3D" }}>Article not found</h1>
        <Link to="/blog" className="inline-block mt-8 text-teal-600 font-semibold">← All articles</Link>
      </div>
      <Footer />
    </div>
  ),
});

function BlogPost() {
  const { post } = Route.useLoaderData() as { post: BlogPostT };
  const idx = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
  const next = BLOG_POSTS[(idx + 1) % BLOG_POSTS.length];

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />

      <article style={{ padding: "140px 40px 80px" }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <Reveal>
            <Link to="/blog" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: "Inter, sans-serif", fontSize: 13, color: "#64748B",
              textDecoration: "none",
            }}>
              <ArrowLeft size={14} /> Back to blog
            </Link>
          </Reveal>
          <Reveal delay={60}>
            <span style={{
              display: "inline-block", marginTop: 28,
              fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase", color: "#00B5A4",
            }}>{post.category}</span>
          </Reveal>
          <Reveal delay={120}>
            <h1 style={{
              marginTop: 16, fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: "clamp(36px, 5vw, 56px)", color: "#0F1F3D",
              letterSpacing: "-0.025em", lineHeight: 1.1,
            }}>{post.title}</h1>
          </Reveal>
          <Reveal delay={180}>
            <p style={{
              marginTop: 24, fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500, fontSize: 21, color: "#475569",
              lineHeight: 1.45, letterSpacing: "-0.005em",
            }}>{post.excerpt}</p>
          </Reveal>
          <Reveal delay={220}>
            <div className="flex items-center gap-3 mt-10" style={{
              paddingTop: 24, borderTop: "1px solid #E2E8F0",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 22,
                background: "linear-gradient(135deg, #00B5A4, #0F1F3D)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700, fontSize: 15,
              }}>
                {post.author.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div style={{
                  fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600,
                  color: "#0F1F3D",
                }}>{post.author.name}</div>
                <div style={{
                  fontFamily: "Inter, sans-serif", fontSize: 12, color: "#94A3B8",
                  marginTop: 2,
                }}>{post.author.role} · {post.publishedAt} · {post.readTime}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </article>

      {/* Body */}
      <section style={{ padding: "20px 40px 80px" }}>
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          {post.sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 40}>
              <div style={{ marginTop: i === 0 ? 0 : 48 }}>
                <h2 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                  fontSize: 28, color: "#0F1F3D", letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}>{s.heading}</h2>
                <p style={{
                  marginTop: 18, fontFamily: "'Inter', Georgia, serif", fontSize: 18,
                  color: "#334155", lineHeight: 1.8,
                }}>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA + next */}
      <section style={{ padding: "40px 40px 100px" }}>
        <div className="mx-auto" style={{ maxWidth: 1080 }}>
          <Reveal>
            <div style={{
              background: "#F8FAFC", borderRadius: 20, padding: 40,
              border: "1px solid #E2E8F0", textAlign: "center",
            }}>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                fontSize: 28, color: "#0F1F3D", letterSpacing: "-0.02em",
              }}>Ready to see ARCA Rx in your practice?</h3>
              <p style={{
                marginTop: 12, fontFamily: "Inter, sans-serif", fontSize: 16,
                color: "#64748B",
              }}>14-day free trial. White-glove migration. No credit card required.</p>
              <a href="/admin/dashboard" className="inline-block mt-6 rounded-lg font-semibold"
                style={{
                  background: "#00B5A4", color: "#0F1F3D",
                  padding: "14px 28px", fontFamily: "Inter, sans-serif", fontSize: 15,
                }}
              >Start free trial →</a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Link to="/blog/$slug" params={{ slug: next.slug }} className="block mt-12" style={{
              textDecoration: "none", padding: "32px 8px",
              borderTop: "1px solid #E2E8F0",
            }}>
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600,
                letterSpacing: "0.1em", textTransform: "uppercase", color: "#94A3B8",
              }}>Read next</div>
              <div className="flex items-center justify-between gap-6 mt-3">
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                  fontSize: 24, color: "#0F1F3D", letterSpacing: "-0.015em",
                }}>{next.title}</h3>
                <ArrowRight size={20} color="#0F1F3D" />
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
