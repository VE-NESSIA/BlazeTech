import express from 'express';
import {
    ingestCustomerController,
    ingestTransactionsController,
    ingestFileController
} from '../controllers/ingestion.controller.js';

import { authenticateApiClient } from '../middleware/authenticateApiClient.js';
import { requireEmailVerified } from '../middleware/requireEmailVerified.js';
import { upload } from '../utils/multer.js';

const router = express.Router();

/**
 *  API-based ingestion
 */
router.post(
    '/customer',
    requireRole('developer'),
    requirePermission('ingestion:write'),
    authenticateApiClient,
    requireEmailVerified,
    ingestCustomerController
);

router.post(
    '/transactions',
    requireRole('developer'),
    requirePermission('ingestion:write'),
    authenticateApiClient,
    requireEmailVerified,
    ingestTransactionsController
);

/**
 *  File-based ingestion
 */
router.post(
    '/file',
    requireRole('developer'),
    requirePermission('ingestion:write'),
    authenticateApiClient,
    requireEmailVerified,
    upload.single('file'),
    ingestFileController
);

export default router;
