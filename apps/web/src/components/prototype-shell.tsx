import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PrototypeShell({
  title,
  subtitle,
  perspective,
  children,
}: {
  title: string;
  subtitle?: string;
  perspective: "agent" | "client" | "d2c" | "internal" | "utility";
  children: React.ReactNode;
}) {
  const perspectiveLabels = {
    agent: "Agent POV",
    client: "Client POV",
    d2c: "D2C Client POV",
    internal: "Internal (Halo)",
    utility: "Utility",
  };

  const perspectiveColors = {
    agent: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    client: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    d2c: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    internal: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    utility: "bg-muted text-muted-foreground",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-4 p-4">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to prototype index</span>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold truncate">{title}</h1>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${perspectiveColors[perspective]}`}
              >
                {perspectiveLabels[perspective]}
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-4xl p-4 md:p-6">{children}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: "verified" | "unverified" | "pending" }) {
  if (status === "verified") {
    return (
      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        Verified
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
        Pending
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">Unverified</Badge>
  );
}
