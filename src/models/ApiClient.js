import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


export default class ApiClient extends Model {
    static initModel(sequelize) {
    ApiClient.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},

        name: { type:DataTypes.STRING, allowNull: false},

        password:{ type:DataTypes.STRING, allowNull: false},

        work_email: {type: DataTypes.STRING, allowNull: false, unique: true, validate:{ isEmail:true}},

        api_key: {type: DataTypes.STRING, unique: true, allowNull: false},

        occupational_role: {type: DataTypes.ENUM('Compliance Officer', 'Fraud Analyst', 'Risk Manager', 'Operations/Admin', 'Developer/Technical', 'Executive'), defaultValue: 'Compliance Officer'},

        role: {type: DataTypes.ENUM('admin', 'user', 'viewer'), defaultValue: 'user'},

        email_verified: {type: DataTypes.BOOLEAN, defaultValue:false},

        otp_hash: {type: DataTypes.STRING, allowNull: true},

        otp_expires_at: {type: DataTypes.DATE, allowNull: true},

        permissions:{ type:DataTypes.JSONB, defaultValue:['read_customers', 'check_transactions', 'view_alerts']},

        active:{ type: DataTypes.BOOLEAN, defaultValue: true},

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
        }


},

    {
        sequelize,
        modelName: 'ApiClient',
        tableName: 'ApiClient',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
    );


return ApiClient;

    }};
