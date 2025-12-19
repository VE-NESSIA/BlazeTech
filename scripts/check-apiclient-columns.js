import sequelize from '../src/config/database.js';

async function main() {
const [rows] = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ApiClient' ORDER BY ordinal_position");

console.log('Columns for ApiClient:');

console.table(rows);
}

main().catch(err => { console.error(err); process.exit(1); });
