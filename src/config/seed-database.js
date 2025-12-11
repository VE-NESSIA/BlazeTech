import sequelize from './database.js';
import Customer from '../models/Customer.js';
import Transaction from '../models/Transaction.js';
import Alert from '../models/Alert.js';
import RiskScore from '../models/RiskScore.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
    try{ 
        await RiskScore.destroy({where:{}});
        await Alert.destroy({where:{}});
        await Transaction.destroy({where:{}});
        await Customer.destroy({where:{}});

        console.log('Cleared existing data');

        const customers = await Customer.bulkCreate([
            {
                name: 'Miracle Oyedepo',
                email: 'miracle.oyedepo@example.com',
                phone: '+2345034868001',
                isPEP: false,
                country: 'Nigeria',
                riskLevel: 'medium'
            },

            {
                name: 'Genevieve Takyi',
                email: 'gtakyi@yahoo.com',
                phone: '+233592445021',
                country: 'Ghana',
                isPEP: true,
                riskLevel: 'high'
            },

            {
                name: 'Oga Dugu',
                email: 'Dugu@gmail.com',
                phone: '+2348034567890',
                country: 'Nigeria',
                isPEP: false,
                riskLevel: 'low'
            }
        ]);

        console.log(' Created customer details')

        const transactions = await Transaction.bulkCreate([
            {
                amount: 1500.00,
                currency: 'NGN',
                type: 'credit',
                status: 'completed',
                customerId: customers[0].id
            },

            {
                amount: 2500.50,
                currency: 'GHS',
                type: 'debit',
                status: 'pending',
                customerId: customers[1].id
            },
            
            {
                amount: 500.75,
                currency: 'NGN',
                type: 'debit',
                status: 'failed',
                customerId: customers[2].id
            }
        ]);

        console.log(' Created transaction records');

        const alerts = await Alert.bulkCreate([
            {
                type: 'Fraud',
                severity: 'high',
                description: 'Suspicious transaction pattern detected.',
                customerId: customers[0].id,
                transactionId: transactions[0].id,
                resolved: false
            },
            {
                type: 'KYC',
                severity: 'medium',
                description: 'Customer identification documents need verification.',
                customerId: customers[1].id,
                transactionId: null,
                resolved: false
            },

            {
            type: 'Fraud',
            severity: 'low',
            description: 'Routine compliance check required.',
            customerId: customers[2].id,
            transactionId: null,
            resolved: false
            }
        ]);

        console.log(' Created alert records');

        const riskScores = await RiskScore.bulkCreate([
            {
                score: 720, 
                type: 'credit',
                factors: { paymentHistory: 'good', creditUtilization: 'low' },
                customerId: customers[0].id
            },

            {
                score: 650,
                type: 'fraud',
                factors: { transactionAnomalies: 'multiple failed logins' },
                customerId: customers[1].id
            },

            {
                score: 800,
                type: 'overall',
                factors: { creditScore: 780, fraudScore: 820 },
                customerId: customers[2].id
            }

            ]);

            console.log(' Created risk score records');


            process.exit(0);}

            catch(error){
                console.error('Seeding database failed:', error);
                process.exit(1);
            }
}

seedDatabase();
        