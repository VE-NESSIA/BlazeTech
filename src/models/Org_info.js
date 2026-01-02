import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


export default class OrgInfo extends Model {
    static initModel(sequelize) {
    OrgInfo.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    
        regis_biz_name: { type: DataTypes.STRING, allowNull: false },
    
        trading_name: { type: DataTypes.STRING, allowNull: true },
    
        countries_of_operation: { type: DataTypes.STRING, allowNull: false },
    
        headquarter_address: { type: DataTypes.TEXT },
    est_customer_size: { type: DataTypes.TEXT },
    
        website_url: { type: DataTypes.TEXT },
    
        license_number: { type: DataTypes.INTEGER },
    
        tax_identification: { type: DataTypes.TEXT },
    
        year_incorporated: { type: DataTypes.DATE }
},

    {
        sequelize,
        modelName: 'OrgInfo',
        tableName: 'org_info',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
    );


return OrgInfo;

    }};
