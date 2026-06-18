import { Link } from "@tanstack/react-router";
import { ArrowRight, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import { Logo } from "./Logo";

const cols = [
  {
    head: "PRODUCT",
    links: [
      ["Features", "/features"],
      ["Pricing", "/pricing"],
      ["Compare", "/compare/mangomint"],
      ["Changelog", "/blog"],
      ["Roadmap", "/blog"],
      ["Security", "/features"],
      ["API Docs", "/features"],
    ],
  },
  {
    head: "COMPANY",
    links: [
      ["About", "/customers"],
      ["Customers", "/customers"],
      ["Blog", "/blog"],
      ["Careers", "/customers", "Hiring"],
      ["Press", "/customers"],
      ["Partners", "/partners"],
      ["Contact", "/demo"],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer style={{ background: "#0A1829", padding: "64px 40px 32px" }}>
      <div className="mx-auto" style={{ maxWidth: 1280 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Logo light />
            <p
              className="mt-4"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 14,
                lineHeight: 1.7,
                maxWidth: 240,
                fontFamily: "Inter, sans-serif",
              }}
            >
              The complete operating system for health optimization practices. HIPAA
              compliant. Built for the modern wellness economy.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Linkedin, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="transition-colors"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.head}>
              <div
                className="font-medium uppercase mb-4"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {c.head}
              </div>
              <ul className="space-y-2.5">
                {c.links.map(([label, to, badge]) => (
                  <li key={label}>
                    <Link
                      to={to as string}
                      className="inline-flex items-center gap-2 transition-colors"
                      style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 14,
                        fontFamily: "Inter, sans-serif",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    >
                      {label}
                      {badge && (
                        <span
                          className="rounded px-1.5 py-px font-medium"
                          style={{
                            background: "rgba(0,181,164,0.18)",
                            color: "#00B5A4",
                            fontSize: 10,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div
              className="font-medium uppercase mb-4"
              style={{
                fontSize: 12,
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              STAY UPDATED
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 14,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Product updates and practice growth insights.
            </p>
            <form
              className="flex mt-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@practice.com"
                className="flex-1 px-3.5 py-2.5 text-[14px] outline-none"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "6px 0 0 6px",
                  color: "white",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="px-3.5 py-2.5 flex items-center justify-center"
                style={{
                  background: "#00B5A4",
                  borderRadius: "0 6px 6px 0",
                  color: "white",
                }}
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        <div
          className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
            © 2025 ARCA Health Inc. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {["Privacy Policy", "Terms of Service", "HIPAA Notice", "Cookie Settings"].map((p, i) => (
              <span key={p} className="flex items-center gap-4">
                <a
                  href="#"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {p}
                </a>
                {i < 3 && (
                  <span style={{ width: 3, height: 3, borderRadius: 999, background: "rgba(255,255,255,0.2)" }} />
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
