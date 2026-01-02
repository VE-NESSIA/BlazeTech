import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


export default class Alerts extends Model {
    static initModel(sequelize) {
    Alerts.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }, 

        customerId: { type: DataTypes.UUID, allowNull: false, field: 'customerId', references:{ model: 'Customers', key: 'id'}},

        transactionId: { type: DataTypes.UUID, allowNull: false, field: 'transactionId', references:{ model: 'Transactions', key: 'id'}},

        api_client_id: {type: DataTypes.UUID,allowNull: false},

        alert_type:{ type: DataTypes.ENUM('KYC', 'Fraud', 'Compliance', 'Risk'), allowNull: false },

        severity:{ type: DataTypes.ENUM('low', 'medium', 'high', 'critical')}, 
    
        color: { type: DataTypes.ENUM('green', 'yellow', 'red'), defaultValue: 'green' },

        status: {type: DataTypes.ENUM('dismissed', 'investigating','resolved', 'open'), allowNull: false},

        description:{ type: DataTypes.TEXT, allowNull: true },
    },

    {
        sequelize,
        modelName: 'Alerts',
        tableName: 'Alerts',
        timestamps: true,
        underscored: false
    }
    );


return Alerts;

    }};
