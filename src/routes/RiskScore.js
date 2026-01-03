import express from 'express';
import { requireAuth } from '../middleware/simpleAuth.js';
import requirePermission from '../middleware/requirePermission.js';
import RiskScoreController from '../controllers/RiskScore.js';
import { requireVerifiedClient } from '../middleware/requireVerifiedClient.js';

const router = express.Router();

router.get('/', requireAuth, requireVerifiedClient, requirePermission('view_risk_scores'), RiskScoreController?.getAllRiskScores ?? ((req,res)=>res.status(501).json({error:'not implemented'})));
router.get('/:id', requireAuth, requireVerifiedClient, requirePermission('view_risk_scores'), RiskScoreController?.getRiskScoreById ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

export default router;
