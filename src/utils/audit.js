import sequelize from '../config/database.js';
import { randomUUID } from 'crypto';

export async function writeAudit({ actorId = 'system', actorName = 'system', action = '', entityType = '', entityId = null, ip = null, userAgent = null, details = {} } = {}) {
try {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    await sequelize.query(
    `INSERT INTO audit_logs (id, client_id, client_name, action, entity_type, entity_id, ip_address, user_agent, details, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    {
        bind: [id, actorId, actorName, action, entityType, entityId, ip, userAgent, JSON.stringify(details), createdAt]
    }
    );
} catch (err) {
    console.error('Failed to write audit log', err);
}
}

export default writeAudit;
