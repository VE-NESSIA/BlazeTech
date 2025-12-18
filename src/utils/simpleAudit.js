import writeAudit from './audit.js';

export async function logAction ({ actorId = 'system', actorName = 'system', action = '', entity = {}, req = {}, details = {} } = {}) {
    try {
        await writeAudit({ actorId, actorName, action, entityType: entity.type, entityId: entity.id, ip: req.ip, userAgent: req?.headers?.['user-agent'], details });
    } catch (err) {
        console.error('logAction failed', err);
    }
}

export default logAction;