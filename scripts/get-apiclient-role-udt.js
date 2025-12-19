#!/usr/bin/env node
(async function main(){
try {
    const db = (await import('../src/config/database.js')).default;
    
    const [[row]] = await db.query("SELECT udt_name AS typname FROM information_schema.columns WHERE table_name = 'apiclient' AND column_name = 'role'");
    console.log('api client role udt name:', row && row.typname);
    
    const [enumRows] = await db.query(`SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid AND pg_type.typname = '${row.typname}' ORDER BY enumlabel`);
    console.log('enum labels:', enumRows.map(r=>r.enumlabel));
    process.exit(0);
} 

catch (err) {
    console.error(err);
    process.exit(1);
}
})();
