import express from 'express';
import { signup, login, verifyOtp } from '../controllers/ApiClient.js';
import { requireVerifiedClient } from '../middleware/requireVerifiedClient.js'

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp',requireVerifiedClient, verifyOtp);
router.post('/login', login);

export default router;
