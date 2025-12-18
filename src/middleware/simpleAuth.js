import sequelize from '../config/database.js';
import writeAudit from '../utils/audit.js';

/* Demo API keys - these are only for local/testing purposes.
    Roles defined below determine which role-scoped permissions are granted.
*/
const DEMO_API_KEYS = {
    // Fintech client user (limited)
    'blazetech-demo-2025': {
        id: 'demo-client-001',
        name: 'BlazeTech Fintech Client',
        role: 'user',
        occupational_role: ['Compliance Officer', 'Fraud Analyst', 'Risk Manager'],
        permissions: ['read_customers', 'check_transactions', 'view_alerts', 'view_risk_scores']
    },

    // Organization admin (belongs to a fintech org) - can manage org-level API keys
    'blazetech-org-admin-2025': {
        id: 'demo-org-admin-001',
        name: 'BlazeTech Organization Admin',
        role: 'org_admin',
        occupational_role: ['Operations/Admin'],
        permissions: ['read_customers', 'check_transactions', 'view_alerts', 'view_risk_scores', 'manage_clients']
    },

    // Platform-level admin (BlazeTech operators) - full platform privileges
    'blazetech-platform-admin-2025': {
        id: 'demo-platform-admin-001',
        name: 'BlazeTech Platform Admin',
        role: 'platform_admin',
        occupational_role: ['Executive'],
        permissions: ['read_customers', 'check_transactions', 'view_alerts', 'view_risk_scores', 'manage_clients', 'view_audit_logs', 'manage_api_keys']
    },

    // Key manager (specialized role that may be granted to a security/operator)
    'blazetech-keymgr-2025': {
        id: 'demo-keymgr-001',
        name: 'BlazeTech Key Manager',
        role: 'api_key_manager',
        occupational_role: ['Developer/Technical'],
        permissions: ['manage_api_keys']
    }
};

// Middleware to authenticate using a simple API key header (x-api-key)
export function authenticateApiKey(req, res, next) {
    (async () => {
        const key = req.get('x-api-key') || req.get('authorization')?.replace(/^ApiKey\s+/i, '');
        if (!key) return res.status(401).json({ error: 'API key required' });

        // First check demo keys (local/dev/back-compat)
        const demo = DEMO_API_KEYS[key];
        if (demo) {
            req.apiUser = demo;
            await writeAudit({ actorId: demo.id, actorName: demo.name, action: 'api_key.auth.success', details: { demo: true }, ip: req.ip, userAgent: req.get('user-agent') });
            return next();
        }

        // Otherwise check database-backed keys
        try {
            const { default: ApiKey } = await import('../models/ApiKey.js');
            const bcrypt = (await import('bcryptjs')).default;

            // naive approach: find non-revoked keys and compare hash
            const candidates = await ApiKey.findAll({ where: { revoked: false } });
            for (const c of candidates) {
                const match = await bcrypt.compare(key, c.hashed_key);
                if (match) {
                    const perms = Array.isArray(c.permissions) ? c.permissions : (c.permissions ? JSON.parse(c.permissions) : []);
                    req.apiUser = {
                        id: c.id,
                        name: c.name,
                        role: 'api_key',
                        permissions: perms,
                        org_id: c.org_id,
                        api_client_id: c.api_client_id
                    };
                    req.apiKeyRecord = c;
                    await writeAudit({ actorId: c.id, actorName: c.name, action: 'api_key.auth.success', entityType: 'api_key', entityId: c.id, ip: req.ip, userAgent: req.get('user-agent') });
                    return next();
                }
            }

            await writeAudit({ actorId: 'unknown', actorName: 'unknown', action: 'api_key.auth.fail', details: { attempted: true }, ip: req.ip, userAgent: req.get('user-agent') });
            return res.status(403).json({ error: 'Invalid API key' });
        } catch (err) {
            console.error('API key auth error', err);
            await writeAudit({ actorId: 'system', actorName: 'system', action: 'api_key.auth.error', details: { message: err.message }, ip: req.ip, userAgent: req.get('user-agent') });
            return res.status(500).json({ error: 'Internal auth error' });
        }
    })();
}

export default DEMO_API_KEYS;
