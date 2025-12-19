#!/usr/bin/env node
(async function main(){
try {
    const db = (await import('../src/config/database.js')).default;
    const [[{ relid }]] = await db.query("SELECT oid AS relid FROM pg_class WHERE relname = 'Api-Clients' LIMIT 1");
    
    if (!relid) { console.log('no Api-Clients table found'); return process.exit(0); }
    
    const [deps] = await db.query(`
    SELECT pg_depend.classid::regclass AS dependent_class, objid::regclass AS dependent_object, deptype
    FROM pg_depend
    WHERE refobjid = ${relid}
    `);
    
    console.log('dependencies:', deps);
    // Also list constraints referencing it
    
    const [cons] = await db.query(`SELECT conname, contype, conrelid::regclass AS table FROM pg_constraint WHERE confrelid = ${relid} OR conrelid = ${relid}`);
    
    console.log('constraints:', cons);
    process.exit(0);
}

catch (err) {
    console.error(err);
    process.exit(1);
}
})();
