'use strict';

/** @type {import('sequelize-cli').Migration} */
const apikey_migration = {
async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ApiKeys', { 
        id: { type: Sequelize.STRING, primaryKey: true },
    
        name: { type: Sequelize.STRING, allowNull: false },
    
        hashed_key: { type: Sequelize.STRING, allowNull: false },
    
        api_client_id: { type: Sequelize.UUID, field:'client_id', allowNull: true },
    
        org_id: { type: Sequelize.UUID, allowNull: true },
    
        permissions: { type: Sequelize.JSONB, allowNull: true, defaultValue: [] },
    
        revoked: { type: Sequelize.BOOLEAN, defaultValue: false },
    
        revoked_at: { type: Sequelize.DATE, allowNull: true },
    
        last_rotated_at: { type: Sequelize.DATE, allowNull: true },
    
        created_by: { type: Sequelize.STRING, allowNull: true }
    },
    
    {
    tableName: 'ApiKeys',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
    });


},

async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ApiKeys');
}
};

export default apikey_migration;