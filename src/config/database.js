import { Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl =  process.env.DATABASE_URL;
const url =new URL(dbUrl);
const username =  process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port =process.env.DB_PORT;
const database = url.pathname.slice(1);

const sequelize = new Sequelize(database, username, password,{

        host: host,
        port: port,
        dialect: process.env.DB_DIALECT || 'postgres',
        logging: process.env.NODE_ENV ? console.log : false,
        dialectOptions: {
            ssl:{
                require:true,
                rejectUnauthorized: false
            }
        }, 
        pool: { 
            max: 5,
            min:0,
            acquire: 30000,
            idle: 10000
        }

    }
);

try{
    await sequelize.authenticate();
    console.log('Sequelize connected to PostgreSQL');
}

catch(error){
    console.log('Sequelize connection failed:', error);
}

export default sequelize;