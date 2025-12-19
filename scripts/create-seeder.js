import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seederName = process.argv[2];
const modelName = process.argv[3] || 'Customer';
const count = parseInt(process.argv[4]) || 10;

if (!seederName) {
  console.error('Usage: node scripts/create-seeder.mjs <seeder-name> [model] [count]');
  console.log('Example: node scripts/create-seeder.mjs seed-customers Customer 50');
  process.exit(1);
}

const seedersDir = path.join(process.cwd(), 'seeders');
if (!fs.existsSync(seedersDir)) {
  fs.mkdirSync(seedersDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
const fileName = `${timestamp}-${seederName}.mjs`;
const filePath = path.join(seedersDir, fileName);

const template = `/** @type {import('sequelize-cli').Migration} */
export default {
async up(queryInterface, Sequelize) {
    console.log('Seeding: ${seederName}');
    
    // Add your ${modelName} seed data here
    // await queryInterface.bulkInsert('${modelName}s', [
    //   {
    //     name: 'Example',
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   }
    // ], {});
},

async down(queryInterface, Sequelize) {
    console.log('Reverting: ${seederName}');
    // await queryInterface.bulkDelete('${modelName}s', null, {});
}
};
`;

fs.writeFileSync(filePath, template);
console.log(`Created: ${fileName}`);
console.log(`Location: ${filePath}`);
console.log(`Model: ${modelName}`);