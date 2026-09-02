import z from "zod";

/**
 * User-level roles (better-auth admin plugin). There is no multi-tenancy
 * in this starter — roles apply to the whole app.
 */
export const roleSchema = z.enum(["admin", "user"]);

export type Role = z.infer<typeof roleSchema>;
