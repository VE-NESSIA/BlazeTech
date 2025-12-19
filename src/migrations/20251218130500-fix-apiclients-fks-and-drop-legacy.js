export const up = async (queryInterface, Sequelize) => {
  // Repoint foreign keys that referenced legacy "Api-Clients" to canonical "ApiClient"
await queryInterface.sequelize.query(`DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Customers_api_client_id_fkey') THEN
    ALTER TABLE "Customers" DROP CONSTRAINT "Customers_api_client_id_fkey";
    ALTER TABLE "Customers" ADD CONSTRAINT "Customers_api_client_id_fkey" FOREIGN KEY (api_client_id) REFERENCES "ApiClient"(id);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Alerts_api_client_id_fkey') THEN
    ALTER TABLE "Alerts" DROP CONSTRAINT "Alerts_api_client_id_fkey";
    ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_api_client_id_fkey" FOREIGN KEY (api_client_id) REFERENCES "ApiClient"(id);
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ApiKeys_api_client_id_fkey') THEN
    ALTER TABLE "ApiKeys" DROP CONSTRAINT "ApiKeys_api_client_id_fkey";
    ALTER TABLE "ApiKeys" ADD CONSTRAINT "ApiKeys_api_client_id_fkey" FOREIGN KEY (api_client_id) REFERENCES "ApiClient"(id);
    END IF;
END$$`);

  // Attempt to drop legacy table now that FKs have been moved
try {
    await queryInterface.dropTable('Api-Clients');
} catch (err) {
    console.warn('Could not drop legacy Api-Clients:', err.message);
}
  // Optionally drop legacy enum types if they have no dependents
try {
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Api-Clients_role"`);
    await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "enum_Api-Clients_occupational_role"`);
} catch (err) {
    console.warn('Could not drop legacy enum types:', err.message);
}
};

export const down = async () => Promise.resolve();
