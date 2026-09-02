import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  customSessionClient,
} from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>(), adminClient()],
});

export const useSession = authClient.useSession;
