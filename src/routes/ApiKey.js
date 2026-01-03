import express from 'express';
import { requireAuth } from '../middleware/simpleAuth.js';
import requirePermission from '../middleware/requirePermission.js';
import controller from '../controllers/ApiKey.js';
import { requireVerifiedClient } from '../middleware/requireVerifiedClient.js';

const router = express.Router();

// All management endpoints require authentication + manage_api_keys permission
router.use(requireAuth);
router.use(requirePermission('manage_api_keys'));

router.get('/', controller.listKeys);
router.post('/',requireVerifiedClient,  controller.createKey);
router.post('/:id/rotate', requireVerifiedClient, controller.rotateKey);
router.post('/:id/revoke', requireVerifiedClient, controller.revokeKey);

export default router;
