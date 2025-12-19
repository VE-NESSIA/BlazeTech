import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
    const header = req.get('authorization');

    if (!header) {
        return res.status(401).json({ error: 'Authorization required' });
    }

    const token = header.replace(/^Bearer\s+/i, '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach fintech staff info
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
