import { db } from "@__APP_NAME__/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin as adminPlugin } from "better-auth/plugins/admin";
import { customSession } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import type { Role } from "./auth/roles";

export const auth = betterAuth({
  appName: "__APP_TITLE__",
  telemetry: {
    enabled: false,
  },

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  session: {
    cookieCache: {
      enabled: false,
    },
  },

  plugins: [
    adminPlugin(),
    customSession(async ({ user, session }) => {
      return {
        role: ((user as { role?: string }).role as Role) ?? "user",
        user,
        session,
      };
    }),
    tanstackStartCookies(), // Must be last
  ],
});
