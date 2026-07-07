import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X, ChevronLeft, ChevronRight, Check,
  Video, MapPin, Clock, User, Calendar,
  Syringe, Heart, Zap, Droplets, Activity, Sparkles,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: "hrt-consult",   label: "HRT Consultation",         duration: "45 min", icon: Heart,    category: "Clinical",   description: "Initial or follow-up hormone therapy evaluation with lab review." },
  { id: "hrt-follow",    label: "HRT Follow-up",            duration: "20 min", icon: Heart,    category: "Clinical",   description: "Quick check-in to review symptoms and adjust protocol." },
  { id: "glp1-consult",  label: "GLP-1 Consultation",       duration: "30 min", icon: Activity, category: "Clinical",   description: "Semaglutide or tirzepatide evaluation and protocol setup." },
  { id: "botox",         label: "Botox / Dysport",          duration: "30 min", icon: Sparkles, category: "Aesthetics", description: "Neurotoxin treatment for lines and wrinkles." },
  { id: "filler",        label: "Dermal Filler",            duration: "45 min", icon: Droplets, category: "Aesthetics", description: "Lip, cheek, jawline, or undereye volume restoration." },
  { id: "morpheus",      label: "Morpheus8",                duration: "60 min", icon: Zap,      category: "Aesthetics", description: "RF microneedling for skin tightening and contouring." },
  { id: "iv-therapy",   label: "IV Therapy",               duration: "45 min", icon: Syringe,  category: "Wellness",   description: "Custom nutrient IV drip - hydration, NAD+, Myers cocktail, and more." },
  { id: "lab-draw",      label: "Lab Draw + Vitals",        duration: "20 min", icon: Activity, category: "Clinical",   description: "In-clinic blood draw and biometric check-in." },
];

const PROVIDERS = [
  { id: "chen",      name: "Dr. Lena Chen",    role: "Medical Director",        modalities: ["video", "in-person"] as const },
  { id: "patel",     name: "Dr. Anika Patel",  role: "HRT Specialist",          modalities: ["video", "in-person"] as const },
  { id: "reeves",    name: "J. Reeves, NP",    role: "Nurse Practitioner",      modalities: ["video", "in-person"] as const },
  { id: "kim",       name: "RN Marcus Kim",    role: "Clinical RN",             modalities: ["in-person"] as const },
  { id: "whitfield", name: "S. Whitfield, PA", role: "Aesthetic PA",            modalities: ["in-person"] as const },
];

const MODALITY_LABELS = { video: "Telehealth", "in-person": "In-person" } as const;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];

const TIME_SLOTS = [
  "8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","1:00 PM","1:30 PM","2:00 PM","2:30 PM",
  "3:00 PM","3:30 PM","4:00 PM","4:30 PM",
];

type MonthKey = `${number}-${number}`;
const UNAVAILABLE_BY_MONTH: Record<MonthKey, number[]> = {
  "2026-6": [2, 3, 9, 14, 20, 21, 27],
  "2026-7": [4, 5, 12, 19, 26],
  "2026-8": [1, 8, 15, 22, 29],
};
const BUSY_SLOTS_BY_MONTH: Record<MonthKey, Record<number, string[]>> = {
  "2026-6": { 5: ["9:00 AM","10:00 AM","2:00 PM"], 7: ["8:00 AM","11:00 AM","3:30 PM"], 18: ["8:30 AM","10:30 AM","2:30 PM"] },
  "2026-7": { 7: ["9:30 AM","1:00 PM","4:00 PM"], 14: ["8:00 AM","2:30 PM"], 21: ["9:00 AM","3:00 PM"] },
  "2026-8": { 5: ["10:00 AM","3:30 PM"], 12: ["9:00 AM","1:30 PM"] },
};
function getUnavailable(year: number, month: number): Set<number> {
  return new Set(UNAVAILABLE_BY_MONTH[`${year}-${month}` as MonthKey] ?? []);
}
function getBusySlots(year: number, month: number): Record<number, string[]> {
  return BUSY_SLOTS_BY_MONTH[`${year}-${month}` as MonthKey] ?? {};
}

