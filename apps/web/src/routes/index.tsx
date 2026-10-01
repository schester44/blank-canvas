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
        title: "Client Search & Selection",
        desc: "Search, select verified/unverified clients, or create new",
      },
      {
        href: "/agent/review/unverified",
        icon: FileCheck,
        title: "Review Screen — Unverified",
        desc: "Email entry, send review link, collision prompt",
      },
      {
        href: "/agent/review/verified",
        icon: ShieldCheck,
        title: "Review Screen — Verified",
        desc: "Pre-filled email, send for signature only",
      },
    ],
  },
  {
    section: "Client Experience",
    items: [
      {
        href: "/client/email",
        icon: Mail,
        title: "Client Email",
        desc: "The review link email as it appears in the inbox",
      },
      {
        href: "/client/review",
        icon: MousePointerClick,
        title: "Client Click-Through",
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
        title: "D2C Entry",
        desc: "Email upfront, recognized vs new client",
      },
      {
        href: "/d2c/checkout",
        icon: Mail,
        title: "D2C Pre-Checkout",
        desc: "\"Check your email to complete checkout\"",
      },
    ],
  },
  {
    section: "Internal",
    items: [
      {
        href: "/halo/clients",
        icon: Users,
        title: "Halo Clients Tab",
        desc: "Parent accounts, nested verified clients, unverified section",
      },
      {
        href: "/agent/profile",
        icon: Settings,
        title: "Client Profile — Email Edit",
        desc: "Email change flow with endorsement messaging",
      },
    ],
  },
  {
    section: "Utilities",
    items: [
      {
        href: "/copy",
        icon: Pencil,
        title: "Copy Editor",
        desc: "Edit all prototype strings in one place",
      },
    ],
  },
];

function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl p-6 md:p-12 space-y-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Contact Verification Prototype
          </h1>
          <p className="mt-1 text-muted-foreground">
            Clickable mockups for every screen in the verification flow.
          </p>
        </div>

        {screens.map((section) => (
          <div key={section.section} className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.section}
            </h2>
            <div className="grid gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group flex items-start gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
