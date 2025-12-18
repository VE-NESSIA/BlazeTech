import { Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl =  'postgresql://neondb_owner:npg_xdtKheCPnl74@ep-withered-meadow-ag1fgvaw-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'; //change it later
const url =new URL(dbUrl);
const username = 'neondb_owner';
const password = 'npg_xdtKheCPnl74';
const host = 'ep-withered-meadow-ag1fgvaw-pooler.c-2.eu-central-1.aws.neon.tech';
const port =5432;
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