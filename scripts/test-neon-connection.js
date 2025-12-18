import Pool from 'pg'
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL ='postgresql://neondb_owner:npg_xdtKheCPnl74@ep-withered-meadow-ag1fgvaw-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

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
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
}

test();