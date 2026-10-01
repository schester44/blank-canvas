import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { samplePolicy } from "@/lib/mock-data";
import { PrototypeShell } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Shield,
  FileText,
  CreditCard,
  PartyPopper,
  Lock,
} from "lucide-react";

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

  return (
    <PrototypeShell
      title={copy.clientReview.pageTitle}
      subtitle="The client's experience after clicking the magic link"
      perspective="client"
    >
      <div className="mx-auto max-w-lg space-y-6">
        {/* Signed in strip */}
        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          {t(copy.clientReview.signedInAs, { email: clientEmail })}
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 text-xs">
          {(["review", "sign", "pay", "done"] as Step[]).map((s, i) => {
            const labels = ["Review", "Sign", "Pay", "Done"];
            const isActive = s === step;
            const isPast =
              ["review", "sign", "pay", "done"].indexOf(s) <
              ["review", "sign", "pay", "done"].indexOf(step);
            return (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={`h-px w-6 ${isPast ? "bg-emerald-500" : "bg-border"}`}
                  />
                )}
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isPast
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                      : isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isPast ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </div>
                <span
                  className={
                    isActive ? "font-medium text-foreground" : "text-muted-foreground"
                  }
                >
                  {labels[i]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step: Review */}
        {step === "review" && (
          <>
            {/* Agency header */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                O
              </div>
              <div>
                <p className="text-sm font-semibold">{p.agency}</p>
                <p className="text-xs text-muted-foreground">Your agent: {p.agent}</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold">Policy details</h2>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Property</dt>
                    <dd className="text-right font-medium">{p.address}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Dwelling coverage</dt>
                    <dd className="font-medium">
                      ${p.dwellingCoverage.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Deductible</dt>
                    <dd className="font-medium">${p.deductible.toLocaleString()}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Annual premium</dt>
                    <dd className="text-base font-semibold">
                      ${p.premium.toLocaleString()}/yr
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Effective</dt>
                    <dd className="font-medium">{p.effectiveDate}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Policy documents</p>
                    <p className="text-xs text-muted-foreground">
                      Declaration page, full policy
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={() => setStep("sign")}>
              Continue to sign
            </Button>
          </>
        )}

        {/* Step: Sign */}
        {step === "sign" && (
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold">{copy.clientReview.signTitle}</h2>
              <p className="text-sm text-muted-foreground">
                {copy.clientReview.signHelper}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signature">Signature</Label>
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
            </CardContent>
          </Card>
        )}

        {/* Step: Pay */}
        {step === "pay" && (
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold">{copy.clientReview.payTitle}</h2>
              <p className="text-sm text-muted-foreground">
                {copy.clientReview.payHelper}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Card number</Label>
                <Input placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiry</Label>
                  <Input placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label>CVC</Label>
                  <Input placeholder="123" />
                </div>
              </div>
              <Button className="w-full gap-2" size="lg" onClick={() => setStep("done")}>
                <CreditCard className="h-4 w-4" />
                {t(copy.clientReview.payButton, {
                  amount: `$${p.premium.toLocaleString()}`,
                })}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{copy.clientReview.doneTitle}</h2>
              <p className="text-muted-foreground">{copy.clientReview.doneSubtitle}</p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              {t(copy.clientReview.donePolicyNumber, { number: p.policyNumber! })}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {copy.clientReview.donePortalPrompt}
              </p>
              <Button variant="outline">{copy.clientReview.donePortalLink}</Button>
            </div>
          </div>
        )}
      </div>
    </PrototypeShell>
  );
}
