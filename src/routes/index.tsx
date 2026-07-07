import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { FloatingCTA } from "@/components/marketing/FloatingCTA";
import { DashboardMock } from "@/components/marketing/DashboardMock";
import {
  ArrowRight,
  Play,
  Check,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Clipboard,
  CreditCard,
  BarChart2,
  Users,
  Globe,
  Stethoscope,
  Activity,
  Beaker,
  Droplets,
  Dumbbell,
  Scale,
  CheckCircle2,
  XCircle,
  CircleDot,
  Star,
  Shield,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { setProductMode } from "@/lib/productMode";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARCA Rx - The Operating System for Health Optimization Practices" },
      {
        name: "description",
        content:
          "ARCA Rx replaces Vagaro, Aesthetic Record, and Mangomint for medical spas, HRT clinics, and wellness practices. HIPAA compliant. Starting at $149/month.",
      },
      { property: "og:title", content: "ARCA Rx - The Operating System for Health Optimization Practices" },
      {
        property: "og:description",
        content:
          "One platform. Every part of your practice. HIPAA compliant. Built for medical spas, HRT, functional medicine, and wellness.",
      },
      { property: "og:url", content: "https://arca-rx.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://arca-rx.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "ARCA Rx",
          applicationCategory: "HealthApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "149", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: HomePage,
});

const FONT_DISPLAY = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "Inter, sans-serif";

