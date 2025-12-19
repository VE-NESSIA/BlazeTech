#!/usr/bin/env node
import dotenv from 'dotenv';
import job from '../src/jobs/process-transactions-fraud.js';

dotenv.config();

(async function main(){
try {
    console.log('Scanning and processing pending transactions for fraud...');
    
    const r = await job.processPendingTransactions({ limit: 500 });
    console.log('Processed', r.length, 'transactions');
    process.exit(0);
} 

catch (err) {
    console.error(err);
    process.exit(1);
}
})();
