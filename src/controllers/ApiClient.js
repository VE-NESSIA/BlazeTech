import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import writeAudit from '../utils/audit.js';
import { signToken } from '../utils/jwt.js';
import { sendOtpEmail } from '../utils/mailer.js';

const SALT_ROUNDS = 10;

/* ============================
   SIGNUP
============================ */
export async function signup(req, res) {
  try {
    const { name, work_email, password, occupational_role, role } = req.body;

    if (!name || !work_email || !password) {
      return res.status(400).json({
        error: 'name, work_email and password required'
      });
    }

    // check existing client
    const existing = await prisma.apiClient.findUnique({
      where: { work_email }
    });

    if (existing) {
      return res.status(409).json({ error: 'email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // API token (shown once)
    const apiToken = crypto.randomBytes(32).toString('hex');
    const hashedApiToken = await bcrypt.hash(apiToken, SALT_ROUNDS);

    // create client
    const client = await prisma.apiClient.create({
      data: {
        name,
        work_email,
        password: hashedPassword,
        occupational_role,
        role,
        email_verified: false,
        otp_hash: otpHash,
        otp_expires_at: otpExpiry
      }
    });

    // create api key
    await prisma.apiKey.create({
      data: {
        name: `${name} initial key`,
        hashed_key: hashedApiToken,
        api_client_id: client.id,
        permissions: client.permissions,
        revoked: false
      }
    });

    // send otp
    await sendOtpEmail({
      toEmail: client.work_email,
      otp
    });

    // audit
    await writeAudit({
      actorId: client.id,
      actorName: client.name,
      action: 'apiclient.signup',
      entityType: 'apiclient',
      entityId: client.id,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    return res.status(201).json({
      api_key: apiToken,
      client: {
        id: client.id,
        name: client.name,
        work_email: client.work_email,
        occupational_role: client.occupational_role,
        role: client.role,
        permissions: client.permissions
      }
    });

  } catch (err) {
    console.error('signup error', err);
    return res.status(500).json({
      error: 'internal error',
      message: err.message
    });
  }
}

/* ============================
   LOGIN
============================ */
export async function login(req, res) {
  try {
    const { work_email, password } = req.body;

    if (!work_email || !password) {
      return res.status(400).json({
        error: 'work_email and password required'
      });
    }

    const client = await prisma.apiClient.findUnique({
      where: { work_email }
    });

    if (!client) {
      return res.status(404).json({ error: 'not found' });
    }

    const match = await bcrypt.compare(password, client.password);
    if (!match) {
      return res.status(403).json({ error: 'invalid credentials' });
    }

    if (!client.email_verified) {
      return res.status(403).json({ error: 'email not verified' });
    }

    const token = signToken({
      id: client.id,
      email: client.work_email,
      role: client.role
    });

    await writeAudit({
      actorId: client.id,
      actorName: client.name,
      action: 'apiclient.login',
      entityType: 'apiclient',
      entityId: client.id,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    return res.json({
      accessToken: token,
      client: {
        id: client.id,
        name: client.name,
        work_email: client.work_email,
        role: client.role,
        permissions: client.permissions
      }
    });

  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({
      error: 'internal error',
      message: err.message
    });
  }
}

/* ============================
   VERIFY OTP
============================ */
export async function verifyOtp(req, res) {
  try {
    const { work_email, otp } = req.body;

    const client = await prisma.apiClient.findUnique({
      where: { work_email }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (client.email_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    if (!client.otp_expires_at || client.otp_expires_at < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    const valid = await bcrypt.compare(String(otp), client.otp_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await prisma.apiClient.update({
      where: { id: client.id },
      data: {
        email_verified: true,
        otp_hash: null,
        otp_expires_at: null
      }
    });

    await writeAudit({
      actorId: client.id,
      actorName: client.name,
      action: 'apiclient.email_verified',
      entityType: 'apiclient',
      entityId: client.id
    });

    return res.json({ message: 'Email verified successfully' });

  } catch (err) {
    console.error('verifyOtp error', err);
    return res.status(500).json({
      error: 'internal error',
      message: err.message
    });
  }
}

/* ============================
   RESEND OTP
============================ */
export async function resendOtp(req, res) {
  try {
    const { work_email } = req.body;

    if (!work_email) {
      return res.status(400).json({ error: 'Work email is required' });
    }

    const client = await prisma.apiClient.findUnique({
      where: { work_email }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    if (client.email_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);

    await prisma.apiClient.update({
      where: { id: client.id },
      data: {
        otp_hash: otpHash,
        otp_expires_at: new Date(Date.now() + 10 * 60 * 1000)
      }
    });

    await sendOtpEmail({
      toEmail: client.work_email,
      otp
    });

    return res.status(200).json({
      message: 'OTP resent successfully'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({
      error: 'Failed to resend OTP'
    });
  }
}

export default {
  signup,
  login,
  verifyOtp,
  resendOtp
};
