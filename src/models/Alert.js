import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';
import Customer from'./Customer.js';
import Transaction from './Transaction.js';

const Alert = sequelize.define('Alert', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true }, 

    type:{ type: DataTypes.ENUM('KYC', 'Fraud', 'Compliance', 'Risk'), allowNull: false },

    severity:{ type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), defaultValue: false},

    description:{ type: DataTypes.TEXT, allowNull: true },

    customerId: { type: DataTypes.UUID, allowNull: false, field: 'customer_id', reference:{ model: Customer, key: 'id'}},

    transactionId: {type:DataTypes.UUID, allowNull:true, field: 'transaction_id', references: {model: Transaction, key: 'id'}},

    resolved: {type: DataTypes.BOOLEAN, defaultValue: false},

    resolvedAt: { type:DataTypes.DATE, allowNull: true, field: 'resolved_at'} },

    {
        tableName: 'alerts',
        timestamps: true,
        underscored: true
    });

    Customer.hasMany(Alert, { foreignKey: ' customer_id'});
    Alert.belongsTo(Customer, { foreignKey: 'customer_id'});

    Transaction.hasMany(Alert, {foreignKey: 'transaction_id'});
    Alert.belongsTo( Transaction, { foreignKey: 'transaction_id'});

    export default Alert;
