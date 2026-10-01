import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { verifiedClients } from "@/lib/mock-data";
import { PrototypeShell, StatusBadge } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  PencilLine,
  Shield,
  ExternalLink,
  X,
} from "lucide-react";

export const Route = createFileRoute("/agent/profile")({
  component: AgentProfile,
  head: () => ({ meta: [{ title: title("Client Profile — Email Edit") }] }),
});

type State = "view" | "editing" | "collision" | "pending";

function AgentProfile() {
  const [state, setState] = useState<State>("view");
  const [newEmail, setNewEmail] = useState("");
  const client = verifiedClients[0]!; // Jane Doe
  const collisionClient = verifiedClients[1]!; // Ron Doe
  const clientName = `${client.firstName} ${client.lastName}`;
  const activePolicies = 3;

  function handleSave() {
    if (newEmail.toLowerCase() === collisionClient.email?.toLowerCase()) {
      setState("collision");
    } else {
      setState("pending");
    }
  }

  return (
    <PrototypeShell
      title={copy.profileEdit.pageTitle}
      subtitle="Agent or CSR editing a verified client's email — triggers endorsements on all policies"
      perspective="agent"
    >
      <div className="mx-auto max-w-lg space-y-6">
        {/* Client header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold">{clientName}</span>
                  <StatusBadge status="verified" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {activePolicies} active policies · Verified {client.verifiedDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">Account email</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current email */}
            <div className="space-y-2">
              <Label>{copy.profileEdit.currentEmailLabel}</Label>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium">{client.email}</span>
                {state === "pending" && (
                  <StatusBadge status="verified" />
                )}
              </div>
            </div>

            {/* View state */}
            {state === "view" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setState("editing")}
              >
                <PencilLine className="h-3 w-3" />
                {copy.shared.edit}
              </Button>
            )}

            {/* Editing state */}
            {state === "editing" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="newEmail">{copy.profileEdit.newEmailLabel}</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder={copy.profileEdit.newEmailPlaceholder}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(copy.profileEdit.helper, {
                    name: client.firstName,
                    count: activePolicies,
                  })}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={!newEmail || !newEmail.includes("@")}
                  >
                    {copy.profileEdit.saveButton}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewEmail("");
                      setState("view");
                    }}
                  >
                    {copy.shared.cancel}
                  </Button>
                </div>
              </div>
            )}

            {/* Collision — merge prompt */}
            {state === "collision" && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="space-y-3 flex-1">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                      {t(copy.profileEdit.collisionTitle, {
                        email: newEmail,
                        name: `${collisionClient.firstName} ${collisionClient.lastName}`,
                      })}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2"
                        onClick={() => setState("pending")}
                      >
                        <Shield className="h-4 w-4" />
                        {t(copy.profileEdit.collisionMerge, {
                          currentName: clientName,
                          name: `${collisionClient.firstName} ${collisionClient.lastName}`,
                        })}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2"
                        onClick={() => {
                          setNewEmail("");
                          setState("editing");
                        }}
                      >
                        {copy.profileEdit.collisionKeepSeparate}
                      </Button>
                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink className="h-3 w-3" />
                        {t(copy.profileEdit.collisionViewProfile, {
                          name: `${collisionClient.firstName} ${collisionClient.lastName}`,
                        })}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNewEmail("");
                      setState("editing");
                    }}
                    className="text-amber-600 hover:text-amber-900 dark:text-amber-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Pending confirmation */}
            {state === "pending" && (
              <div className="space-y-3">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Confirmation sent to {newEmail || "new@email.com"}
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        {client.firstName} needs to click the confirmation link. Until
                        then, {client.email} remains the active sign-in email. All{" "}
                        {activePolicies} active policies will be endorsed with the new
                        contact email once confirmed.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  A notification was also sent to {client.email} with a revert link
                  (valid 7 days).
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email update communications preview */}
        {state === "pending" && (
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-muted-foreground">
                Communications sent
              </h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    To new email
                  </Badge>
                </div>
                <p className="text-sm font-medium">
                  {copy.emailUpdate.confirmSubject}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(copy.emailUpdate.confirmBody, { count: activePolicies })}
                </p>
              </div>
              <div className="rounded-lg border p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    To old email
                  </Badge>
                </div>
                <p className="text-sm font-medium">
                  {copy.emailUpdate.notifySubject}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(copy.emailUpdate.notifyBody, {
                    newEmail: newEmail || "new@email.com",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PrototypeShell>
  );
}
