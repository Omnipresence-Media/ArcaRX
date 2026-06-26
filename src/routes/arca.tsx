import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { FloatingCTA } from "@/components/marketing/FloatingCTA";
import {
  ArrowRight,
  Play,
  Check,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Calendar,
  CreditCard,
  BarChart2,
  Users,
  Globe,
  MessageCircle,
  Scissors,
  Dumbbell,
  Sparkles,
  Heart,
  Flower2,
  Star,
  CheckCircle2,
  XCircle,
  CircleDot,
  Shield,
  ShieldCheck,
  Lock,
  Repeat,
  Smartphone,
  Gift,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/arca")({
  head: () => ({
    meta: [
      { title: "ARCA Pro - The Operating System for Premium Service Businesses" },
      {
        name: "description",
        content:
          "ARCA Pro replaces Vagaro, Mindbody, Square Appointments, and Boulevard for salons, barbershops, gyms, personal trainers, spas, and wellness studios. Starting at $99/month.",
      },
      { property: "og:title", content: "ARCA Pro - The Operating System for Premium Service Businesses" },
      {
        property: "og:description",
        content:
          "Booking, payments, CRM, marketing, and a branded website - one beautifully designed platform for the businesses that shape how people feel.",
      },
      { property: "og:url", content: "https://arca-rx.lovable.app/arca" },
    ],
    links: [{ rel: "canonical", href: "https://arca-rx.lovable.app/arca" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "ARCA Pro",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "99", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: ArcaProPage,
});

const FONT_DISPLAY = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "Inter, sans-serif";
const ACCENT = "#00B5A4";
const ACCENT_2 = "#F59E0B";
const INK = "#0F1F3D";

function Label({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div
      className="font-medium uppercase"
      style={{
        fontSize: 12,
        letterSpacing: "0.08em",
        color: light ? "rgba(255,255,255,0.6)" : ACCENT_2,
        fontFamily: FONT_BODY,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100vh", background: "white" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 800px 600px at 100% 0%, rgba(245,158,11,0.08) 0%, transparent 70%), radial-gradient(ellipse 700px 500px at 0% 100%, rgba(0,181,164,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto text-center" style={{ maxWidth: 1080, padding: "120px 40px 80px" }}>
        <span
          className="inline-flex items-center gap-2"
          style={{
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 24,
            padding: "6px 16px 6px 8px",
          }}
        >
          <span
            className="font-semibold text-white"
            style={{
              background: ACCENT_2,
              borderRadius: 12,
              padding: "2px 8px",
              fontSize: 11,
              fontFamily: FONT_BODY,
            }}
          >
            NEW
          </span>
          <span style={{ fontSize: 13, color: "#92400E", fontFamily: FONT_BODY, fontWeight: 500 }}>
            ARCA Pro is now in early access
          </span>
          <ChevronRight size={14} color="#92400E" />
        </span>

        <h1
          className="mx-auto"
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(40px, 5.5vw, 72px)",
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            color: INK,
            marginTop: 32,
            maxWidth: 880,
          }}
        >
          The Operating System
          <br />
          for Premium
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_2})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Service Businesses.
          </span>
        </h1>

        <p
          className="mx-auto"
          style={{
            fontFamily: FONT_BODY,
            fontSize: "clamp(17px, 2vw, 20px)",
            lineHeight: 1.75,
            color: "#64748B",
            maxWidth: 620,
            marginTop: 24,
          }}
        >
          ARCA Pro replaces Vagaro, Mindbody, Square Appointments, and Boulevard for salons,
          barbershops, gyms, personal trainers, spas, and wellness studios. One beautifully
          designed platform. Built to grow your business.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-3" style={{ marginTop: 40 }}>
          <a
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-white font-semibold transition-all"
            style={{
              background: INK,
              padding: "14px 28px",
              borderRadius: 8,
              fontSize: 16,
              fontFamily: FONT_BODY,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1a3260";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,31,61,0.3)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = INK;
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Start Free Trial <ArrowRight size={18} />
          </a>
          <a
            href="/demo"
            className="inline-flex items-center gap-2 font-medium transition-colors"
            style={{
              background: "transparent",
              border: "1.5px solid #E2E8F0",
              color: INK,
              padding: "12.5px 28px",
              borderRadius: 8,
              fontSize: 16,
              fontFamily: FONT_BODY,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#CBD5E1";
              e.currentTarget.style.background = "#F8FAFB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E2E8F0";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Play size={14} fill={INK} /> Watch Demo
          </a>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6" style={{ marginTop: 20 }}>
          {["No credit card required", "14-day free trial", "Free migration", "Cancel anytime"].map((t, i) => (
            <span key={t} className="flex items-center gap-1.5">
              <Check size={14} color="#10B981" />
              <span style={{ fontSize: 13, color: "#94A3B8", fontFamily: FONT_BODY }}>{t}</span>
              {i < 3 && (
                <span
                  className="hidden sm:inline-block"
                  style={{ width: 4, height: 4, borderRadius: 999, background: "#E2E8F0", marginLeft: 12 }}
                />
              )}
            </span>
          ))}
        </div>

        <ProMock />
      </div>
    </section>
  );
}

function ProMock() {
  return (
    <div
      className="mx-auto text-left"
      style={{
        marginTop: 64,
        maxWidth: 1080,
        background: "white",
        border: "1px solid #E2E8F0",
        borderRadius: 16,
        boxShadow: "0 30px 80px -20px rgba(15,31,61,0.18), 0 8px 24px rgba(15,31,61,0.06)",
        overflow: "hidden",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: "#F1F4F7", background: "#F8FAFB" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FF5F57" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FEBC2E" }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: "#28C840" }} />
        </div>
        <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: FONT_BODY }}>arca.app / today</span>
        <span style={{ width: 40 }} />
      </div>
      <div className="grid md:grid-cols-3">
        <div className="p-6 border-r" style={{ borderColor: "#F1F4F7" }}>
          <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY, letterSpacing: "0.08em" }}>TODAY</span>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 700, color: INK, marginTop: 4 }}>$4,280</div>
          <div style={{ fontSize: 12, color: "#10B981", fontFamily: FONT_BODY, fontWeight: 600 }}>▲ 18% vs yesterday</div>
          <div className="mt-6 space-y-3">
            {[
              ["Appointments", "32"],
              ["New clients", "7"],
              ["Rebook rate", "84%"],
              ["Avg ticket", "$134"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span style={{ fontSize: 13, color: "#64748B", fontFamily: FONT_BODY }}>{l}</span>
                <span style={{ fontSize: 13, color: INK, fontFamily: FONT_BODY, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontSize: 13, color: INK, fontFamily: FONT_BODY, fontWeight: 600 }}>Today's schedule</span>
            <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY }}>3 providers</span>
          </div>
          <div className="space-y-2">
            {[
              ["9:00", "Maya R.", "Balayage + Cut", ACCENT, "Sasha"],
              ["10:30", "Jordan K.", "Personal Training - 60min", ACCENT_2, "Devon"],
              ["12:00", "Alex T.", "Deep Tissue Massage", "#8B5CF6", "Priya"],
              ["1:30", "Riley M.", "Brow Lamination", "#EC4899", "Sasha"],
              ["3:00", "Sam P.", "Yoga Private - 45min", ACCENT, "Devon"],
            ].map(([time, client, service, color, provider]) => (
              <div
                key={String(time) + String(client)}
                className="flex items-center gap-3 rounded-lg p-3"
                style={{ background: "#F8FAFB", border: "1px solid #F1F4F7" }}
              >
                <span style={{ width: 3, height: 32, borderRadius: 4, background: color as string }} />
                <span style={{ fontSize: 12, color: "#64748B", fontFamily: "'JetBrains Mono', monospace", width: 48 }}>
                  {time}
                </span>
                <div className="flex-1">
                  <div style={{ fontSize: 13, color: INK, fontFamily: FONT_BODY, fontWeight: 600 }}>{client}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY }}>{service}</div>
                </div>
                <span style={{ fontSize: 11, color: "#64748B", fontFamily: FONT_BODY }}>{provider}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SOCIAL PROOF ---------------- */
function SocialProof() {
  return (
    <section
      style={{
        background: "#F8FAFB",
        borderTop: "1px solid #E2E8F0",
        borderBottom: "1px solid #E2E8F0",
        padding: "20px 40px",
      }}
    >
      <div className="mx-auto flex flex-wrap items-center justify-between gap-6" style={{ maxWidth: 1280 }}>
        <div className="flex flex-wrap items-center gap-3">
          <span style={{ fontSize: 13, color: "#94A3B8", fontFamily: FONT_BODY }}>
            The platform 1,200+ premium service businesses chose:
          </span>
          <div className="flex items-center gap-3">
            {["Vagaro", "Mindbody", "Boulevard", "Square Appts", "Booksy"].map((n) => (
              <span
                key={n}
                style={{
                  fontSize: 13,
                  color: "#94A3B8",
                  opacity: 0.6,
                  textDecoration: "line-through",
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                }}
              >
                {n}
              </span>
            ))}
            <ArrowRight size={14} color={ACCENT_2} />
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: ACCENT_2 }}>ARCA Pro</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {[
            ["1,200+", "Businesses"],
            ["$340M+", "Processed"],
            ["4.9/5", "Avg rating"],
          ].map(([v, l], i) => (
            <div key={l} className="flex items-center gap-5">
              <div className="flex flex-col">
                <span style={{ fontSize: 15, fontWeight: 600, color: INK, fontFamily: FONT_BODY }}>{v}</span>
                <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: FONT_BODY }}>{l}</span>
              </div>
              {i < 2 && <span style={{ width: 1, height: 20, background: "#E2E8F0" }} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PROBLEM ---------------- */
function Problem() {
  return (
    <section style={{ background: "white", padding: "120px 40px" }}>
      <div className="mx-auto grid md:grid-cols-2 gap-12 items-start" style={{ maxWidth: 1080 }}>
        <div>
          <Label>THE PROBLEM</Label>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(32px, 4vw, 48px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: INK,
              marginTop: 12,
            }}
          >
            Your booking software was designed in 2009. It shows.
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: "#64748B", lineHeight: 1.8, marginTop: 20 }}>
            Most service businesses are stuck duct-taping Vagaro to Square to Mailchimp to a Google
            Doc. Each tool does one thing okay. None of them know your client. None of them know
            your numbers. None of them feel like they belong to a premium brand.
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: "#64748B", lineHeight: 1.8, marginTop: 16 }}>
            The cost is invisible until you total it: 12 hours a week on admin, a 28% no-show rate
            because reminders don't get replies, a rebook rate that's 30 points below what it could
            be, and zero idea which marketing actually pays back.
          </p>
          <div
            className="flex items-start gap-3"
            style={{
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: 8,
              padding: "20px 24px",
              marginTop: 32,
            }}
          >
            <AlertTriangle size={18} color={ACCENT_2} className="mt-0.5 flex-shrink-0" />
            <span style={{ fontSize: 14, color: "#92400E", fontFamily: FONT_BODY, fontWeight: 500 }}>
              The average premium service business pays for 5.8 software tools at $680/mo combined -
              and switches them every 18 months.
            </span>
          </div>
        </div>

        <div
          className="relative rounded-2xl p-8"
          style={{ background: "#F8FAFB", border: "1px solid #E2E8F0", minHeight: 420 }}
        >
          <div className="grid grid-cols-3 gap-3">
            {["Vagaro", "Square", "Mailchimp", "Google Sheets", "Instagram", "Stripe", "Canva"].map((n) => (
              <div
                key={n}
                className="rounded-lg p-3 text-center relative"
                style={{
                  background: "white",
                  border: "1px solid #E2E8F0",
                  fontSize: 12,
                  color: "#64748B",
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                }}
              >
                {n}
                <span
                  className="absolute -top-1.5 -right-1.5"
                  style={{ color: "#EF4444", fontSize: 14, fontWeight: 700 }}
                >
                  ✕
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg p-4" style={{ background: "white", border: "1px solid #E2E8F0" }}>
            {[
              ["Average monthly cost", "$680/mo", "#EF4444"],
              ["Average no-show rate", "28%", "#F59E0B"],
              ["Marketing attribution", "Guesswork", "#EF4444"],
            ].map(([l, v, c]) => (
              <div key={l} className="flex justify-between py-2" style={{ borderBottom: "1px solid #F1F4F7" }}>
                <span style={{ fontSize: 13, color: "#64748B", fontFamily: FONT_BODY }}>{l}</span>
                <span style={{ fontSize: 13, color: c, fontFamily: FONT_BODY, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SOLUTION ---------------- */
const features = [
  { Icon: Calendar, title: "Smart Scheduling", body: "Real-time availability across staff and rooms. Online booking with deposits. Automated reminders that cut no-shows under 5%. Waitlists. Walk-ins." },
  { Icon: CreditCard, title: "Point of Sale", body: "Split payments, tipping, gift cards, packages, retail inventory, and Stripe Terminal for in-person. Settlements next business day." },
  { Icon: Users, title: "Client CRM", body: "Every history, every note, every preference. Birthday automations. Win-back flows. Lifetime value at a glance for every client in the door." },
  { Icon: MessageCircle, title: "2-Way Messaging", body: "SMS and email from one inbox. Templates, automations, and confirmation flows that actually get replies. Branded sender name." },
  { Icon: BarChart2, title: "Growth Analytics", body: "Channel attribution from ad spend to closed ticket. Retention cohorts. Provider performance. AI weekly insights delivered Monday morning." },
  { Icon: Globe, title: "Branded Website", body: "A beautifully designed site connected to your ARCA Pro data. Booking widget embedded. Goes live in under an hour, no developer required." },
];

function Solution() {
  return (
    <section className="relative overflow-hidden" style={{ background: INK, padding: "120px 40px" }}>
      <svg
        className="absolute top-0 right-0 pointer-events-none"
        width="600"
        height="500"
        viewBox="0 0 26 22"
        style={{ opacity: 0.04 }}
      >
        <path d="M2 19 C 4 6, 14 2, 24 7" stroke={ACCENT_2} strokeWidth="0.5" fill="none" strokeLinecap="round" />
      </svg>
      <div className="relative mx-auto" style={{ maxWidth: 1080 }}>
        <Label light>THE SOLUTION</Label>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(32px, 4vw, 52px)",
            lineHeight: 1.1,
            color: "white",
            marginTop: 12,
            letterSpacing: "-0.02em",
          }}
        >
          One platform. Every part of your business.
        </h2>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 18,
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.7,
            marginTop: 16,
            maxWidth: 560,
          }}
        >
          ARCA Pro replaces every tool with one connected system, built specifically for the
          businesses that shape how people look, move, and feel.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 56 }}>
          {features.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: 28,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="inline-flex items-center justify-center"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "rgba(245,158,11,0.12)",
                  color: ACCENT_2,
                  marginBottom: 18,
                }}
              >
                <Icon size={20} />
              </div>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: "white" }}>{title}</h3>
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.6,
                  marginTop: 8,
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- DEEP DIVES ---------------- */
function MockFrame({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: 12,
        border: "1px solid #E2E8F0",
        background: "white",
        boxShadow: "0 12px 40px rgba(15,31,61,0.10)",
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{ background: "#F8FAFB", borderBottom: "1px solid #E2E8F0" }}
      >
        <span className="block rounded-full" style={{ width: 8, height: 8, background: "#FF5F57" }} />
        <span className="block rounded-full" style={{ width: 8, height: 8, background: "#FEBC2E" }} />
        <span className="block rounded-full" style={{ width: 8, height: 8, background: "#28C840" }} />
        <span className="ml-2" style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function DeepDive({
  bg,
  label,
  heading,
  body,
  bullets,
  quote,
  visual,
  flip = false,
}: {
  bg: string;
  label: string;
  heading: string;
  body: string;
  bullets: string[];
  quote?: { text: string; who: string };
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <section style={{ background: bg, padding: "100px 40px" }}>
      <div className="mx-auto grid md:grid-cols-2 gap-12 items-center" style={{ maxWidth: 1080 }}>
        <div className={flip ? "md:order-2" : ""}>
          <Label>{label}</Label>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              lineHeight: 1.1,
              color: INK,
              marginTop: 12,
              letterSpacing: "-0.02em",
            }}
          >
            {heading}
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: "#64748B", lineHeight: 1.8, marginTop: 16 }}>
            {body}
          </p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckCircle2 size={18} color={ACCENT_2} className="mt-0.5 flex-shrink-0" />
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: INK }}>{b}</span>
              </li>
            ))}
          </ul>
          {quote && (
            <div
              className="mt-8"
              style={{
                background: "#FFFBEB",
                borderLeft: `3px solid ${ACCENT_2}`,
                borderRadius: "0 8px 8px 0",
                padding: "16px 20px",
              }}
            >
              <p style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 15, color: INK, fontStyle: "italic" }}>
                "{quote.text}"
              </p>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: "#64748B", marginTop: 6 }}>{quote.who}</div>
            </div>
          )}
        </div>
        <div className={flip ? "md:order-1" : ""}>{visual}</div>
      </div>
    </section>
  );
}

