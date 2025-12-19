import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import sequelize from '../src/config/database.js';
import Sequelize from 'sequelize';
import { up } from '../src/migrations/20251226011605-add-timestamp-to-alert.js';
//import { up } from '../src/migrations/20251226011605-add-timestamp-to-transaction.js';

const migrationsDir = path.resolve('src', 'migrations');

async function ensureMetaTable() {
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS "SequelizeMeta" (name VARCHAR(255) PRIMARY KEY);`
  );
}

async function hasMigrationApplied(name) {
  const [results] = await sequelize.query(
    `SELECT name FROM "SequelizeMeta" WHERE name = :name`,
    { replacements: { name }, type: sequelize.QueryTypes.SELECT }
  );
  return !!results;
}

async function markApplied(name) {
  await sequelize.query(
    `INSERT INTO "SequelizeMeta" (name) VALUES (:name) ON CONFLICT (name) DO NOTHING`,
    { replacements: { name } }
  );
}

async function run() {
  console.log('Running ESM migrations from', migrationsDir);
  const files = fs.existsSync(migrationsDir)
    ? fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js')).sort()
    : [];

  await ensureMetaTable();

  for (const file of files) {
    const applied = await hasMigrationApplied(file);
    if (applied) {
      console.log(`Skipping already-applied migration: ${file}`);
      continue;
    }

    console.log(`Applying migration: ${file}`);
    const mod = await import(pathToFileURL(path.join(migrationsDir, file)).href);
    
    const migration = mod.default ?? mod;
    if (typeof migration.up !== 'function') {
      throw new Error(`Migration ${file} does not export an 'up' function`);
    }

    await migration.up(sequelize.getQueryInterface(), Sequelize);
    await markApplied(file);
    console.log(`Applied migration: ${file}`);
  }

  console.log('Migrations finished');
  await sequelize.close();
}

run().catch(err => {
  console.error('Migration run failed:', err);
  process.exit(1);
});
