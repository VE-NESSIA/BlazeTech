import sequelize from '../config/database.js';
import Customer from './Customer.js';
import Transaction from './Transaction.js';
import Alert from './Alert.js';
import ApiClient from './ApiClient.js';
import ApiKey from './ApiKey.js';

const models = { 
    Customer,
    Transaction,
    Alert,
    ApiClient,
    ApiKey,
    sequelize
};

ApiClient.hasMany(Customer,{foreignKey:'api_client_id'}),
Customer.belongsTo( ApiClient,{foreignKey: 'api_client_id'});

Customer.hasMany(Transaction, {foreignKey: 'customer_id'});
Transaction.belongsTo(Customer, {foreignKey: 'customer_id'});

ApiClient.hasMany(Alert, {foreignKey: 'api_client_id'});
Alert.belongsTo(ApiClient, {foreignKey : 'api_client_id'});

// Api keys can be scoped to a client
ApiClient.hasMany(ApiKey, { foreignKey: 'api_client_id' });
ApiKey.belongsTo(ApiClient, { foreignKey: 'api_client_id' });
Transaction.hasOne(Alert, {foreignKey: 'transaction_id'});
Alert.belongsTo(Transaction,{foreignKey: 'transaction_id'});


export default models;