'use strict';

import { randomUUID } from 'crypto';

const AuditLogs = {
  async up(queryInterface, Sequelize) {
    // Skip seeding if audit_logs already have data
    const [[{ count }]] = await queryInterface.sequelize.query('SELECT COUNT(*)::int AS count FROM audit_logs');
    if (count > 0) {
      console.log('audit_logs already seeded, skipping.');
      return;
    }

    const now = new Date();
    await queryInterface.bulkInsert('audit_logs', [
      {
        id: randomUUID(),
        client_id: 'demo-platform-admin-001',
        client_name: 'BlazeTech Platform Admin',
        action: 'api_key.auth.success',
        entity_type: '',
        entity_id: null,
        ip_address: '::1',
        user_agent: 'seed-runner',
        details: Sequelize.literal("'{\"seed\":true}'::jsonb"),
        created_at: now,
      },
      {
        id: randomUUID(),
        client_id: 'demo-platform-admin-001',
        client_name: 'BlazeTech Platform Admin',
        action: 'api_key.create',
        entity_type: 'api_key',
        entity_id: randomUUID(),
        ip_address: null,
        user_agent: 'seed-runner',
        details: Sequelize.literal("'{\"name\":\"seed-key\"}'::jsonb"),
        created_at: now,
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('audit_logs', null, {});
  }
};

export default AuditLogs;
