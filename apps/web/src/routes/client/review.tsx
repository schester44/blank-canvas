import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { samplePolicy } from "@/lib/mock-data";
import { PrototypeShell } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, FileText, CreditCard, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/review")({
  component: ClientReview,
  head: () => ({ meta: [{ title: title("Review Your Policy") }] }),
});

type Step = "review" | "sign" | "pay" | "done";

function ClientReview() {
  const [step, setStep] = useState<Step>("review");
  const [signature, setSignature] = useState("");
  const [prepaid] = useState(false);
  const p = samplePolicy;
  const clientEmail = "john.smith@email.com";

  const steps: { key: Step; label: string }[] = [
    { key: "review", label: "Review" },
    { key: "sign", label: "Sign" },
    { key: "pay", label: "Pay" },
    { key: "done", label: "Done" },
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <PrototypeShell
      title={copy.clientReview.pageTitle}
      subtitle="Client's experience after clicking the magic link"
      perspective="client"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Signed-in strip */}
        <div className="flex items-center gap-2 rounded-lg bg-obie-teal px-4 py-2 text-xs text-obie-lime">
          <Lock className="h-3 w-3" />
          {t(copy.clientReview.signedInAs, { email: clientEmail })}
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1">
          {steps.map((s, i) => {
            const isPast = i < stepIndex;
            const isActive = i === stepIndex;
            return (
              <div key={s.key} className="flex items-center gap-1">
                {i > 0 && (
                  <div className={cn("h-px w-8", isPast ? "bg-emerald-500" : "bg-border")} />
                )}
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                    isPast && "bg-emerald-100 text-emerald-700",
                    isActive && "bg-obie-teal text-obie-lime",
                    !isPast && !isActive && "bg-muted text-muted-foreground"
                  )}
                >
                  {isPast ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span className={cn("text-xs", isActive ? "font-medium" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Review step */}
        {step === "review" && (
          <div className="space-y-4">
            {/* Agency header */}
            <div className="flex items-center gap-3 rounded-xl bg-obie-teal px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-obie-lime/20 text-obie-lime text-sm font-bold">
                O
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{p.agency}</p>
                <p className="text-xs text-obie-lime/70">Your agent: {p.agent}</p>
              </div>
            </div>

            <section className="rounded-xl border bg-white">
              <div className="border-b px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Policy details
                </span>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property</span>
                  <span className="text-right font-medium">{p.address}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dwelling coverage</span>
                  <span className="font-medium">${p.dwellingCoverage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deductible</span>
                  <span className="font-medium">${p.deductible.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Annual premium</span>
                  <span className="text-lg font-semibold">${p.premium.toLocaleString()}/yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Effective</span>
                  <span className="font-medium">{p.effectiveDate}</span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border bg-white p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Policy documents</p>
                  <p className="text-xs text-muted-foreground">Declaration page, full policy</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </section>

            <Button className="w-full" size="lg" onClick={() => setStep("sign")}>
              Continue to sign
            </Button>
          </div>
        )}

        {/* Sign step */}
        {step === "sign" && (
          <section className="rounded-xl border bg-white">
            <div className="border-b px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {copy.clientReview.signTitle}
              </span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">{copy.clientReview.signHelper}</p>
              <div className="space-y-1.5">
                <Label htmlFor="signature" className="text-xs font-medium">Signature</Label>
                <Input
                  id="signature"
                  placeholder={copy.clientReview.signPlaceholder}
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="font-serif text-lg italic"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                By signing, you agree to the terms of this policy.
              </p>
              <Button
                className="w-full"
                size="lg"
                disabled={!signature}
                onClick={() => setStep(prepaid ? "done" : "pay")}
              >
                {copy.clientReview.signButton}
              </Button>
            </div>
          </section>
        )}

        {/* Pay step */}
        {step === "pay" && (
          <section className="rounded-xl border bg-white">
            <div className="border-b px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {copy.clientReview.payTitle}
              </span>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted-foreground">{copy.clientReview.payHelper}</p>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Card number</Label>
                <Input placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Expiry</Label>
                  <Input placeholder="MM/YY" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">CVC</Label>
                  <Input placeholder="123" />
                </div>
              </div>
              <Button className="w-full gap-2" size="lg" onClick={() => setStep("done")}>
                <CreditCard className="h-4 w-4" />
                {t(copy.clientReview.payButton, { amount: `$${p.premium.toLocaleString()}` })}
              </Button>
            </div>
          </section>
        )}

        {/* Done step */}
        {step === "done" && (
          <div className="text-center space-y-6 py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{copy.clientReview.doneTitle}</h2>
              <p className="text-muted-foreground">{copy.clientReview.doneSubtitle}</p>
            </div>
            <div className="mx-auto max-w-xs rounded-lg border bg-white p-4 text-sm font-medium">
              {t(copy.clientReview.donePolicyNumber, { number: p.policyNumber! })}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{copy.clientReview.donePortalPrompt}</p>
              <Button variant="outline">{copy.clientReview.donePortalLink}</Button>
            </div>
          </div>
        )}
      </div>
    </PrototypeShell>
  );
}