function Label({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div
      className="font-medium uppercase"
      style={{
        fontSize: 12,
        letterSpacing: "0.08em",
        color: light ? "rgba(255,255,255,0.5)" : "#00B5A4",
        fontFamily: FONT_BODY,
      }}
    >
      {children}
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "100vh", background: "white" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 800px 600px at 100% 0%, rgba(0,181,164,0.06) 0%, transparent 70%), radial-gradient(ellipse 700px 500px at 0% 100%, rgba(15,31,61,0.04) 0%, transparent 70%)",
        }}
      />
      <div
        className="relative mx-auto text-center"
        style={{ maxWidth: 1080, padding: "120px 40px 80px" }}
      >
        <a
          href="#"
          className="inline-flex items-center gap-2 transition-colors animate-fade-in"
          style={{
            background: "#F0FDFA",
            border: "1px solid #99F6E4",
            borderRadius: 24,
            padding: "6px 16px 6px 8px",
          }}
        >
          <span
            className="font-semibold text-white"
            style={{
              background: "#00B5A4",
              borderRadius: 12,
              padding: "2px 8px",
              fontSize: 11,
              fontFamily: FONT_BODY,
            }}
          >
            NEW
          </span>
          <span style={{ fontSize: 13, color: "#065F46", fontFamily: FONT_BODY, fontWeight: 500 }}>
            HIPAA-compliant telehealth now available
          </span>
          <ChevronRight size={14} color="#065F46" />
        </a>

        <h1
          className="mx-auto animate-fade-in"
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(40px, 5.5vw, 72px)",
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            color: "#0F1F3D",
            marginTop: 32,
            maxWidth: 800,
          }}
        >
          The Operating System
          <br />
          for Health Optimization
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #00B5A4, #0F1F3D)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Practices.
          </span>
        </h1>

        <p
          className="mx-auto animate-fade-in"
          style={{
            fontFamily: FONT_BODY,
            fontSize: "clamp(17px, 2vw, 20px)",
            lineHeight: 1.75,
            color: "#64748B",
            maxWidth: 560,
            marginTop: 24,
          }}
        >
          ARCA Rx replaces Vagaro, Aesthetic Record, and Mangomint for medical spas, HRT clinics,
          functional medicine practices, and wellness studios. One platform. Fully HIPAA compliant.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-3" style={{ marginTop: 40 }}>
          <a
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-white font-semibold transition-all"
            style={{
              background: "#00B5A4",
              padding: "14px 28px",
              borderRadius: 8,
              fontSize: 16,
              fontFamily: FONT_BODY,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#009e8f";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,181,164,0.35)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#00B5A4";
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
              color: "#0F1F3D",
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
            <Play size={14} fill="#0F1F3D" /> Watch Demo (3 min)
          </a>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6" style={{ marginTop: 20 }}>
          {[
            "No credit card required",
            "14-day free trial",
            "HIPAA compliant",
            "Cancel anytime",
          ].map((t, i) => (
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

        <div className="mx-auto" style={{ marginTop: 64, maxWidth: 1080 }}>
          <DashboardMock />
        </div>
      </div>
    </section>
  );
}

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
      <div
        className="mx-auto flex flex-wrap items-center justify-between gap-6"
        style={{ maxWidth: 1280 }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span style={{ fontSize: 13, color: "#94A3B8", fontFamily: FONT_BODY }}>
            Replacing the tools 500+ practices already use:
          </span>
          <div className="flex items-center gap-3">
            {["Vagaro", "Mindbody", "Aesthetic Record", "Jane App", "Boulevard"].map((n) => (
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
            <ArrowRight size={14} color="#00B5A4" />
            <span
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: 14,
                color: "#00B5A4",
              }}
            >
              ARCA Rx
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {[
            ["500+", "Practices"],
            ["$200M+", "Processed"],
            ["99.9%", "Uptime"],
          ].map(([v, l], i) => (
            <div key={l} className="flex items-center gap-5">
              <div className="flex flex-col">
                <span style={{ fontSize: 15, fontWeight: 600, color: "#0F1F3D", fontFamily: FONT_BODY }}>
                  {v}
                </span>
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
              color: "#0F1F3D",
              marginTop: 12,
            }}
          >
            Your practice is held back by tools built for someone else.
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: "#64748B", lineHeight: 1.8, marginTop: 20 }}>
            Vagaro was built for hair salons. Mindbody was built for yoga studios. Aesthetic Record
            has charting but nothing else. None of them have marketing analytics, virtual care, or
            real HIPAA compliance infrastructure. You are running a medical practice on salon
            software.
          </p>
          <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: "#64748B", lineHeight: 1.8, marginTop: 16 }}>
            The result is 7 disconnected tools that do not talk to each other, 12 hours per week on
            administrative work, zero visibility into which marketing actually brings in patients,
            and a compliance posture that keeps you up at night.
          </p>
          <div
            className="flex items-start gap-3"
            style={{
              background: "#FEF3C7",
              border: "1px solid #FCD34D",
              borderRadius: 8,
              padding: "20px 24px",
              marginTop: 32,
            }}
          >
            <AlertTriangle size={18} color="#F59E0B" className="mt-0.5 flex-shrink-0" />
            <span style={{ fontSize: 14, color: "#92400E", fontFamily: FONT_BODY, fontWeight: 500 }}>
              The average practice uses 6.2 software tools. Each disconnected. Each a potential
              HIPAA liability.
            </span>
          </div>
        </div>

        <div
          className="relative rounded-2xl p-8"
          style={{ background: "#F8FAFB", border: "1px solid #E2E8F0", minHeight: 420 }}
        >
          <div className="grid grid-cols-3 gap-3">
            {["Vagaro", "Square", "Google Docs", "Mailchimp", "Instagram", "Quickbooks", "Inventory"].map(
              (n) => (
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
              ),
            )}
          </div>
          <div
            className="mt-6 rounded-lg p-4"
            style={{ background: "white", border: "1px solid #E2E8F0" }}
          >
            {[
              ["Average monthly cost", "$847/mo", "#EF4444"],
              ["Average setup time", "6+ months", "#F59E0B"],
              ["HIPAA coverage", "None of the above", "#EF4444"],
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

const features = [
  { Icon: Calendar, title: "Smart Scheduling", body: "Real-time availability across providers and rooms. Online booking with deposits. Automated reminders. Waitlist management. Walk-in mode." },
  { Icon: Clipboard, title: "Clinical EMR", body: "HIPAA-compliant charting built for aesthetics, HRT, and functional medicine. Neurotoxin face diagrams. Filler mapping. Before and after management." },
  { Icon: CreditCard, title: "Point of Sale", body: "Full-featured POS with split payments, membership credits, packages, gift cards, and Stripe Terminal for in-person payments." },
  { Icon: BarChart2, title: "Growth Analytics", body: "Complete funnel from ad impression to closed ticket. Paid channel attribution. Churn prediction. Revenue forecasting. AI-generated weekly insights." },
  { Icon: Users, title: "Patient Engagement", body: "The Lucid patient app. Protocol delivery, progress photos, coach messaging, telehealth video, and a loyalty program that retains." },
  { Icon: Globe, title: "Website Builder", body: "A professionally designed practice website natively connected to your ARCA Rx data. Booking widget embedded. Goes live in under an hour." },
];

function Solution() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#0F1F3D", padding: "120px 40px" }}
    >
      <svg
        className="absolute top-0 right-0 pointer-events-none"
        width="600"
        height="500"
        viewBox="0 0 26 22"
        style={{ opacity: 0.04 }}
      >
        <path d="M2 19 C 4 6, 14 2, 24 7" stroke="#00B5A4" strokeWidth="0.5" fill="none" strokeLinecap="round" />
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
          One platform. Every part of your practice.
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
          ARCA Rx replaces every tool with one connected system built specifically for health
          optimization practices.
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
                e.currentTarget.style.borderColor = "rgba(0,181,164,0.3)";
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
                className="flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "rgba(0,181,164,0.15)",
                }}
              >
                <Icon size={20} color="#00B5A4" />
              </div>
              <h3
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 600,
                  fontSize: 18,
                  color: "white",
                  marginTop: 16,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.7,
                  marginTop: 8,
                }}
              >
                {body}
              </p>
              <a
                href="/features"
                className="inline-flex items-center gap-1.5"
                style={{
                  marginTop: 20,
                  color: "#00B5A4",
                  fontSize: 13,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                }}
              >
                Learn more <ChevronRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
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
      <div
        className={`mx-auto grid md:grid-cols-2 gap-12 items-center ${flip ? "" : ""}`}
        style={{ maxWidth: 1080 }}
      >
        <div className={flip ? "md:order-2" : ""}>
          <Label>{label}</Label>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              lineHeight: 1.1,
              color: "#0F1F3D",
              marginTop: 12,
              letterSpacing: "-0.02em",
            }}
          >
            {heading}
          </h2>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 16,
              color: "#64748B",
              lineHeight: 1.8,
              marginTop: 16,
            }}
          >
            {body}
          </p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckCircle2 size={18} color="#00B5A4" className="mt-0.5 flex-shrink-0" />
                <span style={{ fontFamily: FONT_BODY, fontSize: 15, color: "#0F1F3D" }}>{b}</span>
              </li>
            ))}
          </ul>
          {quote && (
            <div
              className="mt-8"
              style={{
                background: "#F0FDFA",
                borderLeft: "3px solid #00B5A4",
                borderRadius: "0 8px 8px 0",
                padding: "16px 20px",
              }}
            >
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#0F1F3D",
                  fontStyle: "italic",
                }}
              >
                "{quote.text}"
              </p>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: "#64748B", marginTop: 6 }}>
                {quote.who}
              </div>
            </div>
          )}
        </div>
        <div className={flip ? "md:order-1" : ""}>{visual}</div>
      </div>
    </section>
  );
}

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

