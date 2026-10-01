import { createFileRoute } from "@tanstack/react-router";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { samplePolicy } from "@/lib/mock-data";
import { PrototypeShell } from "@/components/prototype-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, RotateCw, PencilLine, Shield, ArrowRight } from "lucide-react";

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
      subtitle="After the client finishes quoting — verification required before payment"
      perspective="d2c"
    >
      <div className="mx-auto max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">
            O
          </div>
        </div>

        {/* Main message */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
            <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            {copy.d2c.checkoutTitle}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(copy.d2c.checkoutSubtitle, { email })}
          </p>
        </div>

        {/* Explainer */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {copy.d2c.checkoutExplainer}
            </p>

            <Separator />

            {/* Quote summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Your quote
              </div>
              <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property</span>
                  <span className="font-medium">{p.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Premium</span>
                  <span className="font-medium">${p.premium.toLocaleString()}/yr</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3">
          <Button variant="outline" size="sm" className="gap-1.5">
            <RotateCw className="h-3 w-3" />
            {copy.d2c.checkoutResend}
          </Button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <PencilLine className="h-3 w-3" />
            {copy.d2c.checkoutChangeEmail}
          </button>
        </div>

        {/* What happens next */}
        <div className="rounded-lg border border-dashed p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            What happens when the client clicks the email link:
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
              1
            </span>
            Email verified, account created
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
              2
            </span>
            Review policy details
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
              3
            </span>
            Sign & pay → policy bound
          </div>
        </div>
      </div>
    </PrototypeShell>
  );
}
