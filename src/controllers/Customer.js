import Customer from '../models/Customer.js';
import Transaction from '../models/Transaction.js';
import Alert from '../models/Alert.js';
import RiskScore from '../models/RiskScore.js';
import AuditLog from '../models/Audit_log.js';

const getAllCustomers = async (req, res) => {
    try{
        const customers = await Customer.findAll({
            order: [['risk_score', 'DESC']],
            limit: 50
        })
        res.json(customers);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
} 

const getCustomerById= async (req,res) => {
    const {id} = req.params;

    try{
        const customer = await Customer.findByPk(id, {
            include: [
                {
                    model: Transaction,
                    limit: 3,
                    order: [['createdAt', 'DESC']]
                }]
        });
        if(!customer){
            return res.status(400).json({error: 'Customer not found'});
        }

        res.json(customer);
    }
    catch (error){
        res.status(400).json({error: error.message});
    }
}

const getHighRiskCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({
            where: {
                risk_score: { $gte: 700 }
            },
            order: [['risk_score', 'DESC']],
            limit: 100
        });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get Customers by ID, Name or Email

async function resolveCustomer({ id, name, email }) {
    if (id) return Customer.findByPk(id);
    if (email) return Customer.findOne({ where: { email } });
    if (name) return Customer.findOne({ where: { name } });

    throw new Error('id, name or email is required');
}

// Customer 360
const getCustomerProfile =async (req, res) => {
try {
    const customer = await resolveCustomer(req.query);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const transactions = await Transaction.findAll({
        where: { customerId: customer.id },
        limit: 10,
        order: [['customerId', 'DESC']]
    });

    const riskScore = await RiskScore.findOne({
        where: { customerId: customer.id },
        order: [['customerId', 'DESC']]
    });

    res.json({
        customer,
        transactions,
        riskScore
    });
} catch (err) {
    res.status(400).json({ error: err.message });
}
}

// Automated Compliance Checks and Audit Trails
const getComplianceStatus =async (req, res) => {
try {
    const customer = await resolveCustomer(req.query);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const alerts = await Alert.findAll({
        where: { customerId: customer.id },
        order: [['createdAt', 'DESC']]
    });

    const auditLogs = await AuditLog.findAll({
        where: { entity_type: 'Customer', entity_id: customer.id },
        order: [['created_at', 'DESC']]
    });

    res.json({
        customerId: customer.id,
        complianceStatus: alerts.some(a => a.severity === 'critical')
        ? 'NON_COMPLIANT'
        : 'COMPLIANT',
        alerts,
        auditTrail: auditLogs
    });
} catch (err) {
    res.status(400).json({ error: err.message });
}
}

// Deterministic Credit Assessment
const getCreditAssessment = async (req, res) => {
try {
    const customer = await resolveCustomer(req.query);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const transactions = await Transaction.findAll({
        where: { customerId: customer.id }
    });

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const txCount = transactions.length;

    const riskScore = await RiskScore.findOne({
        where: { customerId: customer.id },
        order: [['customerId', 'DESC']]
    });

    const score =
        (txCount > 20 ? 30 : 10) +
        (totalAmount > 100000 ? 40 : 20) +
        (riskScore?.score >= 70 ? 30 : 10);

    res.json({
        customerId: customer.id,
        creditScore: score,
        decision:
        score >= 80 ? 'APPROVED' :
        score >= 60 ? 'REVIEW' :
        'REJECTED',
        basis: {
        transactionCount: txCount,
        totalAmount,
        riskScore: riskScore?.score ?? null
    }
    });
} catch (err) {
    res.status(400).json({ error: err.message });
}
}


export default { getAllCustomers, getCustomerById, getHighRiskCustomers, getCustomerProfile, getComplianceStatus, getCreditAssessment };