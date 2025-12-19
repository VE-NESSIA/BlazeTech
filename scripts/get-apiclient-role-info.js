#!/usr/bin/env node
(async function main(){
try {
    const db = (await import('../src/config/database.js')).default;
    
    // Find table regclass
    const [[{ relname }]] = await db.query("SELECT relname FROM pg_class WHERE relname ILIKE 'api%client%' LIMIT 1");
    console.log('found table:', relname);
    if (!relname) return process.exit(0);
    
    const [[col]] = await db.query(`SELECT a.attname AS column_name, t.typname AS udt_name
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_type t ON a.atttypid = t.oid
    WHERE c.relname = '${relname}' AND a.attname = 'role' LIMIT 1`);
    
    console.log('role column info:', col);
    
    if (col && col.udt_name) {
    const [enumRows] = await db.query(`SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid AND pg_type.typname = '${col.udt_name}' ORDER BY enumlabel`);
    console.log('enum labels:', enumRows.map(r=>r.enumlabel));
    }
    process.exit(0);
} 

catch (err) {
    console.error(err);
    process.exit(1);
}
})();
