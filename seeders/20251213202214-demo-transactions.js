"use strict";

import { randomUUID } from 'crypto';

/** @type {import('sequelize-cli').Migration} */

const Transactions = {
  async up (queryInterface, Sequelize) {
    // fetch customer ids inserted by the customers seeder
    const [customers] = await queryInterface.sequelize.query('SELECT id FROM "Customers" ORDER BY name ASC LIMIT 3');
    await queryInterface.bulkInsert('Transactions', [
      {
        id: randomUUID(),
        amount: 1500.00,
        currency: 'NGN',
        transaction_type: 'credit',
        status: 'completed',
        customer_id: customers[0].id,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: randomUUID(),
        amount: 2500.50,
        currency: 'NGN',
        transaction_type: 'debit',
        status: 'pending',
        customer_id: customers[1].id,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        id: randomUUID(),
        amount: 5000000.75,
        currency: 'NGN',
        transaction_type: 'debit',
        status: 'failed',
        customer_id: customers[2].id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
},

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {});
  }
};

export default Transactions;
