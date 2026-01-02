'use strict';

import {faker} from '@faker-js/faker';

/** @type {import('sequelize-cli').Migration} */
export default {
async up(queryInterface, Sequelize) {
    const transactions = await queryInterface.sequelize.query(
    `SELECT id, "customerId" FROM "Transactions";`,
    { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const records = [];

    transactions.forEach((tx) => {
    
    const numberOfAlerts = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 0; i < numberOfAlerts; i++) {
    records.push({
        
    id: faker.string.uuid(),
    customerId: tx.customerId,
    transactionId: tx.id,
    //api_client_id: faker.string.uuid(),
    alert_type: faker.helpers.arrayElement(['KYC', 'Fraud', 'Compliance', 'Risk']),
    severity: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
    status: faker.helpers.arrayElement(['dismissed', 'investigating','resolved', 'open']),
    color: faker.helpers.arrayElement(['green', 'yellow', 'red']),
    description: faker.lorem.paragraph().slice(0,255),
    createdAt: new Date(),
    updatedAt: new Date(), 
    });
    }
});
    await queryInterface.bulkInsert ('Alerts', records, {});
    console.log(` Seeded ${records.length} alert records`);
},

async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Alerts', null, {});
    console.log(`  Removed all alert records`);
}
};
