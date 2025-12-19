import sequelize from '../src/config/database.js';

async function main() {
const [rows] = await sequelize.query('SELECT id, client_id, action, entity_type, entity_id, details, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 20');
console.log('Latest audit rows:');
console.table(rows);
process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
