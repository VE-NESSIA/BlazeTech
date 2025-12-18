import Alert from '../models/Alert.js';
import ApiClient from '../models/ApiClient.js';

export async function getAllAlerts(req, res) {
	const alerts = await Alert.findAll({ include: [{ model: ApiClient, attributes: ['id', 'name'] }] });
	res.json(alerts);
}

export async function getAlertById(req, res) {
	const { id } = req.params;
	const a = await Alert.findByPk(id, { include: [{ model: ApiClient, attributes: ['id', 'name'] }] });
	if (!a) return res.status(404).json({ error: 'not found' });
	res.json(a);
}

export default { getAllAlerts, getAlertById };

