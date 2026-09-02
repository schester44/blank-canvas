import type { Role } from "./roles";

/**
 * App-level resource permissions, checked against the user's role
 * (better-auth admin plugin: "admin" | "user").
 *
 * Define your resource permissions here. This must remain `as const` to
 * preserve literal types in consumers (PermissionGate, usePermission).
 */
export const statement = {
  developerTools: ["view"],
  users: ["update"],
  // Add your resource permissions below, e.g.:
  // post: ["create", "update", "delete"],
  // settings: ["view", "update"],
} as const;

type Statement = typeof statement;

export type RolePermissions = {
  [Resource in keyof Statement]?: readonly Statement[Resource][number][];
};

export const rolePermissions: Record<Role, RolePermissions> = {
  admin: {
    developerTools: ["view"],
    users: ["update"],
    // Add admin permissions for your resources here.
  },
  user: {
    // Add regular-user permissions for your resources here, e.g.:
    // post: ["create", "update"],
  },
};
