import express from 'express';
import { requireAuth } from '../middleware/simpleAuth.js';
import requirePermission from '../middleware/requirePermission.js';
import TransactionController from '../controllers/Transaction.js';

const router = express.Router();

router.get('/', requireAuth, requirePermission('check_transactions'), TransactionController?.getAllTransactions ?? ((req,res)=>res.status(501).json({error:'not implemented'})));
router.get('/:id', requireAuth, requirePermission('check_transactions'), TransactionController?.getTransactionById ?? ((req,res)=>res.status(501).json({error:'not implemented'})));
router.post('/', requireAuth, requirePermission('check_transactions'), TransactionController?.createTransaction ?? ((req,res)=>res.status(501).json({error:'not implemented'})));

export default router;
