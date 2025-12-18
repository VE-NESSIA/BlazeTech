import DataTypes from 'sequelize';
import sequelize from '../config/database.js';

const OrgInfo = sequelize.define('OrgInfo', {
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
}, {
    tableName: 'org_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
});

export default OrgInfo;