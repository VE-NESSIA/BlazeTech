import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import sequelize from '../src/config/database.js';
import Sequelize from 'sequelize';

const seedsDir = path.resolve('seeders');

async function run() {
  console.log('Running ESM seeders from', seedsDir);
  const files = fs.existsSync(seedsDir)
    ? fs.readdirSync(seedsDir).filter(f => f.endsWith('.js')).sort()
    : [];

  for (const file of files) {
    console.log(`Applying seed: ${file}`);
    const mod = await import(pathToFileURL(path.join(seedsDir, file)).href);
    const seed = mod.default ?? mod;
    if (typeof seed.up !== 'function') {
      throw new Error(`Seed ${file} does not export an 'up' function`);
    }

    await seed.up(sequelize.getQueryInterface(), Sequelize);
    console.log(`Applied seed: ${file}`);
  }

  console.log('Seeders finished');
  await sequelize.close();
}

run().catch(err => {
  console.error('Seeder run failed:', err);
  process.exit(1);
});