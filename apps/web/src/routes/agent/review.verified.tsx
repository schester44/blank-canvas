import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { samplePolicy, verifiedClients } from "@/lib/mock-data";
import { PrototypeShell, StatusBadge } from "@/components/prototype-shell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Send, RotateCw, CreditCard, CheckCircle2, Mail, Home } from "lucide-react";

export const Route = createFileRoute("/agent/review/verified")({
  component: ReviewVerified,
  head: () => ({ meta: [{ title: title("Review — Verified") }] }),
});

function ReviewVerified() {
  const [sent, setSent] = useState(false);
  const client = verifiedClients[0]!;
  const clientName = `${client.firstName} ${client.lastName}`;
  const p = samplePolicy;

  return (
    <PrototypeShell
      title={copy.review.pageTitle}
      subtitle="Verified client — no email entry, send for signature only"
      perspective="agent"
    >
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-6">
          <section className="rounded-xl border bg-white">
            <div className="flex items-center justify-between border-b px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {copy.review.policyholderLabel}
              </span>
              <StatusBadge status="verified" />
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{clientName}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {client.email}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Verified email — read only */}
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-800">{client.email}</p>
                <span className="ml-auto text-xs text-emerald-600">
                  Verified {client.verifiedDate}
                </span>
              </div>

              {!sent ? (
                <Button onClick={() => setSent(true)} size="sm" className="gap-2">
                  <Send className="h-3.5 w-3.5" />
                  {copy.review.sendButton}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-lg border bg-obie-surface px-4 py-3">
                    <Send className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {t(copy.review.sentConfirmation, { email: client.email! })}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <RotateCw className="h-3 w-3" />
                    {copy.review.resendButton}
                  </Button>
                </div>
              )}
            </div>
          </section>

          {sent && (
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
                <span className="text-lg font-semibold">
                  ${p.premium.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">/yr</span>
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PrototypeShell>
  );
}
