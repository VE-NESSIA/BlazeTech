#!/usr/bin/env node
import models from '../src/models/index.js';
import { QueryTypes } from 'sequelize';

const { sequelize } = models;

(async () => {
try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const sql = `UPDATE "Alerts" SET color = CASE     WHEN severity IN ('high','critical') THEN 'red'::"enum_Alerts_color"
    WHEN severity = 'medium' THEN 'yellow'::"enum_Alerts_color"
    ELSE 'green'::"enum_Alerts_color" END
    WHERE color IS DISTINCT FROM ((CASE WHEN severity IN ('high','critical') THEN 'red' WHEN severity = 'medium' THEN 'yellow' ELSE 'green' END)::"enum_Alerts_color")
    RETURNING id;`;

    const [rows] = await sequelize.query(sql, { type: QueryTypes.UPDATE });
    
    const updatedCount = Array.isArray(rows) ? rows.length : 0;
    
    console.log(`Updated ${updatedCount} alerts to match severity->color mapping`);
    process.exit(0);
} 

catch (err) {
    console.error(err);
    process.exit(1);
}
})();