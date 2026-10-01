import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy, t } from "@/lib/copy";
import { verifiedClients, unverifiedClients } from "@/lib/mock-data";
import { PrototypeShell, StatusBadge } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, User, CheckCircle2, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/agent/search")({
  component: AgentSearch,
  head: () => ({ meta: [{ title: title("Client Search") }] }),
});

function AgentSearch() {
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const lq = query.toLowerCase();
  const filteredVerified = query
    ? verifiedClients.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(lq) ||
          c.email?.toLowerCase().includes(lq)
      )
    : verifiedClients;
  const filteredUnverified = query
    ? unverifiedClients.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(lq)
      )
    : unverifiedClients;

  return (
    <PrototypeShell
      title={copy.search.pageTitle}
      subtitle="Step 1 of the agent quote flow — find or create the client"
      perspective="agent"
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={copy.search.searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowCreate(false);
              setSelectedClient(null);
            }}
            className="pl-10"
          />
        </div>

        {/* Verified clients */}
        {filteredVerified.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {copy.search.verifiedSection}
            </h2>
            <div className="space-y-2">
              {filteredVerified.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent ${
                    selectedClient === client.id
                      ? "border-primary bg-accent ring-1 ring-primary"
                      : "bg-card"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {client.firstName} {client.lastName}
                      </span>
                      <StatusBadge status="verified" />
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </span>
                      {client.policyCount > 0 && (
                        <span>
                          {client.policyCount} {client.policyCount === 1 ? "policy" : "policies"}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Unverified clients */}
        {filteredUnverified.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {copy.search.unverifiedSection}
            </h2>
            <div className="space-y-2">
              {filteredUnverified.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client.id)}
                  className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-accent ${
                    selectedClient === client.id
                      ? "border-primary bg-accent ring-1 ring-primary"
                      : "bg-card"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {client.firstName} {client.lastName}
                      </span>
                      <StatusBadge status="unverified" />
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {client.quoteCount} {client.quoteCount === 1 ? "quote" : "quotes"}
                      {" · "}No email on file
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredVerified.length === 0 && filteredUnverified.length === 0 && query && (
          <p className="text-center text-sm text-muted-foreground py-8">
            {copy.search.noResults}
          </p>
        )}

        {/* Create new */}
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="flex w-full items-center gap-4 rounded-lg border border-dashed p-4 text-left transition-colors hover:bg-accent"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed text-muted-foreground">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{copy.search.createNew}</p>
              <p className="text-xs text-muted-foreground">{copy.search.createNewSub}</p>
            </div>
          </button>
        ) : (
          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold">{copy.search.createNew}</h3>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{copy.search.formFirstName}</Label>
                  <Input id="firstName" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{copy.search.formLastName}</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">{copy.search.formPhone}</Label>
                  <Input id="phone" placeholder="(555) 555-0100" />
                </div>
                <div className="sm:col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreate(false)}>
                    {copy.shared.cancel}
                  </Button>
                  <Button>{copy.search.formCreate}</Button>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                No email field — email is collected on the review screen.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Selected action */}
        {selectedClient && (
          <div className="sticky bottom-4 flex justify-end">
            <Button size="lg" className="shadow-lg">
              Continue with selected client →
            </Button>
          </div>
        )}
      </div>
    </PrototypeShell>
  );
}
