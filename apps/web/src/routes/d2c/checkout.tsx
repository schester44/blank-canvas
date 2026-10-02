import { createFileRoute } from "@tanstack/react-router";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { samplePolicy } from "@/lib/mock-data";
import { PrototypeShell } from "@/components/prototype-shell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, RotateCw, PencilLine, Shield } from "lucide-react";

export const Route = createFileRoute("/d2c/checkout")({
  component: D2CCheckout,
  head: () => ({ meta: [{ title: title("D2C — Check Your Email") }] }),
});

function D2CCheckout() {
  const email = "john.smith@email.com";
  const p = samplePolicy;

  return (
    <PrototypeShell
      title="D2C Pre-Checkout"
      subtitle="Unverified client must verify before payment"
      perspective="d2c"
      maxWidth="lg"
    >
      <div className="space-y-6 pt-8">
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-obie-teal text-obie-lime text-xl font-bold">
            O
          </div>
        </div>

        {/* Main message */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <Mail className="h-7 w-7 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold">{copy.d2c.checkoutTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {t(copy.d2c.checkoutSubtitle, { email })}
          </p>
        </div>

        {/* Explainer + summary */}
        <section className="rounded-xl border bg-white p-5 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {copy.d2c.checkoutExplainer}
          </p>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4 text-muted-foreground" />
              Your quote
            </div>
            <div className="rounded-lg bg-obie-surface p-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property</span>
                <span className="font-medium text-right">{p.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Premium</span>
                <span className="font-medium">${p.premium.toLocaleString()}/yr</span>
              </div>
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3">
          <Button variant="outline" size="sm" className="gap-1.5">
            <RotateCw className="h-3 w-3" />
            {copy.d2c.checkoutResend}
          </Button>
          <button className="text-xs text-obie-link hover:underline flex items-center gap-1.5">
            <PencilLine className="h-3 w-3" />
            {copy.d2c.checkoutChangeEmail}
          </button>
        </div>

        {/* What happens next */}
        <section className="rounded-xl border border-dashed bg-white p-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            After clicking the link
          </p>
          {["Email verified, account created", "Review policy details", "Sign & pay → policy bound"].map((text, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-obie-surface text-xs font-medium">
                {i + 1}
              </span>
              {text}
            </div>
          ))}
        </section>
      </div>
    </PrototypeShell>
  );
}
