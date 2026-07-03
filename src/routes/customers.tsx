import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { Star, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers - ARCA Rx & ARCA Pro" },
      { name: "description", content: "Med spas, HRT clinics, gyms, coaches, and studios grow on ARCA. Read the results." },
    ],
  }),
  component: CustomersPage,
});

const FONT_DISPLAY = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "Inter, sans-serif";
const ACCENT = "#00B5A4";
const NAVY = "#0F1F3D";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";

type Brand = "rx" | "pro";

const STATS: Record<Brand, { value: string; label: string }[]> = {
  rx: [
    { value: "500+", label: "practices on ARCA Rx" },
    { value: "31%", label: "avg revenue lift in year one" },
    { value: "12 hrs", label: "admin saved per week" },
    { value: "94%", label: "would recommend it" },
  ],
  pro: [
    { value: "1,200+", label: "businesses on ARCA Pro" },
    { value: "27%", label: "more rebooks in 90 days" },
    { value: "5.8", label: "tools replaced on average" },
    { value: "96%", label: "would recommend it" },
  ],
};

const CASES: Record<Brand, { name: string; type: string; quote: string; person: string; role: string; metrics: { k: string; v: string }[] }[]> = {
  rx: [
    {
      name: "Meridian Health & Aesthetics",
      type: "Med spa · Austin, TX",
      quote: "ARCA Rx replaced our EMR, our booking tool, our email marketing, and two spreadsheets. We can finally see the whole practice in one place - and our members feel it.",
      person: "Dr. Lena Chen",
      role: "Medical Director",
      metrics: [{ k: "Revenue", v: "+38%" }, { k: "No-shows", v: "−52%" }, { k: "Members", v: "412" }],
    },
    {
      name: "Vitality Men's Clinic",
      type: "HRT clinic · Dallas, TX",
      quote: "Lab trending, subscriptions, and telehealth in one system. Our patients renew because they can see their own progress. That's the whole game.",
      person: "J. Reeves, NP",
      role: "Founder",
      metrics: [{ k: "Retention", v: "96%" }, { k: "LTV", v: "+2.4x" }, { k: "Visits/wk", v: "180" }],
    },
    {
      name: "Restore IV & Wellness",
      type: "IV & wellness · Nashville, TN",
      quote: "We went live in a week and imported five years of client history without losing anything. The migration team did the heavy lifting.",
      person: "S. Whitfield",
      role: "Owner",
      metrics: [{ k: "Go-live", v: "6 days" }, { k: "Rebooks", v: "+29%" }, { k: "Locations", v: "3" }],
    },
  ],
  pro: [
    {
      name: "Forge Strength Co.",
      type: "Personal training · Miami, FL",
      quote: "The outcome reports sell themselves. I send a client their before/after with the numbers and they re-sign on the spot - and post it, which brings me new leads.",
      person: "Coach Diego Romero",
      role: "Owner",
      metrics: [{ k: "Rebooks", v: "+34%" }, { k: "Referrals", v: "+61%" }, { k: "Clients", v: "84" }],
    },
    {
      name: "Halo Studio",
      type: "Boutique fitness · Seattle, WA",
      quote: "Memberships, packages, and the branded client app in one platform. We killed four subscriptions and our members actually use the app now.",
      person: "Priya Shah",
      role: "Founder",
      metrics: [{ k: "MRR", v: "+41%" }, { k: "Churn", v: "−38%" }, { k: "Members", v: "296" }],
    },
    {
      name: "Peak Aesthetics Bar",
      type: "Med spa + coaching · Denver, CO",
      quote: "We run skincare protocols and body-comp coaching side by side. Clients see one place for everything, and I look ten times more professional.",
      person: "D. Hart",
      role: "Owner",
      metrics: [{ k: "Revenue", v: "+44%" }, { k: "5-star", v: "312" }, { k: "Staff", v: "6" }],
    },
  ],
};

const LOGOS: Record<Brand, string[]> = {
  rx: ["Meridian", "Vitality", "Restore", "Apex Wellness", "Northstar HRT", "Clarity Aesthetics"],
  pro: ["Forge", "Halo Studio", "Peak Bar", "Ironline Gym", "Lumen Yoga", "Vega Strength"],
};

