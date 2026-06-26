import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { ShieldCheck, Lock, FileCheck, Eye, Server, KeyRound } from "lucide-react";

export const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security & HIPAA - Built like a bank, audited like a hospital | ARCA Rx" },
      { name: "description", content: "SOC 2 Type II, HITRUST r2, HIPAA BAA included. End-to-end encryption, audit logs on every action, zero breaches since launch." },
      { property: "og:title", content: "Security & HIPAA - ARCA Rx" },
      { property: "og:description", content: "The security and compliance posture trusted by 240+ health practices." },
    ],
    links: [{ rel: "canonical", href: "https://arca-rx.lovable.app/security" }],
  }),
  component: SecurityPage,
});

const CERTS = [
  { name: "SOC 2 Type II", body: "Annual third-party audit by Schellman. Latest report Jan 2026." },
  { name: "HITRUST r2", body: "The gold standard for healthcare data. Re-certified annually." },
  { name: "HIPAA BAA", body: "Signed BAA included in every contract. No upcharge, no negotiation." },
  { name: "PCI-DSS Level 1", body: "Payments processed through Stripe under PCI Level 1 certification." },
];

const PILLARS = [
  { icon: Lock, title: "Encryption everywhere", body: "AES-256 at rest. TLS 1.3 in transit. KMS-managed keys with annual rotation. Field-level encryption for PHI." },
  { icon: Eye, title: "Audit every action", body: "Every read, every write, every login. Tamper-evident logs with 7-year retention. Exportable to your SIEM." },
  { icon: KeyRound, title: "Identity & access", body: "TOTP, WebAuthn, Okta, Google Workspace, Azure AD. Granular role-based permissions enforced server-side." },
  { icon: Server, title: "Infrastructure", body: "Multi-region AWS deployment. 99.99% uptime SLA. Point-in-time recovery to any second in the last 35 days." },
  { icon: FileCheck, title: "Vendor management", body: "Every subprocessor under BAA. Quarterly vendor security reviews. Public subprocessor list." },
  { icon: ShieldCheck, title: "Incident response", body: "4-hour incident response SLA. Tested quarterly. OCR notification handled by our security team." },
];

function SecurityPage() {
  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: "160px 40px 100px", background: "linear-gradient(180deg, #0F1F3D 0%, #1a3260 100%)" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 920 }}>
          <Reveal>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 999,
              background: "rgba(0,181,164,0.15)", color: "#00B5A4",
              border: "1px solid rgba(0,181,164,0.3)",
              fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}><ShieldCheck size={14} /> Trust center</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 style={{
              marginTop: 28, fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: "clamp(44px, 6.5vw, 80px)", color: "white",
              letterSpacing: "-0.03em", lineHeight: 1.02,
            }}>Built like a bank.<br/>
              <span style={{
                background: "linear-gradient(135deg, #00B5A4, #67e8f9)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>Audited like a hospital.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{
              marginTop: 28, fontFamily: "Inter, sans-serif", fontSize: 20,
              color: "rgba(255,255,255,0.7)", lineHeight: 1.6,
              maxWidth: 680, marginInline: "auto",
            }}>
              Your patients trust you with their bodies and their data. ARCA Rx is built to meet
              the highest healthcare security standards - and to keep you out of the OCR's inbox.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Certifications */}
      <section style={{ padding: "80px 40px" }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 42px)", color: "#0F1F3D",
              letterSpacing: "-0.025em", textAlign: "center",
            }}>Independently certified.</h2>
          </Reveal>
          <div className="grid gap-5 mt-12" style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}>
            {CERTS.map((c, i) => (
              <Reveal key={c.name} delay={i * 60}>
                <div style={{
                  background: "white", border: "1px solid #E2E8F0",
                  borderRadius: 16, padding: 28, height: "100%",
                  position: "relative", overflow: "hidden",
                }}>
                  <div aria-hidden style={{
                    position: "absolute", top: -20, right: -20, width: 100, height: 100,
                    background: "radial-gradient(circle, rgba(0,181,164,0.08), transparent 70%)",
                  }} />
                  <ShieldCheck size={32} color="#00B5A4" strokeWidth={1.5} />
                  <h3 style={{
                    marginTop: 20, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 18, color: "#0F1F3D",
                  }}>{c.name}</h3>
                  <p style={{
                    marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 14,
                    color: "#64748B", lineHeight: 1.65,
                  }}>{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ padding: "80px 40px", background: "#F8FAFC" }}>
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 42px)", color: "#0F1F3D",
              letterSpacing: "-0.025em", textAlign: "center",
            }}>How we protect your data.</h2>
          </Reveal>
          <div className="grid gap-6 mt-12" style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          }}>
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div style={{
                  background: "white", border: "1px solid #E2E8F0",
                  borderRadius: 14, padding: 28, height: "100%",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: "linear-gradient(135deg, #ECFEFF, #F0FDFA)",
                    border: "1px solid #A7F3D0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <p.icon size={22} color="#00B5A4" strokeWidth={1.75} />
                  </div>
                  <h3 style={{
                    marginTop: 20, fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 18, color: "#0F1F3D",
                  }}>{p.title}</h3>
                  <p style={{
                    marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: 14,
                    color: "#64748B", lineHeight: 1.7,
                  }}>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section style={{ padding: "80px 40px" }}>
        <div className="mx-auto" style={{ maxWidth: 1080 }}>
          <Reveal>
            <div className="grid gap-px" style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              background: "#E2E8F0", border: "1px solid #E2E8F0",
              borderRadius: 16, overflow: "hidden",
            }}>
              {[
                { v: "0", l: "Breaches since launch" },
                { v: "99.99%", l: "Platform uptime" },
                { v: "0", l: "OCR findings" },
                { v: "< 4h", l: "Incident response" },
              ].map((s) => (
                <div key={s.l} style={{ background: "white", padding: "36px 16px", textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                    fontSize: 44, color: "#0F1F3D", letterSpacing: "-0.02em",
                  }}>{s.v}</div>
                  <div style={{
                    marginTop: 8, fontFamily: "Inter, sans-serif", fontSize: 13,
                    color: "#64748B",
                  }}>{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "100px 40px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 720 }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)", color: "#0F1F3D",
              letterSpacing: "-0.025em",
            }}>Need our SOC 2 report?</h2>
          </Reveal>
          <Reveal delay={80}>
            <p style={{
              marginTop: 16, fontFamily: "Inter, sans-serif", fontSize: 17,
              color: "#64748B", lineHeight: 1.65,
            }}>
              Email <a href="mailto:security@arca.rx" style={{ color: "#00B5A4" }}>security@arca.rx</a>
              {" "}for our latest SOC 2 Type II report, HITRUST certification, and BAA template under NDA.
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
