import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { faker } from '@faker-js/faker';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();
const seedersDir = path.join(projectRoot, 'seeders');

// Ensure seeders directory exists
if (!fs.existsSync(seedersDir)) {
fs.mkdirSync(seedersDir, { recursive: true });
}

function generateTimestamp() {
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hour = String(now.getHours()).padStart(2, '0');
const minute = String(now.getMinutes()).padStart(2, '0');
return `${year}${month}${day}${hour}${minute}`;
}

function createSeeder(modelName, recordCount = 50) {
const timestamp = generateTimestamp();
const fileName = `${timestamp}-seed-${modelName.toLowerCase()}.js`;
const filePath = path.join(seedersDir, fileName);

  // Template based on models
const templates = {
    Customer: `
    id: faker.string.uuid(),
    name:{  
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName()},
    gender: faker.person.sex(['male', 'female']),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.address(),
    national_id: faker.datatype.text(),
    risk_score: faker.number.int({ min: 0, max: 100 })
    `,
    Transaction: `
    id: faker.string.alphanumeric(15).toUpperCase(),
    customerId: faker.string.uuid(),
    amount: parseFloat(faker.finance.amount({ min: 10, max: 50000, dec: 2 })),
    currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS']),
    transaction_type: faker.helpers.arrayElement(['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'payment', 'refund']),
    status: faker.helpers.arrayElement(['pending', 'completed', 'failed', 'cancelled', 'suspended']),
    location: faker.location.city(),
    metadata: JSON.stringify({
        ip_address: faker.internet.ip(),
        device_id: faker.string.uuid()
    }),
    risk_level: faker.helpers.arrayElement(['low', 'medium', 'high']),
    fraud_score: faker.number.int({ min: 0, max: 100 }),
    fraud_flags: JSON.stringify([faker.word.adjective(), faker.word.adjective()]),
    createdAt: new Date(),
    updatedAt: new Date()
    `,
    Alert: `
    id: faker.string.uuid(),
    customerId: faker.string.uuid(),
    transactionId: faker.string.alphanumeric(15).toUpperCase(),
    alert_type: faker.helpers.arrayElement(['fraud', 'compliance', 'aml', 'kyc', 'transaction_monitoring', 'sanctions']),
    severity: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
    color: faker.datatype.enum(['green', 'yellow', 'red']),
    description: faker.lorem.paragraph(),
    resolved: faker.helpers.boolean(),
    resolvedAt: faker.date.recent(),
    resolution_notes: faker.lorem.paragraph(),
    createdAt: new Date(),
    updatedAt: new Date(),    
    `,
    ApiKey: `
    id: faker.string.uuid(),
    name: faker.company.catchPhrase(),
    hashed_key: 'secret_' + faker.string.alphanumeric(48),
    api_client_id: faker.string.uuid(),
    org_id: faker.string.uuid(),
    permissions: JSON.stringify(['transactions:read', 'customers:read', 'alerts:write', 'risk_scores:read']),
    revoked: faker.datatype.boolean(),
    revoked_at: faker.date.future({ years: 1 }),
    last_rotated_at: faker.date.recent(),
    usageCount: faker.number.int({ min: 0, max: 10000 }),
    created_by: faker.person.fullName(),
    createdAt: new Date(),
    updatedAt: new Date()
    `,
    ApiClient: `
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    password: faker.string.password(),
    work_email: faker.internet.email(),
    api_key: 'sk_live_' + faker.string.alphanumeric(32),
    occupational_role: faker.datatype.enum(['Compliance Officer', 'Fraud Analyst', 'Risk Manager', 'Operations/Admin', 'Developer/Technical', 'Executive']),
    role: faker.datatype.enum(['admin', 'user', 'viewer']),
    permissions: JSON.stringify(['transactions:read', 'customers:read', 'alerts:write', 'risk_scores:read']),
    active: faker.datatype.boolean({ probability: 0.9 }),
    created_at: new Date(),
    last_used: faker.date.recent(),
    updated_at: new Date()
    `,
    RiskScore: `
    id: faker.string.uuid(),
    score: faker.number.int({ min: 0, max: 100 }),
    type: faker.helpers.arrayElement(['overall', 'transaction', 'kyc', 'behavioral', 'geographic']),
    factors: JSON.stringify([
        { name: 'transaction_frequency', score: faker.number.int({ min: 0, max: 10 }) },
        { name: 'amount_pattern', score: faker.number.int({ min: 0, max: 10 }) },
        { name: 'location_consistency', score: faker.number.int({ min: 0, max: 10 }) },
        { name: 'peer_comparison', score: faker.number.int({ min: 0, max: 10 }) },
        { name: 'document_verification', score: faker.number.int({ min: 0, max: 10 }) }
    ]),
    customer_id: faker.string.uuid()
    `,
    Org_info: `
    id: faker.string.uuid(),
    regis_biz_name: faker.company.name(),
    trading_name: faker.company.name(),
    Countries_of_operation: faker.location.country(),
    Headquarters_address: faker.location.streetAddress(),
    Est_Customer_size: faker.helpers.arrayElement(['1-10', '11-50', '51-200', '201-1000']),
    Website_url: faker.internet.url(),
    License_number: faker.string.alphanumeric(10).toUpperCase(),
    Tax_identification: faker.string.alphanumeric(10).toUpperCase(),
    Year_incorporated: faker.date.past({ years: 10 }),
    `
};

const template = templates[modelName];

if (!template) {
    console.error(` No template found for model: ${modelName}`);
    return null;
}

const seederContent = `'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up(queryInterface, Sequelize) {
    const records = [];
    
    // Generate ${recordCount} ${modelName} records
    for (let i = 0; i < ${recordCount}; i++) {
    records.push({
        ${template}
        createdAt: new Date(),
        updatedAt: new Date()
    });
    }
    
    await queryInterface.bulkInsert('${modelName}s', records, {});
    console.log(\` Seeded \${records.length} ${modelName.toLowerCase()} records\`);
},

async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('${modelName}s', null, {});
    console.log(\`  Removed all ${modelName.toLowerCase()} records\`);
}
};
`;

fs.writeFileSync(filePath, seederContent, 'utf8');
return fileName;
}

async function generateAllSeeders() {
console.log(' Generating seeders for BlazeTech models...\n');
const models = [
    { name: 'Customer', count: 100 },
    { name: 'Transaction', count: 500 },
    { name: 'Alert', count: 200 },
    { name: 'RiskScore', count: 100 },
    { name: 'ApiKey', count: 30 },
    { name: 'ApiClient', count: 25 },
    { name: 'Org_info', count: 10 }
];

const generatedFiles = [];

for (const model of models) {
    const fileName = createSeeder(model.name, model.count);
    if (fileName) {
    generatedFiles.push(fileName);
    console.log(` Created: ${fileName} (${model.count} records)`);
    }
}

console.log('\n🎉 Generated seeder files:');
generatedFiles.forEach(file => console.log(`   ${file}`));

console.log('\n Location:', seedersDir);
console.log('\n Next steps:');
console.log('  1. Run seeders: npx sequelize-cli db:seed:all');
console.log('  2. Run specific: npx sequelize-cli db:seed --seed [filename]');
console.log('  3. Undo all: npx sequelize-cli db:seed:undo:all');
}

// Run the generator
generateAllSeeders().catch(console.error);