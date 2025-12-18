'use strict';

/** @type {import('sequelize-cli').Migration} */
const api_client_migrations = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ApiClient', {
        id: { type:Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true},
    
        name: { type:Sequelize.STRING, allowNull: false},
        
        password:{ type:Sequelize.STRING, allowNull: false},
      
        work_email: {type: Sequelize.STRING, allowNull: false, unique: true, validate:{ isEmail:true}},
      
        api_key: {type:Sequelize.STRING, unique: true, allowNull: false},
    
        occupational_role: {type: Sequelize.ENUM('Compliance Officer', 'Fraud Analyst', 'Risk Manager', 'Operations/Admin', 'Developer/Technical', 'Executive'), defaultValue: 'Developer/Technical'},

        role: {type: Sequelize.ENUM('admin', 'user', 'viewer'), defaultValue: 'user'},
    
        permissions:{ type:Sequelize.JSONB, defaultValue:['read_customers', 'check_transactions']},
    
        active:{ type: Sequelize.BOOLEAN, defaultValue: true},

        created_at: { type:Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW},

        last_used: { type:Sequelize.DATE}
  });

  await queryInterface.createTable('Audit_logs', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },

    client_id: { type:Sequelize.STRING},

    client_name:{ type: Sequelize.STRING},

    action: {type: Sequelize.STRING, allowNull:false},

    entity_type: {type: Sequelize.STRING},

    entity_id: {type: Sequelize.STRING},

    ip_address:{ type:Sequelize.INET},

    user_agent:{ type:Sequelize.TEXT},

    details:{type:Sequelize.JSONB, defaultValue:{}},

    timestamp:{ type:Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW}
  });

  await queryInterface.addIndex('ApiClient', ['api_key'], {unique:true});
  await queryInterface.addIndex('Audit_logs', ['timestamp']);
  await queryInterface.addIndex('Audit_logs', ['action']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Audit_logs');
    await queryInterface.dropTable('ApiClient')
  }
};

export default api_client_migrations;
