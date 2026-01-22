import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

export const authenticateApiClient = async (req, res, next) => {
    try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

    const apiKeys = await prisma.apiKey.findMany({
        where: { revoked: false },
        include: { api_client: true }
    });

    for (const key of apiKeys) {
        const match = await bcrypt.compare(token, key.hashed_key);
        if (match) {
        req.apiClient = key.api_client;
        return next();
        }
    }

    return res.status(401).json({ error: 'Invalid API key' });
} catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
}
};
