#!/usr/bin/env node
import dotenv from 'dotenv';
import Transaction from '../src/models/Transaction.js';
import Customer from '../src/models/Customer.js';
import fraudDetector from '../src/services/fraudDetector.js';

dotenv.config();

(async function main(){
try {
    // Create a test customer if none exists
    let cust = await Customer.findOne();
    if (!cust) {
    cust = await Customer.create({ name: 'Test', email: `test+${Date.now()}@example.com`, phone: '000', address: { country: 'NG', known_ips: ['127.0.0.1'] }, status: 'active' });
    } else {
      // ensure known ips/country present for test
    await cust.update({ address: { ...cust.address, country: 'NG', known_ips: ['127.0.0.1'] } });
    }

    // Create a transaction that triggers geo mismatch and large amount
    const t1 = await Transaction.create({ customerId: cust.id, amount: 20000, transaction_type: 'payment', status: 'completed', location: { country: 'US' }, ip_address: '203.0.113.5' });
    console.log('Created transaction', t1.id);
    
    const res = await fraudDetector.processTransaction(t1);
    console.log('Detection result:', res);
    process.exit(0);
} 

catch (err) {
    console.error(err);
    process.exit(1);
}
})();
