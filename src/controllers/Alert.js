import {Customer} from '../models/index.js';
import {Transaction} from '../models/index.js';
import {Alert} from '../models/index.js';
import {ApiClient} from '../models/index.js';



export async function getAllAlerts(req, res) {
	try{
	const alerts = await Alert.findAll({
		limit: 50,
		order: [['createdAt', 'ASC']],
		include:[
		{
			model: Transaction, 
				include:[Customer]},
				{model:ApiClient }
		]}
					
);
	res.json(alerts);
}
catch (err){
console.error(err);
    return res.status(500).json({ error: 'internal error', message:err.message });
}
}

export async function getAlertById(req, res) {
	try{
	const { id } = req.params;

	const a = await Alert.findByPk(id, {
		include:[
		{
			model: Transaction, 
				include:[Customer]},
				{model:ApiClient }
		]});
	if (!a) return res.status(404).json({ error: 'not found' });
	res.json(a);
}
catch (err){
console.error(err);
    return res.status(500).json({ error: 'internal error', message:err.message });
}

}

// Get all alerts by severity
export async function getAllAlertsBySeverity(req, res) {
	try {
		const { severity } = req.params;

		const alerts = await Alert.findAll({
			where: { severity },
			order: [['createdAt', 'DESC']]
		});

		res.json({
			count: alerts.length,
			alerts
		});
	} catch (err) {
		console.error('getAllAlertsBySeverity error', err);
		res.status(500).json({ error: err.message });
	}
}

//Get all alerts by status
export async function getAllAlertsByStatus(req, res) {
	try {
		const { status } = req.params;

		const alerts = await Alert.findAll({
			where: { status },
			order: [['createdAt', 'DESC']]
		});

		res.json({
			count: alerts.length,
			alerts
		});
	} catch (err) {
		console.error('getAllAlertsByStatus error', err);
		res.status(500).json({ error: err.message });
	}
}


//Get one alert by severity
export async function getOneAlertBySeverity(req, res) {
	try {
		const { severity } = req.params;

		const alert = await Alert.findOne({
			where: { severity },
			order: [['createdAt', 'DESC']]
		});

		if (!alert) {
			return res.status(404).json({ error: 'Alert not found' });
		}

		res.json(alert);
	} catch (err) {
		console.error('getOneAlertBySeverity error', err);
		res.status(500).json({ error: err.message });
	}
}

// Get one alert by status
export async function getOneAlertByStatus(req, res) {
	try {
		const { status } = req.params;

		const alert = await Alert.findOne({
			where: { status },
			order: [['createdAt', 'DESC']]
		});

		if (!alert) {
			return res.status(404).json({ error: 'Alert not found' });
		}

		res.json(alert);
	} catch (err) {
		console.error('getOneAlertByStatus error', err);
		res.status(500).json({ error: err.message });
	}
}

