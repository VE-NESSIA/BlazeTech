import express from 'express';
import { authenticateApiKey } from '../middleware/simpleAuth.js';
import requirePermission from '../middleware/requirePermission.js';
import TransactionController from '../controllers/Transaction.js';

const router = express.Router();

router.get('/', authenticateApiKey, requirePermission('check_transactions'), TransactionController?.getAllTransactions ?? ((req,res)=>res.status(501).json({error:'not implemented'})));
router.get('/:id', authenticateApiKey, requirePermission('check_transactions'), TransactionController?.getTransactionById ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

export default router;
