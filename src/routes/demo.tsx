import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { Play, ArrowRight, LayoutDashboard, Calendar, Stethoscope, Dumbbell, Camera, LineChart } from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "See a Demo - ARCA Rx & ARCA Pro" },
      { name: "description", content: "Take a self-guided tour of the live product, or book a 30-minute demo with a specialist who knows your specialty." },
    ],
  }),
  component: DemoPage,
});

const FONT_DISPLAY = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "Inter, sans-serif";
const ACCENT = "#00B5A4";
const NAVY = "#0F1F3D";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";

const TOURS = [
  { icon: LayoutDashboard, title: "Command center", body: "The whole practice in one view - revenue, schedule, alerts, and what needs attention today.", to: "/admin/dashboard" },
  { icon: Calendar, title: "Booking & calendar", body: "Multi-provider scheduling with reminders, day and week views, and one-click booking.", to: "/admin/calendar" },
  { icon: Stethoscope, title: "Clinical charts & AI scribe", body: "EMR built for aesthetics and HRT, with an ambient scribe that drafts the note for you.", to: "/admin/scribe" },
  { icon: Camera, title: "Photo reviews", body: "Before/after management, consent tracking, and approvals in a clean review queue.", to: "/admin/photo-reviews" },
  { icon: Dumbbell, title: "Coaching programs", body: "Assign Fitness, Health, and Protocol programs per client and control what they see.", to: "/admin/fit/clients" },
  { icon: LineChart, title: "Outcome reports", body: "A shareable report that pairs before/after photos with the clinical markers that moved.", to: "/results/c14" },
];

function DemoPage() {
  const [sent, setSent] = useState(false);

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: "120px 24px 40px", textAlign: "center" }}>
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <Reveal>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(36px, 5vw, 56px)", color: NAVY, letterSpacing: "-0.025em", lineHeight: 1.1 }}>
              See it working. Right now.
            </h1>
            <p style={{ fontFamily: FONT_BODY, fontSize: 18, color: MUTED, marginTop: 18, lineHeight: 1.7 }}>
              No sales gate to look around. Take the self-guided tour of the live product below, or book 30 minutes with a specialist who knows your specialty.
            </p>
          </Reveal>

          {/* Video / product frame */}
          <div style={{ marginTop: 36, borderRadius: 18, overflow: "hidden", border: `1px solid ${BORDER}`, boxShadow: "0 24px 70px rgba(15,31,61,0.18)" }}>
            <div style={{ background: "#0B1220", padding: "10px 14px", display: "flex", gap: 7, alignItems: "center" }}>
              <span style={{ width: 11, height: 11, borderRadius: 999, background: "#ff5f57" }} />
              <span style={{ width: 11, height: 11, borderRadius: 999, background: "#febc2e" }} />
              <span style={{ width: 11, height: 11, borderRadius: 999, background: "#28c840" }} />
              <span style={{ marginLeft: 10, fontFamily: FONT_BODY, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>arcarx.com/admin/dashboard</span>
            </div>
            <a href="/admin/dashboard" style={{ display: "block", position: "relative", background: "linear-gradient(135deg,#0F1F3D 0%,#123 60%,#00B5A4 160%)", aspectRatio: "16/9" }}>
              <span style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <span style={{ width: 74, height: 74, borderRadius: 999, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.3)" }}>
                  <Play size={28} style={{ color: "white", fill: "white", marginLeft: 4 }} />
                </span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: "white", fontWeight: 600 }}>Open the live dashboard</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Self-guided tour cards */}
      <section style={{ padding: "40px 24px 24px" }}>
        <div className="mx-auto" style={{ maxWidth: 1080 }}>
          <h2 className="text-center" style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.5vw, 36px)", color: NAVY, letterSpacing: "-0.02em" }}>
            Take the self-guided tour
          </h2>
          <p className="text-center" style={{ fontFamily: FONT_BODY, fontSize: 16, color: MUTED, marginTop: 12 }}>
            Every tile opens the real feature in the live app. Poke around - it's demo data.
          </p>
          <div className="grid gap-4" style={{ marginTop: 32, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {TOURS.map((t) => (
              <a key={t.title} href={t.to} style={{ display: "block", background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, transition: "border-color 160ms, transform 160ms" }}>
                <span style={{ display: "inline-flex", width: 42, height: 42, borderRadius: 11, background: "rgba(0,181,164,0.1)", alignItems: "center", justifyContent: "center" }}>
                  <t.icon size={20} style={{ color: ACCENT }} />
                </span>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, color: NAVY, marginTop: 16 }}>{t.title}</h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: MUTED, marginTop: 8, lineHeight: 1.6 }}>{t.body}</p>
                <span className="inline-flex items-center gap-1" style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: ACCENT, fontWeight: 600, marginTop: 14 }}>
                  Open it <ArrowRight size={14} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Book a live demo */}
      <section style={{ padding: "64px 24px", background: "#F8FAFB" }}>
        <div className="mx-auto grid gap-10" style={{ maxWidth: 980, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.5vw, 38px)", color: NAVY, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Prefer a guided walkthrough?
            </h2>
            <p style={{ fontFamily: FONT_BODY, fontSize: 16.5, color: MUTED, marginTop: 16, lineHeight: 1.7 }}>
              Book 30 minutes with a specialist who works with practices and professionals like yours. We'll map ARCA to your exact workflow and answer migration questions.
            </p>
            <ul style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {["Tailored to your specialty", "Migration & pricing walkthrough", "No pressure, no obligation"].map((b) => (
                <li key={b} className="flex items-center gap-2.5" style={{ fontFamily: FONT_BODY, fontSize: 15, color: "#334155" }}>
                  <span style={{ width: 20, height: 20, borderRadius: 999, background: ACCENT, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28 }}>
            {sent ? (
              <div className="text-center" style={{ padding: "28px 8px" }}>
                <div style={{ width: 56, height: 56, borderRadius: 999, background: "rgba(0,181,164,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: ACCENT, fontSize: 26 }}>✓</div>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, color: NAVY, marginTop: 14 }}>Request received</h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: MUTED, marginTop: 8, lineHeight: 1.6 }}>A specialist will reach out within one business day to schedule your demo.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, color: NAVY }}>Book your demo</p>
                {[["Full name", "text", "Jordan Lee"], ["Work email", "email", "you@practice.com"], ["Business name", "text", "Your practice or studio"]].map(([label, type, ph]) => (
                  <label key={label} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: NAVY }}>{label}</span>
                    <input required type={type} placeholder={ph} style={{ fontFamily: FONT_BODY, fontSize: 14, padding: "11px 13px", borderRadius: 9, border: `1px solid ${BORDER}`, outline: "none" }} />
                  </label>
                ))}
                <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: NAVY }}>What do you run?</span>
                  <select style={{ fontFamily: FONT_BODY, fontSize: 14, padding: "11px 13px", borderRadius: 9, border: `1px solid ${BORDER}`, outline: "none", background: "white" }}>
                    <option>Med spa / aesthetics</option>
                    <option>HRT / men's health clinic</option>
                    <option>Weight-loss / GLP-1 clinic</option>
                    <option>Gym / personal training</option>
                    <option>Boutique fitness / studio</option>
                    <option>Coaching business</option>
                  </select>
                </label>
                <button type="submit" className="rounded-lg font-semibold text-white" style={{ background: ACCENT, padding: "13px 20px", fontFamily: FONT_BODY, fontSize: 15, border: "none", cursor: "pointer", marginTop: 4 }}>
                  Request my demo
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
