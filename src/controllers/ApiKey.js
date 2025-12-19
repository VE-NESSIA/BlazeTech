import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import ApiKey from '../models/ApiKey.js';
import writeAudit from '../utils/audit.js';

export async function createKey(req, res) {
const { name, permissions = [], org_id = null, api_client_id = null, created_by = null } = req.body;
if (!name) return res.status(400).json({ error: 'name is required' });

const id = crypto.randomUUID();
const plaintext = crypto.randomBytes(32).toString('base64url');
const hashed = await bcrypt.hash(plaintext, 10);

const row = await ApiKey.create({ id, name, hashed_key: hashed, permissions, org_id, api_client_id, created_by });

  // Audit
await writeAudit({ actorId: req.apiUser?.id || 'unknown', actorName: req.apiUser?.name || 'unknown', action: 'api_key.create', entityType: 'api_key', entityId: id, details: { name, permissions, org_id, api_client_id } });

return res.status(201).json({ id: row.id, key: plaintext });
}

export async function listKeys(req, res) {
const where = {};
  // scope keys to org if user is org_admin
if (req.apiUser?.role === 'org_admin' && req.apiUser.org_id) {
    where.org_id = req.apiUser.org_id;
}

const keys = await ApiKey.findAll({ where, attributes: ['id', 'name', 'org_id', 'api_client_id', 'permissions', 'revoked', 'created_at', 'updated_at'] });
res.json(keys);
}

export async function rotateKey(req, res) {
const { id } = req.params;
const key = await ApiKey.findByPk(id);
if (!key) return res.status(404).json({ error: 'not found' });

  // scope check for org admins
if (req.apiUser?.role === 'org_admin' && req.apiUser.org_id && key.org_id !== req.apiUser.org_id) {
    return res.status(403).json({ error: 'forbidden' });
}

const plaintext = crypto.randomBytes(32).toString('base64url');
const hashed = await bcrypt.hash(plaintext, 10);
key.hashed_key = hashed;
key.last_rotated_at = new Date();
await key.save();

await writeAudit({ actorId: req.apiUser?.id || 'unknown', actorName: req.apiUser?.name || 'unknown', action: 'api_key.rotate', entityType: 'api_key', entityId: id });

return res.json({ id, key: plaintext });
}

export async function revokeKey(req, res) {
const { id } = req.params;
const key = await ApiKey.findByPk(id);
if (!key) return res.status(404).json({ error: 'not found' });

if (req.apiUser?.role === 'org_admin' && req.apiUser.org_id && key.org_id !== req.apiUser.org_id) {
    return res.status(403).json({ error: 'forbidden' });
}

key.revoked = true;
key.revoked_at = new Date();
await key.save();

await writeAudit({ actorId: req.apiUser?.id || 'unknown', actorName: req.apiUser?.name || 'unknown', action: 'api_key.revoke', entityType: 'api_key', entityId: id });

return res.status(204).send();
}

export default { createKey, listKeys, rotateKey, revokeKey };