function CustomersPage() {
  const [brand, setBrand] = useState<Brand>("rx");
  const stats = STATS[brand];
  const cases = CASES[brand];

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav product={brand} />

      {/* Hero */}
      <section style={{ padding: "120px 24px 32px", textAlign: "center" }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <Reveal>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(36px, 5vw, 56px)", color: NAVY, letterSpacing: "-0.025em", lineHeight: 1.1 }}>
              The results speak first.
            </h1>
            <p style={{ fontFamily: FONT_BODY, fontSize: 18, color: MUTED, marginTop: 18, lineHeight: 1.7 }}>
              Practices and professionals don't switch for features. They switch for outcomes. Here's what happened after they moved to ARCA.
            </p>
          </Reveal>

          <div className="inline-flex items-center" style={{ marginTop: 26, background: "#F1F4F7", border: `1px solid ${BORDER}`, borderRadius: 999, padding: 4 }}>
            {(([["rx", "Clinics · ARCA Rx"], ["pro", "Professionals · ARCA Pro"]]) as [Brand, string][]).map(([b, label]) => (
              <button key={b} onClick={() => setBrand(b)} style={{
                fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 999, border: "none", cursor: "pointer",
                background: brand === b ? "white" : "transparent", color: brand === b ? NAVY : MUTED,
                boxShadow: brand === b ? "0 1px 3px rgba(15,31,61,0.12)" : "none",
              }}>{label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Stat band */}
      <section style={{ padding: "20px 24px 8px" }}>
        <div className="mx-auto grid gap-4" style={{ maxWidth: 960, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {stats.map((s) => (
            <div key={s.label} className="text-center" style={{ background: "#F8FAFB", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "28px 16px" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 40, color: ACCENT, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: MUTED, marginTop: 8, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Logo wall */}
      <section style={{ padding: "40px 24px" }}>
        <p className="text-center" style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED }}>
          Trusted by teams like these
        </p>
        <div className="mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-4" style={{ maxWidth: 900, marginTop: 20 }}>
          {LOGOS[brand].map((l) => (
            <span key={l} style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, color: "#94A3B8", letterSpacing: "-0.01em" }}>{l}</span>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section style={{ padding: "32px 24px 40px" }}>
        <div className="mx-auto grid gap-6" style={{ maxWidth: 1080, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          {cases.map((c) => (
            <div key={c.name} style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column" }}>
              <div className="flex items-center gap-0.5" style={{ marginBottom: 14 }}>
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15.5, color: "#1E293B", lineHeight: 1.65, flex: 1 }}>"{c.quote}"</p>
              <div style={{ marginTop: 18 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 15, color: NAVY }}>{c.person}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: MUTED }}>{c.role} · {c.name}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: ACCENT, marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{c.type}</div>
              </div>
              <div className="grid grid-cols-3 gap-2" style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${BORDER}` }}>
                {c.metrics.map((m) => (
                  <div key={m.k} className="text-center">
                    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, color: NAVY }}>{m.v}</div>
                    <div style={{ fontFamily: FONT_BODY, fontSize: 11, color: MUTED, marginTop: 2 }}>{m.k}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pull quote */}
      <section style={{ padding: "64px 24px", background: "#F8FAFB", textAlign: "center" }}>
        <div className="mx-auto" style={{ maxWidth: 800 }}>
          <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: "clamp(24px, 3.2vw, 34px)", color: NAVY, lineHeight: 1.35, letterSpacing: "-0.02em" }}>
            "ARCA didn't just replace our software. It replaced our consultants, our spreadsheets, and half our stress."
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: MUTED, marginTop: 20 }}>
            {brand === "rx" ? "Practice owner, multi-location med spa group" : "Founder, boutique fitness studio"}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "72px 24px", background: NAVY, textAlign: "center" }}>
        <div className="mx-auto" style={{ maxWidth: 640 }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", color: "white", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Your results, next.
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: "rgba(255,255,255,0.7)", marginTop: 16, lineHeight: 1.6 }}>
            Start free and see the difference in your first 30 days.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3" style={{ marginTop: 28 }}>
            <a href="/admin/dashboard" className="inline-flex items-center gap-1.5 rounded-lg font-semibold text-white" style={{ background: ACCENT, padding: "15px 32px", fontFamily: FONT_BODY, fontSize: 16 }}>Start free trial <ArrowRight size={17} /></a>
            <a href="/demo" className="rounded-lg font-semibold" style={{ background: "rgba(255,255,255,0.1)", color: "white", padding: "15px 32px", fontFamily: FONT_BODY, fontSize: 16, border: "1px solid rgba(255,255,255,0.2)" }}>Book a live demo</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
