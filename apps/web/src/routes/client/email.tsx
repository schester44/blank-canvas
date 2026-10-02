import { createFileRoute } from "@tanstack/react-router";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { samplePolicy } from "@/lib/mock-data";
import { PrototypeShell } from "@/components/prototype-shell";
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
      subtitle="The review link email as the client sees it"
      perspective="client"
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Inbox metadata */}
        <section className="rounded-xl border bg-white p-4">
          <dl className="space-y-1.5 text-sm">
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 text-muted-foreground">From</dt>
              <dd className="font-medium">{t(copy.email.from, { agency: p.agency })}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 text-muted-foreground">To</dt>
              <dd>john.smith@email.com</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 text-muted-foreground">Subject</dt>
              <dd className="font-medium">{t(copy.email.subject, { address: p.address })}</dd>
            </div>
          </dl>
        </section>

        {/* Email body */}
        <section className="rounded-xl border bg-white overflow-hidden">
          {/* Agency header */}
          <div className="flex items-center gap-3 bg-obie-teal px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-obie-lime/20 text-obie-lime text-sm font-bold">
              O
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{p.agency}</p>
              <p className="text-xs text-obie-lime/70">via Obie</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <p className="text-sm">{t(copy.email.greeting, { name: "John" })}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(copy.email.body, { address: p.address })}
            </p>

            {/* Policy summary */}
            <div className="rounded-lg border bg-obie-surface p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property</span>
                <span className="font-medium text-right">{p.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Annual premium</span>
                <span className="font-medium">${p.premium.toLocaleString()}/yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effective date</span>
                <span className="font-medium">{p.effectiveDate}</span>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button size="lg" className="px-12">{copy.email.ctaButton}</Button>
            </div>

            <Separator />

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p>{t(copy.email.agentLine, { agent: p.agent, agency: p.agency })}</p>
              <p>{copy.email.footer}</p>
            </div>
          </div>
        </section>

        {/* Prepaid variant note */}
        <section className="rounded-xl border border-dashed bg-white p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Prepaid variant — the summary would also show:
          </p>
          <div className="rounded-md bg-obie-surface p-3 text-sm font-medium text-emerald-700">
            ✓ {t(copy.email.prepaidLine, { agency: p.agency })}
          </div>
        </section>
      </div>
    </PrototypeShell>
  );
}
