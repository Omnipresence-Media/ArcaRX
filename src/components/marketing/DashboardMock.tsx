import { TrendingUp, Calendar, Users, AlertTriangle } from "lucide-react";

const stats = [
  { label: "Today's Revenue", value: "$4,280", delta: "+12.4%", icon: TrendingUp, color: "#10B981" },
  { label: "Appointments Today", value: "14", delta: "3 pending", icon: Calendar, color: "#00B5A4" },
  { label: "Active Members", value: "847", delta: "+23 this wk", icon: Users, color: "#0F1F3D" },
  { label: "Action Required", value: "5", delta: "review now", icon: AlertTriangle, color: "#F59E0B" },
];

const schedule = [
  { t: "9:00", name: "Sarah K.", svc: "Botox follow-up", color: "#00B5A4" },
  { t: "10:30", name: "Mark D.", svc: "HRT consultation", color: "#0F1F3D" },
  { t: "1:00", name: "Olivia R.", svc: "Filler — lips", color: "#8B5CF6" },
  { t: "3:30", name: "James T.", svc: "IV drip — Myers", color: "#F59E0B" },
];

// Spark area path (precomputed)
const areaPath =
  "M0,60 L40,52 L80,55 L120,40 L160,42 L200,30 L240,28 L280,18 L320,22 L360,12 L400,8 L400,80 L0,80 Z";
const linePath =
  "M0,60 L40,52 L80,55 L120,40 L160,42 L200,30 L240,28 L280,18 L320,22 L360,12 L400,8";

export function DashboardMock() {
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: 16,
        border: "1px solid #E2E8F0",
        boxShadow:
          "0 0 0 1px #E2E8F0, 0 32px 80px rgba(15,31,61,0.20), 0 0 120px rgba(0,181,164,0.08)",
        background: "white",
      }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center px-4 py-3"
        style={{ background: "#F8FAFB", borderBottom: "1px solid #E2E8F0" }}
      >
        <div className="flex gap-1.5">
          <span className="block rounded-full" style={{ width: 10, height: 10, background: "#FF5F57" }} />
          <span className="block rounded-full" style={{ width: 10, height: 10, background: "#FEBC2E" }} />
          <span className="block rounded-full" style={{ width: 10, height: 10, background: "#28C840" }} />
        </div>
        <div
          className="flex-1 text-center"
          style={{ fontSize: 12, color: "#94A3B8", fontFamily: "Inter, sans-serif" }}
        >
          arcarx.com/admin/dashboard
        </div>
      </div>

      <div className="flex" style={{ minHeight: 480 }}>
        {/* Sidebar */}
        <div
          className="hidden sm:block"
          style={{ width: 200, background: "#0F1F3D", padding: 20, color: "white" }}
        >
          <div className="flex items-center gap-1.5 mb-6">
            <svg width="20" height="16" viewBox="0 0 26 22"><path d="M2 19 C 4 6, 14 2, 24 7" stroke="#00B5A4" strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14 }}>
              ARCA<sup style={{ color: "#00B5A4", fontSize: 9 }}>Rx</sup>
            </span>
          </div>
          {["Dashboard", "Calendar", "Patients", "Charts", "POS", "Inventory", "Analytics", "Settings"].map(
            (n, i) => (
              <div
                key={n}
                className="rounded-md px-2.5 py-2 mb-1"
                style={{
                  background: i === 0 ? "rgba(0,181,164,0.15)" : "transparent",
                  color: i === 0 ? "#00B5A4" : "rgba(255,255,255,0.65)",
                  fontSize: 12.5,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: i === 0 ? 600 : 500,
                }}
              >
                {n}
              </div>
            ),
          )}
        </div>

        {/* Main */}
        <div className="flex-1" style={{ padding: 24, background: "#F8FAFB" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0F1F3D", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Command Center
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
                Apex Aesthetics — Austin
              </div>
            </div>
            <div
              className="rounded-md px-3 py-1.5"
              style={{ background: "white", border: "1px solid #E2E8F0", fontSize: 12, color: "#64748B", fontFamily: "Inter, sans-serif" }}
            >
              ⌘K Search
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg p-3.5"
                style={{ background: "white", border: "1px solid #E2E8F0" }}
              >
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                    {s.label}
                  </div>
                  <s.icon size={14} color={s.color} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#0F1F3D", marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: s.color, marginTop: 2, fontFamily: "Inter, sans-serif" }}>
                  {s.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Chart + schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div
              className="rounded-lg p-4 lg:col-span-2"
              style={{ background: "white", border: "1px solid #E2E8F0" }}
            >
              <div className="flex justify-between mb-3">
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D", fontFamily: "Inter, sans-serif" }}>
                  30-day Revenue
                </div>
                <div style={{ fontSize: 11, color: "#10B981", fontFamily: "Inter, sans-serif" }}>+18.2% vs last mo</div>
              </div>
              <svg viewBox="0 0 400 80" className="w-full h-24">
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00B5A4" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#00B5A4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#ga)" />
                <path d={linePath} fill="none" stroke="#00B5A4" strokeWidth="2" />
              </svg>
            </div>
            <div
              className="rounded-lg p-4"
              style={{ background: "white", border: "1px solid #E2E8F0" }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D", marginBottom: 10, fontFamily: "Inter, sans-serif" }}>
                Today's Schedule
              </div>
              {schedule.map((s) => (
                <div key={s.t} className="flex items-start gap-2.5 py-1.5">
                  <span
                    style={{
                      width: 3,
                      height: 28,
                      borderRadius: 2,
                      background: s.color,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                  <div className="flex-1">
                    <div style={{ fontSize: 12, color: "#0F1F3D", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                      {s.t} · {s.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", fontFamily: "Inter, sans-serif" }}>{s.svc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
