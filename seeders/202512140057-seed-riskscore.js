'use strict';

import {faker} from '@faker-js/faker';

/** @type {import('sequelize-cli').Migration} */
export default{
async up(queryInterface, Sequelize) {
    const records = [];
    
    // Generate 100 RiskScore records
    for (let i = 0; i < 100; i++) {
    records.push({
        
    id: faker.string.uuid(),
    score: faker.number.int({ min: 0, max: 100 }),
    type: faker.helpers.arrayElement(['overall', 'credit', 'fraud']),
    factors: JSON.stringify([
        { name: 'transaction_frequency', score: faker.number.int({ min: 0, max: 10 }) },
        { name: 'amount_pattern', score: faker.number.int({ min: 0, max: 10 }) },
        { name: 'location_consistency', score: faker.number.int({ min: 0, max: 10 }) },
        { name: 'peer_comparison', score: faker.number.int({ min: 0, max: 10 }) },
        { name: 'document_verification', score: faker.number.int({ min: 0, max: 10 }) }
    ]),
    customer_id: faker.string.uuid()
    });
    }
    
    await queryInterface.bulkInsert('risk_scores', records, {});
    console.log(`Seeded ${records.length} riskscore records`);
},

async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('risk_scores', null, {});
    console.log(` Removed all riskscore records`);
}
};
