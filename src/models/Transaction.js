import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


export default class Transaction extends Model {
    static initModel(sequelize) {
    Transaction.init(
    {
        id:{type:DataTypes.UUID, defaultValue:DataTypes.UUIDV4, primaryKey:true},

        customerId:{ type:DataTypes.UUID, allowNull: false, field: 'customerId', references:{ model: 'Customer', key: 'id'}},

        amount:{ type:DataTypes.DECIMAL(15,2), allowNull: false, validate:{ min:0.01}},

        currency:{type:DataTypes.STRING, defaultValue: 'NGN'},


        transaction_type:{ type: DataTypes.STRING(50), allowNull: false},

        status:{ type:DataTypes.ENUM('pending', 'completed', 'failed', 'reversed'), defaultValue: 'pending'},

        location: {type: DataTypes.JSONB, defaultValue: {}},

        device_id:{type: DataTypes.UUID},

        risk_level:{type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'low'},
        fraud_score: {type: DataTypes.INTEGER, defaultValue:0, validate:{ min:0, max:100}},

        fraud_flags:{ type: DataTypes.JSONB, defaultValue:[]},

        ip_address: { type: DataTypes.STRING(64), allowNull: true }
    
        },
    {
        sequelize,
        modelName: 'Transaction',
        tableName: 'Transactions',
        timestamp: false,
        underscored: false
    }
    );


return Transaction;

    }};
