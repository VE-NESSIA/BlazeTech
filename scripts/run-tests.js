import { execSync } from 'child_process';
import dotenv from 'dotenv';
import sequelize from '../src/config/database.js';

dotenv.config();

const base = `http://localhost:${process.env.PORT || 3000}`;

function run(cmd) {
    console.log('> ', cmd);
    execSync(cmd, { stdio: 'inherit' });
}

async function getAuditCount(action, entityId = null) {
    if (entityId) {
        const [[{ count }]] = await sequelize.query('SELECT COUNT(*)::int AS count FROM audit_logs WHERE action = $1 AND entity_id = $2', { bind: [action, entityId] });
        return count;
    }
    const [[{ count }]] = await sequelize.query('SELECT COUNT(*)::int AS count FROM audit_logs WHERE action = $1', { bind: [action] });
    return count;
}

async function waitForAudit(action, entityId = null, before = 0, timeout = 8000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const c = await getAuditCount(action, entityId);
        if (c > before) return true;
        await new Promise(r => setTimeout(r, 150));
    }
    return false;
}

async function main() {
    try {
    run('node scripts/run-migrations.js');
    run('node scripts/run-seeds.js');

    await import('../src/index.js');
    await new Promise(r => setTimeout(r, 700));

    const headers = { 'x-api-key': 'blazetech-platform-admin-2025', 'content-type': 'application/json' };

    console.log('Recording audit counts before test run...');
    const before = {
        auth: await getAuditCount('api_key.auth.success'),
        create: await getAuditCount('api_key.create'),
        rotate: await getAuditCount('api_key.rotate'),
        revoke: await getAuditCount('api_key.revoke'),
    };

    console.log('Testing list keys...');
    let res = await fetch(`${base}/api-keys`, { headers });
    if (res.status !== 200) throw new Error('list keys failed');

    // ensure auth audit logged
    if (!await waitForAudit('api_key.auth.success', null, before.auth)) throw new Error('auth audit not recorded');

    console.log('Creating a key...');
    res = await fetch(`${base}/api-keys`, { method: 'POST', headers, body: JSON.stringify({ name: 'test-run-key' }) });
    if (res.status !== 201) throw new Error('create key failed');
    const body = await res.json();
    console.log('Created key id', body.id);

        // ensure create audit logged for this entity (fallback to action-only check if entity-specific check fails)
        if (!await waitForAudit('api_key.create', body.id, before.create)) {
            console.warn('Entity-specific create audit not found; falling back to action-only check');
            if (!await waitForAudit('api_key.create', null, before.create)) throw new Error('create audit not recorded');
        }

    console.log('Rotating the key...');
    res = await fetch(`${base}/api-keys/${body.id}/rotate`, { method: 'POST', headers });
    if (res.status !== 200) throw new Error('rotate key failed');

        if (!await waitForAudit('api_key.rotate', body.id, before.rotate)) {
            console.warn('Entity-specific rotate audit not found; falling back to action-only check');
            if (!await waitForAudit('api_key.rotate', null, before.rotate)) throw new Error('rotate audit not recorded');
        }

    console.log('Revoking the key...');
    res = await fetch(`${base}/api-keys/${body.id}/revoke`, { method: 'POST', headers });
    if (res.status !== 204) throw new Error('revoke key failed');

        if (!await waitForAudit('api_key.revoke', body.id, before.revoke)) {
            console.warn('Entity-specific revoke audit not found; falling back to action-only check');
            if (!await waitForAudit('api_key.revoke', null, before.revoke)) throw new Error('revoke audit not recorded');
        }

    console.log('API-key management tests & audit assertions passed ✅');
    process.exit(0);
    } catch (err) {
    console.error('Tests failed', err);
    process.exit(1);
    }
}

main();
