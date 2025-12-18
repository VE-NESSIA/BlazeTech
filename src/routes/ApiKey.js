import express from 'express';
import { authenticateApiKey } from '../middleware/simpleAuth.js';
import requirePermission from '../middleware/requirePermission.js';
import controller from '../controllers/ApiKey.js';

const router = express.Router();

// All management endpoints require authentication + manage_api_keys permission
router.use(authenticateApiKey);
router.use(requirePermission('manage_api_keys'));

router.get('/', controller.listKeys);
router.post('/', controller.createKey);
router.post('/:id/rotate', controller.rotateKey);
router.post('/:id/revoke', controller.revokeKey);

export default router;
