import {DataTypes} from 'sequelize';
import sequelize from  '../config/database.js';
import Customer from './Customer.js';

const Transaction = sequelize.define('Transaction', {
    id:{type:DataTypes.UUID, defaultValue:DataTypes.UUIDV4, primaryKey:true},

    amount:{ type:DataTypes.DECIMAL(15,2), allowNull: false, validate:{ min:0.01}},

    currency:{type:DataTypes.STRING, default: 'NGN'},


    type:{ type:DataTypes.ENUM('credit', 'debit'), allowNull: false},

    status:{ type:DataTypes.ENUM('pending', 'completed', 'failed', 'reversed'), defaultValue: 'pending'},

    customerId:{ type:DataTypes.UUID, allowNull: false, field: 'customer_id', references:{ model: Customer, key: 'id'}}
    
        },
    {
    tableName: 'transactions',
    timestamp: true,
    underscored: true
})
;

Customer.hasMany(Transaction, {foreignKey: 'customer_id'});
Transaction.belongsTo(Customer, { foreignKey: 'customer_id'});

export default Transaction;