import type { Role } from "./roles";
import { rolePermissions, statement } from "./permissions";

export function checkPermission<
  Resource extends keyof typeof statement,
  Action extends (typeof statement)[Resource][number],
>(role: Role | null | undefined, resource: Resource, action: Action): boolean {
  if (!role) return false;

  const permissions = rolePermissions[role];
  if (!permissions) return false;

  const resourcePermissions = permissions[resource];

  if (!resourcePermissions) return false;

  return resourcePermissions.includes(action as never);
}
