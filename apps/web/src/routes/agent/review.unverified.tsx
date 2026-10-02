import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { samplePolicy, unverifiedClients, verifiedClients } from "@/lib/mock-data";
import { PrototypeShell, StatusBadge } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  RotateCw,
  PencilLine,
  CreditCard,
  AlertCircle,
  User,
  ExternalLink,
  X,
  CheckCircle2,
  Home,
  DollarSign,
  Calendar,
  Shield,
} from "lucide-react";

export const Route = createFileRoute("/agent/review/unverified")({
  component: ReviewUnverified,
  head: () => ({ meta: [{ title: title("Review — Unverified") }] }),
});

type State = "empty" | "collision" | "sent" | "verified";

function ReviewUnverified() {
  const [state, setState] = useState<State>("empty");
  const [email, setEmail] = useState("");
  const client = unverifiedClients[0]!;
  const collisionClient = verifiedClients[1]!; // Ron Doe
  const clientName = `${client.firstName} ${client.lastName}`;
  const p = samplePolicy;

  function handleSend() {
    if (email.toLowerCase() === collisionClient.email?.toLowerCase()) {
      setState("collision");
    } else {
      setState("sent");
    }
  }

  return (
    <PrototypeShell
      title={copy.review.pageTitle}
      subtitle="Unverified client — try ron.doe@email.com for collision"
      perspective="agent"
    >
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column: policyholder + email */}
        <div className="lg:col-span-3 space-y-6">
          {/* Policyholder */}
          <section className="rounded-xl border bg-white">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {copy.review.policyholderLabel}
              </span>
              <StatusBadge status={state === "verified" ? "verified" : "unverified"} />
            </div>

            <div className="p-5 space-y-5">
              {/* Client info */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-obie-surface text-muted-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{clientName}</p>
                  {client.phone && (
                    <p className="text-xs text-muted-foreground">{client.phone}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Email field states */}
              {state === "empty" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="clientEmail" className="text-xs font-medium">
                      {copy.review.emailLabel}
                    </Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder={copy.review.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t(copy.review.emailHelper, { name: client.firstName })}
                    </p>
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!email || !email.includes("@")}
                    size="sm"
                    className="gap-2"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {copy.review.sendButton}
                  </Button>
                </div>
              )}

              {/* Collision */}
              {state === "collision" && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div className="space-y-3 flex-1">
                      <p className="text-sm font-medium text-amber-900">
                        {t(copy.review.collisionTitle, {
                          email,
                          name: `${collisionClient.firstName} ${collisionClient.lastName}`,
                        })}
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2 bg-white"
                          onClick={() => setState("verified")}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {t(copy.review.collisionUseExisting, {
                            name: `${collisionClient.firstName} ${collisionClient.lastName}`,
                          })}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2 bg-white"
                          onClick={() => { setEmail(""); setState("empty"); }}
                        >
                          <PencilLine className="h-3.5 w-3.5" />
                          {copy.review.collisionDifferent}
                        </Button>
                        <button className="flex items-center gap-1.5 text-xs text-obie-link hover:underline mt-1">
                          <ExternalLink className="h-3 w-3" />
                          {t(copy.review.collisionViewProfile, {
                            name: `${collisionClient.firstName} ${collisionClient.lastName}`,
                          })}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => { setEmail(""); setState("empty"); }}
                      className="text-amber-500 hover:text-amber-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Sent */}
              {state === "sent" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-lg border bg-obie-surface px-4 py-3">
                    <Send className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{t(copy.review.sentConfirmation, { email })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <RotateCw className="h-3 w-3" />
                      {copy.review.resendButton}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-muted-foreground"
                      onClick={() => { setEmail(""); setState("empty"); }}
                    >
                      <PencilLine className="h-3 w-3" />
                      {copy.review.changeEmailButton}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-xs text-emerald-600"
                      onClick={() => setState("verified")}
                    >
                      [Simulate verify]
                    </Button>
                  </div>
                </div>
              )}

              {/* Verified */}
              {state === "verified" && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-medium text-emerald-800">
                    {email || collisionClient.email}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Prepayment CTA */}
          {state === "sent" && (
            <section className="rounded-xl border bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Prepay on behalf of your client</p>
                  <p className="text-xs text-muted-foreground">
                    Optional — client won't see a payment step if you pay now.
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <CreditCard className="h-3.5 w-3.5" />
                  {copy.review.continueToPayment}
                </Button>
              </div>
            </section>
          )}
        </div>

        {/* Right column: coverage summary */}
        <div className="lg:col-span-2">
          <section className="rounded-xl border bg-white">
            <div className="border-b px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {copy.review.coverageTitle}
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Home className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{copy.review.propertyLabel}</p>
                  <p className="text-sm font-medium">{p.address}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{copy.review.coverageLabel}</span>
                  <span className="font-medium">${p.dwellingCoverage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{copy.review.deductibleLabel}</span>
                  <span className="font-medium">${p.deductible.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{copy.review.effectiveLabel}</span>
                  <span className="font-medium">{p.effectiveDate}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{copy.review.premiumLabel}</span>
                <span className="text-lg font-semibold">${p.premium.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/yr</span></span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PrototypeShell>
  );
}
