import { Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PrototypeShell({
  title,
  subtitle,
  perspective,
  children,
  maxWidth = "4xl",
}: {
  title: string;
  subtitle?: string;
  perspective: "agent" | "client" | "d2c" | "internal" | "utility";
  children: React.ReactNode;
  maxWidth?: "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full";
}) {
  const perspectiveConfig = {
    agent: { label: "Agent", color: "bg-obie-teal text-obie-lime" },
    client: { label: "Client", color: "bg-emerald-700 text-emerald-50" },
    d2c: { label: "D2C", color: "bg-obie-teal text-obie-lime" },
    internal: { label: "Internal", color: "bg-amber-700 text-amber-50" },
    utility: { label: "Utility", color: "bg-muted text-muted-foreground" },
  };

  const config = perspectiveConfig[perspective];
  const maxWidthClass = {
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    full: "max-w-full",
  }[maxWidth];

  return (
    <div className="min-h-screen bg-obie-surface">
      {/* Top bar — mimics Obie app header */}
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className={cn("mx-auto flex items-center gap-3 px-6 py-3", maxWidthClass)}>
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>

          {/* Obie logo mark */}
          <ObieLogo />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold truncate">{title}</h1>
              <span
                className={cn(
                  "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  config.color
                )}
              >
                {config.label}
              </span>
            </div>
            {subtitle && (
              <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </header>
      <main className={cn("mx-auto px-6 py-8", maxWidthClass)}>{children}</main>
    </div>
  );
}

export function ObieLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 32"
      fill="none"
      className={cn("h-6 w-auto", className)}
      aria-label="Obie"
    >
      {/* Stylized "obie" wordmark */}
      <text
        x="0"
        y="24"
        fontFamily="Geist, system-ui, sans-serif"
        fontWeight="700"
        fontSize="26"
        fill="currentColor"
        className="text-obie-teal"
      >
        obie
      </text>
    </svg>
  );
}

export function StatusBadge({ status }: { status: "verified" | "unverified" | "pending" }) {
  if (status === "verified") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-300 bg-emerald-50 text-emerald-800 font-medium text-[11px]"
      >
        Verified
      </Badge>
    );
  }
  if (status === "pending") {
    return (
      <Badge
        variant="outline"
        className="border-amber-300 bg-amber-50 text-amber-800 font-medium text-[11px]"
      >
        Pending
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="font-medium text-[11px]">
      Unverified
    </Badge>
  );
}
