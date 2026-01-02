import ApiClient from '../models/ApiClient.js';
import ApiKey from '../models/ApiKey.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import writeAudit from '../utils/audit.js';
import { signToken } from '../utils/jwt.js';
import { sendOtpEmail } from '../utils/mailer.js';

const SALT_ROUNDS = 10;

export async function signup(req, res) {
try {
    const { name, work_email, password, occupational_role, role } = req.body;
    if (!name || !work_email || !password) return res.status(400).json({ error: 'name, work_email and password required' });

    // check existing
    const existing = await ApiClient.findOne({ where: { work_email } });
    if (existing) return res.status(409).json({ error: 'email already registered' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, SALT_ROUNDS);

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    // generate API token for the client (plain token returned once)
    const apiToken = crypto.randomBytes(32).toString('hex');

    const client = await ApiClient.create({ name, work_email, password: hashed, api_key: apiToken, occupational_role, role, email_verified:false, otp_hash: otpHash, otp_expires_at : otpExpiry });

    await sendOtpEmail({
        toEmail: client.work_email,
        otp});

    // create an ApiKey record (hashed) so middleware can authenticate
    const apiKeyId = crypto.randomUUID();
    const hashedKey = await bcrypt.hash(apiToken, SALT_ROUNDS);
    await ApiKey.create({ id: apiKeyId, name: `${name} initial key`, hashed_key: hashedKey, api_client_id: client.id, permissions: client.permissions, revoked:false });


    await writeAudit({ actorId: client.id, actorName: client.name, action: 'apiclient.signup', entityType: 'apiclient', entityId: client.id, ip: req.ip, userAgent: req.get('user-agent') });

    return res.status(201).json({api_key: apiToken, client: { id: client.id, name: client.name, work_email: client.work_email, occupational_role:client.occupational_role,role: client.role, permissions: client.permissions } });
} catch (err) {
    console.error('signup error', err);
    return res.status(500).json({ error: 'internal error', message:err.message });
}
}

export async function login(req, res) {
try {
    const { work_email, password} = req.body;
    if (!work_email || !password) return res.status(400).json({ error: 'work_email and password required' });

    const client = await ApiClient.findOne({ where: { work_email } });
    if (!client) return res.status(404).json({ error: 'not found' });

    const match = await bcrypt.compare(password, client.password);
    if (!match) return res.status(403).json({ error: 'invalid credentials' });

    // generate new token 
    const token = signToken({
    id: client.id,
    email: client.email,
    role: client.role });

    

    // update client stored  token
    await client.update({ api_key: token });

    await writeAudit({ actorId: client.id, actorName: client.name, action: 'apiclient.sigup.otp_sent', entityType: 'apiclient', entityId: client.id, ip: req.ip, userAgent: req.get('user-agent') });

    return res.json({ accessToken: token, client: { id: client.id, name: client.name, work_email: client.work_email, role: client.role, permissions: client.permissions } });
} catch (err) {
    console.error('login error', err);
    return res.status(500).json({ error: 'internal error', message:err.message });
}
}

export async function verifyOtp(req, res) {
try {
    const { work_email, otp } = req.body;

    const client = await ApiClient.findOne({ where: { work_email } });
    if (!client) {
        return res.status(404).json({ error: 'Client not found' });
    }

    if (client.email_verified) {
        return res.status(400).json({ error: 'Email already verified' });
    }

    if (!client.otp_expires_at || client.otp_expires_at < new Date()) {
        return res.status(400).json({ error: 'OTP expired' });
    }

    const valid = await bcrypt.compare(otp, client.otp_hash);
    if (!valid) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Mark verified
    client.email_verified = true;
    client.otp_hash = null;
    client.otp_expires_at = null;
    await client.save();

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
    res.status(500).json({ error: 'internal error' });
}
}

export default { signup, login, verifyOtp
    
};

