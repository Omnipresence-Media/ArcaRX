import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cancelMembership, practitionerName, resumeMembership, updateCard, useMe, useSpruce } from "@/features/spruce/store";
import { Pill, SectionCard, SpPage } from "@/features/spruce/ui";

export const Route = createFileRoute("/spruce/portal/account")({
  head: () => ({ meta: [{ title: "Account - Spruce Micro" }] }),
  component: Account,
});

const STATUS_PILL = {
  incomplete: { tone: "warning", label: "Setup incomplete" },
  active: { tone: "success", label: "Active" },
  past_due: { tone: "danger", label: "Past due" },
  paused: { tone: "warning", label: "Paused" },
  cancelled: { tone: "neutral", label: "Cancelled" },
} as const;

const INVOICES = [
  { id: "inv-3", label: "Oct 15", amount: "paid" },
  { id: "inv-2", label: "Sep 15", amount: "paid" },
  { id: "inv-1", label: "Aug 15", amount: "paid" },
];

const fmtNumber = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const fmtExp = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function download(filename: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast.success(`Downloaded ${filename}`);
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2.5 last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{children}</span>
    </div>
  );
}

function Account() {
  const s = useSpruce();
  const me = useMe();
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardError, setCardError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const planName = me.membershipType === "in_clinic" ? "In-Clinic" : me.membershipType === "virtual" ? "Virtual" : "Not selected";
  const price = me.membershipType === "in_clinic" ? "$199/mo" : me.membershipType === "virtual" ? "$129/mo" : "-";
  const pill = STATUS_PILL[me.membership];
  const endsNow = me.membership === "past_due" || me.membership === "paused";
  const myProtocols = s.protocols.filter((p) => p.patientId === s.meId);

  const saveCard = () => {
    const digits = num.replace(/\D/g, "");
    if (digits === "4000000000000002") { setCardError("Your card has insufficient funds. Try a different card."); return; }
    if (digits === "4000000000000069") { setCardError("This card was declined permanently by your bank. Please use a different card."); return; }
    const m = /^(\d{2})\/(\d{2})$/.exec(exp);
    if (digits.length < 13) { setCardError("Enter a valid card number."); return; }
    if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) { setCardError("Enter the expiry as MM/YY."); return; }
    if (cvc.length < 3) { setCardError("Enter the 3 or 4 digit security code."); return; }
    const wasRestricted = me.membership === "past_due" || me.membership === "paused";
    updateCard({ brand: "Visa", last4: digits.slice(-4), exp });
    setNum(""); setExp(""); setCvc(""); setCardError(null);
    toast.success(`Card updated. Your billing date has not changed.${wasRestricted ? " You are back to full access." : ""}`);
  };

  return (
    <SpPage
      title="Account"
      actions={<Button asChild variant="outline" size="sm"><Link to="/spruce">Sign out</Link></Button>}
    >
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <SectionCard title="Profile">
            <Row label="Name">{me.name}</Row>
            <Row label="Email">{me.email}</Row>
            <Row label="Practitioner">{practitionerName(s, me.practitionerId)}</Row>
            <Row label="Membership type">{planName}</Row>
            <Row label="Member since">{me.createdLabel}</Row>
          </SectionCard>
        </TabsContent>

        <TabsContent value="billing" className="mt-4 space-y-4">
          <SectionCard title="Membership" right={
            <span className="flex items-center gap-2">
              <Pill tone={pill.tone}>{pill.label}</Pill>
              {me.cancelAtPeriodEnd && <Pill tone="warning">Ends {me.nextRenewal}</Pill>}
            </span>
          }>
            <Row label="Plan">{planName} {price}</Row>
            <Row label="Next renewal">{me.nextRenewal}</Row>
            <p className="pt-2 text-xs text-muted-foreground">Billed on day {me.anchorDay} of each month (shorter months bill on the last day).</p>
          </SectionCard>

          <SectionCard title="Payment method">
            <Row label="Saved card">{me.card ? `${me.card.brand} ending ${me.card.last4}, exp ${me.card.exp}` : "None"}</Row>
            <div className="mt-4 space-y-3">
              <p className="text-sm font-semibold">Update card</p>
              <div className="space-y-1.5">
                <Label htmlFor="acct-card">Card number</Label>
                <Input id="acct-card" inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" value={num} onChange={(e) => { setNum(fmtNumber(e.target.value)); setCardError(null); }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="acct-exp">Expiry</Label>
                  <Input id="acct-exp" inputMode="numeric" autoComplete="off" placeholder="MM/YY" value={exp} onChange={(e) => { setExp(fmtExp(e.target.value)); setCardError(null); }} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="acct-cvc">CVC</Label>
                  <Input id="acct-cvc" inputMode="numeric" autoComplete="off" placeholder="123" value={cvc} onChange={(e) => { setCvc(e.target.value.replace(/\D/g, "").slice(0, 4)); setCardError(null); }} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Prototype hint: 4242 4242 4242 4242 works.</p>
              {cardError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{cardError}</p>}
              <Button type="button" onClick={saveCard} disabled={!num}>Save card</Button>
            </div>
          </SectionCard>

          <SectionCard title="Invoices">
            <ul className="divide-y">
              {INVOICES.map((i) => (
                <li key={i.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span>{i.label}, {planName} {price}</span>
                  <Pill tone="success">Paid</Pill>
                </li>
              ))}
            </ul>
          </SectionCard>

          {me.cancelAtPeriodEnd ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resumeMembership(me.id);
                toast.success("Your membership will continue");
              }}
            >
              Keep my membership
            </Button>
          ) : (
            me.membership !== "cancelled" && (
              <Button type="button" variant="outline" className="text-red-700" onClick={() => setConfirmOpen(true)}>Cancel membership</Button>
            )
          )}
        </TabsContent>

        <TabsContent value="records" className="mt-4">
          <SectionCard title="Records">
            <ul className="divide-y">
              {myProtocols.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="flex min-w-0 items-center gap-2 text-sm"><FileText className="h-4 w-4 shrink-0 text-[color:var(--teal)]" /><span className="truncate">{p.title}</span></span>
                  <Button size="sm" variant="outline" onClick={() => download(`${p.title}.txt`, `${p.title}\nUploaded ${p.uploadedLabel}\n`)}><Download className="mr-1 h-4 w-4" />Download</Button>
                </li>
              ))}
              <li className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex min-w-0 items-center gap-2 text-sm"><FileText className="h-4 w-4 shrink-0 text-[color:var(--teal)]" /><span className="truncate">Consent and agreement v2, signed</span></span>
                <Button size="sm" variant="outline" onClick={() => download("Consent and agreement v2.txt", `Consent and agreement, version 2\nSigned by ${me.name}\n`)}><Download className="mr-1 h-4 w-4" />Download</Button>
              </li>
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel your membership?</DialogTitle>
            <DialogDescription>
              {endsNow
                ? "Your membership ends right away and you will not be charged again."
                : `Your access continues until the end of the current billing period (${me.nextRenewal}). You will not be charged again after that.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Keep membership</Button>
            <Button
              onClick={() => {
                cancelMembership(me.id);
                setConfirmOpen(false);
                toast.success(endsNow ? "Membership cancelled." : "Membership cancelled. Access continues to the end of the period.");
              }}
            >
              Cancel membership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SpPage>
  );
}
