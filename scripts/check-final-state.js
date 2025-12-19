#!/usr/bin/env node
(async function main(){
try {
    const db = (await import('../src/config/database.js')).default;
    
    const [[{ audit_legacy }]] = await db.query("SELECT (to_regclass('\"Audit_logs\"') IS NOT NULL) AS audit_legacy");
    
    const [[{ apiclient_legacy }]] = await db.query("SELECT (to_regclass('\"Api-Clients\"') IS NOT NULL) AS apiclient_legacy");
    
    const [[{ apiclient }]] = await db.query("SELECT (to_regclass('\"ApiClient\"') IS NOT NULL) AS apiclient");
    
    const [[{ enum_legacy_role }]] = await db.query("SELECT EXISTS(SELECT 1 FROM pg_type WHERE typname = 'enum_Api-Clients_role') AS exists");
    
    const [[{ enum_canonical_role }]] = await db.query("SELECT EXISTS(SELECT 1 FROM pg_type WHERE typname = 'enum_ApiClient_role') AS exists");
    
    console.log('Audit_logs legacy exists:', !!audit_legacy);
    
    console.log('Api-Clients legacy exists:', !!apiclient_legacy);
    
    console.log('ApiClient exists:', !!apiclient);
    
    
    console.log('enum_Api-Clients_role exists:', !!(enum_legacy_role && enum_legacy_role.exists));
    
    console.log('enum_ApiClient_role exists:', !!(enum_canonical_role && enum_canonical_role.exists));
    process.exit(0);
} 

catch (err) {
    console.error(err);

    process.exit(1);
}
})();
