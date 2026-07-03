import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { Link2, DollarSign, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partner Program - ARCA Rx & ARCA Pro" },
      { name: "description", content: "Earn 15–25% recurring commission for every practice or business you refer to ARCA. Paid monthly, for as long as they stay." },
    ],
  }),
  component: PartnersPage,
});

const FONT_DISPLAY = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "Inter, sans-serif";
const ACCENT = "#00B5A4";
const NAVY = "#0F1F3D";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";

const STEPS = [
  { icon: Link2, title: "Share your link", body: "Get a unique referral link the moment you join. Share it with your network, audience, or clients." },
  { icon: Users, title: "They sign up", body: "When a practice or business starts a paid plan through your link, they're tagged to you for life." },
  { icon: DollarSign, title: "You get paid monthly", body: "Earn recurring commission every month they stay - deposited automatically. No caps, no clawbacks after 90 days." },
];

const TIERS = [
  { name: "Affiliate", rate: "15%", req: "1–4 active referrals", perk: "Recurring monthly payout" },
  { name: "Partner", rate: "20%", req: "5–14 active referrals", perk: "Co-marketing + priority support" },
  { name: "Elite", rate: "25%", req: "15+ active referrals", perk: "Dedicated manager + bonuses" },
];

function PartnersPage() {
  const [refs, setRefs] = useState(15);
  const [avg, setAvg] = useState(249);
  const rate = refs >= 15 ? 0.25 : refs >= 5 ? 0.2 : 0.15;
  const monthly = Math.round(refs * avg * rate);
  const yearly = monthly * 12;

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section style={{ padding: "120px 24px 40px", textAlign: "center" }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <Reveal>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(36px, 5vw, 56px)", color: NAVY, letterSpacing: "-0.025em", lineHeight: 1.1 }}>
              Refer once. Earn every month.
            </h1>
            <p style={{ fontFamily: FONT_BODY, fontSize: 18, color: MUTED, marginTop: 18, lineHeight: 1.7 }}>
              Earn up to 25% recurring commission for every practice or business you send to ARCA Rx and ARCA Pro - for as long as they stay. Paid monthly, automatically.
            </p>
          </Reveal>
          <a href="/admin/dashboard" className="inline-block rounded-lg font-semibold text-white" style={{ marginTop: 28, background: ACCENT, padding: "14px 30px", fontFamily: FONT_BODY, fontSize: 16 }}>
            Become a partner
          </a>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "40px 24px" }}>
        <div className="mx-auto grid gap-5" style={{ maxWidth: 1000, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {STEPS.map((s, i) => (
            <div key={s.title} style={{ background: "#F8FAFB", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 26 }}>
              <div className="flex items-center gap-3">
                <span style={{ display: "inline-flex", width: 40, height: 40, borderRadius: 11, background: "rgba(0,181,164,0.1)", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={19} style={{ color: ACCENT }} />
                </span>
                <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13, color: "#94A3B8" }}>0{i + 1}</span>
              </div>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, color: NAVY, marginTop: 16 }}>{s.title}</h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14.5, color: MUTED, marginTop: 8, lineHeight: 1.6 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Earnings calculator */}
      <section style={{ padding: "56px 24px" }}>
        <div className="mx-auto" style={{ maxWidth: 860, background: NAVY, borderRadius: 20, padding: "40px 32px" }}>
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5" style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: ACCENT }}>
              <TrendingUp size={14} /> Earnings calculator
            </span>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(24px, 3.2vw, 34px)", color: "white", marginTop: 10, letterSpacing: "-0.02em" }}>
              See what you could earn
            </h2>
          </div>

          <div className="grid gap-8" style={{ marginTop: 32, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Active referrals</span>
                  <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: "white" }}>{refs}</span>
                </div>
                <input type="range" min={1} max={40} step={1} value={refs} onChange={(e) => setRefs(Number(e.target.value))} style={{ width: "100%", accentColor: ACCENT }} />
              </div>
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Avg. plan / mo</span>
                  <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: "white" }}>${avg}</span>
                </div>
                <input type="range" min={99} max={499} step={10} value={avg} onChange={(e) => setAvg(Number(e.target.value))} style={{ width: "100%", accentColor: ACCENT }} />
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                Your rate at this volume: <span style={{ color: ACCENT, fontWeight: 700 }}>{Math.round(rate * 100)}%</span>
              </p>
            </div>

            <div className="text-center" style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "28px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Estimated monthly</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 52, color: "white", lineHeight: 1.1 }}>${monthly.toLocaleString()}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: ACCENT, marginTop: 6 }}>${yearly.toLocaleString()} / year recurring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission tiers */}
      <section style={{ padding: "40px 24px 24px" }}>
        <div className="mx-auto" style={{ maxWidth: 1000 }}>
          <h2 className="text-center" style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.5vw, 36px)", color: NAVY, letterSpacing: "-0.02em" }}>
            The more you refer, the higher your rate
          </h2>
          <div className="grid gap-5" style={{ marginTop: 32, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {TIERS.map((t, i) => (
              <div key={t.name} style={{ background: i === 2 ? NAVY : "white", border: i === 2 ? "none" : `1px solid ${BORDER}`, borderRadius: 14, padding: 28, textAlign: "center" }}>
                <div style={{ fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: i === 2 ? ACCENT : MUTED }}>{t.name}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 48, color: i === 2 ? "white" : NAVY, lineHeight: 1.1, marginTop: 8 }}>{t.rate}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: i === 2 ? "rgba(255,255,255,0.7)" : MUTED, marginTop: 6 }}>{t.req}</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: i === 2 ? "white" : "#334155", marginTop: 14, paddingTop: 14, borderTop: `1px solid ${i === 2 ? "rgba(255,255,255,0.15)" : BORDER}` }}>{t.perk}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "72px 24px", textAlign: "center" }}>
        <div className="mx-auto" style={{ maxWidth: 620 }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", color: NAVY, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Turn your network into income.
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: MUTED, marginTop: 16, lineHeight: 1.6 }}>
            Free to join. Approved in 24 hours. Start earning on your first referral.
          </p>
          <a href="/admin/dashboard" className="inline-block rounded-lg font-semibold text-white" style={{ marginTop: 24, background: ACCENT, padding: "15px 32px", fontFamily: FONT_BODY, fontSize: 16 }}>
            Become a partner
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
