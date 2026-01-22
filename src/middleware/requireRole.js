export function requireRole(...allowedRoles) {
return (req, res, next) => {
    if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
    }

    const { role } = req.user;

    if (!allowedRoles.includes(role)) {
    return res.status(403).json({
        error: 'Forbidden',
        message: `Role '${role}' is not allowed`
        });
    }

    next();
};
}
