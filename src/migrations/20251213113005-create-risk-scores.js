'use strict';

/** @type {import('sequelize-cli').Migration} */

const module = {
  async up(queryInterface, Sequelize) { 
    await queryInterface.createTable('risk_scores', {
      id: { type:Sequelize.UUID, defaultValue:Sequelize.UUIDV4, primaryKey:true},
  
      score: {type:Sequelize.INTEGER, allowNull: false, validate: { min:300, max: 850}},
  
      type: {type:Sequelize.ENUM('credit', 'fraud', 'overall'), allowNull: false},
  
      factors: { type:Sequelize.JSONB, allowNull: true, defaultValue: {}},
  
      customerId: { type:Sequelize.UUID, allowNull: false, field: 'customer_id'}
  },
  {
    tableName: 'risk_scores',
    timestamps: true,
    underscored: true
  
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('risk_scores');
  }
};

export default module;