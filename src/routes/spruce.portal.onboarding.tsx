import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, CheckCircle2, Clock, FileUp, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitOnboarding, updateMe, useMe, type MembershipType, type Patient } from "@/features/spruce/store";
import { headingFont } from "@/features/spruce/theme";
import { PhotoSlots, SectionCard, SpPage } from "@/features/spruce/ui";

export const Route = createFileRoute("/spruce/portal/onboarding")({
  head: () => ({ meta: [{ title: "Get started - Spruce Micro" }] }),
  component: Onboarding,
});

type StepKey = "membership" | "consent" | "id" | "photos" | "payment" | "review";
const STEP_LABEL: Record<StepKey, string> = {
  membership: "Membership",
  consent: "Consent",
  id: "Photo ID",
  photos: "Baseline photos",
  payment: "Payment",
  review: "Review",
};

function stepsFor(me: Patient): StepKey[] {
  const base: StepKey[] = ["membership", "consent", "id"];
  if (me.membershipType === "virtual") base.push("photos");
  return [...base, "payment", "review"];
}

function firstIncomplete(me: Patient, steps: StepKey[]): number {
  const done: Record<StepKey, boolean> = {
    membership: me.membershipType !== null,
    consent: me.consentSigned,
    id: me.idUploaded,
    photos: me.photosUploaded >= 3,
    payment: me.card !== null,
    review: false,
  };
  const i = steps.findIndex((k) => !done[k]);
  return i === -1 ? steps.length - 1 : i;
}

const PLANS: { id: MembershipType; name: string; price: string; points: string[] }[] = [
  { id: "in_clinic", name: "In-Clinic", price: "$199/mo", points: ["Visits with your practitioner at the clinic", "Weekly check-ins and protocols", "Member pricing in the store"] },
  { id: "virtual", name: "Virtual", price: "$129/mo", points: ["Everything online, from home", "Weekly check-ins with photos", "Member pricing in the store"] },
];

const CONSENT = [
  "By becoming a Spruce Micro member you agree to receive skin care guidance from licensed practitioners through this portal. Guidance is based only on the information and photos you share.",
  "You confirm that the information you provide, including your photo ID and baseline photos, is accurate and belongs to you. You agree to tell your practitioner about changes in your health or medications.",
  "Microneedling and prescription topicals carry risks, including redness, irritation, and rare allergic reactions. You agree to follow your protocol and to message your practitioner if something looks or feels wrong.",
  "In an emergency, call 911. This portal is not monitored around the clock and is not for urgent medical needs.",
  "Your membership renews monthly on your billing date until you cancel. Cancelling keeps your access through the end of the paid period. Your health information is handled under our privacy policy.",
];

// ---------------------------------------------------------------- card helpers

const fmtNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const fmtExp = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function checkCard(number: string, exp: string, cvc: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (digits === "4000000000000002") return "Your card has insufficient funds. Try a different card.";
  if (digits === "4000000000000069") return "This card was declined permanently by your bank. Please use a different card.";
  if (digits.length < 13) return "Enter a valid card number.";
  const m = /^(\d{2})\/(\d{2})$/.exec(exp);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return "Enter the expiry as MM/YY.";
  if (cvc.length < 3) return "Enter the 3 or 4 digit security code.";
  return null;
}

// ---------------------------------------------------------------- signature pad

function SignaturePad({ onChange }: { onChange: (hasStroke: boolean) => void }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = ref.current;
    if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };
  const ctx = () => {
    const g = ref.current?.getContext("2d");
    if (g) {
      g.lineWidth = 2.5;
      g.lineCap = "round";
      g.lineJoin = "round";
      g.strokeStyle = "#14241C";
    }
    return g ?? null;
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={ref}
        width={600}
        height={160}
        className="h-32 w-full touch-none rounded-lg border bg-white"
        aria-label="Signature pad"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drawing.current = true;
          const p = pos(e);
          const g = ctx();
          g?.beginPath();
          g?.moveTo(p.x, p.y);
          g?.lineTo(p.x + 0.1, p.y + 0.1);
          g?.stroke();
          onChange(true);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const p = pos(e);
          const g = ctx();
          g?.lineTo(p.x, p.y);
          g?.stroke();
        }}
        onPointerUp={() => { drawing.current = false; }}
        onPointerCancel={() => { drawing.current = false; }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const c = ref.current;
          c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
          onChange(false);
        }}
      >
        Clear
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------- page

