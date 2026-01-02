'use strict';

import {faker} from '@faker-js/faker';

/** @type {import('sequelize-cli').Migration} */
export default {
async up(queryInterface, Sequelize) {
    const records = [];
    
    // Generate 25 ApiClient records
    for (let i = 0; i < 25; i++) {
    records.push({
        
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    work_email: faker.internet.email(),
    api_key: 'sk_live_' + faker.string.alphanumeric(32),
    occupational_role: faker.helpers.arrayElement(['Compliance Officer', 'Fraud Analyst', 'Risk Manager', 'Operations/Admin', 'Developer/Technical', 'Executive']),
    role: faker.helpers.arrayElement(['admin', 'user', 'viewer']),
    permissions: JSON.stringify(['transactions:read', 'customers:read', 'alerts:write', 'risk_scores:read']),
    active: faker.datatype.boolean({ probability: 0.9 }),
    created_at: new Date(),
    updated_at: new Date()
    
    });
    }
    
    await queryInterface.bulkInsert('ApiClient', records, {});
    console.log(` Seeded ${records.length} apiclient records`);
},

async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ApiClient', null, {});
    console.log(` Removed all apiclient records`);
}
};
