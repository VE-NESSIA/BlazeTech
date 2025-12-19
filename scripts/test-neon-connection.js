import Pool from 'pg'
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool.Pool({connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function test(){
    try{
        const res = await pool.query('SELECT NOW()');
        console.log('Database connection:', res.rows[0]);
        await pool.end();
    } 
    
    catch (err) {
        console.error('Error connecting to database:', err);
    }
}

test();