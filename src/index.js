import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoutes from './routes/Customer.js';
import transactionRoutes from './routes/Transaction.js';
import alertRoutes from './routes/Alert.js';
import riskScoreRoutes from './routes/RiskScore.js';
import apiKeyRoutes from './routes/ApiKey.js';
import apiClientRoutes from './routes/ApiClient.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/customers', customerRoutes);
app.use('/transactions', transactionRoutes);
app.use('/alerts', alertRoutes);
app.use('/risk-scores', riskScoreRoutes);
app.use('/api-keys', apiKeyRoutes);
app.use('/api-clients', apiClientRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Server listening on port ${port}`);
});

export default app;

