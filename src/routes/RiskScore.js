import express from 'express';
import { authenticateApiKey } from '../middleware/simpleAuth.js';
import requirePermission from '../middleware/requirePermission.js';
import RiskScoreController from '../controllers/RiskScore.js';

const router = express.Router();

router.get('/', authenticateApiKey, requirePermission('view_risk_scores'), RiskScoreController?.getAllRiskScores ?? ((req,res)=>res.status(501).json({error:'not implemented'})));
router.get('/:id', authenticateApiKey, requirePermission('view_risk_scores'), RiskScoreController?.getRiskScoreById ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

export default router;
