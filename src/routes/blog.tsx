import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { BLOG_POSTS } from "@/lib/marketing-content";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Insights for modern health practices | ARCA Rx" },
      { name: "description", content: "Practice growth playbooks, HIPAA compliance guides, clinical operations, and product updates from the ARCA Rx team." },
      { property: "og:title", content: "Blog — ARCA Rx" },
      { property: "og:description", content: "Insights for modern health optimization practices." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [featured, ...rest] = BLOG_POSTS;
  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />

      <section style={{ padding: "140px 40px 60px" }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <Reveal>
            <span style={{
              fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase", color: "#00B5A4",
            }}>The ARCA journal</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{
              marginTop: 16, fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: "clamp(44px, 6vw, 72px)", color: "#0F1F3D",
              letterSpacing: "-0.03em", lineHeight: 1.05,
            }}>Insights for modern<br/>health practices.</h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{
              marginTop: 24, fontFamily: "Inter, sans-serif", fontSize: 19,
              color: "#64748B", lineHeight: 1.65, maxWidth: 620,
            }}>
              Growth playbooks, compliance deep dives, clinical operations, and product updates —
              from the people building ARCA Rx.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding: "20px 40px 60px" }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <Reveal>
            <Link
              to="/blog/$slug"
              params={{ slug: featured.slug }}
              className="block group"
              style={{
                background: "linear-gradient(135deg, #0F1F3D 0%, #1a3260 100%)",
                borderRadius: 24, padding: "56px 56px", textDecoration: "none",
                position: "relative", overflow: "hidden",
              }}
            >
              <div aria-hidden style={{
                position: "absolute", top: -100, right: -100, width: 400, height: 400,
                background: "radial-gradient(circle, rgba(0,181,164,0.25), transparent 70%)",
              }} />
              <div className="relative">
                <span style={{
                  fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.1em", textTransform: "uppercase", color: "#00B5A4",
                }}>Featured · {featured.category}</span>
                <h2 style={{
                  marginTop: 16, fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: "clamp(28px, 4vw, 44px)", color: "white",
                  letterSpacing: "-0.025em", lineHeight: 1.15, maxWidth: 820,
                }}>{featured.title}</h2>
                <p style={{
                  marginTop: 18, fontFamily: "Inter, sans-serif", fontSize: 17,
                  color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: 720,
                }}>{featured.excerpt}</p>
                <div className="flex items-center gap-4 mt-8" style={{
                  fontFamily: "Inter, sans-serif", fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                }}>
                  <span>{featured.author.name}</span>
                  <span>·</span>
                  <span>{featured.publishedAt}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                </div>
                <div className="inline-flex items-center gap-2 mt-8" style={{
                  fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600,
                  color: "#00B5A4",
                }}>Read article <ArrowRight size={16} /></div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "20px 40px 120px" }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <div className="grid gap-8" style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}>
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="block h-full group"
                  style={{
                    textDecoration: "none",
                    paddingBottom: 24,
                    borderBottom: "1px solid #E2E8F0",
                  }}
                >
                  <span style={{
                    fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600,
                    letterSpacing: "0.1em", textTransform: "uppercase", color: "#00B5A4",
                  }}>{p.category}</span>
                  <h3 style={{
                    marginTop: 12, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 22, color: "#0F1F3D",
                    letterSpacing: "-0.015em", lineHeight: 1.25,
                  }}>{p.title}</h3>
                  <p style={{
                    marginTop: 12, fontFamily: "Inter, sans-serif", fontSize: 15,
                    color: "#64748B", lineHeight: 1.65,
                  }}>{p.excerpt}</p>
                  <div className="flex items-center gap-3 mt-5" style={{
                    fontFamily: "Inter, sans-serif", fontSize: 12, color: "#94A3B8",
                  }}>
                    <span>{p.publishedAt}</span>
                    <span>·</span>
                    <span>{p.readTime}</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
