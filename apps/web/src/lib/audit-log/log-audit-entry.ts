import type { AuditLogEntityType, Prisma } from "@__APP_NAME__/db";
import { logAuditEntryInputSchema, type LogAuditEntryInput } from "./schemas";

/**
 * Log an audit entry for a business action.
 *
 * @example
 * ```typescript
 * await logAuditEntry(tx, {
 *   action: 'API_KEY_CREATED',
 *   entityType: 'API_KEY',
 *   entityId: apiKey.id,
 *   actor: { type: 'USER', id: user.id, name: user.name },
 *   metadata: { name: apiKey.name },
 * });
 * ```
 */
export async function logAuditEntry(
  tx: Prisma.TransactionClient,
  input: LogAuditEntryInput,
) {
  const validated = logAuditEntryInputSchema.parse(input);

  const auditLog = await tx.auditLog.create({
    data: {
      action: validated.action,
      entityType: validated.entityType,
      entityId: validated.entityId,
      actorType: validated.actor.type,
      actorId: validated.actor.type !== "SYSTEM" ? validated.actor.id : null,
      actorName: validated.actor.type === "USER" ? validated.actor.name : null,
      metadata: validated.metadata as Prisma.InputJsonValue,
      occurredAt: validated.occurredAt ?? new Date(),
    },
  });

  if (validated.relatedEntities?.length) {
    const existingEntities = new Set<string>();
    const entities: Array<{
      entityType: AuditLogEntityType;
      entityId: string;
    }> = [];

    for (const entity of validated.relatedEntities) {
      const key = `${entity.entityType}:${entity.entityId}`;

      if (existingEntities.has(key)) {
        continue;
      }

      existingEntities.add(key);
      entities.push(entity);
    }

    await tx.auditLogEntity.createMany({
      data: entities.map((entity) => ({
        auditLogId: auditLog.id,
        entityType: entity.entityType,
        entityId: entity.entityId,
      })),
    });
  }

  return auditLog;
}
