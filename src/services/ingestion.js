import { prisma } from '../lib/prisma.js';
import { audit } from './audit.js';

/**
 * INGEST CUSTOMER (via API or file upload)
 */
export async function ingestCustomer({ apiClient, payload }) {
    const customer = await prisma.customer.create({
    data: {
        name: payload.name,
        email: payload.email,
        country: payload.country,
        ipAddress: payload.ipAddress,
        kycStatus: 'PENDING',
        riskScore: 0
    }
    });

    await audit({
    actorType: 'API_CLIENT',
    actorId: apiClient.id,
    action: 'CUSTOMER_INGESTED',
    entityType: 'Customer',
    entityId: customer.id,
    metadata: {
    source: payload.source || 'API'
    }
    });

    return customer;
}


/**
 * INGEST TRANSACTION
 */
export async function ingestTransaction({ apiClient, payload }) {
    const transaction = await prisma.transaction.create({
    data: {
        customerId: payload.customerId,
        amount: payload.amount,
        currency: payload.currency,
        location: payload.location
    }
    });

await audit({
    actorType: 'API_CLIENT',
    actorId: apiClient.id,
    action: 'TRANSACTION_INGESTED',
    entityType: 'Transaction',
    entityId: transaction.id,
    metadata: {
    amount: payload.amount
    }
    });

return transaction;
}
