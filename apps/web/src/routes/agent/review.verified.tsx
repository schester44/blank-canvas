import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { samplePolicy, verifiedClients } from "@/lib/mock-data";
import { PrototypeShell, StatusBadge } from "@/components/prototype-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Send, RotateCw, CreditCard, CheckCircle2, Mail } from "lucide-react";

export const Route = createFileRoute("/agent/review/verified")({
  component: ReviewVerified,
  head: () => ({ meta: [{ title: title("Review — Verified") }] }),
});

function ReviewVerified() {
  const [sent, setSent] = useState(false);
  const client = verifiedClients[0]!;
  const clientName = `${client.firstName} ${client.lastName}`;

  return (
    <PrototypeShell
      title={copy.review.pageTitle}
      subtitle="Verified client — no email entry needed, send for signature only"
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
              <StatusBadge status="verified" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-semibold">{clientName}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {client.email}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Verified email - read only */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    {client.email}
                  </p>
                  <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400">
                    Verified {client.verifiedDate}
                  </span>
                </div>
              </div>

              {/* Send / Sent */}
              {!sent ? (
                <Button onClick={() => setSent(true)} className="gap-2">
                  <Send className="h-4 w-4" />
                  {copy.review.sendButton}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">
                        {t(copy.review.sentConfirmation, { email: client.email! })}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <RotateCw className="h-3 w-3" />
                    {copy.review.resendButton}
                  </Button>
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
                <dd className="font-medium">${samplePolicy.dwellingCoverage.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{copy.review.deductibleLabel}</dt>
                <dd className="font-medium">${samplePolicy.deductible.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{copy.review.effectiveLabel}</dt>
                <dd className="font-medium">{samplePolicy.effectiveDate}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Prepayment CTA */}
        {sent && (
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
