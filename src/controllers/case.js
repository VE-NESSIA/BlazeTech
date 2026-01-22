import prisma from '../prisma/client.js';
import writeAudit from '../utils/audit.js';

export const createCaseFromAlert = async ({
alertId,
customerId,
priority,
createdBy
}) => {
const newCase = await prisma.case.create({
    data: {
    alertId,
    customerId,
    priority
    }
});

await writeAudit({
    actorId: createdBy.id,
    actorName: createdBy.name,
    action: 'case.created',
    entityType: 'Case',
    entityId: newCase.id
});

return newCase;
};

export const assignCase = async (caseId, analystId, actor) => {
const updated = await prisma.case.update({
    where: { id: caseId },
    data: {
        assignedToId: analystId,
        status: 'IN_REVIEW'
    }
});

await writeAudit({
    actorId: actor.id,
    actorName: actor.name,
    action: 'case.assigned',
    entityType: 'Case',
    entityId: caseId
});

return updated;
};

export const updateCaseStatus = async (caseId, status, actor) => {
const updated = await prisma.case.update({
    where: { id: caseId },
    data: { status }
});

await writeAudit({
    actorId: actor.id,
    actorName: actor.name,
    action: `case.status.${status.toLowerCase()}`,
    entityType: 'Case',
    entityId: caseId});

return updated;
};

export const closeCase = async (caseId, resolution, actor) => {
const closed = await prisma.case.update({
    where: { id: caseId },
    data: {
    status: 'CLOSED',
    resolution
    }
});

await writeAudit({
    actorId: actor.id,
    actorName: actor.name,
    action: 'case.closed',
    entityType: 'Case',
    entityId: caseId
});

return closed;
};
