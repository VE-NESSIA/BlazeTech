import RiskScore from '../models/RiskScore.js';
import Customer from '../models/Customer.js';

export async function getAllRiskScores(req, res) {
	try{
	const rows = await RiskScore.findAll({ include: [{ model: Customer,  }] });
	res.json(rows);
} 
catch (err){
console.error(err);
    return res.status(500).json({ error: 'internal error', message:err.message });
}

}

export async function getRiskScoreById(req, res) {
	const { id } = req.params;
	const r = await RiskScore.findByPk(id, { include: [{ model: Customer}] });
	if (!r) return res.status(404).json({ error: 'not found' });
	res.json(r);
}

export default { getAllRiskScores, getRiskScoreById };
