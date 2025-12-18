'use strict';

import { randomUUID } from 'crypto';

/** @type {import('sequelize-cli').Migration} */

const Customers= {
  async up (queryInterface, Sequelize) {
    // Skip seeding if Customers already have data
    const [[{ count }]] = await queryInterface.sequelize.query('SELECT COUNT(*)::int AS count FROM "Customers"');
    if (count > 0) {
      console.log('Customers table already seeded, skipping.');
      return;
    }

    await queryInterface.bulkInsert('Customers', [
      {
        id: randomUUID(),
        name: 'Miracle Oyedepo',
        email:'miracle.oyedepo@example.com',
        phone: '+2345034868001',
        address: Sequelize.literal("'{}'::jsonb"),
        risk_score: 50,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: randomUUID(),
        name: 'Genevieve Takyi',
        email: 'gtakyi@yahoo.com',
        phone: '+233592445021',
        address: Sequelize.literal("'{}'::jsonb"),
        risk_score: 80,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: randomUUID(),
        name: 'Oga Dugu',
        email: 'Dugu@gmail.com',
        phone: '+2348034567890',
        address: Sequelize.literal("'{}'::jsonb"),
        risk_score: 20,
        created_at: new Date(),
        updated_at: new Date()
      }
        ]);
  },

  async down (queryInterface, Sequelize){
    await queryInterface.bulkDelete('Customers', null, {});
  }
};

export default Customers;