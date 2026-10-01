import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { PrototypeShell } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, Mail, ArrowRight, CheckCircle2, Lock } from "lucide-react";

export const Route = createFileRoute("/d2c/start")({
  component: D2CStart,
  head: () => ({ meta: [{ title: title("D2C — Get a Quote") }] }),
});

type State = "entry" | "recognized" | "new" | "logged-in";

function D2CStart() {
  const [state, setState] = useState<State>("entry");
  const [email, setEmail] = useState("");

  function handleContinue() {
    if (email.toLowerCase() === "jane.doe@email.com") {
      setState("recognized");
    } else if (email.toLowerCase() === "returning@email.com") {
      setState("logged-in");
    } else {
      setState("new");
    }
  }

  return (
    <PrototypeShell
      title="D2C Flow — Entry"
      subtitle="Client-facing quote start. Try jane.doe@email.com (recognized) or returning@email.com (logged in) or anything else (new)"
      perspective="d2c"
    >
      <div className="mx-auto max-w-md space-y-8">
        {/* Brand header */}
        <div className="text-center space-y-3 pt-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold">
            O
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {copy.d2c.entryTitle}
          </h1>
          <p className="text-muted-foreground">{copy.d2c.entrySubtitle}</p>
        </div>

        {/* Email entry */}
        {state === "entry" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="d2c-email">{copy.d2c.emailLabel}</Label>
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
            </CardContent>
          </Card>
        )}

        {/* Recognized — existing account, not logged in */}
        {state === "recognized" && (
          <Card>
            <CardContent className="p-6 space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-base font-semibold">{copy.d2c.welcomeBack}</h2>
                <p className="text-sm text-muted-foreground">
                  We sent a sign-in link to <strong>{email}</strong>. Click it to continue.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setEmail("");
                  setState("entry");
                }}
              >
                Use a different email
              </Button>
            </CardContent>
          </Card>
        )}

        {/* New client — proceed to quoting */}
        {state === "new" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
              <h2 className="text-base font-semibold">Tell us about your property</h2>
              <p className="text-sm text-muted-foreground">
                The client proceeds through the quoting flow as an unverified client.
                Their email is stored on the quote — not on a client record yet.
                Verification happens at the end via magic link.
              </p>
              <div className="space-y-2">
                <Label>Property address</Label>
                <Input placeholder="1423 Maple Drive, Austin, TX 78701" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property type</Label>
                  <Input placeholder="Single family" />
                </div>
                <div className="space-y-2">
                  <Label>Year built</Label>
                  <Input placeholder="2004" />
                </div>
              </div>
              <Button className="w-full gap-2" size="lg">
                Get quotes
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                [This would continue through the full quoting flow →{" "}
                <a href="/d2c/checkout" className="underline hover:text-foreground">
                  skip to checkout
                </a>
                ]
              </p>
            </CardContent>
          </Card>
        )}

        {/* Already logged in — skip verification */}
        {state === "logged-in" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm dark:bg-emerald-950">
                <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300">
                  {t(copy.d2c.loggedInNotice, { email })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Client is already authenticated — no re-verification needed for this
                or any other partner. They proceed directly through quoting to checkout.
              </p>
              <Button className="w-full gap-2" size="lg">
                {copy.d2c.loggedInContinue}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PrototypeShell>
  );
}
