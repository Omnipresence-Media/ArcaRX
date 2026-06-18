import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo, type Product } from "./Logo";
import { ProductToggle } from "./ProductToggle";
import { ThemeToggle } from "./ThemeToggle";

type NavLink = { label: string; to: string; isNew?: boolean };

const linksByProduct: Record<Product, NavLink[]> = {
  rx: [
    { label: "Features", to: "/features", isNew: true },
    { label: "Pricing", to: "/pricing" },
    { label: "Security", to: "/security" },
    { label: "Customers", to: "/customers" },
    { label: "Blog", to: "/blog" },
    { label: "About", to: "/about" },
  ],
  pro: [
    { label: "Features", to: "/features" },
    { label: "Pricing", to: "/pricing" },
    { label: "Industries", to: "/customers" },
    { label: "Blog", to: "/blog" },
    { label: "About", to: "/about" },
  ],

};

export function Nav({ product = "rx" }: { product?: Product }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = linksByProduct[product];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(226,232,240,0.8)" : "1px solid transparent",
        }}
      >
        <div
          className="mx-auto flex h-16 items-center justify-between"
          style={{ maxWidth: 1400, padding: "0 40px" }}
        >
          <div className="flex items-center">
            <Logo product={product} />
            <ProductToggle active={product} />
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[14px] font-medium transition-colors"
                style={{ color: "#64748B", fontFamily: "Inter, sans-serif" }}
                activeProps={{ style: { color: "#0F1F3D", background: "#F1F4F7" } }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#0F1F3D";
                  e.currentTarget.style.background = "#F1F4F7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#64748B";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {l.label}
                {l.isNew && (
                  <span
                    className="rounded px-1.5 py-px font-medium"
                    style={{
                      background: "#F0FDFA",
                      color: "#065F46",
                      border: "1px solid #A7F3D0",
                      fontSize: 10,
                      letterSpacing: "0.04em",
                    }}
                  >
                    HIPAA v2
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="/admin/dashboard"
              className="hidden md:inline-flex text-[14px] font-medium transition-colors"
              style={{ color: "#64748B", fontFamily: "Inter, sans-serif" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0F1F3D")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
            >
              Log In
            </a>
            <a
              href="/admin/dashboard"
              className="inline-flex items-center rounded-md text-[14px] font-medium text-white transition-all"
              style={{
                background: "#0F1F3D",
                padding: "9px 20px",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1a3260";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,31,61,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0F1F3D";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Start Free Trial
            </a>
            <button
              className="md:hidden inline-flex items-center justify-center p-2"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} color="#64748B" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[200] bg-white animate-fade-in">
          <div className="flex items-center justify-between h-16 px-6 border-b" style={{ borderColor: "#F1F4F7" }}>
            <div className="flex items-center">
              <Logo product={product} />
              <ProductToggle active={product} />
            </div>
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2">
              <X size={22} color="#64748B" />
            </button>
          </div>
          <div className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-6 py-4 border-b text-[18px] font-semibold"
                style={{ color: "#0F1F3D", borderColor: "#F1F4F7", fontFamily: "Inter, sans-serif" }}
              >
                {l.label}
              </Link>
            ))}
            <div className="p-6">
              <a
                href="/admin/dashboard"
                className="block w-full text-center rounded-md text-white font-semibold py-3"
                style={{ background: "#00B5A4", fontFamily: "Inter, sans-serif" }}
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