function Onboarding() {
  const me = useMe();
  const steps = stepsFor(me);
  const [step, setStep] = useState<number | null>(null);
  const [fixing, setFixing] = useState(false);

  // consent
  const [typedName, setTypedName] = useState("");
  const [signed, setSigned] = useState(false);
  // id
  const [idName, setIdName] = useState<string | null>(null);
  const idRef = useRef<HTMLInputElement | null>(null);
  // photos
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
  // payment
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardError, setCardError] = useState<string | null>(null);

  // A scenario switch while mounted must not leave a stale step behind.
  useEffect(() => {
    setStep(null);
    setFixing(false);
  }, [me.id, me.onboarding]);

  useEffect(() => {
    if (me.idUploaded && !idName) setIdName("photo-id.jpg");
  }, [me.idUploaded, idName]);

  const cur = Math.min(step ?? firstIncomplete(me, steps), steps.length - 1);
  const key = steps[cur];
  const go = (i: number) => setStep(Math.max(0, Math.min(i, steps.length - 1)));
  const next = () => go(cur + 1);
  const back = () => go(cur - 1);

  const showStepper = me.onboarding === "account_created" || (me.onboarding === "changes_requested" && fixing);

  const Checklist = (
    <ul className="space-y-2 text-sm">
      {[
        { label: `Membership: ${me.membershipType === "in_clinic" ? "In-Clinic" : me.membershipType === "virtual" ? "Virtual" : "not chosen"}`, ok: me.membershipType !== null },
        { label: "Consent and agreement signed", ok: me.consentSigned },
        { label: "Photo ID uploaded", ok: me.idUploaded },
        ...(me.membershipType === "virtual" ? [{ label: "3 baseline photos added", ok: me.photosUploaded >= 3 }] : []),
        { label: me.card ? `Payment method: ${me.card.brand} ending ${me.card.last4}` : "Payment method", ok: me.card !== null },
      ].map((r) => (
        <li key={r.label} className="flex items-center gap-2">
          <CheckCircle2 className={`h-4 w-4 ${r.ok ? "text-[color:var(--teal)]" : "text-muted-foreground"}`} />
          <span className={r.ok ? "" : "text-muted-foreground"}>{r.label}</span>
        </li>
      ))}
    </ul>
  );

  if (me.onboarding === "pending_review") {
    return (
      <SpPage title="Thanks, you are all set">
        <SectionCard>
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[color:var(--teal)]"><Clock className="h-6 w-6" /></div>
            <p className="text-base font-semibold" style={headingFont}>Your practitioner is reviewing your information</p>
            <p className="max-w-sm text-sm text-muted-foreground">This usually takes within one business day. We will let you know as soon as you are approved.</p>
          </div>
        </SectionCard>
        <SectionCard title="What you submitted">{Checklist}</SectionCard>
      </SpPage>
    );
  }

  if (me.onboarding === "rejected") {
    return (
      <SpPage title="We could not approve your application">
        <SectionCard>
          <p className="text-sm text-muted-foreground">We were not able to approve your membership at this time. If you think this is a mistake, please contact support and we will help you with next steps.</p>
        </SectionCard>
      </SpPage>
    );
  }

  if (me.onboarding === "changes_requested" && !fixing) {
    return (
      <SpPage title="A small fix is needed">
        <SectionCard>
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Your practitioner asked for a change</p>
              <p className="text-sm">{me.changesReason ?? "Please review your information and resubmit."}</p>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Your submission">{Checklist}</SectionCard>
        <Button
          onClick={() => {
            updateMe({ idUploaded: false });
            setIdName(null);
            setFixing(true);
            setStep(steps.indexOf("id"));
          }}
        >
          Fix and resubmit
        </Button>
      </SpPage>
    );
  }

  if (!showStepper) {
    return (
      <SpPage title="Get started">
        <SectionCard><p className="text-sm text-muted-foreground">Your onboarding is complete.</p></SectionCard>
      </SpPage>
    );
  }

  // ---- step bodies

  const nav = (canContinue: boolean, onContinue: () => void, label = "Continue") => (
    <div className="flex items-center justify-between gap-3 pt-2">
      <Button type="button" variant="outline" onClick={back} disabled={cur === 0}>Back</Button>
      <Button type="button" onClick={onContinue} disabled={!canContinue}>{label}</Button>
    </div>
  );

  let body: React.ReactNode = null;

  if (key === "membership") {
    body = (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {PLANS.map((p) => {
            const on = me.membershipType === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  updateMe({ membershipType: p.id });
                  toast.success(`${p.name} selected`);
                }}
                className={`rounded-xl border-2 p-4 text-left transition-colors ${on ? "border-[color:var(--teal)] bg-accent" : "hover:border-[color:var(--teal)]"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold" style={headingFont}>{p.name}</span>
                  {on && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--teal)] text-white"><Check className="h-3 w-3" /></span>}
                </div>
                <p className="mt-1 text-lg font-semibold">{p.price}</p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {p.points.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </button>
            );
          })}
        </div>
        {nav(me.membershipType !== null, next)}
      </div>
    );
  } else if (key === "consent") {
    const canGo = typedName.trim().length > 1 && signed;
    body = (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Consent and agreement, version 2</h3>
          <div className="mt-2 max-h-48 space-y-3 overflow-y-auto rounded-lg border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
            {CONSENT.map((c) => <p key={c}>{c}</p>)}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sp-fullname">Type your full legal name</Label>
          <Input id="sp-fullname" value={typedName} onChange={(e) => setTypedName(e.target.value)} placeholder={me.name} autoComplete="off" />
        </div>
        <div className="space-y-1.5">
          <Label>Sign below</Label>
          <SignaturePad onChange={setSigned} />
        </div>
        {nav(canGo, () => {
          updateMe({ consentSigned: true });
          toast.success("Consent signed");
          next();
        })}
      </div>
    );
  } else if (key === "id") {
    body = (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Upload a clear photo of the front of your government-issued ID. JPEG, PNG or HEIC, up to 10 MB.</p>
        <input
          ref={idRef}
          type="file"
          accept="image/jpeg,image/png,image/heic,.heic"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            if (f.size > 10 * 1024 * 1024) {
              toast.error("That file is over 10 MB. Please choose a smaller photo.");
              return;
            }
            setIdName(f.name);
            updateMe({ idUploaded: true });
            toast.success("Photo ID added");
          }}
        />
        {me.idUploaded && idName ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/50 p-3">
            <div className="flex min-w-0 items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--teal)]" />
              <span className="truncate text-sm">{idName}</span>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => idRef.current?.click()}>Replace</Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => idRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-muted-foreground hover:border-[color:var(--teal)]"
          >
            <FileUp className="h-6 w-6" />
            <span className="text-sm font-medium">Choose a file</span>
          </button>
        )}
        {nav(me.idUploaded, next)}
      </div>
    );
  } else if (key === "photos") {
    const all = previews.every(Boolean);
    body = (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Add three baseline photos in natural light, with a clean face and no filters. These help your practitioner track progress.</p>
        <PhotoSlots
          labels={["Front", "Left", "Right"]}
          previews={previews}
          onPick={(i, url) => setPreviews((prev) => prev.map((x, j) => (j === i ? url : x)))}
        />
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>Front: face the camera straight on, hair pulled back.</li>
          <li>Left: turn so your left cheek faces the camera.</li>
          <li>Right: turn so your right cheek faces the camera.</li>
        </ul>
        {nav(all, () => {
          updateMe({ photosUploaded: 3 });
          toast.success("Baseline photos saved");
          next();
        })}
      </div>
    );
  } else if (key === "payment") {
    body = (
      <div className="space-y-4">
        {me.card && (
          <p className="rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">Saved: {me.card.brand} ending {me.card.last4}, expires {me.card.exp}. Enter a new card to replace it, or continue.</p>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="sp-card">Card number</Label>
          <Input id="sp-card" inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" value={num} onChange={(e) => { setNum(fmtNumber(e.target.value)); setCardError(null); }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="sp-exp">Expiry</Label>
            <Input id="sp-exp" inputMode="numeric" autoComplete="off" placeholder="MM/YY" value={exp} onChange={(e) => { setExp(fmtExp(e.target.value)); setCardError(null); }} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sp-cvc">CVC</Label>
            <Input id="sp-cvc" inputMode="numeric" autoComplete="off" placeholder="123" value={cvc} onChange={(e) => { setCvc(e.target.value.replace(/\D/g, "").slice(0, 4)); setCardError(null); }} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Prototype hint: 4242 4242 4242 4242 works.</p>
        {cardError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{cardError}</p>}
        {nav(me.card !== null || num.length > 0, () => {
          if (!num && me.card) { next(); return; }
          const err = checkCard(num, exp, cvc);
          if (err) { setCardError(err); return; }
          const digits = num.replace(/\D/g, "");
          updateMe({ card: { brand: "Visa", last4: digits.slice(-4), exp } });
          setNum(""); setExp(""); setCvc("");
          toast.success("Payment method saved");
          next();
        })}
      </div>
    );
  } else {
    const canSubmit =
      me.membershipType !== null &&
      me.consentSigned &&
      me.idUploaded &&
      (me.membershipType !== "virtual" || me.photosUploaded >= 3) &&
      me.card !== null;
    body = (
      <div className="space-y-4">
        {me.onboarding === "changes_requested" && me.changesReason && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Requested change: {me.changesReason}</p>
        )}
        {Checklist}
        <p className="text-xs text-muted-foreground">Your card is not charged until your practitioner approves your membership.</p>
        {nav(canSubmit, () => {
          if (!submitOnboarding()) {
            toast.error("Finish every step before submitting");
            return;
          }
          setFixing(false);
          toast.success("Submitted for review");
        }, "Submit for review")}
      </div>
    );
  }

  return (
    <SpPage title="Get started" sub="A few quick steps and your practitioner will review everything.">
      <ol className="flex items-center gap-1.5 overflow-x-auto pb-1" aria-label="Progress">
        {steps.map((k, i) => (
          <li key={k} className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                i === cur ? "bg-primary text-primary-foreground" : i < cur ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {i < cur ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
              {STEP_LABEL[k]}
            </span>
          </li>
        ))}
      </ol>
      <SectionCard title={`Step ${cur + 1} of ${steps.length}: ${STEP_LABEL[key]}`}>{body}</SectionCard>
    </SpPage>
  );
}
