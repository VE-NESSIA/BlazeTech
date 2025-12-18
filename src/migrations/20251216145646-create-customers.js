'use strict';

/** @type {import('sequelize-cli').Migration} */
const customer_migration= { async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      id:{type:Sequelize.UUID, defaultValue:Sequelize.UUIDV4, primaryKey: true},
      
      name:{type:Sequelize.STRING, allowNull : false, validate:{ notEmpty:true}},
      
      email:{type:Sequelize.STRING, allowNull: false, unique: true, validate:{isEmail:true}},

      phone:{type:Sequelize.STRING, allowNull: false, validate:{ notEmpty:true}},
      
      address:{ type:Sequelize.JSONB,  defaultValue: {}},
      
      risk_score:{ type:Sequelize.INTEGER, defaultValue: 0, validate:{min:0,
      max:100},
    
      status: { type: Sequelize.STRING(20), defaultValue: 'active' },
    
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },

      updated_at: { type: Sequelize.DATE, allowNull: false,  defaultValue: Sequelize.NOW}
    }
  });
},

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Customers');
  } }
;

export default customer_migration;