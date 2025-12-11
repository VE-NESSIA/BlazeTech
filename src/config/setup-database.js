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
            CREATE INDEX idx_transaction_customer_id ON transactions (customer_id);
            CREATE INDEX idx_alert_customer_id ON alerts (customer_id);
            CREATE INDEX idx_alert_resolved_id ON alerts (resolved);
            CREATE INDEX idx_customer_is_pep ON risk_scores (is_pep);
            CREATE INDEX idx_customer_email ON customers (email);`);

            console.log('Database indexes created successfully.');

            process.exit(0);

    } catch(error) {
        console.error('Database setup failed:', error);
        process.exit(1);

    }
    
}

setupDatabase();