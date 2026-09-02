# blank-canvas

A blank-canvas starter for building apps with an AI assistant: TanStack
Start, Prisma, Tailwind v4 / shadcn, and zod — with Better Auth wired up
but dormant, so the default experience is a simple unauthenticated page
you can shape into anything.

Derived from [ts-starter](https://github.com/schester44/ts-starter); same
stack and structure, different starting point:

- `/` is a public placeholder page ("hello world — let's build something
  fun together"). No redirect into a dashboard.
- Auth (Better Auth: email/password, Google OAuth) and the `_authed`
  layout/routes are included but nothing forces you through them. Enable
  authentication whenever the app needs it by pointing routes at the
  `_authed` layout.
- No multi-tenancy: there are no organizations or memberships. Roles are
  app-wide (`admin` | `user`, via Better Auth's admin plugin).

## Quick Start

```bash
git clone git@github.com:schester44/blank-canvas.git my-app
cd my-app
./setup.sh
```

The setup script will ask for your app name and replace all placeholders,
install deps, and generate the Prisma client.

## Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React 19, Vite 7, Nitro)
- **Auth**: [Better Auth](https://better-auth.com) (email/password + Google OAuth; included, dormant by default; no organizations/multi-tenancy)
- **Database**: PostgreSQL + [Prisma](https://www.prisma.io)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (New York)
- **Validation**: [zod](https://zod.dev)
- **Monorepo**: Yarn 4 workspaces + [Turborepo](https://turbo.build)
- **Observability**: [OpenTelemetry](https://opentelemetry.io) (vendor-neutral)
- **Linting**: ESLint 9 (flat config) + Prettier

## Structure

```
apps/web               → TanStack Start application
apps/worker            → Background job worker (pg-boss)
packages/db            → Prisma schema, client & data migrations
packages/observability → OpenTelemetry setup
```
