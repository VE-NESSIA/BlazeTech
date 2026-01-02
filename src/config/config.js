import dotenv from 'dotenv';

dotenv.config();

const databaseConfig = {
    "development" : {
        url:process.env.DATABASE_URL,
        dialect:process.env.DB_DIALECT || 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    },
    "test" : {
        url:process.env.DATABASE_URL,
        dialect:process.env.DB_DIALECT || 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
                
            }
        }
    },
    "production" : {
        url:process.env.DATABASE_URL,
        dialect:process.env.DB_DIALECT || 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
}

export default databaseConfig;