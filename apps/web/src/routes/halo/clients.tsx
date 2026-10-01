import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { title } from "@/lib/meta";
import { copy } from "@/lib/copy";
import { haloParentAccounts, haloUnverifiedClients } from "@/lib/mock-data";
import { PrototypeShell, StatusBadge } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Mail,
  User,
  Shield,
  Link2,
} from "lucide-react";

export const Route = createFileRoute("/halo/clients")({
  component: HaloClients,
  head: () => ({ meta: [{ title: title("Halo — Clients") }] }),
});

function HaloClients() {
  const [query, setQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["pa-1"]));

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const lq = query.toLowerCase();
  const filteredAccounts = query
    ? haloParentAccounts.filter(
        (a) =>
          a.email.toLowerCase().includes(lq) ||
          a.displayName.toLowerCase().includes(lq) ||
          a.akas.some((aka) => aka.toLowerCase().includes(lq))
      )
    : haloParentAccounts;

  const filteredUnverified = query
    ? haloUnverifiedClients.filter(
        (c) =>
          c.name.toLowerCase().includes(lq) ||
          c.agency.toLowerCase().includes(lq)
      )
    : haloUnverifiedClients;

  return (
    <PrototypeShell
      title={copy.halo.pageTitle}
      subtitle="Internal view — full identity graph visible to CSRs"
      perspective="internal"
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={copy.halo.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="verified">
          <TabsList>
            <TabsTrigger value="verified">
              {copy.halo.parentAccountsTab}
              <Badge variant="secondary" className="ml-2">
                {filteredAccounts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unverified">
              {copy.halo.unverifiedTab}
              <Badge variant="secondary" className="ml-2">
                {filteredUnverified.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Verified accounts */}
          <TabsContent value="verified">
            <div className="space-y-3 mt-4">
              {filteredAccounts.map((account) => {
                const isExpanded = expandedIds.has(account.id);
                return (
                  <Card key={account.id}>
                    <CardContent className="p-0">
                      {/* Parent row */}
                      <button
                        onClick={() => toggleExpanded(account.id)}
                        className="flex w-full items-center gap-4 p-4 text-left hover:bg-accent/50 transition-colors"
                      >
                        <div className="text-muted-foreground">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                          <Shield className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">
                              {account.displayName}
                            </span>
                            {account.akas.map((aka) => (
                              <Badge
                                key={aka}
                                variant="outline"
                                className="text-[10px] font-normal"
                              >
                                AKA {aka}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {account.email}
                            </span>
                            <span>
                              {account.partnerClients.length} partner{" "}
                              {account.partnerClients.length === 1 ? "client" : "clients"}
                            </span>
                            <span>
                              {account.totalPolicies}{" "}
                              {account.totalPolicies === 1 ? "policy" : "policies"}
                            </span>
                          </div>
                        </div>
                        <div className="hidden sm:block text-right">
                          <p className="text-xs text-muted-foreground">
                            Last login: {account.lastLogin}
                          </p>
                        </div>
                      </button>

                      {/* Nested partner clients */}
                      {isExpanded && (
                        <div className="border-t bg-muted/20">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs">
                                  {copy.halo.pcAgency}
                                </TableHead>
                                <TableHead className="text-xs">
                                  {copy.halo.pcName}
                                </TableHead>
                                <TableHead className="text-xs text-right">
                                  {copy.halo.pcPolicies}
                                </TableHead>
                                <TableHead className="text-xs text-right">
                                  {copy.halo.pcVerified}
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {account.partnerClients.map((pc, i) => (
                                <TableRow key={i}>
                                  <TableCell className="text-sm">{pc.agency}</TableCell>
                                  <TableCell className="text-sm">
                                    <span>{pc.name}</span>
                                    {pc.name !== account.displayName && (
                                      <Badge
                                        variant="outline"
                                        className="ml-2 text-[10px] font-normal"
                                      >
                                        AKA
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-sm text-right">
                                    {pc.policies}
                                  </TableCell>
                                  <TableCell className="text-sm text-right text-muted-foreground">
                                    {pc.verifiedDate}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Unverified clients */}
          <TabsContent value="unverified">
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">{copy.halo.uvName}</TableHead>
                    <TableHead className="text-xs">{copy.halo.uvAgency}</TableHead>
                    <TableHead className="text-xs text-right">
                      {copy.halo.uvQuotes}
                    </TableHead>
                    <TableHead className="text-xs text-right">
                      {copy.halo.uvCreated}
                    </TableHead>
                    <TableHead className="text-xs text-center">
                      {copy.halo.uvPendingLink}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnverified.map((client, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-medium">{client.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {client.agency}
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        {client.quotes}
                      </TableCell>
                      <TableCell className="text-sm text-right text-muted-foreground">
                        {client.created}
                      </TableCell>
                      <TableCell className="text-center">
                        {client.hasPendingLink ? (
                          <Badge
                            variant="outline"
                            className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          >
                            <Link2 className="mr-1 h-3 w-3" />
                            Sent
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PrototypeShell>
  );
}
