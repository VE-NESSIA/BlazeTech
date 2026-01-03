import express from 'express';
import requirePermission from '../middleware/requirePermission.js';
import { requireAuth } from '../middleware/simpleAuth.js';
import CustomerController from '../controllers/Customer.js';
import { requireVerifiedClient } from '../middleware/requireVerifiedClient.js';

const router = express.Router();

// List customers (requires read_customers)
router.get('/', requireAuth, requireVerifiedClient, requirePermission('read_customers'), CustomerController.getAllCustomers);

router.get('/profile',requireAuth, requirePermission('read_customers'), CustomerController.getCustomerProfile);

router.get('/compliance',requireAuth, requireVerifiedClient, requirePermission('read_customers'), CustomerController.getComplianceStatus);

router.get('/credit',requireAuth, requireVerifiedClient, requirePermission('read_customers'), CustomerController.getCreditAssessment);

// Get single customer
router.get('/:id',requireAuth, requireVerifiedClient, requirePermission('read_customers'), CustomerController.getCustomerById);


export default router;
