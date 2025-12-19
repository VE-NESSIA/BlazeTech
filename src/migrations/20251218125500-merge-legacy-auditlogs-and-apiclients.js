export const up = async (queryInterface, Sequelize) => {
  // 1) Migrate rows from legacy "Audit_logs" to canonical audit_logs
const [[{ exists: hasAuditLegacy }]] = await queryInterface.sequelize.query(
    `SELECT (to_regclass('"Audit_logs"') IS NOT NULL) AS exists`
);

if (hasAuditLegacy) {
    // copy any rows that don't already exist in audit_logs
    await queryInterface.sequelize.query(
    `INSERT INTO audit_logs (id, client_id, client_name, action, entity_type, entity_id, ip_address, user_agent, details, created_at)
    SELECT id, client_id, client_name, action, entity_type, entity_id::uuid, ip_address::text, user_agent, details, timestamp
    FROM "Audit_logs" a
    WHERE NOT EXISTS (SELECT 1 FROM audit_logs b WHERE b.id = a.id)`
    );

    // drop legacy table
    try {
    await queryInterface.dropTable('Audit_logs');
    } catch (err) {
      // ignore errors
    console.warn('Failed to drop legacy Audit_logs table', err.message);
    }
}

  // 2) Fix Api-Clients table naming: if a legacy "Api-Clients" exists, merge/rename
const [[{ exists: hasApiClientsLegacy }]] = await queryInterface.sequelize.query(
    `SELECT (to_regclass('"Api-Clients"') IS NOT NULL) AS exists`
);

const [[{ exists: hasApiClient }]] = await queryInterface.sequelize.query(
    `SELECT (to_regclass('"ApiClient"') IS NOT NULL) AS exists`
);

if (hasApiClientsLegacy) {
    if (!hasApiClient) {
      // safe rename
    try {
        await queryInterface.renameTable('Api-Clients', 'ApiClient');
    } catch (err) {
        console.warn('Failed to rename Api-Clients to ApiClient', err.message);
    }
    } else {
      // both tables exist: ensure enum labels from legacy table exist in canonical enum,
      // then copy rows that don't exist in canonical table using a safe cast
    await queryInterface.sequelize.query(
        `DO $$
        DECLARE r RECORD;
        BEGIN
        FOR r IN SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'enum_Api-Clients_role' LOOP
            IF NOT EXISTS (SELECT 1 FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'enum_ApiClient_role' AND enumlabel = r.enumlabel) THEN
            EXECUTE format('ALTER TYPE "enum_ApiClient_role" ADD VALUE %L', r.enumlabel);
            END IF;
        END LOOP;
        END
        $$`);

    await queryInterface.sequelize.query(
        `INSERT INTO "ApiClient" (id, name, password, work_email, api_key, occupational_role, role, permissions, active)
        SELECT id, name, password, work_email, occupational_role, api_key, (role::text)::"enum_ApiClient_role" AS role, permissions, active
        FROM "Api-Clients" l
        WHERE NOT EXISTS (SELECT 1 FROM "ApiClient" c WHERE c.id = l.id)`
    );

      // drop legacy
    try {
        await queryInterface.dropTable('Api-Clients');
    } catch (err) {
        console.warn('Failed to drop legacy Api-Clients table', err.message);
    }
    }
}

  // 3) Ensure canonical ApiClient has updated_at column (model expects it)
const [[{ exists: hasUpdatedAt }]] = await queryInterface.sequelize.query(
    "SELECT (EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'apiclient' AND column_name = 'updated_at')) AS exists"
);

if (!hasUpdatedAt) {
    await queryInterface.addColumn('ApiClient', 'updated_at', { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW });
}
};

export const down = async (queryInterface, Sequelize) => {
  // Irreversible: data merge operations are not easily reversible; leave as no-op
return Promise.resolve();
};
