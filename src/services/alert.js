import { prisma } from '../lib/prisma.js';
import { audit } from './audit.js';

export async function raiseAlerts({ apiClient, customer, flags }) {
    const alerts = [];

for (const flag of flags) {
    const alert = await prisma.alert.create({
        data: {
        customerId: customer.id,
        severity: flag.severity,
        status: 'OPEN',
        reason: flag.code,
        metadata: flag
    }
    });

    await audit({
        actorType: 'SYSTEM',
        actorId: apiClient.id,
        action: 'ALERT_RAISED',
        entityType: 'Alert',
        entityId: alert.id,
        metadata: flag
    });

    alerts.push(alert);
    }

return alerts;
}
