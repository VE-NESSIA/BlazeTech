import { Router } from 'express';
import {
    createCase,
    getAllCases,
    getCaseById,
    assignCaseToAnalyst,
    updateStatus,
    close
} from '../controllers/case.controller.js';

import auth from '../middleware/auth.js';
import requireRole from '../middleware/requireRole.js';

const router = Router();

router.use(auth);

router.post('/',   requireRole('analyst'),
requirePermission('case:write'),
createCase);
router.get('/',   requireRole('analyst'),
requirePermission('case:write'),
getAllCases);
router.get('/:id',   requireRole('analyst'),
requirePermission('case:write'),
getCaseById);

router.patch('/:id/assign',  requireRole('analyst'),
requirePermission('case:write'),
assignCaseToAnalyst);
router.patch('/:id/status',  requireRole('analyst'),
requirePermission('case:write'),
updateStatus);
router.patch('/:id/close',  requireRole('analyst'),
requirePermission('case:write'),
close);

export default router;
