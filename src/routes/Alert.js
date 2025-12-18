import express from 'express';
import { authenticateApiKey } from '../middleware/simpleAuth.js';
import requirePermission from '../middleware/requirePermission.js';
import AlertController from '../controllers/Alert.js';

const router = express.Router();

router.get('/', authenticateApiKey, requirePermission('view_alerts'), AlertController?.getAllAlerts ?? ((req,res)=>res.status(501).json({error:'not implemented'})));
router.get('/:id', authenticateApiKey, requirePermission('view_alerts'), AlertController?.getAlertById ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

export default router;
