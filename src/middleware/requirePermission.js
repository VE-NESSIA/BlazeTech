const ROLE_PERMISSIONS = {
  // platform_admin has full platform access
platform_admin: ['*'],

  // org_admin can manage their organization and keys
org_admin: ['manage_api_keys', 'read_customers', 'view_alerts', 'view_risk_scores', 'manage_clients'],

  // api_key_manager has only key lifecycle permissions
api_key_manager: ['manage_api_keys']
};

export default function requirePermission(permission) {
return (req, res, next) => {
    const user = req.apiUser;
    if (!user) return res.status(401).json({ error: 'Not authenticated' });

    // Direct user permissions (explicitly granted)
    if (Array.isArray(user.permissions) && user.permissions.includes(permission)) {
    return next();
    }

    // Role-scoped permissions
    const rolePerms = ROLE_PERMISSIONS[user.role];
    if (Array.isArray(rolePerms)) {
    if (rolePerms.includes('*') || rolePerms.includes(permission)) return next();
    }

    return res.status(403).json({ error: 'Forbidden' });
};
}

export { ROLE_PERMISSIONS };
