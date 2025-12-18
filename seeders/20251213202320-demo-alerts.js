'use strict';

/** @type {import('sequelize-cli').Migration} */

const Alerts = {
  async up (queryInterface, Sequelize) {
    // get transactions so we can link alerts to transactions and customers
    const [transactions] = await queryInterface.sequelize.query('SELECT id, customer_id FROM "Transactions" ORDER BY id ASC LIMIT 3');
    // generate ids in JS to avoid DB uuid function dependency
    const { randomUUID } = await import('crypto');
    await queryInterface.bulkInsert('Alerts', [
      {
        id: randomUUID(),
        customer_id: transactions[0].customer_id,
        transaction_id: transactions[0].id,
        alert_type: 'Fraud',
        severity: 'high',
        description: 'Suspicious transaction flagged',
        resolved: false,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: randomUUID(),
        customer_id: transactions[1].customer_id,
        transaction_id: transactions[1].id,
        alert_type: 'KYC',
        severity: 'medium',
        description: 'KYC mismatch detected',
        resolved: false,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: randomUUID(),
        customer_id: transactions[2].customer_id,
        transaction_id: transactions[2].id,
        alert_type: 'Risk',
        severity: 'low',
        description: 'Low risk anomaly',
        resolved: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  
  },

  async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Alerts', null, {});
  }
};

export default Alerts;