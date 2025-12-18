import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';

const Customer = sequelize.define('Customer', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    address: { type: DataTypes.JSONB, defaultValue: {} },
    risk_score: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0, max: 100 } }
}, {
    tableName: 'Customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

export default Customer;