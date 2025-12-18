'use strict';

/** @type {import('sequelize-cli').Migration} */
const transaction_migration = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', { 
      id:{type:Sequelize.UUID, defaultValue:Sequelize.UUIDV4, primaryKey:true},

    // reference the actual table name created in customers migration
    customerId:{ type:Sequelize.UUID, allowNull: false, field: 'customer_id', references:{ model: 'Customers', key: 'id'}},

    amount:{ type:Sequelize.DECIMAL(15,2), allowNull: false, validate:{ min:0.01}},

    currency:{type:Sequelize.STRING, defaultValue: 'NGN'},


    transaction_type:{ type: Sequelize.STRING(50), allowNull: false},

    status:{ type:Sequelize.ENUM('pending', 'completed', 'failed', 'reversed'), defaultValue: 'pending'},

    location: {type: Sequelize.JSONB, defaultValue: {}},

    device_id:{type: Sequelize.UUID
    },

    risk_level:{type: Sequelize.ENUM('low', 'medium', 'high'), defaultValue: 'low'},

    fraud_score: {type: Sequelize.INTEGER, defaultValue:0, validate:{ min:0, max:100}},

    fraud_flags:{ type: Sequelize.JSONB, defaultValue:[]},

    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

    updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW}
    });

    await queryInterface.addIndex('Transactions', ['customer_id']);
    await queryInterface.addIndex('Transactions', ['status']);
    await queryInterface.addIndex('Transactions', ['created_at']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};

export default transaction_migration;