import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export function FloatingCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="/admin/dashboard"
      className="fixed z-[90] inline-flex items-center gap-2 rounded-lg text-white font-semibold transition-all"
      style={{
        bottom: 24,
        right: 24,
        background: "#00B5A4",
        padding: "12px 20px",
        fontSize: 14,
        boxShadow: "0 4px 16px rgba(0,181,164,0.35)",
        fontFamily: "Inter, sans-serif",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      Start Free Trial <ArrowRight size={16} />
    </a>
  );
}
