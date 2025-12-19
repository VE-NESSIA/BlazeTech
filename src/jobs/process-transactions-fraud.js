import Transaction from '../models/Transaction.js';
import fraudDetector from '../services/fraudDetector.js';

export async function processPendingTransactions({ limit = 100 } = {}) {
  // Find recent transactions that have not been scored (fraud_score = 0)
const txs = await Transaction.findAll({ where: { fraud_score: 0 }, limit });
const results = [];
for (const tx of txs) {
    const r = await fraudDetector.processTransaction(tx);
    results.push({ id: tx.id, result: r });
}
return results;
}

export default { processPendingTransactions };
