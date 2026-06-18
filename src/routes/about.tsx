import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Why ARCA Rx exists | The future of practice software" },
      { name: "description", content: "ARCA Rx is rebuilding the operating system for health optimization practices. Our story, our mission, and the team behind it." },
      { property: "og:title", content: "About ARCA Rx" },
      { property: "og:description", content: "The story behind the operating system for modern health practices." },
    ],
    links: [{ rel: "canonical", href: "https://arca-rx.lovable.app/about" }],
  }),
  component: AboutPage,
});

const STATS = [
  { value: "240+", label: "Practices on ARCA" },
  { value: "$1.4B", label: "Annual GMV processed" },
  { value: "0", label: "HIPAA findings since launch" },
  { value: "99.99%", label: "Platform uptime" },
];

const VALUES = [
  { title: "Clinical first", body: "Every feature is reviewed by practicing clinicians before it ships. We don't guess what charting feels like." },
  { title: "Boring infrastructure", body: "Bank-grade encryption, SOC 2 Type II, HITRUST r2. The unsexy work that lets you sleep at night." },
  { title: "No two-year contracts", body: "Month-to-month from day one. If we're not earning your business, you should be able to leave." },
  { title: "Real human support", body: "Your CSM has a name, a face, and a phone number. No ticket queues. No chatbots pretending to be people." },
  { title: "Built in the open", body: "Public changelog, public roadmap, public uptime. You see what we're shipping and what's broken in real time." },
  { title: "Aligned incentives", body: "We make money when you grow. No usage fees, no add-on traps, no surprise invoices." },
];

const TEAM = [
  { name: "Dr. Elena Rios", role: "Co-founder & CEO", bio: "Practiced aesthetics for 11 years. Sold her two-location med spa in 2023 to build the platform she wished existed." },
  { name: "Mateo Aragón", role: "Co-founder & CTO", bio: "Former Stripe engineer. Built infrastructure for some of the largest healthcare networks in the country." },
  { name: "Sarah Chen", role: "Chief Clinical Officer", bio: "Board-certified PA, 14 years in functional medicine. Designs every clinical template in ARCA." },
  { name: "Marcus Tate, JD", role: "Director of Compliance", bio: "Healthcare attorney. Previously OCR enforcement. Knows where the bodies are buried." },
];

