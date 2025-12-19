export const up = async (queryInterface, Sequelize) => {
await queryInterface.createTable('audit_logs', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    
    client_id: { type: Sequelize.STRING(128) },
    
    client_name: { type: Sequelize.STRING(256) },
    action: { type: Sequelize.STRING(128), allowNull: false },
    
    entity_type: { type: Sequelize.STRING(64) },
    
    entity_id: { type: Sequelize.UUID },
    
    ip_address: { type: Sequelize.STRING(64) },
    
    user_agent: { type: Sequelize.STRING(256) },
    
    details: { type: Sequelize.JSONB, defaultValue: {} },
    
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
})
}

export const down = async (queryInterface, Sequelize) => {
await queryInterface.dropTable('audit_logs')
}
