import sequelize from '../config/database.js';
import { randomUUID } from 'crypto';
import { AuditLog } from '../models/index.js';


export async function writeAudit({
    actorId = null,
    actorName = null,
    action,
    entityType,
    entityId = null,
    ip = null,
    userAgent = null,
    details = {},
} = {}) {
    
    try {
    await AuditLog.create({
        id: randomUUID(),
        api_client_id: actorId,
        client_name: actorName,
        action,
        entity_type: entityType,
        entity_id: entityId,
        ip_address: ip,
        user_agent: userAgent,
        details,
        created_at: new Date(),
    });
}   

catch (err) {
    console.error('Failed to write audit log', err);
}
}

export default writeAudit;
