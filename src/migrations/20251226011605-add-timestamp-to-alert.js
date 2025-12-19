import db from '../models/index.js';
import { Sequelize } from 'sequelize';


const queryInterface = db.sequelize.getQueryInterface();

export async function up() {
await queryInterface.addColumn('Alerts', 'createdAt', {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
});

await queryInterface.addColumn('Alerts', 'updatedAt', {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
});
}

export async function down() {
await queryInterface.removeColumn('Alerts', 'createdAt');
await queryInterface.removeColumn('Alerts', 'updatedAt');
}
