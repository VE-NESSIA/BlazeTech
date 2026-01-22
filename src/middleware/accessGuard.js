import { requireRole } from './requireRole.middleware.js';
import { requirePermission } from './requirePermission.middleware.js';

export function accessGuard({ roles = [], permission }) {
    return [
    ...(roles.length ? [requireRole(...roles)] : []),
    ...(permission ? [requirePermission(permission)] : [])
];
}
