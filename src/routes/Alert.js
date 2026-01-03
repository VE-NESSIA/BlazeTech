import express from 'express';
import { requireAuth} from '../middleware/simpleAuth.js';
import requirePermission from '../middleware/requirePermission.js';
import {getAllAlerts, getAlertById, getAllAlertsBySeverity, getAllAlertsByStatus, getOneAlertBySeverity, getOneAlertByStatus} from '../controllers/Alert.js';
import { requireVerifiedClient } from '../middleware/requireVerifiedClient.js';

const router = express.Router();

router.get('/', requireAuth, requireVerifiedClient, requirePermission('view_alerts'), getAllAlerts ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

router.get('/severity/:severity', requireAuth, requireVerifiedClient, requirePermission('view_alerts'), getAllAlertsBySeverity ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

router.get('/status/:status', requireAuth, requireVerifiedClient, requirePermission('view_alerts'), getAllAlertsByStatus ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

router.get('/severity/:severity/latest', requireAuth, requireVerifiedClient, requirePermission('view_alerts'), getOneAlertBySeverity ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

router.get('/status/:status/latest', requireAuth, requireVerifiedClient, requirePermission('view_alerts'), getOneAlertByStatus ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

//router.get('/:id', requireAuth, requirePermission('view_alerts'), getAlertById ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

export default router;
