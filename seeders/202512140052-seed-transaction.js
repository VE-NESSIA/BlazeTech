'use strict';

import {faker} from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

/** @type {import('sequelize-cli').Migration} */
export default {
async up(queryInterface, Sequelize) {
    const customers = await queryInterface.sequelize.query(
    `SELECT id FROM "Customers";`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
);

    const records = [];
    
    // Generate 500 Transaction records
    for (let i = 0; i < 500; i++) {
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    records.push({
        
    id: faker.string.uuid(),
    customerId: randomCustomer.id,
    amount: parseFloat(faker.finance.amount({ min: 10, max: 50000, dec: 2 })),
    currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS']),
    transaction_type: faker.helpers.arrayElement(['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'payment', 'refund']),
    status: faker.helpers.arrayElement(['pending', 'completed', 'failed', 'reversed']),
    location: JSON.stringify( faker.location.city()),
    ip_address: faker.internet.ip(),
    device_id: faker.string.uuid(),
    risk_level: faker.helpers.arrayElement(['low', 'medium', 'high']),
    fraud_score: faker.number.int({ min: 0, max: 100 }),
    fraud_flags: JSON.stringify([faker.word.adjective(), faker.word.adjective()]),
    createdAt: new Date(),
    updatedAt: new Date()
    });
    }
    
    await queryInterface.bulkInsert('Transactions', records, {});
    console.log(` Seeded ${records.length} transaction records`);
},

async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transactions', null, {});
    console.log(` Removed all transaction records`);
}
};
