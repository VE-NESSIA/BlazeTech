import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';
import fraudDetector from '../services/fraudDetector.js';

export async function getAllTransactions(req, res) {
	const transactions = await Transaction.findAll({
		limit: 50,
		order: [['createdAt', 'ASC']]});
	res.json(transactions);
}

export async function getTransactionById(req, res) {
	const { id } = req.params;
	const tx = await Transaction.findByPk(id, { include: [{ model: Customer}] });
	if (!tx) return res.status(404).json({ error: 'not found' });
	res.json(tx);
}

export async function createTransaction(req, res) {
	try {
		const payload = req.body;
		// Minimal validation
		if (!payload.customerId || !payload.amount || !payload.transaction_type) {
			return res.status(400).json({ error: 'customerId, amount and transaction_type are required' });
		}

		const tx = await Transaction.create({
			customerId: payload.customerId,
			amount: payload.amount,
			currency: payload.currency || 'NGN',
			transaction_type: payload.transaction_type,
			status: payload.status || 'completed',
			location: payload.location || {},
			device_id: payload.device_id || null,
			ip_address: payload.ip_address || req.ip
		});

		// Run detector synchronously for now
		const result = await fraudDetector.processTransaction(tx);

		const fresh = await Transaction.findByPk(tx.id);
		res.status(201).json({ transaction: fresh, detection: result });
	} catch (err) {
		console.error('createTransaction error', err);
		res.status(500).json({ error: 'internal error' });
	}
}

export default { getAllTransactions, getTransactionById, createTransaction };