function ChartingMock() {
  return (
    <MockFrame title="arcarx.com/admin/charts">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div style={{ fontSize: 14, fontWeight: 600, color: "#0F1F3D", fontFamily: FONT_BODY }}>
            Botox - Sarah K.
          </div>
          <span
            className="rounded px-2 py-0.5"
            style={{ background: "#F0FDFA", color: "#065F46", fontSize: 11, fontFamily: FONT_BODY, fontWeight: 500 }}
          >
            Signed
          </span>
        </div>
        <div className="flex gap-4">
          <svg viewBox="0 0 120 160" width="120" height="160">
            <ellipse cx="60" cy="80" rx="50" ry="70" fill="#FEF3C7" stroke="#E2E8F0" />
            <ellipse cx="60" cy="48" rx="20" ry="8" fill="#00B5A4" opacity="0.55" />
            <ellipse cx="40" cy="62" rx="10" ry="5" fill="#00B5A4" opacity="0.55" />
            <ellipse cx="80" cy="62" rx="10" ry="5" fill="#00B5A4" opacity="0.55" />
            <circle cx="48" cy="72" r="2" fill="#0F1F3D" />
            <circle cx="72" cy="72" r="2" fill="#0F1F3D" />
            <path d="M48 100 Q 60 108 72 100" stroke="#0F1F3D" strokeWidth="1.5" fill="none" />
          </svg>
          <div className="flex-1">
            <div className="space-y-2">
              {[
                ["Glabellar", "20 u"],
                ["Frontalis", "10 u"],
                ["Crow's feet (L)", "12 u"],
                ["Crow's feet (R)", "12 u"],
              ].map(([z, u]) => (
                <div
                  key={z}
                  className="flex justify-between rounded-md px-3 py-2"
                  style={{ background: "#F8FAFB", border: "1px solid #E2E8F0" }}
                >
                  <span style={{ fontSize: 12, color: "#0F1F3D", fontFamily: FONT_BODY, fontWeight: 500 }}>{z}</span>
                  <span style={{ fontSize: 12, color: "#00B5A4", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>{u}</span>
                </div>
              ))}
            </div>
            <div
              className="mt-3 rounded-md px-3 py-2 flex justify-between"
              style={{ background: "#0F1F3D", color: "white" }}
            >
              <span style={{ fontSize: 12, fontFamily: FONT_BODY }}>Total units</span>
              <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>54 u</span>
            </div>
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

function AnalyticsMock() {
  return (
    <MockFrame title="arcarx.com/admin/analytics">
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            ["MRR", "$48,279", "+12%"],
            ["CAC", "$184", "-8%"],
            ["LTV", "$3,420", "+18%"],
            ["ROAS", "4.2x", "+0.4"],
          ].map(([l, v, d]) => (
            <div key={l} className="rounded-md p-2.5" style={{ background: "#F8FAFB", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: FONT_BODY }}>{l}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0F1F3D", fontFamily: FONT_DISPLAY }}>{v}</div>
              <div style={{ fontSize: 10, color: "#10B981", fontFamily: FONT_BODY }}>{d}</div>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 400 100" className="w-full h-24">
          <defs>
            <linearGradient id="ga2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00B5A4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,75 L40,70 L80,72 L120,55 L160,60 L200,42 L240,38 L280,25 L320,28 L360,15 L400,10 L400,100 L0,100 Z" fill="url(#ga2)" />
          <path d="M0,75 L40,70 L80,72 L120,55 L160,60 L200,42 L240,38 L280,25 L320,28 L360,15 L400,10" stroke="#00B5A4" strokeWidth="2" fill="none" />
          <path d="M0,85 L40,82 L80,80 L120,75 L160,72 L200,65 L240,60 L280,55 L320,50 L360,45 L400,42" stroke="#0F1F3D" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        </svg>
        <div className="mt-4 space-y-2">
          {[
            ["Instagram Ads", 78],
            ["Google Search", 62],
            ["Referrals", 45],
            ["Organic", 28],
          ].map(([n, pct]) => (
            <div key={n as string}>
              <div className="flex justify-between mb-1">
                <span style={{ fontSize: 11, color: "#64748B", fontFamily: FONT_BODY }}>{n}</span>
                <span style={{ fontSize: 11, color: "#0F1F3D", fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: "#F1F4F7", borderRadius: 3 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: "#00B5A4", borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

function MultiLocationMock() {
  return (
    <MockFrame title="arcarx.com/admin/locations">
      <div className="p-5">
        <svg viewBox="0 0 400 80" className="w-full h-16 mb-3">
          <path d="M0,60 L80,50 L160,40 L240,30 L320,20 L400,10" stroke="#00B5A4" strokeWidth="2" fill="none" />
          <path d="M0,60 L80,50 L160,40 L240,30 L320,20 L400,10 L400,80 L0,80 Z" fill="rgba(0,181,164,0.1)" />
        </svg>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Austin", "$48.2K", "#00B5A4"],
            ["Dallas", "$42.7K", "#0F1F3D"],
            ["Nashville", "$36.9K", "#8B5CF6"],
          ].map(([city, rev, c]) => (
            <div
              key={city}
              className="rounded-md p-3"
              style={{ background: "#F8FAFB", border: "1px solid #E2E8F0" }}
            >
              <div className="flex items-center gap-1.5">
                <span style={{ width: 8, height: 8, borderRadius: 999, background: c as string }} />
                <span style={{ fontSize: 12, fontFamily: FONT_BODY, fontWeight: 600, color: "#0F1F3D" }}>{city}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0F1F3D", fontFamily: FONT_DISPLAY, marginTop: 6 }}>
                {rev}
              </div>
              <div style={{ fontSize: 10, color: "#10B981", fontFamily: FONT_BODY }}>This month</div>
            </div>
          ))}
        </div>
      </div>
    </MockFrame>
  );
}

const specialties = [
  { Icon: Stethoscope, bg: "#EFF6FF", iconColor: "#3B82F6", title: "Medical Spas and Aesthetics", desc: "The complete solution for aesthetic practices from booking to clinical documentation to growth analytics.", badge: "Neurotoxin face diagram" },
  { Icon: Activity, bg: "#FFF7ED", iconColor: "#F97316", title: "Hormone Optimization Clinics", desc: "Lab result tracking, subscription memberships, and virtual care for HRT and men's health practices.", badge: "Lab result trending" },
  { Icon: Beaker, bg: "#F5F3FF", iconColor: "#8B5CF6", title: "Functional Medicine", desc: "Comprehensive intake forms, elimination protocol tracking, and root cause documentation for integrative practices.", badge: "Functional intake forms" },
  { Icon: Droplets, bg: "#F0FDFA", iconColor: "#00B5A4", title: "IV Therapy Centers", desc: "Drip protocol templates, lot tracking for IV components, and real-time vital sign documentation.", badge: "Infusion tracking" },
  { Icon: Dumbbell, bg: "#F0FDF4", iconColor: "#10B981", title: "Personal Training Studios", desc: "Program delivery, performance tracking, and body composition progress through the Lucid client app.", badge: "Client progress app" },
  { Icon: Scale, bg: "#FFFBEB", iconColor: "#F59E0B", title: "Weight Loss Clinics", desc: "GLP-1 protocol tracking, weekly weigh-in scheduling, and behavioral coaching tools.", badge: "GLP-1 tracking" },
];

function Specialties() {
  return (
    <section style={{ background: "white", padding: "100px 40px" }}>
      <div className="mx-auto" style={{ maxWidth: 1080 }}>
        <Label>WHO WE SERVE</Label>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(28px, 3.5vw, 42px)",
            color: "#0F1F3D",
            marginTop: 12,
            letterSpacing: "-0.02em",
          }}
        >
          Built for every health optimization specialty.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {specialties.map((s) => (
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
              <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, color: "#0F1F3D", marginTop: 14 }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#64748B", lineHeight: 1.6, marginTop: 8 }}>
                {s.desc}
              </p>
              <span
                className="inline-block mt-4 rounded-full px-2.5 py-1"
                style={{
                  background: "#F0FDFA",
                  color: "#065F46",
                  fontSize: 11,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                }}
              >
                {s.badge}
              </span>
            </div>
          ))}
        </div>
        <p
          className="text-center mt-10"
          style={{ fontSize: 14, color: "#64748B", fontFamily: FONT_BODY }}
        >
          All specialties are served by the same platform. Features activate based on your practice
          type.{" "}
          <a href="/features" style={{ color: "#00B5A4", fontWeight: 500 }}>
            See All Features →
          </a>
        </p>
      </div>
    </section>
  );
}

const compareRows: Array<[string, 1 | 0 | 0.5, 1 | 0 | 0.5, 1 | 0 | 0.5, 1 | 0 | 0.5]> = [
  ["HIPAA-compliant EMR", 1, 0, 0, 1],
  ["Neurotoxin and filler charting", 1, 0, 0, 1],
  ["Before and after photo management", 1, 0.5, 0, 1],
  ["Telehealth video consultations", 1, 0, 0, 0],
  ["Virtual membership and protocol delivery", 1, 0, 0, 0],
  ["Full-funnel growth analytics", 1, 0, 0, 0],
  ["Predictive churn scoring", 1, 0, 0, 0],
  ["Multi-specialty support", 1, 0, 0, 0.5],
  ["Patient progress app (Lucid)", 1, 0.5, 0, 0],
  ["AI-assisted recommendations", 1, 0, 0, 0],
  ["Affiliate revenue program", 1, 0, 0, 0],
  ["HIPAA audit log", 1, 0, 0, 0.5],
];

function compareCell(v: 1 | 0 | 0.5) {
  if (v === 1) return <CheckCircle2 size={18} color="#10B981" />;
  if (v === 0) return <XCircle size={18} color="rgba(255,255,255,0.2)" />;
  return <CircleDot size={18} color="#F59E0B" />;
}

function Compare() {
  return (
    <section style={{ background: "#0F1F3D", padding: "100px 40px" }}>
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
          Finally, software built for clinical practices.
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
          See why 500+ practices switched from their previous tools to ARCA Rx.
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
                {["ARCA Rx", "Mangomint", "Vagaro", "Aesthetic Record"].map((c, i) => (
                  <th
                    key={c}
                    className="px-4 py-4 text-center"
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: i === 0 ? 14 : 13,
                      fontWeight: i === 0 ? 600 : 500,
                      color: i === 0 ? "#00B5A4" : "rgba(255,255,255,0.6)",
                      background: i === 0 ? "rgba(0,181,164,0.12)" : "transparent",
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
                  style={{
                    background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <td
                    className="px-4 py-3.5"
                    style={{ fontFamily: FONT_BODY, fontSize: 14, color: "rgba(255,255,255,0.8)" }}
                  >
                    {feat}
                  </td>
                  <td className="px-4 py-3.5 text-center" style={{ background: "rgba(0,181,164,0.04)" }}>
                    <div className="flex justify-center">{compareCell(a)}</div>
                  </td>
                  <td className="px-4 py-3.5 text-center"><div className="flex justify-center">{compareCell(b)}</div></td>
                  <td className="px-4 py-3.5 text-center"><div className="flex justify-center">{compareCell(c)}</div></td>
                  <td className="px-4 py-3.5 text-center"><div className="flex justify-center">{compareCell(d)}</div></td>
                </tr>
              ))}
              <tr style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <td className="px-4 py-3.5" style={{ fontFamily: FONT_BODY, fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>Starting price</td>
                {["$149/mo", "$165/mo", "$30/mo", "$250/mo"].map((p, i) => (
                  <td
                    key={p}
                    className="px-4 py-3.5 text-center"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      color: i === 0 ? "#00B5A4" : "rgba(255,255,255,0.6)",
                      background: i === 0 ? "rgba(0,181,164,0.04)" : "transparent",
                      fontWeight: i === 0 ? 600 : 500,
                    }}
                  >
                    {p}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p
          className="text-center mt-4"
          style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: FONT_BODY }}
        >
          Feature comparison as of June 2025. Based on publicly available information.
        </p>
        <div className="flex flex-col items-center mt-8 gap-2">
          <a
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 rounded-lg font-semibold"
            style={{ background: "white", color: "#0F1F3D", padding: "14px 28px", fontSize: 16, fontFamily: FONT_BODY }}
          >
            Start Free Trial <ArrowRight size={18} />
          </a>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: FONT_BODY }}>
            No credit card required. 14-day free trial. Cancel anytime.
          </span>
        </div>
      </div>
    </section>
  );
}

function Hipaa() {
  return (
    <section style={{ background: "#F8FAFB", padding: "100px 40px" }}>
      <div className="mx-auto grid md:grid-cols-2 gap-12 items-start" style={{ maxWidth: 1080 }}>
        <div>
          <Label>COMPLIANCE AND SECURITY</Label>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              color: "#0F1F3D",
              marginTop: 12,
              letterSpacing: "-0.02em",
            }}
          >
            HIPAA compliance built in. Not bolted on.
          </h2>
          <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: "#64748B", lineHeight: 1.8, marginTop: 16 }}>
            ARCA Rx was built from day one with HIPAA compliance as a core requirement. Every
            feature, every data flow, and every integration has been designed to protect your
            patients and your practice.
          </p>
          <ul className="mt-6 space-y-2.5">
            {[
              "Append-only HIPAA audit log (6-year retention)",
              "Role-based access control with field-level visibility",
              "Session timeout with idle detection",
              "Multi-factor authentication for all staff",
              "Business Associate Agreements with all vendors",
              "Staff training tracker with completion monitoring",
              "Breach response workflow and incident reporting",
              "Annual security assessment tools",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckCircle2 size={16} color="#00B5A4" className="mt-0.5 flex-shrink-0" />
                <span style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#0F1F3D" }}>{b}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 mt-8 flex-wrap">
            {[
              { Icon: ShieldCheck, label: "HIPAA Compliant", color: "#10B981" },
              { Icon: Shield, label: "BAA Available", color: "#00B5A4" },
              { Icon: Shield, label: "SOC 2 In Progress", color: "#94A3B8" },
            ].map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: "white", border: "1px solid #E2E8F0" }}
              >
                <b.Icon size={16} color={b.color} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 12, color: "#0F1F3D", fontWeight: 500 }}>
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <MockFrame title="arcarx.com/admin/hipaa">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div style={{ fontSize: 12, color: "#94A3B8", fontFamily: FONT_BODY }}>Compliance score</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#10B981", fontFamily: FONT_DISPLAY, lineHeight: 1 }}>
                  87
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
                  strokeDasharray={`${(87 / 100) * 201} 201`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
            </div>
            <div className="space-y-2">
              {[
                ["Audit log active", true],
                ["MFA enforced", true],
                ["BAAs on file", true],
                ["Staff training current", false],
              ].map(([l, ok]) => (
                <div
                  key={l as string}
                  className="flex items-center justify-between rounded-md px-3 py-2"
                  style={{ background: "#F8FAFB", border: "1px solid #E2E8F0" }}
                >
                  <span style={{ fontSize: 12, color: "#0F1F3D", fontFamily: FONT_BODY }}>{l}</span>
                  {ok ? <CheckCircle2 size={16} color="#10B981" /> : <AlertTriangle size={16} color="#F59E0B" />}
                </div>
              ))}
            </div>
            <div
              className="mt-3 rounded-md p-3"
              style={{ background: "#0F1F3D", color: "rgba(255,255,255,0.85)" }}
            >
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontFamily: FONT_BODY }}>RECENT AUDIT</div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
                09:42 · dr.chen viewed patient #4291
              </div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                09:38 · admin exported revenue report
              </div>
            </div>
          </div>
        </MockFrame>
      </div>
    </section>
  );
}

function Pricing() {
  const [annual, setAnnual] = useState(true);
  const prices = {
    starter: annual ? 119 : 149,
    growth: annual ? 239 : 299,
    scale: annual ? 399 : 499,
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
    const txt = opts.dark ? "white" : "#0F1F3D";
    const sub = opts.dark ? "rgba(255,255,255,0.65)" : "#64748B";
    return (
      <div
        className="relative"
        style={{
          background: opts.dark ? "#0F1F3D" : opts.featured ? "white" : "#F8FAFB",
          border: opts.featured ? "2px solid #00B5A4" : "1px solid #E2E8F0",
          borderRadius: 12,
          padding: 36,
          boxShadow: opts.featured ? "0 8px 40px rgba(0,181,164,0.15)" : "none",
        }}
      >
        {opts.featured && (
          <span
            className="absolute left-1/2 -translate-x-1/2 rounded-full font-semibold text-white"
            style={{ top: -14, background: "#00B5A4", padding: "4px 16px", fontSize: 12, fontFamily: FONT_BODY }}
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
            background: opts.cta.primary ? "#00B5A4" : opts.cta.light ? "white" : "transparent",
            color: opts.cta.primary ? "white" : opts.cta.light ? "#0F1F3D" : "#0F1F3D",
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
        <div style={{ fontSize: 13, fontFamily: FONT_BODY, fontWeight: 500, color: txt }}>
          {opts.bulletsHeader}
        </div>
        <ul className="mt-3 space-y-2.5">
          {opts.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5">
              <CheckCircle2 size={16} color={opts.dark ? "#00B5A4" : "#10B981"} className="mt-0.5 flex-shrink-0" />
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
              color: "#0F1F3D",
              marginTop: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Simple, transparent pricing. Scaled for your practice.
          </h2>
          <div
            className="inline-flex items-center mt-8"
            style={{ background: "#F1F4F7", borderRadius: 999, padding: 4 }}
          >
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
                    color: active ? "#0F1F3D" : "#64748B",
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
            base: 149,
            desc: "For practices getting started with practice management software.",
            cta: { label: "Start Free Trial" },
            bulletsHeader: "What's included",
            bullets: [
              "Online booking and scheduling",
              "Basic clinical notes",
              "Point of sale and payments",
              "Email notifications and reminders",
              "Patient portal access",
              "1 location · Up to 2 providers",
              "Up to 500 clients",
            ],
          })}
          {card({
            badge: "GROWTH",
            badgeColor: "#00B5A4",
            price: prices.growth,
            base: 299,
            desc: "For growing practices ready to scale operations and patient acquisition.",
            cta: { label: "Start Free Trial", primary: true },
            featured: true,
            bulletsHeader: "Everything in Starter, plus",
            bullets: [
              "Advanced EMR and clinical charting",
              "Inventory management with lot tracking",
              "Membership and package management",
              "Advanced analytics dashboard",
              "Referral and loyalty program",
              "Website builder included",
              "1 location · Up to 5 providers",
              "Unlimited clients",
            ],
          })}
          {card({
            badge: "SCALE",
            badgeColor: "#00B5A4",
            price: prices.scale,
            base: 499,
            desc: "For multi-location practices and ambitious high-growth operations.",
            cta: { label: "Start Free Trial", light: true },
            dark: true,
            bulletsHeader: "Everything in Growth, plus",
            bullets: [
              "Multi-location support (up to 3)",
              "Advanced EMR for all specialties",
              "Commission tracking and payroll export",
              "Custom intake forms builder",
              "API access and webhooks",
              "White-label patient portal",
              "Affiliate program access",
              "Up to 15 providers",
            ],
          })}
        </div>

        <div
          className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-xl p-7"
          style={{ background: "#F8FAFB", border: "1px solid #E2E8F0" }}
        >
          <div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 16, color: "#0F1F3D" }}>Enterprise</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: "#64748B", marginTop: 4 }}>
              Unlimited locations, providers, and clients. Dedicated AM, SLA, custom integrations,
              and SSO. For groups and franchise operators.
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href="/demo"
              className="rounded-md font-medium text-white"
              style={{ background: "#0F1F3D", padding: "10px 20px", fontSize: 14, fontFamily: FONT_BODY }}
            >
              Contact Sales
            </a>
            <a
              href="/demo"
              className="rounded-md font-medium"
              style={{ border: "1.5px solid #E2E8F0", color: "#0F1F3D", padding: "10px 20px", fontSize: 14, fontFamily: FONT_BODY }}
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
  ["What counts as a provider?", "Any staff member who renders billable services or signs clinical charts."],
  ["Is there a setup fee?", "No. Onboarding, data import, and live training are included."],
  ["What happens after my trial ends?", "Choose a plan to continue. Your data stays intact. No charges if you don't pick one."],
  ["Do you offer discounts for annual billing?", "Yes. Pay annually and save 20% across every plan."],
] as const;

