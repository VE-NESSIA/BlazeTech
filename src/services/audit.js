import { prisma } from '../lib/prisma.js';

export async function audit({
    actorType,
    actorId,
    action,
    entityType,
    entityId,
    metadata = {}
}) {
    return prisma.auditLog.create({
    data: {
        actorType,
        actorId,
        action,
        entityType,
        entityId,
        metadata
    }
    });
}
