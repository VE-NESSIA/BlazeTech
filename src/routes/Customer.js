import express from 'express';
import requirePermission from '../middleware/requirePermission.js';
import { requireAuth } from '../middleware/simpleAuth.js';
import CustomerController from '../controllers/Customer.js';

const router = express.Router();

// List customers (requires read_customers)
router.get('/', requireAuth, requirePermission('read_customers'), CustomerController.getAllCustomers);

// Get single customer
router.get('/:id',requireAuth, requirePermission('read_customers'), CustomerController.getCustomerById);

export default router;
