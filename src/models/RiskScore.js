import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';
import Customer from './Customer.js';

const RiskScore = sequelize.define('RiskScore', {
    id: { type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey:true},

    score: {type:DataTypes.INTEGER, allowNull: false, validate: { min:300, max: 850}},

    type: {type:DataTypes.ENUM('credit', 'fraud', 'overall'), allowNull: false},

    factors: { type:DataTypes.JSONB, allowNull: true, defaultValue: {}},

    customerId: { type:DataTypes.UUID, allowNull: false, field: 'customer_id'}
},
{
    tableName: 'risk_scores',
    timestamps: true,
    underscored: true
});

Customer.hasMany(RiskScore, { foreignKey: 'customer_id'});
RiskScore.belongsTo(Customer, { foreignKey: 'customer_id'});

export default RiskScore;
