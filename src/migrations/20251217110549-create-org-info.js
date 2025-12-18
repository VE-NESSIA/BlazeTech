'use strict';

/** @type {import('sequelize-cli').Migration} */
const Org_info = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('org_info',{
        id: {type: Sequelize.UUID, defaultValue:Sequelize.UUIDV4, primaryKey: true},
    
        regis_biz_name: {type:Sequelize.STRING, allowNull: false},
    
        trading_name: {type: Sequelize.STRING, allowNull: true},
    
        Countries_of_operation: {type: Sequelize.STRING, allowNull:false},
    
        Headquarter_address :{type: Sequelize.TEXT},
    
        Est_Customer_size: {type:Sequelize.TEXT},
    
        Website_url: {type: Sequelize.TEXT},
    
        License_number:{type: Sequelize.INTEGER},
    
        Tax_identification: { type: Sequelize.TEXT},
    
        Year_incorporated: {type: Sequelize.DATE}
    },

    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Org_info');
  }
};

export default Org_info;