export function AboutPage() {
  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: "160px 40px 100px", position: "relative", overflow: "hidden" }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(900px 500px at 50% -100px, rgba(0,181,164,0.10), transparent 60%)",
        }} />
        <div className="mx-auto relative" style={{ maxWidth: 920, textAlign: "center" }}>
          <Reveal>
            <span style={{
              display: "inline-block", padding: "6px 14px", borderRadius: 999,
              background: "#F0FDFA", color: "#065F46", border: "1px solid #A7F3D0",
              fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Our story</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{
              marginTop: 28, fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: "clamp(44px, 6.5vw, 80px)", color: "#0F1F3D",
              letterSpacing: "-0.03em", lineHeight: 1.02,
            }}>We're building<br/>
              <span style={{
                background: "linear-gradient(135deg, #00B5A4 0%, #0F1F3D 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>the operating system</span>
              <br/>your practice deserves.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{
              marginTop: 28, fontFamily: "Inter, sans-serif", fontSize: 20,
              color: "#475569", lineHeight: 1.6, maxWidth: 680, marginInline: "auto",
            }}>
              ARCA Rx exists because the software running modern health optimization practices
              hasn't kept up with the medicine. We're here to fix that.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Origin story */}
      <section style={{ padding: "60px 40px 100px" }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 42px)", color: "#0F1F3D",
              letterSpacing: "-0.025em", lineHeight: 1.15,
            }}>Why we started.</h2>
          </Reveal>
          <Reveal delay={80}>
            <p style={{
              marginTop: 24, fontFamily: "'Inter', sans-serif", fontSize: 18,
              color: "#334155", lineHeight: 1.85,
            }}>
              In 2023, our CEO Dr. Elena Rios sold her two-location aesthetics practice in Austin
              after eleven years of building it. The hardest part of running that practice wasn't
              the medicine, the hiring, or the marketing. It was the software.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <p style={{
              marginTop: 20, fontFamily: "'Inter', sans-serif", fontSize: 18,
              color: "#334155", lineHeight: 1.85,
            }}>
              She used seven different tools to run the business — a calendar that didn't know about
              the EMR, an EMR that didn't know about the POS, a POS that didn't know about marketing,
              and a marketing stack that lived in someone else's spreadsheet. Each one charged her
              monthly. Each one required its own login. None of them talked to each other.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <p style={{
              marginTop: 20, fontFamily: "'Inter', sans-serif", fontSize: 18,
              color: "#334155", lineHeight: 1.85,
            }}>
              When she went looking for an all-in-one platform, she found two options: legacy
              healthcare software built in 2014, or spa software that wasn't actually clinical. So
              she partnered with Mateo Aragón, a former Stripe infrastructure engineer, and they
              started building ARCA Rx — the operating system she wished she'd had.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "20px 40px 80px" }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <Reveal>
            <div className="grid gap-px" style={{
              gridTemplateColumns: `repeat(${STATS.length}, minmax(0,1fr))`,
              background: "#0F1F3D", borderRadius: 20, overflow: "hidden",
            }}>
              {STATS.map((s) => (
                <div key={s.label} style={{
                  background: "#0F1F3D", padding: "40px 24px", textAlign: "center",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                    fontSize: 48, color: "#00B5A4", letterSpacing: "-0.02em",
                  }}>{s.value}</div>
                  <div style={{
                    marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 13,
                    color: "rgba(255,255,255,0.65)",
                  }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "80px 40px", background: "#F8FAFC" }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)", color: "#0F1F3D",
              letterSpacing: "-0.025em", textAlign: "center",
            }}>What we believe.</h2>
          </Reveal>
          <div className="grid gap-6 mt-12" style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}>
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <div style={{
                  background: "white", borderRadius: 14, padding: 28,
                  border: "1px solid #E2E8F0", height: "100%",
                }}>
                  <h3 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                    fontSize: 18, color: "#0F1F3D",
                  }}>{v.title}</h3>
                  <p style={{
                    marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: 15,
                    color: "#64748B", lineHeight: 1.7,
                  }}>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: "100px 40px" }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)", color: "#0F1F3D",
              letterSpacing: "-0.025em", textAlign: "center",
            }}>The team.</h2>
          </Reveal>
          <div className="grid gap-8 mt-12" style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}>
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 80}>
                <div>
                  <div style={{
                    width: "100%", aspectRatio: "1 / 1", borderRadius: 16,
                    background: `linear-gradient(135deg, hsl(${(i * 70) % 360} 60% 88%), hsl(${(i * 70 + 40) % 360} 50% 78%))`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#0F1F3D", fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 48, letterSpacing: "-0.02em",
                  }}>{m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
                  <h3 style={{
                    marginTop: 18, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 18, color: "#0F1F3D",
                  }}>{m.name}</h3>
                  <div style={{
                    marginTop: 4, fontFamily: "Inter, sans-serif", fontSize: 13,
                    color: "#00B5A4", fontWeight: 600,
                  }}>{m.role}</div>
                  <p style={{
                    marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: 14,
                    color: "#64748B", lineHeight: 1.65,
                  }}>{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 40px", background: "#0F1F3D" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 720 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(32px, 4.5vw, 52px)", color: "white",
              letterSpacing: "-0.025em", lineHeight: 1.1,
            }}>Come build with us.</h2>
          </Reveal>
          <Reveal delay={80}>
            <p style={{
              marginTop: 16, fontFamily: "Inter, sans-serif", fontSize: 18,
              color: "rgba(255,255,255,0.7)", lineHeight: 1.65,
            }}>
              We're hiring across engineering, clinical, and customer success. Remote-first.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="flex justify-center gap-3 mt-8 flex-wrap">
              <a href="/admin/dashboard" className="rounded-lg font-semibold inline-block" style={{
                background: "#00B5A4", color: "#0F1F3D", padding: "14px 28px",
                fontFamily: "Inter, sans-serif", fontSize: 15,
              }}>Try ARCA Rx →</a>
              <a href="mailto:careers@arca.rx" className="rounded-lg font-semibold inline-block" style={{
                background: "transparent", color: "white", padding: "14px 28px",
                border: "1px solid rgba(255,255,255,0.3)",
                fontFamily: "Inter, sans-serif", fontSize: 15,
              }}>See open roles</a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
