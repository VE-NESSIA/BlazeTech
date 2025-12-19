'use strict';

import {faker} from '@faker-js/faker';

/** @type {import('sequelize-cli').Migration} */
export default{
async up(queryInterface, Sequelize) {
    const records = [];
    
    // Generate 10 Org_info records
    for (let i = 0; i < 10; i++) {
    records.push({
        
    id: faker.string.uuid(),
    regis_biz_name: faker.company.name(),
    trading_name: faker.company.name(),
    Countries_of_operation: faker.location.country(),
    Headquarter_address: faker.location.streetAddress(),
    Est_Customer_size: faker.helpers.arrayElement(['1-10', '11-50', '51-200', '201-1000']),
    Website_url: faker.internet.url(),
    License_number: faker.string.alphanumeric(10).toUpperCase(),
    Tax_identification: faker.string.alphanumeric(10).toUpperCase(),
    Year_incorporated: faker.date.past({ years: 10 }),
    });
    }
    
    await queryInterface.bulkInsert('org_info', records, {});
    console.log(`Seeded ${records.length} org_info records`);
},

async down(queryInterface, Sequelize) {
    console.log(` Removed all org_info records`);
}
};
