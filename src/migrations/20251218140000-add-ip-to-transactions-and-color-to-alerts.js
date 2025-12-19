export const up = async (queryInterface, Sequelize) => {
  // Add ip_address column to Transactions if missing
await queryInterface.sequelize.query(`DO $$ BEGIN IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='Transactions' AND column_name='ip_address') THEN
    ALTER TABLE "Transactions" ADD COLUMN "ip_address" VARCHAR(64);
    END IF; END$$;`);

  // Add color enum type and column to Alerts if missing
await queryInterface.sequelize.query("DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_Alerts_color') THEN CREATE TYPE \"enum_Alerts_color\" AS ENUM ('green','yellow','red'); END IF; END$$;");
await queryInterface.sequelize.query(`DO $$ BEGIN IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='Alerts' AND column_name='color') THEN
    ALTER TABLE "Alerts" ADD COLUMN "color" "enum_Alerts_color" NOT NULL DEFAULT 'green';
END IF; END$$;`);

  // Backfill existing alerts based on severity (cast literals to enum type)
await queryInterface.sequelize.query(`
    UPDATE "Alerts" SET color = CASE
    WHEN severity IN ('high','critical') THEN 'red'::"enum_Alerts_color"
    WHEN severity = 'medium' THEN 'yellow'::"enum_Alerts_color"
    ELSE 'green'::"enum_Alerts_color" END
    WHERE color IS DISTINCT FROM (
    (CASE WHEN severity IN ('high','critical') THEN 'red' WHEN severity = 'medium' THEN 'yellow' ELSE 'green' END)::"enum_Alerts_color"
    )`);
};

export const down = async (queryInterface, Sequelize) => {
await queryInterface.removeColumn('Transactions', 'ip_address');
await queryInterface.removeColumn('Alerts', 'color');
await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_alerts_color\";");
};
