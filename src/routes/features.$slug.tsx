import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { FEATURES, type FeatureContent } from "@/lib/marketing-content";
import * as Icons from "lucide-react";

export const Route = createFileRoute("/features/$slug")({
  loader: ({ params }) => {
    const f = FEATURES.find((x) => x.slug === params.slug);
    if (!f) throw notFound();
    return { feature: f };
  },
  head: ({ loaderData }) => {
    const f = loaderData?.feature;
    return {
      meta: [
        { title: f ? `${f.title} - ARCA Rx` : "Feature - ARCA Rx" },
        { name: "description", content: f?.description ?? "ARCA Rx feature." },
        { property: "og:title", content: f ? `${f.title} - ARCA Rx` : "Feature - ARCA Rx" },
        { property: "og:description", content: f?.description ?? "" },
        { property: "og:type", content: "article" },
      ],
      links: f
        ? [{ rel: "canonical", href: `https://arca-rx.lovable.app/features/${f.slug}` }]
        : [],
    };
  },
  component: FeatureDetail,
  notFoundComponent: () => (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />
      <div className="mx-auto text-center" style={{ padding: "200px 40px", maxWidth: 600 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 48, fontWeight: 700, color: "#0F1F3D" }}>Feature not found</h1>
        <Link to="/features" className="inline-block mt-8 text-teal-600 font-semibold">← Back to features</Link>
      </div>
      <Footer />
    </div>
  ),
});

function FeatureDetail() {
  const { feature: f } = Route.useLoaderData() as { feature: FeatureContent };
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>>)[f.icon] || Icons.Sparkles;
  const idx = FEATURES.findIndex((x) => x.slug === f.slug);
  const next = FEATURES[(idx + 1) % FEATURES.length];

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: "140px 40px 80px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(800px 400px at 50% -100px, rgba(0,181,164,0.12), transparent 60%)",
        }} />
        <div className="mx-auto relative" style={{ maxWidth: 920 }}>
          <Reveal>
            <Link to="/features" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: "Inter, sans-serif", fontSize: 13, color: "#64748B",
              textDecoration: "none",
            }}>
              <Icons.ArrowLeft size={14} /> All features
            </Link>
          </Reveal>
          <Reveal delay={60}>
            <div style={{
              marginTop: 24, display: "inline-flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "linear-gradient(135deg, #ECFEFF, #F0FDFA)",
                border: "1px solid #A7F3D0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={28} color="#00B5A4" strokeWidth={1.75} />
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase", color: "#00B5A4",
              }}>{f.category}</span>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <h1 style={{
              marginTop: 24,
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(40px, 5.5vw, 68px)", color: "#0F1F3D",
              letterSpacing: "-0.03em", lineHeight: 1.05,
            }}>{f.title}</h1>
          </Reveal>
          <Reveal delay={200}>
            <p style={{
              marginTop: 20, fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500, fontSize: 24, color: "#475569",
              letterSpacing: "-0.01em", lineHeight: 1.35,
            }}>{f.tagline}</p>
          </Reveal>
          <Reveal delay={260}>
            <p style={{
              marginTop: 24, fontFamily: "Inter, sans-serif", fontSize: 17,
              color: "#64748B", lineHeight: 1.75,
            }}>{f.longDescription}</p>
          </Reveal>
        </div>
      </section>

      {/* Metrics strip */}
      <section style={{ padding: "20px 40px 60px" }}>
        <div className="mx-auto" style={{ maxWidth: 1080 }}>
          <Reveal>
            <div className="grid gap-px" style={{
              gridTemplateColumns: `repeat(${f.metrics.length}, 1fr)`,
              background: "#E2E8F0",
              border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden",
            }}>
              {f.metrics.map((m) => (
                <div key={m.label} style={{ background: "white", padding: "32px 24px", textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                    fontSize: 40, color: "#0F1F3D", letterSpacing: "-0.02em",
                  }}>{m.value}</div>
                  <div style={{
                    marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 13,
                    color: "#64748B",
                  }}>{m.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section style={{ padding: "60px 40px" }}>
        <div className="mx-auto" style={{ maxWidth: 1080 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 40px)", color: "#0F1F3D",
              letterSpacing: "-0.02em", lineHeight: 1.15,
            }}>What's inside.</h2>
          </Reveal>
          <div className="grid gap-5 mt-10" style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}>
            {f.capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 50}>
                <div style={{
                  background: "white", border: "1px solid #E2E8F0",
                  borderRadius: 14, padding: 24, height: "100%",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: "#00B5A4" }} />
                    <h3 style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                      fontSize: 17, color: "#0F1F3D",
                    }}>{c.title}</h3>
                  </div>
                  <p style={{
                    marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: 14,
                    color: "#64748B", lineHeight: 1.65,
                  }}>{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section style={{ padding: "80px 40px", background: "#F8FAFC" }}>
        <div className="mx-auto" style={{ maxWidth: 1080 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 40px)", color: "#0F1F3D",
              letterSpacing: "-0.02em", lineHeight: 1.15, textAlign: "center",
            }}>How it works.</h2>
          </Reveal>
          <div className="grid gap-6 mt-12" style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}>
            {f.workflow.map((w, i) => (
              <Reveal key={w.step} delay={i * 80}>
                <div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                    fontWeight: 600, color: "#00B5A4", letterSpacing: "0.1em",
                  }}>STEP {w.step}</div>
                  <h3 style={{
                    marginTop: 8, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 19, color: "#0F1F3D",
                  }}>{w.title}</h3>
                  <p style={{
                    marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 14,
                    color: "#64748B", lineHeight: 1.65,
                  }}>{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 40px" }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 40px)", color: "#0F1F3D",
              letterSpacing: "-0.02em",
            }}>Common questions.</h2>
          </Reveal>
          <div className="mt-10 space-y-4">
            {f.faq.map((q, i) => (
              <Reveal key={q.q} delay={i * 60}>
                <div style={{
                  border: "1px solid #E2E8F0", borderRadius: 12, padding: 22,
                }}>
                  <h3 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                    fontSize: 16, color: "#0F1F3D",
                  }}>{q.q}</h3>
                  <p style={{
                    marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 15,
                    color: "#64748B", lineHeight: 1.7,
                  }}>{q.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Next feature */}
      <section style={{ padding: "60px 40px 100px" }}>
        <div className="mx-auto" style={{ maxWidth: 1080 }}>
          <Link to="/features/$slug" params={{ slug: next.slug }} style={{
            display: "block", textDecoration: "none",
            background: "linear-gradient(135deg, #0F1F3D 0%, #1a3260 100%)",
            borderRadius: 20, padding: "40px 40px",
          }}>
            <div style={{
              fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase", color: "#00B5A4",
            }}>Next feature</div>
            <div className="flex items-end justify-between gap-6 mt-3 flex-wrap">
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                fontSize: 32, color: "white", letterSpacing: "-0.02em",
              }}>{next.title}</h3>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600,
                color: "#00B5A4",
              }}>
                Explore <Icons.ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