function BookingMock() {
  return (
    <MockFrame title="arca.app/admin/calendar">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div style={{ fontSize: 14, fontWeight: 600, color: INK, fontFamily: FONT_BODY }}>Thursday · Mar 14</div>
          <span
            className="rounded px-2 py-0.5"
            style={{ background: "#FFFBEB", color: "#92400E", fontSize: 11, fontFamily: FONT_BODY, fontWeight: 500 }}
          >
            82% booked
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["Sasha", "Devon", "Priya"].map((p, col) => (
            <div key={p}>
              <div
                className="text-center py-1.5 rounded-t"
                style={{ background: "#F8FAFB", fontSize: 11, color: "#64748B", fontFamily: FONT_BODY, fontWeight: 600 }}
              >
                {p}
              </div>
              <div className="space-y-1 mt-1">
                {[
                  ["9:00", "Color", ACCENT, 60],
                  ["10:30", "Cut", ACCENT_2, 40],
                  ["1:00", "Massage", "#8B5CF6", 70],
                ].map(([t, s, c, h], i) => (
                  <div
                    key={`${p}-${i}`}
                    className="rounded px-2 py-1"
                    style={{
                      background: `${(c as string)}15`,
                      borderLeft: `2px solid ${c as string}`,
                      height: h as number,
                      display: col === i % 3 ? "block" : "block",
                    }}
                  >
                    <div style={{ fontSize: 10, color: INK, fontFamily: "'JetBrains Mono', monospace" }}>{t as string}</div>
                    <div style={{ fontSize: 11, color: INK, fontFamily: FONT_BODY, fontWeight: 500 }}>{s as string}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-3 rounded-md px-3 py-2 flex items-center justify-between"
          style={{ background: INK, color: "white" }}
        >
          <span style={{ fontSize: 12, fontFamily: FONT_BODY }}>Today's projected revenue</span>
          <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: ACCENT_2 }}>
            $4,840
          </span>
        </div>
      </div>
    </MockFrame>
  );
}

function CrmMock() {
  return (
    <MockFrame title="arca.app/admin/clients">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="inline-flex items-center justify-center text-white font-bold rounded-full"
            style={{ width: 44, height: 44, background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_2})`, fontFamily: FONT_DISPLAY }}
          >
            MR
          </span>
          <div>
            <div style={{ fontSize: 14, color: INK, fontFamily: FONT_BODY, fontWeight: 600 }}>Maya Rodriguez</div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY }}>VIP · Member since 2022</div>
          </div>
          <span
            className="ml-auto rounded px-2 py-0.5"
            style={{ background: "#FFFBEB", color: "#92400E", fontSize: 11, fontFamily: FONT_BODY, fontWeight: 600 }}
          >
            LTV $4,820
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            ["Visits", "42"],
            ["Rebook", "96%"],
            ["Avg ticket", "$148"],
          ].map(([l, v]) => (
            <div key={l} className="rounded-md p-2.5" style={{ background: "#F8FAFB", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: FONT_BODY }}>{l}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: INK, fontFamily: FONT_DISPLAY }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY, marginBottom: 6 }}>
          PREFERENCES & FORMULAS
        </div>
        <div className="space-y-1.5">
          {[
            "Wella Koleston 7/0 + 9% dev · 30 min",
            "Likes Sasha · Avoids Sundays",
            "Birthday Jan 14 · Auto-promo sent",
          ].map((n) => (
            <div
              key={n}
              className="rounded px-3 py-1.5"
              style={{ background: "#F8FAFB", fontSize: 12, color: INK, fontFamily: FONT_BODY }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

function AnalyticsMock() {
  return (
    <MockFrame title="arca.app/admin/analytics">
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            ["MRR", "$32,140", "+14%"],
            ["CAC", "$48", "-12%"],
            ["LTV", "$1,820", "+22%"],
            ["ROAS", "5.1x", "+0.6"],
          ].map(([l, v, d]) => (
            <div key={l} className="rounded-md p-2.5" style={{ background: "#F8FAFB", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: FONT_BODY }}>{l}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: INK, fontFamily: FONT_DISPLAY }}>{v}</div>
              <div style={{ fontSize: 10, color: "#10B981", fontFamily: FONT_BODY }}>{d}</div>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 400 100" className="w-full h-24">
          <defs>
            <linearGradient id="proGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT_2} stopOpacity="0.4" />
              <stop offset="100%" stopColor={ACCENT_2} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,75 L40,70 L80,72 L120,55 L160,60 L200,42 L240,38 L280,25 L320,28 L360,15 L400,10 L400,100 L0,100 Z"
            fill="url(#proGrad)"
          />
          <path
            d="M0,75 L40,70 L80,72 L120,55 L160,60 L200,42 L240,38 L280,25 L320,28 L360,15 L400,10"
            stroke={ACCENT_2}
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <div className="mt-4 space-y-2">
          {[
            ["Instagram Ads", 82],
            ["Google Search", 64],
            ["Walk-ins", 48],
            ["Referrals", 31],
          ].map(([n, pct]) => (
            <div key={n as string}>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: 11, color: "#64748B", fontFamily: FONT_BODY }}>{n}</span>
                <span style={{ fontSize: 11, color: INK, fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: "#F1F4F7", borderRadius: 3 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: ACCENT_2, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

/* ---------------- INDUSTRIES ---------------- */
const industries = [
  { Icon: Scissors, bg: "#FEF3F2", iconColor: "#EC4899", title: "Salons & Barbershops", desc: "Color cards, formulas, chair rental, retail, tipping, and product recommendations on every ticket.", badge: "Color formulas" },
  { Icon: Dumbbell, bg: "#FFF7ED", iconColor: ACCENT_2, title: "Gyms & Personal Trainers", desc: "Programs, packages, recurring sessions, attendance, and a client app for workouts and progress.", badge: "Program builder" },
  { Icon: Sparkles, bg: "#F0FDFA", iconColor: ACCENT, title: "Day Spas", desc: "Multi-room booking, packages, gift cards, retail inventory, and add-on upsells at checkout.", badge: "Multi-room booking" },
  { Icon: Heart, bg: "#FDF2F8", iconColor: "#EC4899", title: "Wellness Coaches", desc: "Memberships, protocols, 2-way messaging, progress tracking, and recurring billing on autopilot.", badge: "Memberships" },
  { Icon: Flower2, bg: "#F5F3FF", iconColor: "#8B5CF6", title: "Yoga & Pilates Studios", desc: "Class schedules, drop-ins, packs, waitlists, capacity caps, and instructor payouts.", badge: "Class packs" },
  { Icon: Users, bg: "#EFF6FF", iconColor: "#3B82F6", title: "Group Fitness", desc: "Capacity-managed classes, recurring billing, attendance, and a leaderboard members love.", badge: "Capacity caps" },
];

function Industries() {
  return (
    <section style={{ background: "white", padding: "100px 40px" }}>
      <div className="mx-auto" style={{ maxWidth: 1080 }}>
        <Label>WHO WE SERVE</Label>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(28px, 3.5vw, 42px)",
            color: INK,
            marginTop: 12,
            letterSpacing: "-0.02em",
          }}
        >
          Designed for the businesses that shape how people feel.
        </h2>
        <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: "#64748B", lineHeight: 1.7, marginTop: 12, maxWidth: 620 }}>
          Six industries. One platform. Every workflow handled, beautifully - with the specific
          features your category actually needs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {industries.map((s) => (
            <div
              key={s.title}
              className="cursor-pointer transition-all"
              style={{
                background: "#F8FAFB",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: 28,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,31,61,0.08)";
                e.currentTarget.style.borderColor = "#CBD5E1";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#F8FAFB";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 40, height: 40, background: s.bg }}
              >
                <s.Icon size={20} color={s.iconColor} />
              </div>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, color: INK, marginTop: 14 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#64748B", lineHeight: 1.6, marginTop: 8 }}>
                {s.desc}
              </p>
              <span
                className="inline-block mt-4 rounded-full px-2.5 py-1"
                style={{ background: "#FFFBEB", color: "#92400E", fontSize: 11, fontFamily: FONT_BODY, fontWeight: 500 }}
              >
                {s.badge}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center mt-10" style={{ fontSize: 14, color: "#64748B", fontFamily: FONT_BODY }}>
          All industries are served by the same platform. Features activate based on your business
          type.{" "}
          <a href="/features" style={{ color: ACCENT_2, fontWeight: 500 }}>
            See All Features →
          </a>
        </p>
      </div>
    </section>
  );
}

/* ---------------- COMPARE ---------------- */
const compareRows: Array<[string, 1 | 0 | 0.5, 1 | 0 | 0.5, 1 | 0 | 0.5, 1 | 0 | 0.5]> = [
  ["Modern, fast-loading interface", 1, 0, 0, 0.5],
  ["Online booking with deposits", 1, 1, 1, 1],
  ["Branded website + booking widget", 1, 0.5, 0, 0.5],
  ["Built-in 2-way SMS", 1, 0.5, 0.5, 1],
  ["Full-funnel marketing attribution", 1, 0, 0, 0],
  ["Memberships and recurring billing", 1, 1, 0.5, 1],
  ["Retail inventory + low-stock alerts", 1, 0.5, 0.5, 1],
  ["Client lifetime value scoring", 1, 0, 0, 0],
  ["AI weekly insights", 1, 0, 0, 0],
  ["Stripe Terminal in-person payments", 1, 0, 0, 0.5],
  ["Predictable transparent pricing", 1, 0.5, 0, 0.5],
  ["Free white-glove migration", 1, 0, 0, 0],
];

function compareCell(v: 1 | 0 | 0.5) {
  if (v === 1) return <CheckCircle2 size={18} color="#10B981" />;
  if (v === 0) return <XCircle size={18} color="rgba(255,255,255,0.2)" />;
  return <CircleDot size={18} color={ACCENT_2} />;
}

function Compare() {
  return (
    <section style={{ background: INK, padding: "100px 40px" }}>
      <div className="mx-auto" style={{ maxWidth: 1080 }}>
        <Label light>COMPARE</Label>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(28px, 3.5vw, 42px)",
            color: "white",
            marginTop: 12,
            letterSpacing: "-0.02em",
          }}
        >
          Finally, software your team actually wants to use.
        </h2>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 17,
            color: "rgba(255,255,255,0.65)",
            marginTop: 12,
            maxWidth: 600,
            lineHeight: 1.7,
          }}
        >
          See why 1,200+ premium service businesses switched from legacy tools to ARCA Pro.
        </p>

        <div
          className="mt-12 overflow-x-auto"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
          }}
        >
          <table className="w-full" style={{ minWidth: 700, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.06)" }}>
                <th
                  className="text-left px-4 py-4"
                  style={{ fontFamily: FONT_BODY, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}
                >
                  Feature
                </th>
                {["ARCA Pro", "Vagaro", "Mindbody", "Boulevard"].map((c, i) => (
                  <th
                    key={c}
                    className="px-4 py-4 text-center"
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: i === 0 ? 14 : 13,
                      fontWeight: i === 0 ? 600 : 500,
                      color: i === 0 ? ACCENT_2 : "rgba(255,255,255,0.6)",
                      background: i === 0 ? "rgba(245,158,11,0.12)" : "transparent",
                    }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map(([feat, a, b, c, d], i) => (
                <tr
                  key={feat as string}
                  style={{ borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.06)" }}
                >
                  <td className="px-4 py-3" style={{ fontFamily: FONT_BODY, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
                    {feat as string}
                  </td>
                  <td className="px-4 py-3 text-center" style={{ background: "rgba(245,158,11,0.08)" }}>
                    {compareCell(a)}
                  </td>
                  <td className="px-4 py-3 text-center">{compareCell(b)}</td>
                  <td className="px-4 py-3 text-center">{compareCell(c)}</td>
                  <td className="px-4 py-3 text-center">{compareCell(d)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
          {[
            [<CheckCircle2 key="c" size={14} color="#10B981" />, "Full support"],
            [<CircleDot key="p" size={14} color={ACCENT_2} />, "Partial"],
            [<XCircle key="x" size={14} color="rgba(255,255,255,0.3)" />, "Not available"],
          ].map(([icon, label]) => (
            <span key={label as string} className="flex items-center gap-1.5">
              {icon as React.ReactNode}
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: FONT_BODY }}>
                {label as string}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRUST ---------------- */
function Trust() {
  return (
    <section style={{ background: "#F8FAFB", padding: "100px 40px" }}>
      <div className="mx-auto grid md:grid-cols-2 gap-12 items-start" style={{ maxWidth: 1080 }}>
        <div>
          <Label>SECURITY & RELIABILITY</Label>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              color: INK,
              marginTop: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Built to handle your busiest Saturday.
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: "#64748B", lineHeight: 1.8, marginTop: 16 }}>
            ARCA Pro runs on the same infrastructure as the world's most demanding financial apps.
            Your bookings, payments, and client data are encrypted at rest and in transit, backed up
            in three regions, and protected by enterprise security from day one.
          </p>
          <ul className="mt-6 space-y-2.5">
            {[
              "99.99% uptime SLA on every plan",
              "PCI-DSS Level 1 payments via Stripe",
              "SOC 2 Type II infrastructure",
              "256-bit encryption at rest and in transit",
              "Continuous backups across three regions",
              "Role-based access with single sign-on (SSO)",
              "Audit log of every staff action",
              "GDPR and CCPA-ready data exports",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} color={ACCENT_2} className="mt-0.5 flex-shrink-0" />
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: INK }}>{b}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 mt-8 flex-wrap">
            {[
              { Icon: ShieldCheck, label: "PCI-DSS L1", color: "#10B981" },
              { Icon: Shield, label: "SOC 2 Type II", color: ACCENT },
              { Icon: Lock, label: "GDPR Ready", color: ACCENT_2 },
            ].map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: "white", border: "1px solid #E2E8F0" }}
              >
                <b.Icon size={16} color={b.color} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: INK, fontWeight: 500 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <MockFrame title="arca.app/admin/system">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ fontSize: 12, color: "#94A3B8", fontFamily: FONT_BODY }}>30-day uptime</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#10B981", fontFamily: FONT_DISPLAY, lineHeight: 1 }}>
                  99.99%
                </div>
              </div>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" stroke="#F1F4F7" strokeWidth="8" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#10B981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(99.99 / 100) * 201} 201`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
            </div>
            <div className="space-y-2">
              {[
                ["Payments processing", true],
                ["Booking engine", true],
                ["SMS gateway", true],
                ["Email delivery", true],
              ].map(([l, ok]) => (
                <div
                  key={l as string}
                  className="flex items-center justify-between rounded-md px-3 py-2"
                  style={{ background: "#F8FAFB", border: "1px solid #E2E8F0" }}
                >
                  <span style={{ fontSize: 12, color: INK, fontFamily: FONT_BODY }}>{l}</span>
                  {ok ? <CheckCircle2 size={16} color="#10B981" /> : <AlertTriangle size={16} color={ACCENT_2} />}
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-md p-3" style={{ background: INK, color: "rgba(255,255,255,0.85)" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: FONT_BODY }}>SECURITY EVENTS</div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
                09:42 · sasha logged in · austin-01
              </div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                09:38 · MFA verified · devon
              </div>
            </div>
          </div>
        </MockFrame>
      </div>
    </section>
  );
}

/* ---------------- PRICING ---------------- */
function Pricing() {
  const [annual, setAnnual] = useState(true);
  const prices = {
    starter: annual ? 79 : 99,
    growth: annual ? 159 : 199,
    scale: annual ? 279 : 349,
  };

  const card = (opts: {
    badge: string;
    badgeColor: string;
    price: number;
    base: number;
    desc: string;
    cta: { label: string; primary?: boolean; light?: boolean };
    bullets: string[];
    bulletsHeader: string;
    featured?: boolean;
    dark?: boolean;
  }) => {
    const txt = opts.dark ? "white" : INK;
    const sub = opts.dark ? "rgba(255,255,255,0.65)" : "#64748B";
    return (
      <div
        className="relative"
        style={{
          background: opts.dark ? INK : opts.featured ? "white" : "#F8FAFB",
          border: opts.featured ? `2px solid ${ACCENT_2}` : "1px solid #E2E8F0",
          borderRadius: 12,
          padding: 36,
          boxShadow: opts.featured ? "0 8px 40px rgba(245,158,11,0.18)" : "none",
        }}
      >
        {opts.featured && (
          <span
            className="absolute left-1/2 -translate-x-1/2 rounded-full font-semibold text-white"
            style={{ top: -14, background: ACCENT_2, padding: "4px 16px", fontSize: 12, fontFamily: FONT_BODY }}
          >
            Most Popular
          </span>
        )}
        <div
          className="font-semibold uppercase"
          style={{ fontSize: 12, letterSpacing: "0.08em", color: opts.badgeColor, fontFamily: FONT_BODY }}
        >
          {opts.badge}
        </div>
        <div className="flex items-baseline gap-2 mt-4">
          <div className="flex items-start">
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24, color: txt, marginTop: 8 }}>$</span>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 52, color: txt, lineHeight: 1 }}>
              {opts.price}
            </span>
          </div>
          <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: sub }}>/mo</span>
        </div>
        {annual && (
          <div style={{ fontSize: 12, color: sub, fontFamily: FONT_BODY, marginTop: 2 }}>
            <span style={{ textDecoration: "line-through" }}>${opts.base}/mo</span> billed annually
          </div>
        )}
        <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: sub, marginTop: 12 }}>{opts.desc}</p>
        <a
          href="/admin/dashboard"
          className="block text-center w-full rounded-md font-semibold mt-5"
          style={{
            background: opts.cta.primary ? ACCENT_2 : opts.cta.light ? "white" : "transparent",
            color: opts.cta.primary ? "white" : opts.cta.light ? INK : INK,
            border: opts.cta.primary || opts.cta.light ? "none" : "1.5px solid #E2E8F0",
            padding: "12px 24px",
            fontSize: 15,
            fontFamily: FONT_BODY,
          }}
        >
          {opts.cta.label}
        </a>
        <div className="text-center" style={{ fontSize: 12, color: opts.dark ? "rgba(255,255,255,0.4)" : "#94A3B8", marginTop: 8, fontFamily: FONT_BODY }}>
          14-day free trial. No credit card.
        </div>
        <div style={{ height: 1, background: opts.dark ? "rgba(255,255,255,0.1)" : "#E2E8F0", margin: "24px 0" }} />
        <div style={{ fontSize: 13, fontFamily: FONT_BODY, fontWeight: 500, color: txt }}>{opts.bulletsHeader}</div>
        <ul className="mt-3 space-y-2.5">
          {opts.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5">
              <CheckCircle2 size={16} color={opts.dark ? ACCENT_2 : "#10B981"} className="mt-0.5 flex-shrink-0" />
              <span style={{ fontSize: 14, color: txt, fontFamily: FONT_BODY }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section id="pricing" style={{ background: "white", padding: "100px 40px" }}>
      <div className="mx-auto" style={{ maxWidth: 1080 }}>
        <div className="text-center">
          <Label>PRICING</Label>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              color: INK,
              marginTop: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Simple, transparent pricing. Scaled to your business.
          </h2>
          <div className="inline-flex items-center mt-8" style={{ background: "#F1F4F7", borderRadius: 999, padding: 4 }}>
            {[
              [false, "Monthly"],
              [true, "Annual · Save 20%"],
            ].map(([val, label]) => {
              const active = annual === val;
              return (
                <button
                  key={label as string}
                  onClick={() => setAnnual(val as boolean)}
                  className="rounded-full transition-all"
                  style={{
                    padding: "8px 18px",
                    fontSize: 13,
                    fontFamily: FONT_BODY,
                    fontWeight: 500,
                    background: active ? "white" : "transparent",
                    color: active ? INK : "#64748B",
                    boxShadow: active ? "0 1px 3px rgba(15,31,61,0.08)" : "none",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start mt-12 max-w-5xl mx-auto">
          {card({
            badge: "STARTER",
            badgeColor: "#64748B",
            price: prices.starter,
            base: 99,
            desc: "For solo operators and new shops getting their first booking system.",
            cta: { label: "Start Free Trial" },
            bulletsHeader: "What's included",
            bullets: [
              "Online booking and scheduling",
              "Point of sale and payments",
              "2-way SMS confirmations",
              "Client CRM with notes and history",
              "Up to 2 staff members",
              "Up to 500 clients",
              "Embedded booking widget",
            ],
          })}
          {card({
            badge: "GROWTH",
            badgeColor: ACCENT_2,
            price: prices.growth,
            base: 199,
            desc: "For growing businesses ready to fill the calendar and grow rebooks.",
            cta: { label: "Start Free Trial", primary: true },
            featured: true,
            bulletsHeader: "Everything in Starter, plus",
            bullets: [
              "Memberships and recurring billing",
              "Retail inventory with low-stock alerts",
              "Packages, gift cards, and tipping",
              "Branded website builder",
              "Marketing automations + email",
              "Up to 8 staff members",
              "Unlimited clients",
            ],
          })}
          {card({
            badge: "SCALE",
            badgeColor: ACCENT_2,
            price: prices.scale,
            base: 349,
            desc: "For multi-location operators and ambitious high-growth brands.",
            cta: { label: "Start Free Trial", light: true },
            dark: true,
            bulletsHeader: "Everything in Growth, plus",
            bullets: [
              "Multi-location support (up to 5)",
              "Full marketing attribution + ROAS",
              "Commission tracking and payouts",
              "AI weekly insights and forecasting",
              "API access and webhooks",
              "SSO and audit log exports",
              "Up to 25 staff members",
            ],
          })}
        </div>

        <div
          className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-xl p-7"
          style={{ background: "#F8FAFB", border: "1px solid #E2E8F0" }}
        >
          <div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 16, color: INK }}>Enterprise</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#64748B", marginTop: 4 }}>
              Unlimited locations, staff, and clients. Dedicated AM, SLA, custom integrations, and
              franchise tooling. For groups and multi-brand operators.
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href="/demo"
              className="rounded-md font-medium text-white"
              style={{ background: INK, padding: "10px 20px", fontSize: 14, fontFamily: FONT_BODY }}
            >
              Contact Sales
            </a>
            <a
              href="/demo"
              className="rounded-md font-medium"
              style={{ border: "1.5px solid #E2E8F0", color: INK, padding: "10px 20px", fontSize: 14, fontFamily: FONT_BODY }}
            >
              Schedule a Demo
            </a>
          </div>
        </div>

        <PricingFAQ />
      </div>
    </section>
  );
}

const faq = [
  ["Can I switch plans at any time?", "Yes. Upgrade or downgrade instantly. Prorated automatically."],
  ["What counts as a staff member?", "Anyone with their own login who takes bookings, sells retail, or processes payments."],
  ["Is there a setup fee?", "No. Onboarding, data import from your old system, and live training are included on every plan."],
  ["What happens after my trial ends?", "Choose a plan to continue. Your data stays intact. No charges if you don't pick one."],
  ["What are the payment processing fees?", "2.6% + 10¢ in person, 2.9% + 30¢ online. No platform markup. Settlements next business day."],
] as const;

function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-16 max-w-2xl mx-auto">
      <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: INK, textAlign: "center" }}>
        Common questions about pricing
      </h3>
      <div className="mt-6 space-y-2">
        {faq.map(([q, a], i) => (
          <div key={q} style={{ background: "#F8FAFB", border: "1px solid #E2E8F0", borderRadius: 8 }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center text-left px-5 py-4"
            >
              <span style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 15, color: INK }}>{q}</span>
              <ChevronDown
                size={18}
                color="#64748B"
                style={{ transform: open === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 200ms" }}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-4" style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>
                {a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- CUSTOMERS ---------------- */
function Customers() {
  return (
    <section style={{ background: "#F8FAFB", padding: "100px 40px" }}>
      <div className="mx-auto" style={{ maxWidth: 1080 }}>
        <Label>CUSTOMER STORIES</Label>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(28px, 3.5vw, 42px)",
            color: INK,
            marginTop: 12,
            letterSpacing: "-0.02em",
          }}
        >
          Businesses that replaced four tools with ARCA Pro.
        </h2>

        <div
          className="grid md:grid-cols-2 gap-12 mt-12 p-10 rounded-2xl"
          style={{ background: "white", border: "1px solid #E2E8F0" }}
        >
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Before
                </div>
                {[
                  ["Revenue", "$62K/mo"],
                  ["No-shows", "24%"],
                  ["Rebook", "48%"],
                  ["Tools", "4 separate"],
                ].map(([k, v]) => (
                  <div key={k} className="mt-3">
                    <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY }}>{k}</div>
                    <div style={{ fontSize: 18, fontFamily: FONT_DISPLAY, fontWeight: 600, color: "#94A3B8" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: ACCENT_2, fontFamily: FONT_BODY, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  After
                </div>
                {[
                  ["Revenue", "$148K/mo"],
                  ["No-shows", "3.8%"],
                  ["Rebook", "84%"],
                  ["Tools", "ARCA Pro"],
                ].map(([k, v]) => (
                  <div key={k} className="mt-3">
                    <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY }}>{k}</div>
                    <div style={{ fontSize: 18, fontFamily: FONT_DISPLAY, fontWeight: 700, color: ACCENT_2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 20, color: INK }}>Atelier Studio</span>
              <span
                className="rounded px-2 py-0.5"
                style={{ background: "#FFFBEB", color: "#92400E", fontSize: 11, fontFamily: FONT_BODY, fontWeight: 500 }}
              >
                Salon · Los Angeles
              </span>
            </div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: INK, lineHeight: 1.7, fontStyle: "italic" }}>
              "We cancelled four tools the week we switched to ARCA Pro. Bookings are up 32%,
              no-shows dropped to under 4%, and my team finally has one place to work from. It just
              feels like the brand we've spent years building."
            </p>
            <div className="flex items-center gap-3 mt-5">
              <div
                className="rounded-full flex items-center justify-center text-white font-semibold"
                style={{
                  width: 48,
                  height: 48,
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_2})`,
                  fontFamily: FONT_DISPLAY,
                }}
              >
                EM
              </div>
              <div>
                <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: INK }}>Elena Morales, Owner</div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: "#64748B" }}>Atelier Studio</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {[
            {
              quote: "We grew membership revenue 4x in 9 months. The recurring billing alone paid for the platform.",
              name: "Marcus Liu",
              practice: "Forge Strength Club",
              tag: "Gym",
            },
            {
              quote: "First week, our no-show rate dropped from 22% to under 5%. The reminder flows are next level.",
              name: "Priya Kapoor",
              practice: "Stillpoint Wellness",
              tag: "Spa",
            },
          ].map((t) => (
            <div key={t.name} className="rounded-xl p-7" style={{ background: "white", border: "1px solid #E2E8F0" }}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={ACCENT_2} color={ACCENT_2} />
                ))}
              </div>
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 15,
                  color: INK,
                  lineHeight: 1.7,
                  marginTop: 14,
                  fontStyle: "italic",
                }}
              >
                "{t.quote}"
              </p>
              <div className="flex items-center justify-between mt-5">
                <div>
                  <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: INK }}>{t.name}</div>
                  <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: "#64748B" }}>{t.practice}</div>
                </div>
                <span
                  className="rounded px-2 py-0.5"
                  style={{ background: "#F1F4F7", color: "#64748B", fontSize: 11, fontFamily: FONT_BODY, fontWeight: 500 }}
                >
                  {t.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- AFFILIATE ---------------- */
function Affiliate() {
  return (
    <section style={{ background: "white", padding: "100px 40px" }}>
      <div
        className="mx-auto rounded-2xl text-center"
        style={{
          maxWidth: 860,
          padding: 64,
          background: `linear-gradient(135deg, ${ACCENT_2} 0%, ${INK} 100%)`,
        }}
      >
        <span
          className="inline-block rounded-full font-medium uppercase"
          style={{
            background: "rgba(255,255,255,0.15)",
            color: "white",
            padding: "4px 12px",
            fontSize: 11,
            letterSpacing: "0.08em",
            fontFamily: FONT_BODY,
          }}
        >
          PARTNER PROGRAM
        </span>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(28px, 3.5vw, 42px)",
            color: "white",
            marginTop: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Refer a business. Earn forever.
        </h2>
        <p
          className="mx-auto"
          style={{
            fontFamily: FONT_BODY,
            fontSize: 18,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.7,
            marginTop: 16,
            maxWidth: 560,
          }}
        >
          Earn 15% of every referred business's monthly subscription for as long as they stay on
          ARCA Pro. The more you refer, the higher your tier.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mt-8">
          {[
            ["Tier 1", "1–5 businesses", "15%"],
            ["Tier 2", "6–15 businesses", "20%"],
            ["Tier 3", "16+ businesses", "25%"],
          ].map(([t, r, p]) => (
            <div
              key={t}
              className="rounded-xl p-5 text-center"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: "white" }}>{t}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>{r}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28, color: "white", marginTop: 6 }}>{p}</div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: "rgba(255,255,255,0.85)", marginTop: 24 }}>
          15 referred businesses × $199/mo average ={" "}
          <span style={{ color: "white", fontWeight: 700 }}>$597/month passive income</span>.
        </p>

        <a
          href="/partners"
          className="inline-flex items-center gap-2 rounded-lg font-semibold mt-7"
          style={{ background: "white", color: INK, padding: "14px 28px", fontSize: 15, fontFamily: FONT_BODY }}
        >
          Learn About the Partner Program <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden text-center" style={{ background: INK, padding: "100px 40px" }}>
      <svg
        className="absolute inset-0 m-auto pointer-events-none"
        width="800"
        height="600"
        viewBox="0 0 26 22"
        style={{ opacity: 1 }}
      >
        <path d="M2 19 C 4 6, 14 2, 24 7" stroke="rgba(245,158,11,0.08)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
      </svg>
      <div className="relative">
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(36px, 5vw, 64px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "white",
          }}
        >
          Run a more beautiful
          <br />
          business.
        </h2>
        <p
          className="mx-auto"
          style={{
            fontFamily: FONT_BODY,
            fontSize: 20,
            color: "rgba(255,255,255,0.65)",
            marginTop: 20,
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          Join 1,200+ premium service businesses that replaced their disconnected tools with
          ARCA Pro.
        </p>
        <div className="flex flex-wrap justify-center gap-3" style={{ marginTop: 40 }}>
          <a
            href="/admin/dashboard"
            className="rounded-lg font-semibold"
            style={{ background: ACCENT_2, color: "white", padding: "16px 32px", fontSize: 16, fontFamily: FONT_BODY, boxShadow: "0 8px 24px rgba(245,158,11,0.35)" }}
          >
            Start Your Free Trial
          </a>
          <a
            href="/demo"
            className="rounded-lg font-medium"
            style={{
              border: "1.5px solid rgba(255,255,255,0.3)",
              color: "white",
              padding: "14.5px 32px",
              fontSize: 16,
              fontFamily: FONT_BODY,
            }}
          >
            Talk to Sales
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-7">
          {["14-day free trial", "No credit card required", "Free migration", "Cancel anytime", "Setup in 30 minutes"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <Check size={12} color="rgba(255,255,255,0.4)" />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: FONT_BODY }}>{t}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PAGE ---------------- */
function ArcaProPage() {
  return (
    <div style={{ background: "white" }}>
      <Nav product="pro" />
      <Hero />
      <SocialProof />
      <Problem />
      <Solution />
      <DeepDive
        bg="white"
        label="FILL THE CALENDAR"
        heading="Booking that feels like the brand you built."
        body="ARCA Pro turns booking from a chore into a brand moment. Clients book in three taps from your site, Instagram, or Google. Deposits hold the slot. SMS confirmations cut no-shows below 5%. Your team sees one calendar across every staff member and room."
        bullets={[
          "Embedded booking widget for your site and Instagram",
          "Service-specific durations, prep time, and resources",
          "Deposits, packages, gift cards, and tipping on every flow",
          "Waitlist auto-fills cancellations within minutes",
          "Smart reminders via SMS, email, and push",
          "Color-coded staff columns with drag-and-drop",
        ]}
        quote={{
          text: "Our no-show rate went from 22% to under 5% in the first week. The reminder flows alone paid for the platform.",
          who: "Priya Kapoor, Owner, Stillpoint Wellness",
        }}
        visual={<BookingMock />}
      />
      <DeepDive
        bg="#F8FAFB"
        label="KNOW EVERY CLIENT"
        heading="A CRM that remembers what your team can't."
        body="Every visit, every preference, every formula, every birthday. ARCA Pro builds a complete profile from the first booking, surfaces it the second a client walks in, and runs the win-back and loyalty automations that turn one-time visitors into lifetime regulars."
        bullets={[
          "Lifetime value, visit count, and rebook rate per client",
          "Custom fields for color formulas, allergies, or programs",
          "Auto-tag VIPs, at-risk, and birthday clients",
          "Win-back automations for lapsed clients",
          "Built-in loyalty program with tiers and rewards",
          "Internal notes shared across your whole team",
        ]}
        visual={<CrmMock />}
        flip
      />
      <DeepDive
        bg="white"
        label="GROWTH INTELLIGENCE"
        heading="Know exactly what is working. And what is not."
        body="No other booking tool shows you the full picture from ad spend to closed ticket. ARCA Pro connects your Meta and Google campaigns, organic traffic, and walk-ins to actual revenue. See your real CAC, real ROAS, and real LTV - and let the AI tell you what to do about it."
        bullets={[
          "Full-funnel attribution from ad click to closed ticket",
          "Provider performance scoring with six key metrics",
          "Cohort retention showing real client lifetime value",
          "AI-generated weekly insights delivered Monday 7am",
          "Revenue forecasting with what-if scenario modeling",
          "Predictive churn scoring for every active member",
        ]}
        visual={<AnalyticsMock />}
      />
      <Industries />
      <Compare />
      <Trust />
      <Pricing />
      <Customers />
      <Affiliate />
      <FinalCTA />
      <Footer />
      <FloatingCTA />
    </div>
  );
}

/* Silence unused-icon lint for icons reserved for future sections */
const _reserved = { Repeat, Smartphone, Gift };
void _reserved;
