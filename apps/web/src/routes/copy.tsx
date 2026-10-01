import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { title } from "@/lib/meta";
import { copy } from "@/lib/copy";
import { PrototypeShell } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/copy")({
  component: CopyEditor,
  head: () => ({ meta: [{ title: title("Copy Editor") }] }),
});

type CopyEntry = {
  section: string;
  key: string;
  fullKey: string;
  value: string;
};

function flattenCopy(obj: Record<string, unknown>, prefix = ""): CopyEntry[] {
  const entries: CopyEntry[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      entries.push(...flattenCopy(value as Record<string, unknown>, fullKey));
    } else if (typeof value === "string") {
      const section = prefix.split(".")[0] || key;
      entries.push({ section, key, fullKey, value });
    }
  }
  return entries;
}

const sectionLabels: Record<string, string> = {
  search: "Agent: Client Search",
  review: "Agent: Review Screen",
  email: "Client: Email Template",
  clientReview: "Client: Click-Through",
  d2c: "D2C Flow",
  emailUpdate: "Email Update Confirmation",
  profileEdit: "Agent: Profile Email Edit",
  halo: "Halo: Internal Clients Tab",
  shared: "Shared",
};

function CopyEditor() {
  const [filter, setFilter] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const entries = useMemo(() => flattenCopy(copy as unknown as Record<string, unknown>), []);

  const filteredEntries = filter
    ? entries.filter(
        (e) =>
          e.fullKey.toLowerCase().includes(filter.toLowerCase()) ||
          e.value.toLowerCase().includes(filter.toLowerCase())
      )
    : entries;

  const grouped = useMemo(() => {
    const groups: Record<string, CopyEntry[]> = {};
    for (const entry of filteredEntries) {
      if (!groups[entry.section]) groups[entry.section] = [];
      groups[entry.section]!.push(entry);
    }
    return groups;
  }, [filteredEntries]);

  function handleCopyKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }

  return (
    <PrototypeShell
      title="Copy Editor"
      subtitle={`${entries.length} strings across ${Object.keys(sectionLabels).length} sections — edit copy.ts to change values`}
      perspective="utility"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter by key or value…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            All copy lives in <code className="rounded bg-muted px-1 py-0.5">src/lib/copy.ts</code>.
            Variables use <code className="rounded bg-muted px-1 py-0.5">{"{name}"}</code> syntax.
            Edit the file directly — changes hot-reload into all screens.
          </p>
        </div>

        {Object.entries(grouped).map(([section, sectionEntries]) => (
          <Card key={section}>
            <CardHeader>
              <h2 className="text-sm font-semibold">
                {sectionLabels[section] || section}
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectionEntries.map((entry) => (
                  <div key={entry.fullKey} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-mono text-muted-foreground">
                        {entry.fullKey}
                      </Label>
                      <button
                        onClick={() => handleCopyKey(entry.fullKey)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Copy key path"
                      >
                        {copiedKey === entry.fullKey ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                      {entry.value}
                      {entry.value.includes("{") && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {Array.from(entry.value.matchAll(/\{(\w+)\}/g)).map(
                            (match) => (
                              <Badge
                                key={match[1]}
                                variant="outline"
                                className="text-[10px] font-mono"
                              >
                                {`{${match[1]}}`}
                              </Badge>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredEntries.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No matching strings found.
          </p>
        )}
      </div>
    </PrototypeShell>
  );
}
