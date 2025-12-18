import Transaction from '../models/Transaction.js';
import Customer from '../models/Customer.js';

export async function getAllTransactions(req, res) {
	const transactions = await Transaction.findAll({ include: [{ model: Customer, attributes: ['id', 'first_name', 'last_name'] }] });
	res.json(transactions);
}

export async function getTransactionById(req, res) {
	const { id } = req.params;
	const tx = await Transaction.findByPk(id, { include: [{ model: Customer, attributes: ['id', 'first_name', 'last_name'] }] });
	if (!tx) return res.status(404).json({ error: 'not found' });
	res.json(tx);
}

export default { getAllTransactions, getTransactionById };
