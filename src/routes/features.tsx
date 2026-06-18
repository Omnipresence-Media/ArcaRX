import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { FEATURES } from "@/lib/marketing-content";
import * as Icons from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Every capability of ARCA Rx, in one platform" },
      { name: "description", content: "Scheduling, EMR, POS, growth analytics, patient engagement, website builder, multi-location, and HIPAA security. The complete feature tour of ARCA Rx." },
      { property: "og:title", content: "Features — ARCA Rx" },
      { property: "og:description", content: "The complete feature tour of the operating system for health optimization practices." },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: "160px 40px 80px", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(0,181,164,0.10), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="mx-auto text-center relative" style={{ maxWidth: 920 }}>
          <Reveal>
            <span style={{
              display: "inline-block", padding: "6px 14px", borderRadius: 999,
              background: "#F0FDFA", color: "#065F46", border: "1px solid #A7F3D0",
              fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            }}>The complete platform</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{
              marginTop: 24,
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(44px, 6vw, 76px)", color: "#0F1F3D",
              letterSpacing: "-0.03em", lineHeight: 1.05,
            }}>
              Every feature your practice<br/>needs.{" "}
              <span style={{
                background: "linear-gradient(135deg, #00B5A4 0%, #0F1F3D 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>One platform.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: 20, color: "#475569",
              marginTop: 28, lineHeight: 1.6, maxWidth: 680, marginInline: "auto",
            }}>
              ARCA Rx replaces seven disconnected tools with one HIPAA-compliant operating system.
              Tour every capability below.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Feature grid */}
      <section style={{ padding: "60px 40px 120px" }}>
        <div className="mx-auto" style={{ maxWidth: 1280 }}>
          <div className="grid gap-6" style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}>
            {FEATURES.map((f, i) => {
              const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>>)[f.icon] || Icons.Sparkles;
              return (
                <Reveal key={f.slug} delay={i * 60}>
                  <Link
                    to="/features/$slug"
                    params={{ slug: f.slug }}
                    className="group block h-full"
                    style={{
                      background: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: 16,
                      padding: 28,
                      transition: "all 280ms cubic-bezier(0.22, 1, 0.36, 1)",
                      textDecoration: "none",
                      display: "block",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-6px)";
                      e.currentTarget.style.boxShadow = "0 24px 60px -24px rgba(15,31,61,0.18)";
                      e.currentTarget.style.borderColor = "#00B5A4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#E2E8F0";
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: "linear-gradient(135deg, #ECFEFF, #F0FDFA)",
                      border: "1px solid #A7F3D0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={22} color="#00B5A4" strokeWidth={1.75} />
                    </div>
                    <div style={{
                      marginTop: 20, fontFamily: "Inter, sans-serif", fontSize: 11,
                      fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "#00B5A4",
                    }}>{f.category}</div>
                    <h3 style={{
                      marginTop: 8, fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700, fontSize: 22, color: "#0F1F3D", letterSpacing: "-0.01em",
                    }}>{f.title}</h3>
                    <p style={{
                      marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: 14,
                      color: "#64748B", lineHeight: 1.65,
                    }}>{f.tagline}</p>
                    <div style={{
                      marginTop: 22, display: "inline-flex", alignItems: "center", gap: 6,
                      fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
                      color: "#0F1F3D",
                    }}>
                      Explore feature
                      <Icons.ArrowRight size={14} />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 40px", background: "#0F1F3D" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 720 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(32px, 4vw, 48px)", color: "white",
              letterSpacing: "-0.025em", lineHeight: 1.15,
            }}>See it run on your practice.</h2>
          </Reveal>
          <Reveal delay={80}>
            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: 18, color: "rgba(255,255,255,0.7)",
              marginTop: 16, lineHeight: 1.65,
            }}>
              14-day free trial. White-glove migration. No credit card required.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <a href="/admin/dashboard"
              className="inline-block mt-8 rounded-lg font-semibold transition-all"
              style={{
                background: "#00B5A4", color: "#0F1F3D",
                padding: "16px 32px", fontFamily: "Inter, sans-serif", fontSize: 16,
              }}
            >Start free trial →</a>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
