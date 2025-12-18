import RiskScore from '../models/RiskScore.js';
import Customer from '../models/Customer.js';

export async function getAllRiskScores(req, res) {
	const rows = await RiskScore.findAll({ include: [{ model: Customer, attributes: ['id', 'first_name', 'last_name'] }] });
	res.json(rows);
}

export async function getRiskScoreById(req, res) {
	const { id } = req.params;
	const r = await RiskScore.findByPk(id, { include: [{ model: Customer, attributes: ['id', 'first_name', 'last_name'] }] });
	if (!r) return res.status(404).json({ error: 'not found' });
	res.json(r);
}

export default { getAllRiskScores, getRiskScoreById };
