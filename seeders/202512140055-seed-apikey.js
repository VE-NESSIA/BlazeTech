'use strict';

import {faker} from '@faker-js/faker';

/** @type {import('sequelize-cli').Migration} */
export default {
async up(queryInterface, Sequelize) {
    const records = [];
    
    // Generate 30 ApiKey records
    for (let i = 0; i < 30; i++) {
        //const plainKey = `sk_dev_${faker.string.alphanumeric(32)}`;
    records.push({
        
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
    });
    }
    
    await queryInterface.bulkInsert('ApiKeys', records, {});
    console.log(`Seeded ${records.length} apikey records`);
},

async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ApiKeys', null, {});
    console.log(` Removed all apikey records`);
}
};
