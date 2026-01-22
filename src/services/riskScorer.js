import { prisma } from '../lib/prisma.js';
import { audit } from './audit.js';

export async function computeRisk({ apiClient, customer, kycScore, amlScore }) {
  const score = kycScore + amlScore;

  const category =
    score > 700 ? 'HIGH' :
    score > 400 ? 'MEDIUM' :
    'LOW';

  await prisma.riskScore.create({
    data: {
      customerId: customer.id,
      score,
      category
    }
  });

  await prisma.customer.update({
    where: { id: customer.id },
    data: { riskScore: score }
  });

  await audit({
    actorType: 'SYSTEM',
    actorId: apiClient.id,
    action: 'RISK_SCORED',
    entityType: 'Customer',
    entityId: customer.id,
    metadata: { score, category }
  });

  return { score, category };
}
