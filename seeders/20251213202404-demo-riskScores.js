'use strict';

/** @type {import('sequelize-cli').Migration} */
const RiskScores = {
  async up (queryInterface, Sequelize) {
    const [customers] = await queryInterface.sequelize.query('SELECT id FROM "Customers" ORDER BY name ASC LIMIT 3');
    const { randomUUID } = await import('crypto');
    await queryInterface.bulkInsert('risk_scores', [
      {
        id: randomUUID(),
        score: 720,
        type: 'credit',
        factors: Sequelize.literal("'" + JSON.stringify({ paymentHistory: 'good', creditUtilization: 'low' }) + "'::jsonb"),
        customer_id: customers[0].id,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: randomUUID(),
        score: 650,
        type: 'fraud',
        factors: Sequelize.literal("'" + JSON.stringify({ transactionAnomalies: 'multiple failed logins' }) + "'::jsonb"),
        customer_id: customers[1].id,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: randomUUID(),
        score: 800,
        type: 'overall',
        factors: Sequelize.literal("'" + JSON.stringify({ creditScore: 780, fraudScore: 820 }) + "'::jsonb"),
        customer_id: customers[2].id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('risk_scores', null, {});
  }
};

export default RiskScores;