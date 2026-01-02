import { Sequelize } from 'sequelize';

import Customer from './Customer.js';
import Transaction from './Transaction.js';
import Alert from './Alert.js';
import ApiClient from './ApiClient.js';
import ApiKey from './ApiKey.js';
import AuditLog from './Audit_log.js';
import RiskScore from './RiskScore.js';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
        require: true, 
        rejectUnauthorized: false }
},
    logging: console.log,
}
);


// Initialize models (CORRECT WAY)
Customer.initModel(sequelize);
Transaction.initModel(sequelize);
Alert.initModel(sequelize);
ApiClient.initModel(sequelize);
ApiKey.initModel(sequelize);
AuditLog.initModel(sequelize);
RiskScore.initModel(sequelize);

// Associations
ApiClient.hasMany(Customer, { foreignKey: 'api_client_id' });
Customer.belongsTo(ApiClient, { foreignKey: 'api_client_id' });

ApiClient.hasMany(Alert, { foreignKey: 'api_client_id' });
Alert.belongsTo(ApiClient, { foreignKey: 'api_client_id' });

Customer.hasMany(Transaction, { foreignKey: 'customerId' });
Transaction.belongsTo(Customer, { foreignKey: 'customerId' });

Transaction.hasOne(Alert, { foreignKey: 'transactionId' });
Alert.belongsTo(Transaction, { foreignKey: 'transactionId' });

ApiClient.hasMany(ApiKey, { foreignKey: 'api_client_id' });
ApiKey.belongsTo(ApiClient, { foreignKey: 'api_client_id' });

Customer.hasMany(RiskScore, { foreignKey: 'customer_id'});
RiskScore.belongsTo(Customer, { foreignKey: 'customer_id'});

export {
    sequelize,
    Customer,
    Transaction,
    Alert,
    ApiClient,
    ApiKey,
    AuditLog,
    RiskScore,
};
