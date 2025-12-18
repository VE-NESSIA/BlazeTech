'use strict';

/** @type {import('sequelize-cli').Migration} */
const alert_migration = {
  async up (queryInterface, Sequelize) {
    // Use plural table name 'Alerts' to match models and other migrations
    await queryInterface.createTable('Alerts', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }, 

    customerId: { type: Sequelize.UUID, allowNull: false, field: 'customer_id', references:{ model: 'Customers', key: 'id'}},

    transactionId: { type: Sequelize.UUID, allowNull: false, field: 'transaction_id', references:{ model: 'Transactions', key: 'id'}},
    alert_type:{ type: Sequelize.ENUM('KYC', 'Fraud', 'Compliance', 'Risk'), allowNull: false },

    severity:{ type: Sequelize.ENUM('low', 'medium', 'high', 'critical'), defaultValue: 'low'},

    description:{ type: Sequelize.TEXT, allowNull: true },
    resolved: {type: Sequelize.BOOLEAN, defaultValue: false},

    resolvedAt: { type:Sequelize.DATE, allowNull: true, field: 'resolved_at'},

    resolution_notes: {type: Sequelize.STRING, allowNull: true},

    created_at: { type:Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

    updated_at: {type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW} });

    await queryInterface.addIndex('Alerts', ['customer_id']);
    await queryInterface.addIndex('Alerts', ['severity']);
    await queryInterface.addIndex('Alerts', ['created_at']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Alerts');
  }
};

export default alert_migration;
