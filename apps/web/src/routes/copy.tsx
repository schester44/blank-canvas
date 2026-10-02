import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { title } from "@/lib/meta";
import { copy } from "@/lib/copy";
import { PrototypeShell } from "@/components/prototype-shell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/copy")({
  component: CopyEditor,
  head: () => ({ meta: [{ title: title("Copy Editor") }] }),
});

type CopyEntry = { section: string; key: string; fullKey: string; value: string };

function flattenCopy(obj: Record<string, unknown>, prefix = ""): CopyEntry[] {
  const entries: CopyEntry[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      entries.push(...flattenCopy(value as Record<string, unknown>, fullKey));
    } else if (typeof value === "string") {
      entries.push({ section: prefix.split(".")[0] || key, key, fullKey, value });
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
  const filtered = filter
    ? entries.filter((e) => e.fullKey.toLowerCase().includes(filter.toLowerCase()) || e.value.toLowerCase().includes(filter.toLowerCase()))
    : entries;
  const grouped = useMemo(() => {
    const g: Record<string, CopyEntry[]> = {};
    for (const e of filtered) { (g[e.section] ??= []).push(e); }
    return g;
  }, [filtered]);

  function handleCopy(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }

  return (
    <PrototypeShell
      title="Copy Editor"
      subtitle={`${entries.length} strings — edit src/lib/copy.ts, changes hot-reload into all screens`}
      perspective="utility"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Filter by key or value…" value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-10 bg-white" />
        </div>

        {Object.entries(grouped).map(([section, sectionEntries]) => (
          <section key={section} className="rounded-xl border bg-white overflow-hidden">
            <div className="border-b px-5 py-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {sectionLabels[section] || section}
              </span>
            </div>
            <div className="divide-y">
              {sectionEntries.map((entry) => (
                <div key={entry.fullKey} className="px-5 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-[11px] font-mono text-muted-foreground">{entry.fullKey}</code>
                    <button onClick={() => handleCopy(entry.fullKey)} className="text-muted-foreground hover:text-foreground">
                      {copiedKey === entry.fullKey ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <p className="text-sm">{entry.value}</p>
                  {entry.value.includes("{") && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {Array.from(entry.value.matchAll(/\{(\w+)\}/g)).map((m) => (
                        <Badge key={m[1]} variant="outline" className="text-[10px] font-mono">{`{${m[1]}}`}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No matching strings.</p>
        )}
      </div>
    </PrototypeShell>
  );
}
