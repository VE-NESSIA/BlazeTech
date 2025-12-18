import Customer from '../models/Customer.js';
import Transaction from '../models/Transaction.js';
import Alert from '../models/Alert.js';

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
                    limit: 10,
                    order: [['created_at', 'DESC']]
                },
                {
                    model: Alert,
                    limit: 5,
                    order: [['created_at', 'DESC']]
                }
            ]
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

export default { getAllCustomers, getCustomerById, getHighRiskCustomers };