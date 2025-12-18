import express from 'express';
import requirePermission from '../middleware/requirePermission.js';
import { authenticateApiKey } from '../middleware/simpleAuth.js';
import CustomerController from '../controllers/Customer.js';

const router = express.Router();

// List customers (requires read_customers)
router.get('/', authenticateApiKey, requirePermission('read_customers'), CustomerController.getAllCustomers);

// Get single customer
router.get('/:id', authenticateApiKey, requirePermission('read_customers'), CustomerController.getCustomerById);

export default router;
