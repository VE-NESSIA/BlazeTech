#!/usr/bin/env node
import models from '../src/models/index.js';
import { literal, QueryTypes } from 'sequelize';

const { Alert, sequelize } = models;

(async () => {
try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const total = await Alert.count();

    // Find alerts where the color does not match the expected mapping
    const mismatches = await Alert.findAll({
    attributes: ['id', 'severity', 'color', 'created_at'],
    where: literal(`color IS DISTINCT FROM ((CASE WHEN severity IN ('high','critical') THEN 'red' WHEN severity = 'medium' THEN 'yellow' ELSE 'green' END)::"enum_Alerts_color")`),
    limit: 100
    });

    console.log(`Total alerts: ${total}`);
    console.log(`Mismatched alerts (sample up to 100): ${mismatches.length}`);
    mismatches.forEach(a => console.log(`${a.id} severity=${a.severity} color=${a.color} created_at=${a.created_at}`));

    // Give a breakdown by severity-color counts
    const breakdown = await sequelize.query(`SELECT severity, color, count(*) as cnt FROM "Alerts" GROUP BY severity, color ORDER BY severity, color;`, { type: QueryTypes.SELECT });
    console.log('Breakdown by severity and color:');
    breakdown.forEach(row => console.log(`  severity=${row.severity} color=${row.color} count=${row.cnt}`));

    process.exit(0);
} catch (err) {
    console.error(err);
    process.exit(1);
}
})();