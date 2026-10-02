import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { PrototypeShell } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Lock } from "lucide-react";

export const Route = createFileRoute("/d2c/start")({
  component: D2CStart,
  head: () => ({ meta: [{ title: title("D2C — Get a Quote") }] }),
});

type State = "entry" | "recognized" | "new" | "logged-in";

function D2CStart() {
  const [state, setState] = useState<State>("entry");
  const [email, setEmail] = useState("");

  function handleContinue() {
    if (email.toLowerCase() === "jane.doe@email.com") setState("recognized");
    else if (email.toLowerCase() === "returning@email.com") setState("logged-in");
    else setState("new");
  }

  return (
    <PrototypeShell
      title="D2C Flow — Entry"
      subtitle="Try jane.doe@email.com (recognized) · returning@email.com (logged in) · anything else (new)"
      perspective="d2c"
      maxWidth="lg"
    >
      <div className="space-y-8 pt-8">
        {/* Brand */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-obie-teal text-obie-lime text-xl font-bold">
            O
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{copy.d2c.entryTitle}</h1>
            <p className="mt-1 text-muted-foreground">{copy.d2c.entrySubtitle}</p>
          </div>
        </div>

        {/* Entry */}
        {state === "entry" && (
          <section className="rounded-xl border bg-white p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="d2c-email" className="text-xs font-medium">{copy.d2c.emailLabel}</Label>
              <Input
                id="d2c-email"
                type="email"
                placeholder={copy.d2c.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{copy.d2c.emailHelper}</p>
            </div>
            <Button
              className="w-full gap-2"
              size="lg"
              disabled={!email || !email.includes("@")}
              onClick={handleContinue}
            >
              {copy.d2c.continueButton}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </section>
        )}

        {/* Recognized */}
        {state === "recognized" && (
          <section className="rounded-xl border bg-white p-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <Mail className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-base font-semibold">{copy.d2c.welcomeBack}</h2>
            <p className="text-sm text-muted-foreground">
              We sent a sign-in link to <strong>{email}</strong>. Click it to continue.
            </p>
            <button
              className="text-xs text-obie-link hover:underline"
              onClick={() => { setEmail(""); setState("entry"); }}
            >
              Use a different email
            </button>
          </section>
        )}

        {/* New client */}
        {state === "new" && (
          <section className="rounded-xl border bg-white p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
            <h2 className="text-base font-semibold">Tell us about your property</h2>
            <p className="text-sm text-muted-foreground">
              Client proceeds through quoting as unverified. Email is stored on the quote.
              Verification happens at the end via magic link.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Property address</Label>
              <Input placeholder="1423 Maple Drive, Austin, TX 78701" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Property type</Label>
                <Input placeholder="Single family" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Year built</Label>
                <Input placeholder="2004" />
              </div>
            </div>
            <Button className="w-full gap-2" size="lg">
              Get quotes <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              [Continues through full quoting → <a href="/d2c/checkout" className="text-obie-link hover:underline">skip to checkout</a>]
            </p>
          </section>
        )}

        {/* Logged in */}
        {state === "logged-in" && (
          <section className="rounded-xl border bg-white p-6 space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-obie-teal px-4 py-3 text-sm text-obie-lime">
              <Lock className="h-4 w-4" />
              {t(copy.d2c.loggedInNotice, { email })}
            </div>
            <p className="text-sm text-muted-foreground">
              Already authenticated — no re-verification needed. Proceeds directly to checkout.
            </p>
            <Button className="w-full gap-2" size="lg">
              {copy.d2c.loggedInContinue} <ArrowRight className="h-4 w-4" />
            </Button>
          </section>
        )}
      </div>
    </PrototypeShell>
  );
}