type Step = "service" | "provider" | "datetime" | "confirm" | "done";
type Modality = "video" | "in-person";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
  const steps: Step[] = ["service", "provider", "datetime", "confirm"];
  const labels = ["Service", "Provider", "Date & Time", "Confirm"];
  const current = steps.indexOf(step);
  return (
    <div className="flex items-center gap-0 px-6 py-4 border-b">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
            i < current ? "bg-[color:var(--teal)] text-white" :
            i === current ? "border-2 border-[color:var(--teal)] text-[color:var(--teal)]" :
            "border border-border text-muted-foreground"
          }`}>
            {i < current ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </div>
          <span className={`ml-1.5 text-[11px] font-medium ${i === current ? "text-foreground" : "text-muted-foreground"}`}>
            {labels[i]}
          </span>
          {i < steps.length - 1 && <div className={`mx-3 h-px w-6 ${i < current ? "bg-[color:var(--teal)]" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function ServiceStep({ onSelect }: { onSelect: (id: string) => void }) {
  const categories = ["Clinical", "Aesthetics", "Wellness"];
  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">What would you like to book?</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Select a service to get started.</p>
      </div>
      {categories.map(cat => {
        const items = SERVICES.filter(s => s.category === cat);
        return (
          <div key={cat}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{cat}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map(svc => {
                const Icon = svc.icon;
                return (
                  <button key={svc.id} onClick={() => onSelect(svc.id)}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card/60 p-3.5 text-left hover:border-[color:var(--teal)]/50 hover:bg-[color:var(--teal)]/5 transition-colors group">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-card group-hover:border-[color:var(--teal)]/30">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-[color:var(--teal)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{svc.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{svc.description}</p>
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />{svc.duration}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProviderStep({
  service, modality, setModality, onSelect, onBack,
}: {
  service: typeof SERVICES[0];
  modality: Modality;
  setModality: (m: Modality) => void;
  onSelect: (id: string) => void;
  onBack: () => void;
}) {
  const eligible = PROVIDERS.filter(p => (p.modalities as readonly string[]).includes(modality));
  return (
    <div className="p-6 space-y-5">
      <div>
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3">
          <ChevronLeft className="h-3.5 w-3.5" />Back
        </button>
        <h2 className="text-lg font-semibold">Choose a provider</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{service.label} · {service.duration}</p>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Visit type</p>
        <div className="flex gap-2">
          {(["video", "in-person"] as Modality[]).map(m => (
            <button key={m} onClick={() => setModality(m)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors ${
                modality === m ? "border-[color:var(--teal)] bg-[color:var(--teal)]/10 text-[color:var(--teal)]" : "border-border text-muted-foreground hover:text-foreground"
              }`}>
              {m === "video" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              {MODALITY_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {eligible.map(p => (
          <button key={p.id} onClick={() => onSelect(p.id)}
            className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3.5 text-left hover:border-[color:var(--teal)]/50 hover:bg-[color:var(--teal)]/5 transition-colors group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-[11px] text-muted-foreground">{p.role}</p>
              <div className="mt-1 flex gap-1">
                {p.modalities.map(m => (
                  <Badge key={m} variant="outline" className="text-[10px] px-1.5 py-0">
                    {MODALITY_LABELS[m]}
                  </Badge>
                ))}
              </div>
            </div>
          </button>
        ))}
        <button onClick={() => onSelect("any")}
          className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-card/30 p-3.5 text-left hover:border-[color:var(--teal)]/40 transition-colors">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">No preference</p>
            <p className="text-[11px] text-muted-foreground">First available provider</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function DateTimeStep({
  service, provider, modality, onSelect, onBack,
}: {
  service: typeof SERVICES[0];
  provider: typeof PROVIDERS[0] | null;
  modality: Modality;
  onSelect: (date: string, time: string) => void;
  onBack: () => void;
}) {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const today = new Date();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const todayDay = today.getDate();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const unavailable = getUnavailable(year, month);
  const busySlots = getBusySlots(year, month);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelectedDay(null); setSelectedTime(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelectedDay(null); setSelectedTime(null);
  }

  const availableSlots = selectedDay
    ? TIME_SLOTS.filter(t => !(busySlots[selectedDay] ?? []).includes(t))
    : [];

  const dateLabel = selectedDay
    ? `${MONTH_NAMES[month]} ${selectedDay}, ${year}`
    : null;

  function confirm() {
    if (selectedDay && selectedTime) {
      onSelect(`${MONTH_NAMES[month]} ${selectedDay}, ${year}`, selectedTime);
    }
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3">
          <ChevronLeft className="h-3.5 w-3.5" />Back
        </button>
        <h2 className="text-lg font-semibold">Pick a date & time</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {service.label} · {provider?.name ?? "First available"} · {MODALITY_LABELS[modality]}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_1fr]">
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-muted transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-semibold">{MONTH_NAMES[month]} {year}</p>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-muted transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DAY_NAMES.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isPast = isCurrentMonth && day < todayDay;
              const isUnavail = unavailable.has(day);
              const isWeekend = new Date(year, month, day).getDay() % 6 === 0;
              const disabled = isPast || isUnavail || isWeekend;
              const isSelected = selectedDay === day;
              return (
                <button key={day} disabled={disabled} onClick={() => { setSelectedDay(day); setSelectedTime(null); }}
                  className={`aspect-square rounded text-xs font-medium transition-colors ${
                    disabled ? "text-muted-foreground/30 cursor-not-allowed" :
                    isSelected ? "bg-[color:var(--teal)] text-white" :
                    "hover:bg-muted text-foreground"
                  }`}>
                  {day}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Weekends and grayed dates unavailable</p>
        </div>

        {/* Time slots */}
        <div>
          {selectedDay ? (
            <>
              <p className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">{dateLabel}</p>
              <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1">
                {availableSlots.length === 0 ? (
                  <p className="col-span-2 text-sm text-muted-foreground py-4 text-center">No availability this day</p>
                ) : availableSlots.map(t => (
                  <button key={t} onClick={() => setSelectedTime(t)}
                    className={`rounded-md border py-2 text-xs font-medium transition-colors ${
                      selectedTime === t
                        ? "border-[color:var(--teal)] bg-[color:var(--teal)]/10 text-[color:var(--teal)]"
                        : "border-border hover:border-[color:var(--teal)]/40 hover:bg-muted"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Select a date to see availability</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button disabled={!selectedDay || !selectedTime} onClick={confirm}
          className="gradient-brand text-white h-9 text-sm">
          Continue
        </Button>
      </div>
    </div>
  );
}

function ConfirmStep({
  service, provider, modality, date, time, onConfirm, onBack, loading,
}: {
  service: typeof SERVICES[0];
  provider: typeof PROVIDERS[0] | null;
  modality: Modality;
  date: string;
  time: string;
  onConfirm: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  return (
    <div className="p-6 space-y-5">
      <div>
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-3">
          <ChevronLeft className="h-3.5 w-3.5" />Back
        </button>
        <h2 className="text-lg font-semibold">Confirm your appointment</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Review the details below before booking.</p>
      </div>

      <div className="rounded-xl border bg-card/60 divide-y divide-border overflow-hidden">
        {[
          { label: "Service",   value: service.label, sub: service.duration },
          { label: "Provider",  value: provider?.name ?? "First available", sub: provider?.role },
          { label: "Visit type",value: MODALITY_LABELS[modality], sub: modality === "video" ? "Telehealth link sent via email" : "Austin Flagship · 123 Main St" },
          { label: "Date",      value: date },
          { label: "Time",      value: time },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between px-4 py-3">
            <p className="text-xs text-muted-foreground">{row.label}</p>
            <div className="text-right">
              <p className="text-sm font-medium">{row.value}</p>
              {row.sub && <p className="text-[11px] text-muted-foreground">{row.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-400">
        A confirmation + intake link will be sent to your email. You can cancel or reschedule up to 24 hours before your appointment.
      </div>

      <Button onClick={onConfirm} disabled={loading}
        className="w-full gradient-brand text-white h-10 text-sm font-semibold">
        {loading ? "Booking..." : "Confirm appointment"}
      </Button>
    </div>
  );
}

function DoneStep({ service, date, time, modality, onClose }: {
  service: typeof SERVICES[0]; date: string; time: string; modality: Modality; onClose: () => void;
}) {
  return (
    <div className="p-8 flex flex-col items-center text-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--teal)]/15">
        <Check className="h-8 w-8 text-[color:var(--teal)]" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">You're booked!</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {service.label} on {date} at {time}
        </p>
        {modality === "video" && (
          <p className="text-xs text-muted-foreground mt-1">A telehealth link will be emailed to you before your visit.</p>
        )}
      </div>
      <div className="w-full rounded-xl border bg-card/60 divide-y divide-border overflow-hidden text-left">
        <div className="flex items-center gap-3 px-4 py-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">{date} · {time}</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          {modality === "video" ? <Video className="h-4 w-4 text-muted-foreground" /> : <MapPin className="h-4 w-4 text-muted-foreground" />}
          <p className="text-sm">{modality === "video" ? "Telehealth - link sent via email" : "Austin Flagship · 123 Main St"}</p>
        </div>
      </div>
      <Button onClick={onClose} className="w-full gradient-brand text-white h-10 text-sm font-semibold">
        Done
      </Button>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export type BookingResult = {
  type: string;
  dateLabel: string;
  time: string;
  modality: Modality;
  provider: string;
  location: string;
};

export function BookingModal({
  onClose,
  onBooked,
  title = "Book an appointment",
}: {
  onClose: () => void;
  onBooked?: (result: BookingResult) => void;
  title?: string;
}) {
  const [step, setStep] = useState<Step>("service");
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [modality, setModality] = useState<Modality>("video");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const service = SERVICES.find(s => s.id === serviceId) ?? null;
  const provider = PROVIDERS.find(p => p.id === providerId) ?? null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleConfirm() {
    setLoading(true);
    try {
      await supabase.from("appointments").insert({
        patient_id: "demo-patient",
        provider_id: providerId,
        location_id: "loc-atx",
        date,
        time,
        duration: 30,
        type: service?.label ?? "Appointment",
        status: "scheduled",
        is_virtual: modality === "video",
      });
    } catch {
      // non-blocking - proceed to done even if DB insert fails
    } finally {
      setLoading(false);
      onBooked?.({
        type: service?.label ?? "Appointment",
        dateLabel: date,
        time,
        modality,
        provider: provider?.name ?? "First available",
        location: modality === "video" ? "Telehealth" : "Austin Flagship",
      });
      setStep("done");
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <p className="text-sm font-semibold">{title}</p>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {step !== "done" && <StepIndicator step={step} />}

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {step === "service" && (
            <ServiceStep onSelect={id => { setServiceId(id); setStep("provider"); }} />
          )}
          {step === "provider" && service && (
            <ProviderStep
              service={service}
              modality={modality}
              setModality={setModality}
              onSelect={id => { setProviderId(id); setStep("datetime"); }}
              onBack={() => setStep("service")}
            />
          )}
          {step === "datetime" && service && (
            <DateTimeStep
              service={service}
              provider={provider}
              modality={modality}
              onSelect={(d, t) => { setDate(d); setTime(t); setStep("confirm"); }}
              onBack={() => setStep("provider")}
            />
          )}
          {step === "confirm" && service && (
            <ConfirmStep
              service={service}
              provider={provider}
              modality={modality}
              date={date}
              time={time}
              onConfirm={handleConfirm}
              onBack={() => setStep("datetime")}
              loading={loading}
            />
          )}
          {step === "done" && service && (
            <DoneStep service={service} date={date} time={time} modality={modality} onClose={onClose} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
