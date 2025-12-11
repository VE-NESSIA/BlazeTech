import { Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.dbUrl;
const url =new URL(dbUrl);
const username = url.username;
const password = url.password;
const host = url.hostname;
const port = url.port;
const database = url.pathname.slice(1);

const sequelize = new Sequelize(database, username, password,{

        host: host,
        port: port,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
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