import { ROLE_PERMISSIONS } from '../config/permissions.js';

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { role, permissions = [] } = req.user;

    // Explicit user permissions override role
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    const effectivePermissions = new Set([
      ...rolePermissions,
      ...permissions
    ]);

    if (!effectivePermissions.has(permission)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Missing permission: ${permission}`
      });
    }

    next();
  };
}
