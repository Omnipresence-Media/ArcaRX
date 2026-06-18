import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

export function StubPage({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ background: "white", minHeight: "100vh" }}>
      <Nav />
      <section style={{ padding: "160px 40px 120px" }}>
        <div className="mx-auto text-center" style={{ maxWidth: 720 }}>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(36px, 5vw, 56px)",
              color: "#0F1F3D",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 18,
              color: "#64748B",
              marginTop: 20,
              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </p>
          <a
            href="/admin/dashboard"
            className="inline-block mt-8 rounded-lg text-white font-semibold"
            style={{ background: "#00B5A4", padding: "14px 28px", fontFamily: "Inter, sans-serif" }}
          >
            Start Free Trial
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
