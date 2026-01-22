import { prisma } from '../lib/prisma.js';
import { audit } from './audit.js';

export async function runKyc({ apiClient, customer }) {
    let score = 100;

if (!customer.email) score -= 30;
if (customer.country !== 'Nigeria') score -= 20;

const status =
    score >= 80 ? 'PASSED' :
    score >= 60 ? 'REVIEW' :
    'FAILED';

await prisma.customer.update({
    where: { id: customer.id },
    data: { kycStatus: status }
});

await audit({
    actorType: 'SYSTEM',
    actorId: apiClient.id,
    action: 'KYC_EVALUATED',
    entityType: 'Customer',
    entityId: customer.id,
    metadata: { score, status }
});

return { score, status };
}
