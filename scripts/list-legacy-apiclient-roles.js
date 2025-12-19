#!/usr/bin/env node
(async function main(){
try {
    const db = (await import('../src/config/database.js')).default;
    
    const [rows] = await db.query('SELECT DISTINCT role::text AS role FROM "Api-Clients" ORDER BY role');
    console.log('legacy roles:', rows.map(r=>r.role));
    process.exit(0);
} 

catch (err) {
    console.error(err);
    process.exit(1);
}
})();