function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-16 max-w-2xl mx-auto">
      <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, color: "#0F1F3D", textAlign: "center" }}>
        Common questions about pricing
      </h3>
      <div className="mt-6 space-y-2">
        {faq.map(([q, a], i) => (
          <div key={q} style={{ background: "#F8FAFB", border: "1px solid #E2E8F0", borderRadius: 8 }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center text-left px-5 py-4"
            >
              <span style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 15, color: "#0F1F3D" }}>{q}</span>
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
            color: "#0F1F3D",
            marginTop: 12,
            letterSpacing: "-0.02em",
          }}
        >
          Practices that replaced everything with ARCA Rx.
        </h2>

        <div
          className="grid md:grid-cols-2 gap-12 mt-12 p-10 rounded-2xl"
          style={{ background: "white", border: "1px solid #E2E8F0" }}
        >
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY, textTransform: "uppercase", letterSpacing: "0.08em" }}>Before</div>
                {[
                  ["Revenue", "$100K/mo"],
                  ["Tools", "5 separate"],
                  ["Marketing", "Blind"],
                  ["HIPAA", "Incomplete"],
                ].map(([k, v]) => (
                  <div key={k} className="mt-3">
                    <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY }}>{k}</div>
                    <div style={{ fontSize: 18, fontFamily: FONT_DISPLAY, fontWeight: 600, color: "#94A3B8" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#00B5A4", fontFamily: FONT_BODY, textTransform: "uppercase", letterSpacing: "0.08em" }}>After</div>
                {[
                  ["Revenue", "$284K/mo"],
                  ["Tools", "ARCA Rx"],
                  ["Marketing", "Full funnel"],
                  ["HIPAA", "Compliant"],
                ].map(([k, v]) => (
                  <div key={k} className="mt-3">
                    <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: FONT_BODY }}>{k}</div>
                    <div style={{ fontSize: 18, fontFamily: FONT_DISPLAY, fontWeight: 700, color: "#00B5A4" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 20, color: "#0F1F3D" }}>
                Spruce Micro
              </span>
              <span
                className="rounded px-2 py-0.5"
                style={{ background: "#F0FDFA", color: "#065F46", fontSize: 11, fontFamily: FONT_BODY, fontWeight: 500 }}
              >
                Med Spa · Austin, TX
              </span>
            </div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 17, color: "#0F1F3D", lineHeight: 1.7, fontStyle: "italic" }}>
              "ARCA Rx didn't just replace our software - it replaced our consultants, our
              marketing agency dashboards, and our HIPAA officer's spreadsheet. We grew revenue
              2.8x in eleven months and finally know which ad spend actually returns."
            </p>
            <div className="flex items-center gap-3 mt-5">
              <div
                className="rounded-full flex items-center justify-center text-white font-semibold"
                style={{ width: 48, height: 48, background: "#0F1F3D", fontFamily: FONT_DISPLAY }}
              >
                JM
              </div>
              <div>
                <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: "#0F1F3D" }}>
                  Jenna Marquez, Owner
                </div>
                <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: "#64748B" }}>Spruce Micro</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {[
            {
              quote: "The face diagram alone saves me five minutes per patient. Charting feels like it was built next to me, not in some boardroom.",
              name: "Dr. Sarah Chen",
              practice: "Apex Aesthetics",
              tag: "Med Spa",
            },
            {
              quote: "We unified scheduling, labs, telehealth, and memberships in two weeks. Patients are renewing at 91%. Unreal.",
              name: "Dr. Mark Davis",
              practice: "Vital North HRT",
              tag: "HRT Clinic",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-xl p-7"
              style={{ background: "white", border: "1px solid #E2E8F0" }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: "#0F1F3D", lineHeight: 1.7, marginTop: 14, fontStyle: "italic" }}>
                "{t.quote}"
              </p>
              <div className="flex items-center justify-between mt-5">
                <div>
                  <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: "#0F1F3D" }}>{t.name}</div>
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

