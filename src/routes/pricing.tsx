import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { Check, Minus } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing - ARCA Rx & ARCA Pro" },
      { name: "description", content: "Simple, transparent pricing. ARCA Rx for clinics from $149/mo, ARCA Pro for service businesses from $99/mo. 14-day free trial, no credit card." },
    ],
  }),
  component: PricingPage,
});

const FONT_DISPLAY = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "Inter, sans-serif";
const ACCENT = "#00B5A4";
const NAVY = "#0F1F3D";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";

type Brand = "rx" | "pro";

type Tier = {
  badge: string;
  monthly: number;
  desc: string;
  header: string;
  bullets: string[];
  featured?: boolean;
};

const TIERS: Record<Brand, Tier[]> = {
  rx: [
    {
      badge: "Starter",
      monthly: 149,
      desc: "For solo practitioners and new clinics finding their footing.",
      header: "What's included",
      bullets: ["Smart scheduling & online booking", "Clinical EMR & charting", "Patient portal & intake", "Integrated payments", "1 location · 1 provider", "Email support"],
    },
    {
      badge: "Growth",
      monthly: 299,
      desc: "For established practices ready to scale revenue and retention.",
      header: "Everything in Starter, plus",
      bullets: ["Memberships & subscriptions", "Email & SMS marketing automation", "Telehealth & photo reviews", "Inventory & lot tracking", "Up to 3 providers", "Priority support"],
      featured: true,
    },
    {
      badge: "Scale",
      monthly: 499,
      desc: "For multi-location groups and high-volume practices.",
      header: "Everything in Growth, plus",
      bullets: ["Multi-location management", "Insurance billing & RCM", "Population health & care gaps", "HIPAA audit-log exports", "API access", "Dedicated success manager"],
    },
  ],
  pro: [
    {
      badge: "Starter",
      monthly: 99,
      desc: "For solo operators getting their first real system in place.",
      header: "What's included",
      bullets: ["Booking & calendar", "Client management", "Payments & POS", "Branded website + booking widget", "1 staff seat", "Email support"],
    },
    {
      badge: "Growth",
      monthly: 199,
      desc: "For coaches and studios ready to fill the calendar and retain clients.",
      header: "Everything in Starter, plus",
      bullets: ["Coaching programs: Fitness, Health, Protocol", "Client portal + progress reports", "Memberships & packages", "Marketing automation", "Up to 5 staff seats", "Priority support"],
      featured: true,
    },
    {
      badge: "Scale",
      monthly: 349,
      desc: "For multi-location operators and ambitious high-growth brands.",
      header: "Everything in Growth, plus",
      bullets: ["Multi-location management", "Team performance & payroll", "Advanced analytics & attribution", "White-label client app", "API access", "Dedicated success manager"],
    },
  ],
};

const COMPARE: Record<Brand, { section: string; rows: { label: string; tiers: (boolean | string)[] }[] }[]> = {
  rx: [
    {
      section: "Front desk",
      rows: [
        { label: "Online booking & scheduling", tiers: [true, true, true] },
        { label: "Multi-provider calendar", tiers: ["1", "3", "Unlimited"] },
        { label: "Automated reminders", tiers: [true, true, true] },
        { label: "Multi-location", tiers: [false, false, true] },
      ],
    },
    {
      section: "Clinical",
      rows: [
        { label: "EMR & charting", tiers: [true, true, true] },
        { label: "Telehealth visits", tiers: [false, true, true] },
        { label: "Photo reviews & before/after", tiers: [false, true, true] },
        { label: "Population health & care gaps", tiers: [false, false, true] },
      ],
    },
    {
      section: "Growth & billing",
      rows: [
        { label: "Payments & memberships", tiers: [true, true, true] },
        { label: "Marketing automation", tiers: [false, true, true] },
        { label: "Insurance billing / RCM", tiers: [false, false, true] },
        { label: "HIPAA BAA included", tiers: [true, true, true] },
      ],
    },
  ],
  pro: [
    {
      section: "Front of house",
      rows: [
        { label: "Booking & calendar", tiers: [true, true, true] },
        { label: "Staff seats", tiers: ["1", "5", "Unlimited"] },
        { label: "Payments & POS", tiers: [true, true, true] },
        { label: "Multi-location", tiers: [false, false, true] },
      ],
    },
    {
      section: "Coaching",
      rows: [
        { label: "Fitness / Health / Protocol programs", tiers: [false, true, true] },
        { label: "Client portal + progress reports", tiers: [false, true, true] },
        { label: "Body scans & form reviews", tiers: [false, true, true] },
        { label: "White-label client app", tiers: [false, false, true] },
      ],
    },
    {
      section: "Growth",
      rows: [
        { label: "Branded website", tiers: [true, true, true] },
        { label: "Memberships & packages", tiers: [false, true, true] },
        { label: "Marketing automation", tiers: [false, true, true] },
        { label: "Advanced analytics", tiers: [false, false, true] },
      ],
    },
  ],
};

