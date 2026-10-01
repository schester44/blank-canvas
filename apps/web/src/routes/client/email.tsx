import { createFileRoute } from "@tanstack/react-router";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { samplePolicy } from "@/lib/mock-data";
import { PrototypeShell } from "@/components/prototype-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/client/email")({
  component: ClientEmail,
  head: () => ({ meta: [{ title: title("Client Email Preview") }] }),
});

function ClientEmail() {
  const p = samplePolicy;

  return (
    <PrototypeShell
      title="Client Email"
      subtitle="The review link email as it appears in the inbox"
      perspective="client"
    >
      <div className="mx-auto max-w-lg space-y-4">
        {/* Inbox meta */}
        <Card>
          <CardContent className="p-4">
            <dl className="space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-muted-foreground">From</dt>
                <dd className="font-medium">{t(copy.email.from, { agency: p.agency })}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-muted-foreground">To</dt>
                <dd>john.smith@email.com</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-muted-foreground">Subject</dt>
                <dd className="font-medium">
                  {t(copy.email.subject, { address: p.address })}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Email body */}
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Agency header */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                O
              </div>
              <div>
                <p className="text-sm font-semibold">{p.agency}</p>
                <p className="text-xs text-muted-foreground">via Obie</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="text-sm">{t(copy.email.greeting, { name: "John" })}</p>
              <p className="text-sm text-muted-foreground">
                {t(copy.email.body, { address: p.address })}
              </p>

              {/* Policy summary */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Property</span>
                  <span className="font-medium">{p.address}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t(copy.email.premiumLine, { premium: "" }).replace(": ", "")}
                  </span>
                  <span className="font-medium">${p.premium.toLocaleString()}/yr</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Effective date</span>
                  <span className="font-medium">{p.effectiveDate}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-center pt-2">
                <Button size="lg" className="w-full max-w-xs">
                  {copy.email.ctaButton}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-xs text-muted-foreground">
              <p>{t(copy.email.agentLine, { agent: p.agent, agency: p.agency })}</p>
              <p>{copy.email.footer}</p>
            </div>
          </CardContent>
        </Card>

        {/* Prepaid variant toggle */}
        <div className="rounded-lg border border-dashed p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Prepaid variant — the premium line would show:
          </p>
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            {t(copy.email.prepaidLine, { agency: p.agency })}
          </div>
        </div>
      </div>
    </PrototypeShell>
  );
}
