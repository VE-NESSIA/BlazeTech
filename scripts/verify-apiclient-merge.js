#!/usr/bin/env node
(async function main(){
try {
    const db = (await import('../src/config/database.js')).default;
    
    const [[{ legacy_count }]] = await db.query('SELECT COUNT(*) AS legacy_count FROM "Api-Clients"');
    
    const [[{ canonical_count }]] = await db.query('SELECT COUNT(*) AS canonical_count FROM "ApiClient"');
    console.log('legacy count:', legacy_count, 'canonical count:', canonical_count);
    
    const [roleCounts] = await db.query('SELECT role::text AS role, COUNT(*) AS cnt FROM "ApiClient" GROUP BY role::text ORDER BY cnt DESC');
    console.log('role distribution in ApiClient:', roleCounts);
    
    const [missing] = await db.query('SELECT id FROM "Api-Clients" EXCEPT SELECT id FROM "ApiClient"');
    console.log('ids in legacy but missing in canonical (sample 10):', missing.slice(0,10).map(r=>r.id));
    process.exit(0);
} 

catch (err) {
    console.error(err);
    process.exit(1);
}
})();
