import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { samplePolicy, unverifiedClients, verifiedClients } from "@/lib/mock-data";
import { PrototypeShell, StatusBadge } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  function handleSend() {
    // Simulate collision if the email matches Ron Doe's
    if (email.toLowerCase() === collisionClient.email?.toLowerCase()) {
      setState("collision");
    } else {
      setState("sent");
    }
  }

  return (
    <PrototypeShell
      title={copy.review.pageTitle}
      subtitle="Unverified client — email entry required before bind"
      perspective="agent"
    >
      <div className="space-y-6">
        {/* Policyholder card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {copy.review.policyholderLabel}
              </h2>
              <StatusBadge status={state === "verified" ? "verified" : "unverified"} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-semibold">{clientName}</p>
                  {client.phone && (
                    <p className="text-xs text-muted-foreground">{client.phone}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Email entry / sent state */}
              {state === "empty" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">{copy.review.emailLabel}</Label>
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
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {copy.review.sendButton}
                  </Button>
                </div>
              )}

              {/* Collision prompt */}
              {state === "collision" && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        {t(copy.review.collisionTitle, {
                          email: email,
                          name: `${collisionClient.firstName} ${collisionClient.lastName}`,
                        })}
                      </p>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2"
                          onClick={() => setState("verified")}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {t(copy.review.collisionUseExisting, {
                            name: `${collisionClient.firstName} ${collisionClient.lastName}`,
                          })}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2"
                          onClick={() => {
                            setEmail("");
                            setState("empty");
                          }}
                        >
                          <PencilLine className="h-4 w-4" />
                          {copy.review.collisionDifferent}
                        </Button>
                        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          <ExternalLink className="h-3 w-3" />
                          {t(copy.review.collisionViewProfile, {
                            name: `${collisionClient.firstName} ${collisionClient.lastName}`,
                          })}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEmail("");
                        setState("empty");
                      }}
                      className="ml-auto text-amber-600 hover:text-amber-900 dark:text-amber-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Sent state */}
              {state === "sent" && (
                <div className="space-y-3">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">
                        {t(copy.review.sentConfirmation, { email })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <RotateCw className="h-3 w-3" />
                      {copy.review.resendButton}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => {
                        setEmail("");
                        setState("empty");
                      }}
                    >
                      <PencilLine className="h-3 w-3" />
                      {copy.review.changeEmailButton}
                    </Button>
                    {/* Demo: simulate verification */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-xs text-emerald-600"
                      onClick={() => setState("verified")}
                    >
                      [Demo: simulate verify]
                    </Button>
                  </div>
                </div>
              )}

              {/* Verified state */}
              {state === "verified" && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {email || collisionClient.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Coverage summary */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-muted-foreground">
              {copy.review.coverageTitle}
            </h2>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">{copy.review.propertyLabel}</dt>
                <dd className="font-medium">{samplePolicy.address}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{copy.review.premiumLabel}</dt>
                <dd className="font-medium">${samplePolicy.premium.toLocaleString()}/yr</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{copy.review.coverageLabel}</dt>
                <dd className="font-medium">
                  ${samplePolicy.dwellingCoverage.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{copy.review.deductibleLabel}</dt>
                <dd className="font-medium">
                  ${samplePolicy.deductible.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{copy.review.effectiveLabel}</dt>
                <dd className="font-medium">{samplePolicy.effectiveDate}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Prepayment CTA */}
        {state === "sent" && (
          <div className="flex justify-end">
            <Button variant="outline" className="gap-2">
              <CreditCard className="h-4 w-4" />
              {copy.review.continueToPayment}
            </Button>
          </div>
        )}
      </div>
    </PrototypeShell>
  );
}
