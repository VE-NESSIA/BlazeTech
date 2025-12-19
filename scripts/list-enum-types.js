#!/usr/bin/env node
(async function main(){
try {
    const db = (await import('../src/config/database.js')).default;
    
    const [types] = await db.query("SELECT DISTINCT t.typname FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid ORDER BY t.typname");
    
    for (const { typname } of types) {
    const [labels] = await db.query(`SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid AND pg_type.typname = '${typname}' ORDER BY enumlabel`);
    console.log(typname, ':', labels.map(r=>r.enumlabel));
    }
    process.exit(0);
} 

catch (err) {
    console.error(err);
    process.exit(1);
}
})();
