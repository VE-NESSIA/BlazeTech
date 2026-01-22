import { ingestCustomer, ingestTransactions, ingestFile } from '../services/ingestion.service.js';
import writeAudit from '../utils/audit.js';

/**
 * API-based customer ingestion
 * Source: Partner fintech API
 */
export const ingestCustomerController = async (req, res) => {
    try {
    const apiClient = req.apiClient; // set by auth middleware
    const payload = req.body;

    if (!payload || !payload.external_customer_id) {
        return res.status(400).json({ error: 'Invalid customer payload' });
    }

    const result = await ingestCustomer({
        data: payload,
        source: 'API',
        apiClientId: apiClient.id
    });

    await writeAudit({
        actorId: apiClient.id,
        actorName: apiClient.name,
        action: 'data.ingest.customer',
        entityType: 'Customer',
        entityId: result.customer.id,
        metadata: { source: 'API' },
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    return res.status(201).json({
        message: 'Customer ingested successfully',
        customerId: result.customer.id,
        kycStatus: result.kycStatus,
        riskScore: result.riskScore
    });
    } catch (error) {
    console.error('Customer ingestion error:', error);
    return res.status(500).json({ error: error.message });
    }
};

/**
 * API-based transaction ingestion
 */
export const ingestTransactionsController = async (req, res) => {
    try {
    const apiClient = req.apiClient;
    const { customer_external_id, transactions } = req.body;

    if (!customer_external_id || !Array.isArray(transactions)) {
        return res.status(400).json({ error: 'Invalid transaction payload' });
    }

    const result = await ingestTransactions({
        customerExternalId: customer_external_id,
        transactions,
        source: 'API',
        apiClientId: apiClient.id
    });

    await writeAudit({
        actorId: apiClient.id,
        actorName: apiClient.name,
        action: 'data.ingest.transactions',
        entityType: 'Transaction',
        entityId: result.customerId,
        metadata: { count: transactions.length },
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    return res.status(201).json({
        message: 'Transactions ingested',
        ingestedCount: result.ingestedCount,
        flaggedTransactions: result.flaggedTransactions
    });
} catch (error) {
    console.error('Transaction ingestion error:', error);
    return res.status(500).json({ error: error.message });
}
};

/**
 * File-based ingestion (CSV / JSON)
 */
export const ingestFileController = async (req, res) => {
try {
    const apiClient = req.apiClient;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await ingestFile({
        filePath: file.path,
        mimeType: file.mimetype,
        apiClientId: apiClient.id
    });

    await writeAudit({
        actorId: apiClient.id,
        actorName: apiClient.name,
        action: 'data.ingest.file',
        entityType: 'IngestionBatch',
        entityId: result.batchId,
        metadata: {
        filename: file.originalname,
        records: result.totalRecords
    },
        ip: req.ip,
        userAgent: req.get('user-agent')
    });

    return res.status(201).json({
        message: 'File ingested successfully',
        batchId: result.batchId,
        totalRecords: result.totalRecords,
        errors: result.errors
    });
} catch (error) {
    console.error('File ingestion error:', error);
    return res.status(500).json({ error: error.message });
}
};