const FAQ = [
  { q: "Is there really a free trial?", a: "Yes. Every plan includes a 14-day free trial with no credit card required. You get the full product, not a stripped-down demo." },
  { q: "Can I switch plans later?", a: "Anytime, in one click. Upgrade or downgrade and we prorate the difference automatically. No calls, no contracts to renegotiate." },
  { q: "Do you help me migrate off my old tools?", a: "White-glove migration is included on Growth and Scale. We import your clients, appointments, and history so you go live without losing data." },
  { q: "Is my data HIPAA compliant?", a: "ARCA Rx ships with a signed HIPAA BAA on every plan, SOC 2 Type II, and end-to-end encryption. ARCA Pro uses the same encrypted infrastructure to keep client data safe." },
  { q: "What does annual billing save me?", a: "Annual billing saves 20% versus monthly on both ARCA Rx and ARCA Pro. You can start monthly and switch to annual whenever you like." },
  { q: "Do I need a contract?", a: "No long-term contract. Month-to-month by default. Cancel anytime and export your data on the way out." },
];

function PricingPage() {
  const [brand, setBrand] = useState<Brand>("rx");
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tiers = TIERS[brand];
  const compare = COMPARE[brand];
  const price = (m: number) => (annual ? Math.round(m * 0.8) : m);

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav product={brand} />

      {/* Hero */}
      <section style={{ padding: "120px 24px 40px", textAlign: "center" }}>
        <div className="mx-auto" style={{ maxWidth: 760 }}>
          <Reveal>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(36px, 5vw, 56px)", color: NAVY, letterSpacing: "-0.025em", lineHeight: 1.1 }}>
              Simple, transparent pricing.
            </h1>
            <p style={{ fontFamily: FONT_BODY, fontSize: 18, color: MUTED, marginTop: 18, lineHeight: 1.7 }}>
              One platform replaces the five to seven tools you pay for today. 14-day free trial, no credit card, cancel anytime.
            </p>
          </Reveal>

          {/* Brand toggle */}
          <div className="inline-flex items-center" style={{ marginTop: 28, background: "#F1F4F7", border: `1px solid ${BORDER}`, borderRadius: 999, padding: 4 }}>
            {(([["rx", "For Clinics · ARCA Rx"], ["pro", "For Professionals · ARCA Pro"]]) as [Brand, string][]).map(([b, label]) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                style={{
                  fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, padding: "9px 18px", borderRadius: 999, border: "none", cursor: "pointer",
                  background: brand === b ? "white" : "transparent",
                  color: brand === b ? NAVY : MUTED,
                  boxShadow: brand === b ? "0 1px 3px rgba(15,31,61,0.12)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-3" style={{ marginTop: 20 }}>
            <button onClick={() => setAnnual(false)} style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: !annual ? NAVY : MUTED, background: "none", border: "none", cursor: "pointer" }}>Monthly</button>
            <button
              onClick={() => setAnnual((v) => !v)}
              aria-label="Toggle annual billing"
              style={{ width: 44, height: 24, borderRadius: 999, background: annual ? ACCENT : "#CBD5E1", border: "none", cursor: "pointer", position: "relative", transition: "background 180ms" }}
            >
              <span style={{ position: "absolute", top: 2, left: annual ? 22 : 2, width: 20, height: 20, borderRadius: 999, background: "white", transition: "left 180ms" }} />
            </button>
            <span style={{ fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, color: annual ? NAVY : MUTED }}>
              Annual <span style={{ color: ACCENT }}>· save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Tier cards */}
      <section style={{ padding: "20px 24px 40px" }}>
        <div className="mx-auto grid gap-5" style={{ maxWidth: 1080, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {tiers.map((t) => (
            <div
              key={t.badge}
              className="relative"
              style={{
                background: t.featured ? "white" : "#F8FAFB",
                border: t.featured ? `2px solid ${ACCENT}` : `1px solid ${BORDER}`,
                borderRadius: 14,
                padding: 32,
                boxShadow: t.featured ? "0 8px 40px rgba(0,181,164,0.15)" : "none",
              }}
            >
              {t.featured && (
                <span className="absolute left-1/2 -translate-x-1/2 rounded-full font-semibold text-white" style={{ top: -13, background: ACCENT, padding: "4px 16px", fontSize: 12, fontFamily: FONT_BODY }}>
                  Most Popular
                </span>
              )}
              <div className="font-semibold uppercase" style={{ fontSize: 12, letterSpacing: "0.08em", color: ACCENT, fontFamily: FONT_BODY }}>{t.badge}</div>
              <div className="flex items-start gap-1" style={{ marginTop: 14 }}>
                <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24, color: NAVY, marginTop: 8 }}>$</span>
                <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 52, color: NAVY, lineHeight: 1 }}>{price(t.monthly)}</span>
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: MUTED, marginTop: 26 }}>/mo</span>
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: MUTED, marginTop: 10, lineHeight: 1.6, minHeight: 44 }}>{t.desc}</p>
              <a href="/admin/dashboard" className="block text-center rounded-lg font-semibold" style={{
                marginTop: 18, padding: "13px 20px", fontFamily: FONT_BODY, fontSize: 15,
                background: t.featured ? ACCENT : "white",
                color: t.featured ? "white" : NAVY,
                border: t.featured ? "none" : `1px solid ${BORDER}`,
              }}>
                Start free trial
              </a>
              <p className="font-semibold uppercase" style={{ fontSize: 11, letterSpacing: "0.06em", color: NAVY, fontFamily: FONT_BODY, marginTop: 26 }}>{t.header}</p>
              <ul style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5" style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#334155", lineHeight: 1.5 }}>
                    <Check size={16} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-center" style={{ fontFamily: FONT_BODY, fontSize: 13, color: MUTED, marginTop: 24 }}>
          Managing a group of locations or a DSO? <a href="/demo" style={{ color: ACCENT, fontWeight: 600 }}>Talk to our team →</a>
        </p>
      </section>

      {/* Comparison table */}
      <section style={{ padding: "56px 24px", background: "#F8FAFB" }}>
        <div className="mx-auto" style={{ maxWidth: 900 }}>
          <h2 className="text-center" style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.5vw, 36px)", color: NAVY, letterSpacing: "-0.02em" }}>
            Compare every plan
          </h2>
          <div style={{ marginTop: 32, background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", padding: "16px 20px", background: NAVY }}>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Feature</span>
              {tiers.map((t) => (
                <span key={t.badge} className="text-center" style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700, color: "white" }}>{t.badge}</span>
              ))}
            </div>
            {compare.map((group) => (
              <div key={group.section}>
                <div style={{ padding: "12px 20px", background: "#F1F4F7", fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: MUTED }}>
                  {group.section}
                </div>
                {group.rows.map((row) => (
                  <div key={row.label} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", padding: "13px 20px", borderTop: `1px solid ${BORDER}`, alignItems: "center" }}>
                    <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#334155" }}>{row.label}</span>
                    {row.tiers.map((val, i) => (
                      <span key={i} className="text-center" style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: NAVY, fontWeight: 600 }}>
                        {val === true ? <Check size={17} style={{ color: ACCENT, display: "inline" }} /> : val === false ? <Minus size={16} style={{ color: "#CBD5E1", display: "inline" }} /> : val}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "72px 24px" }}>
        <div className="mx-auto" style={{ maxWidth: 720 }}>
          <h2 className="text-center" style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.5vw, 36px)", color: NAVY, letterSpacing: "-0.02em" }}>
            Questions, answered
          </h2>
          <div style={{ marginTop: 32 }}>
            {FAQ.map((item, i) => (
              <div key={item.q} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between text-left"
                  style={{ padding: "20px 0", background: "none", border: "none", cursor: "pointer" }}
                >
                  <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 17, color: NAVY }}>{item.q}</span>
                  <span style={{ fontFamily: FONT_BODY, fontSize: 22, color: ACCENT, lineHeight: 1 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: MUTED, lineHeight: 1.7, paddingBottom: 20, marginTop: -4 }}>{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "72px 24px", background: NAVY, textAlign: "center" }}>
        <div className="mx-auto" style={{ maxWidth: 640 }}>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4vw, 42px)", color: "white", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Start free. Go live this week.
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: "rgba(255,255,255,0.7)", marginTop: 16, lineHeight: 1.6 }}>
            14 days free on every plan. No credit card. Your data imported for you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3" style={{ marginTop: 28 }}>
            <a href="/admin/dashboard" className="rounded-lg font-semibold text-white" style={{ background: ACCENT, padding: "15px 32px", fontFamily: FONT_BODY, fontSize: 16 }}>Start free trial</a>
            <a href="/demo" className="rounded-lg font-semibold" style={{ background: "rgba(255,255,255,0.1)", color: "white", padding: "15px 32px", fontFamily: FONT_BODY, fontSize: 16, border: "1px solid rgba(255,255,255,0.2)" }}>Book a live demo</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
