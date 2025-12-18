import sequelize from './database.js';
import Customer from '../models/Customer.js';
import Transaction from '../models/Transaction.js';
import Alert from '../models/Alert.js';
import RiskScore from '../models/RiskScore.js';

async function setupDatabase() {
    try {
        await sequelize.sync({ force: true});

        console.log(' Database setup completed successfully.');

        await sequelize.query(`
            CREATE INDEX IF NOT EXISTS idx_transaction_customer_id ON "Transactions" (customer_id);
            CREATE INDEX IF NOT EXISTS idx_alert_customer_id ON "Alerts" (customer_id);
            CREATE INDEX IF NOT EXISTS idx_alert_resolved_id ON "Alerts" (resolved);
            CREATE INDEX IF NOT EXISTS idx_customer_is_pep ON "risk_scores" (is_pep);
            CREATE INDEX IF NOT EXISTS idx_customer_email ON "Customers" (email);`);

            console.log('Database indexes created successfully.');

            process.exit(0);

    } catch(error) {
        console.error('Database setup failed:', error);
        process.exit(1);

    }
    
}

setupDatabase();