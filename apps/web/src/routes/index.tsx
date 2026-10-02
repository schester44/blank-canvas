import { createFileRoute, Link } from "@tanstack/react-router";
import { title } from "@/lib/meta";
import {
  Search,
  FileCheck,
  Mail,
  MousePointerClick,
  Globe,
  ShieldCheck,
  Users,
  Settings,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [{ title: title("Contact Verification Prototype") }],
  }),
});

const screens = [
  {
    section: "Agent Flow",
    items: [
      {
        href: "/agent/search",
        icon: Search,
        label: "Client Search",
        desc: "Find or create clients",
      },
      {
        href: "/agent/review/unverified",
        icon: FileCheck,
        label: "Review — Unverified",
        desc: "Email entry + collision",
      },
      {
        href: "/agent/review/verified",
        icon: ShieldCheck,
        label: "Review — Verified",
        desc: "Signature only",
      },
      {
        href: "/agent/profile",
        icon: Settings,
        label: "Profile Email Edit",
        desc: "Endorsement flow",
      },
    ],
  },
  {
    section: "Client Experience",
    items: [
      {
        href: "/client/email",
        icon: Mail,
        label: "Email Preview",
        desc: "Inbox rendering",
      },
      {
        href: "/client/review",
        icon: MousePointerClick,
        label: "Click-Through",
        desc: "Review → sign → pay → done",
      },
    ],
  },
  {
    section: "D2C Flow",
    items: [
      {
        href: "/d2c/start",
        icon: Globe,
        label: "D2C Entry",
        desc: "Email-first start",
      },
      {
        href: "/d2c/checkout",
        icon: Mail,
        label: "Pre-Checkout",
        desc: "Verify before payment",
      },
    ],
  },
  {
    section: "Internal",
    items: [
      {
        href: "/halo/clients",
        icon: Users,
        label: "Halo Clients",
        desc: "Full identity graph",
      },
      {
        href: "/copy",
        icon: Pencil,
        label: "Copy Editor",
        desc: "All prototype strings",
      },
    ],
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-obie-surface">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-obie-teal">
            <span className="text-xs font-bold text-obie-lime">O</span>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">Contact Verification</h1>
            <p className="text-xs text-muted-foreground">Interactive prototype · All flows</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {screens.map((section) => (
            <div key={section.section} className="space-y-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {section.section}
              </h2>
              <div className="rounded-xl border bg-white">
                {section.items.map((item, i) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent",
                      i > 0 && "border-t"
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-obie-surface text-muted-foreground transition-colors group-hover:bg-obie-teal group-hover:text-obie-lime">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <span className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
