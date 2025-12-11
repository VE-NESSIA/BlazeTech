import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';

const Customer = sequelize.define('Customer',
    {
        id:{type:DataTypes.UUID, defaultValue:DataTypes.UUIDV4, primaryKey: true},

        name:{type:DataTypes.STRING, allowNull : false, validate:{ notEmpty:true}},

        email:{type:DataTypes.STRING, allowNull: false, unique: true, validate:{isEmail:true}},

        phone:{type:DataTypes.STRING, allowNull: false, validate:{ notEmpty:true}},

        isPEP:{ type:DataTypes.BOOLEAN, defaultValue: false, field: 'is_pep'
        },

        country:{ type:DataTypes.STRING, allowNull: false, defaultValue: 'Nigeria'},

        riskLevel:{ type:DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium', field: 'risk_level'},
    },
        {tableName:'customers',
            timestamps: true,
            underscored: true
        }
);

export default Customer;