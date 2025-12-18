import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';

const Alert = sequelize.define('Alert', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }, 

    customerId: { type: DataTypes.UUID, allowNull: false, field: 'customer_id', references:{ model: 'Customers', key: 'id'}},

    transactionId: { type: DataTypes.UUID, allowNull: false, field: 'transaction_id', references:{ model: 'Transactions', key: 'id'}},

    alert_type:{ type: DataTypes.ENUM('KYC', 'Fraud', 'Compliance', 'Risk'), allowNull: false },

    severity:{ type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), defaultValue: 'low'},

    description:{ type: DataTypes.TEXT, allowNull: true },

    resolved: {type: DataTypes.BOOLEAN, defaultValue: false},

    resolvedAt: { type:DataTypes.DATE, allowNull: true, field: 'resolved_at'},

    resolution_notes: {type: DataTypes.STRING, allowNull: true}},


    {
        tableName: 'Alerts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        resolverAt: 'resolver_at',
        underscored: true
    });


    export default Alert;