function Affiliate() {
  return (
    <section style={{ background: "white", padding: "100px 40px" }}>
      <div
        className="mx-auto rounded-2xl text-center"
        style={{
          maxWidth: 860,
          padding: 64,
          background: "linear-gradient(135deg, #00B5A4 0%, #0F1F3D 100%)",
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
          Refer a practice. Earn forever.
        </h2>
        <p
          className="mx-auto"
          style={{
            fontFamily: FONT_BODY,
            fontSize: 18,
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.7,
            marginTop: 16,
            maxWidth: 560,
          }}
        >
          Earn 15% of every referred practice's monthly subscription for as long as they stay on
          ARCA Rx. The more you refer, the higher your tier.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mt-8">
          {[
            ["Tier 1", "1–3 practices", "15%"],
            ["Tier 2", "4–10 practices", "20%"],
            ["Tier 3", "11+ practices", "25%"],
          ].map(([t, r, p]) => (
            <div
              key={t}
              className="rounded-xl p-5 text-center"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 14, color: "white" }}>{t}</div>
              <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{r}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 28, color: "#00B5A4", marginTop: 6 }}>
                {p}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: "rgba(255,255,255,0.7)", marginTop: 24 }}>
          10 referred practices × $299/mo average = <span style={{ color: "white", fontWeight: 600 }}>$597/month passive income</span>.
        </p>

        <a
          href="/partners"
          className="inline-flex items-center gap-2 rounded-lg font-semibold mt-7"
          style={{ background: "white", color: "#00B5A4", padding: "14px 28px", fontSize: 15, fontFamily: FONT_BODY }}
        >
          Learn About the Partner Program <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden text-center"
      style={{ background: "#0F1F3D", padding: "100px 40px" }}
    >
      <svg
        className="absolute inset-0 m-auto pointer-events-none"
        width="800"
        height="600"
        viewBox="0 0 26 22"
        style={{ opacity: 1 }}
      >
        <path d="M2 19 C 4 6, 14 2, 24 7" stroke="rgba(0,181,164,0.08)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
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
          Your practice deserves
          <br />
          better software.
        </h2>
        <p
          className="mx-auto"
          style={{
            fontFamily: FONT_BODY,
            fontSize: 20,
            color: "rgba(255,255,255,0.65)",
            marginTop: 20,
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          Join 500+ health optimization practices that replaced their disconnected tools with
          ARCA Rx.
        </p>
        <div className="flex flex-wrap justify-center gap-3" style={{ marginTop: 40 }}>
          <a
            href="/admin/dashboard"
            className="rounded-lg font-semibold"
            style={{ background: "white", color: "#0F1F3D", padding: "16px 32px", fontSize: 16, fontFamily: FONT_BODY }}
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
          {["14-day free trial", "No credit card required", "HIPAA compliant", "Cancel anytime", "Setup in 30 minutes"].map((t) => (
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

function HomePage() {
  // Entering the app from the Rx marketing site lands you in the Rx product.
  useEffect(() => setProductMode("rx"), []);
  return (
    <div style={{ background: "white" }}>
      <Nav />
      <Hero />
      <SocialProof />
      <Problem />
      <Solution />
      <DeepDive
        bg="white"
        label="CLINICAL EXCELLENCE"
        heading="Built for aesthetic medicine. Not hair salons."
        body="ARCA Rx includes the only EMR built specifically for the procedures you perform. A neurotoxin face diagram lets you click treatment zones and record units directly on the illustration. Filler area mapping. Laser settings documentation. Chemical peel charting. All with HIPAA-compliant audit logging on every access."
        bullets={[
          "Neurotoxin face diagram with zone-by-zone unit tracking",
          "Filler area mapping with product and technique documentation",
          "Service-specific structured fields for every treatment type",
          "Photo documentation with standardized angle guides",
          "E-signature consent forms with HIPAA compliance",
          "Chart signing, locking, and addendum system",
        ]}
        quote={{
          text: "I have never seen software built specifically for what I do. The face diagram alone saves me 5 minutes per patient.",
          who: "Dr. Sarah Chen, Medical Director, Apex Aesthetics",
        }}
        visual={<ChartingMock />}
      />
      <DeepDive
        bg="#F8FAFB"
        label="GROWTH INTELLIGENCE"
        heading="Know exactly what is working. And what is not."
        body="No other practice management software shows you the full picture from ad impression to closed ticket. ARCA Rx connects your Meta ads, Google campaigns, email sequences, and organic channels to actual patient bookings and revenue. See your real CAC, real ROAS, and real LTV for the first time."
        bullets={[
          "Full-funnel attribution from first ad click to closed ticket",
          "Predictive churn scoring for every active member",
          "Cohort retention analysis showing member lifetime value",
          "AI-generated weekly insights identifying your biggest opportunities",
          "Revenue forecasting with scenario modeling",
          "Provider performance scoring with six key metrics",
        ]}
        visual={<AnalyticsMock />}
        flip
      />
      <DeepDive
        bg="white"
        label="BUILT TO SCALE"
        heading="One platform. Multiple locations. Unlimited growth."
        body="ARCA Rx grows with your practice. Start with one location. Add more as you expand. Manage a group of practices under one account. Each location has its own inventory, scheduling, and reporting while you see the consolidated picture at the group level."
        bullets={[
          "Multi-location management with consolidated reporting",
          "Sub-account system for franchise and group operations",
          "Per-location inventory with transfer workflows",
          "Location-specific pricing overrides",
          "Staff management across all locations",
          "A super-admin console for group operators",
        ]}
        visual={<MultiLocationMock />}
      />
      <Specialties />
      <Compare />
      <Hipaa />
      <Pricing />
      <Customers />
      <Affiliate />
      <FinalCTA />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
