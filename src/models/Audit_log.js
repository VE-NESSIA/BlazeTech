import { Model, DataTypes } from 'sequelize';

export default class AuditLog extends Model {
    static initModel(sequelize) {
    AuditLog.init(
        {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },

        api_client_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        client_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        action: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        entity_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        entity_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },

        ip_address: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        user_agent: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        details: {
            type: DataTypes.JSONB,
            allowNull: true,
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'AuditLog',
        tableName: 'audit_logs',
        timestamps: false, 
        underscored: true,
    }
    );
}
}
