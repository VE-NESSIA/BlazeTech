import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


export default class RiskScore extends Model {
    static initModel(sequelize) {
    RiskScore.init(
    {
        id: { type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey:true},

        score: {type:DataTypes.INTEGER, allowNull: false, validate: { min:300, max: 850}},

        type: {type:DataTypes.ENUM('credit', 'fraud', 'overall'), allowNull: false},

        factors: { type:DataTypes.JSONB, allowNull: true, defaultValue: {}},

        customerId: { type:DataTypes.UUID, allowNull: false, field: 'customer_id'}

},

    {
        sequelize,
        modelName: 'RiskScore',
        tableName: 'risk_scores',
        timestamps: false,
        underscored: false
    }
    );


return RiskScore;

    }};
