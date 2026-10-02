import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { verifiedClients } from "@/lib/mock-data";
import { PrototypeShell, StatusBadge } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
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
  const client = verifiedClients[0]!;
  const collisionClient = verifiedClients[1]!;
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
      subtitle="Try ron.doe@email.com for merge prompt"
      perspective="agent"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Client header */}
        <section className="rounded-xl border bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{clientName}</span>
                <StatusBadge status="verified" />
              </div>
              <p className="text-xs text-muted-foreground">
                {activePolicies} active policies · Verified {client.verifiedDate}
              </p>
            </div>
          </div>
        </section>

        {/* Email section */}
        <section className="rounded-xl border bg-white">
          <div className="flex items-center gap-2 border-b px-5 py-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Account email
            </span>
          </div>
          <div className="p-5 space-y-4">
            {/* Current */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">{copy.profileEdit.currentEmailLabel}</Label>
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">{client.email}</span>
              </div>
            </div>

            {state === "view" && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setState("editing")}>
                <PencilLine className="h-3 w-3" />
                {copy.shared.edit}
              </Button>
            )}

            {state === "editing" && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="newEmail" className="text-xs font-medium">{copy.profileEdit.newEmailLabel}</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder={copy.profileEdit.newEmailPlaceholder}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(copy.profileEdit.helper, { name: client.firstName, count: activePolicies })}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={!newEmail || !newEmail.includes("@")}>
                    {copy.profileEdit.saveButton}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setNewEmail(""); setState("view"); }}>
                    {copy.shared.cancel}
                  </Button>
                </div>
              </div>
            )}

            {state === "collision" && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div className="space-y-3 flex-1">
                    <p className="text-sm font-medium text-amber-900">
                      {t(copy.profileEdit.collisionTitle, {
                        email: newEmail,
                        name: `${collisionClient.firstName} ${collisionClient.lastName}`,
                      })}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="justify-start gap-2 bg-white" onClick={() => setState("pending")}>
                        <Shield className="h-3.5 w-3.5" />
                        {t(copy.profileEdit.collisionMerge, { currentName: clientName, name: `${collisionClient.firstName} ${collisionClient.lastName}` })}
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start gap-2 bg-white" onClick={() => { setNewEmail(""); setState("editing"); }}>
                        {copy.profileEdit.collisionKeepSeparate}
                      </Button>
                      <button className="flex items-center gap-1.5 text-xs text-obie-link hover:underline mt-1">
                        <ExternalLink className="h-3 w-3" />
                        {t(copy.profileEdit.collisionViewProfile, { name: `${collisionClient.firstName} ${collisionClient.lastName}` })}
                      </button>
                    </div>
                  </div>
                  <button onClick={() => { setNewEmail(""); setState("editing"); }} className="text-amber-500 hover:text-amber-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {state === "pending" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-blue-600" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-900">
                        Confirmation sent to {newEmail || "new@email.com"}
                      </p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        {client.firstName} needs to click the confirmation link. Until then,{" "}
                        {client.email} remains active. All {activePolicies} policies will be
                        endorsed with the new email once confirmed.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  A notification with a revert link (7 days) was sent to {client.email}.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Communications preview */}
        {state === "pending" && (
          <section className="rounded-xl border bg-white">
            <div className="border-b px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Communications sent
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="rounded-lg border bg-obie-surface p-3 space-y-1">
                <Badge variant="outline" className="text-[10px]">To new email</Badge>
                <p className="text-sm font-medium">{copy.emailUpdate.confirmSubject}</p>
                <p className="text-xs text-muted-foreground">
                  {t(copy.emailUpdate.confirmBody, { count: activePolicies })}
                </p>
              </div>
              <div className="rounded-lg border bg-obie-surface p-3 space-y-1">
                <Badge variant="outline" className="text-[10px]">To old email</Badge>
                <p className="text-sm font-medium">{copy.emailUpdate.notifySubject}</p>
                <p className="text-xs text-muted-foreground">
                  {t(copy.emailUpdate.notifyBody, { newEmail: newEmail || "new@email.com" })}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </PrototypeShell>
  );
}
