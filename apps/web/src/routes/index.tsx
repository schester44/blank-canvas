import { createFileRoute } from "@tanstack/react-router";
import { title } from "@/lib/meta";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [{ title: title() }],
  }),
});

/**
 * Placeholder landing page — this is a blank canvas.
 *
 * Replace this page (and everything else) with whatever you're building.
 * Auth (better-auth) is wired up but dormant: the /login route and the
 * `_authed` layout exist if you need protected pages later.
 */
function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Subtle dot grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,_color-mix(in_oklab,_var(--color-muted-foreground)_15%,_transparent)_1px,_transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,_black,_transparent)]"
      />

      <div className="relative flex max-w-xl flex-col items-center gap-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Your app is running
        </span>

        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Hello, world.
        </h1>

        <p className="text-balance text-lg text-muted-foreground">
          This is a blank canvas — let&apos;s build something fun together.
        </p>

        <p className="max-w-md text-balance text-sm text-muted-foreground/80">
          Describe what you want in the chat and watch this page change. Every
          edit hot-reloads right here.
        </p>
      </div>

      <footer className="absolute bottom-6 text-xs text-muted-foreground/60">
        TanStack Start · Tailwind · shadcn/ui · Postgres
      </footer>
    </main>
  );
}
