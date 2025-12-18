import {DataTypes} from 'sequelize';
import sequelize from  '../config/database.js';
import Customer from './Customer.js';

const Transaction = sequelize.define('Transaction', {
    id:{type:DataTypes.UUID, defaultValue:DataTypes.UUIDV4, primaryKey:true},

    customerId:{ type:DataTypes.UUID, allowNull: false, field: 'customer_id', references:{ model: 'Customer', key: 'id'}},

    amount:{ type:DataTypes.DECIMAL(15,2), allowNull: false, validate:{ min:0.01}},

    currency:{type:DataTypes.STRING, defaultValue: 'NGN'},


    transaction_type:{ type: DataTypes.STRING(50), allowNull: false},

    status:{ type:DataTypes.ENUM('pending', 'completed', 'failed', 'reversed'), defaultValue: 'pending'},

    location: {type: DataTypes.JSONB, defaultValue: {}},

    device_id:{type: DataTypes.UUID
    },

    risk_level:{type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'low'},

    fraud_score: {type: DataTypes.INTEGER, defaultValue:0, validate:{ min:0, max:100}},

    fraud_flags:{ type: DataTypes.JSONB, defaultValue:[]}
    
        },
    {
    tableName: 'Transactions',
    timestamp: true,
    createdAt:'created_at',
    updatedAt:'updated_at',
    underscored: true
})
;


export default Transaction;