import DataTypes from 'sequelize';
import sequelize from '../config/database.js';

const ApiClient = sequelize.define('ApiClient', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},

    name: { type:DataTypes.STRING, allowNull: false},

    password:{ type:DataTypes.STRING, allowNull: false},

    work_email: {type: DataTypes.STRING, allowNull: false, unique: true, validate:{ isEmail:true}},

    api_key: {type: DataTypes.STRING, unique: true, allowNull: false},

    occupational_role: {type: DataTypes.ENUM('Compliance Officer', 'Fraud Analyst', 'Risk Manager', 'Operations/Admin', 'Developer/Technical', 'Executive'), defaultValue: 'Compliance Officer'},

    role: {type: DataTypes.ENUM('admin', 'user', 'viewer'), defaultValue: 'user'},

    permissions:{ type:DataTypes.JSONB, defaultValue:['read_customers', 'check_transactions', 'view_alerts']},

    active:{ type: DataTypes.BOOLEAN, defaultValue: true}


},
{ tableName: 'ApiClient',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

export default ApiClient;