import DataTypes from 'sequelize';
import sequelize from '../config/database.js';

const ApiKey = sequelize.define('ApiKey', {
id: { type: DataTypes.STRING, primaryKey: true },

name: { type: DataTypes.STRING, allowNull: false },

hashed_key: { type: DataTypes.STRING, allowNull: false },

api_client_id: { type: DataTypes.UUID, allowNull: true },

org_id: { type: DataTypes.UUID, allowNull: true },

permissions: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },

revoked: { type: DataTypes.BOOLEAN, defaultValue: false },

revoked_at: { type: DataTypes.DATE, allowNull: true },

last_rotated_at: { type: DataTypes.DATE, allowNull: true },

created_by: { type: DataTypes.STRING, allowNull: true }
},

{
tableName: 'ApiKeys',
timestamps: true,
createdAt: 'created_at',
updatedAt: 'updated_at'
});

export default ApiKey;
