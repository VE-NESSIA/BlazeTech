'use strict';

import {faker} from '@faker-js/faker';

/** @type {import('sequelize-cli').Migration} */
export default {
async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Customers', null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
    });

    const records = [];
    
    // Generate 100 Customer records
    for (let i = 0; i < 100; i++) {
    records.push({
        
    id: faker.string.uuid(),
    name: faker.person.firstName()+ " "+ faker.person.lastName(),
    gender: faker.person.sex(['male', 'female']),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: JSON.stringify({ street: faker.location.streetAddress(), city: faker.location.city(), country: faker.location.country() }),
    national_id: faker.lorem.words(),
    risk_score: faker.number.int({ min: 0, max: 100 })
    });
    }
    
    await queryInterface.bulkInsert('Customers', records, {});
    console.log(` Seeded ${records.length} customer records`);
},

async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Customers', null, {
        truncate: true,
        cascade: true,
        restartIdentity: true,
    });

}
}