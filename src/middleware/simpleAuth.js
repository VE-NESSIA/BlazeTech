import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
    const header = req.get('authorization');

    if (!header) {
    return res.status(401).json({ error: 'Authorization required' });
}

    const token = header.startsWith('Bearer ')
    ? header.slice(7)
    : null;

    if (!token) {
    return res.status(401).json({ error: 'Invalid authorization format' });
}

    try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.apiUser = decoded;

    next();
} catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
}
}
