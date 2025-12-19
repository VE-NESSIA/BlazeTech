const requestCount = new Map();

export default function simpleRateLimit(windowMs = 15 * 60 * 1000, max = 100) {
return (req, res, next) => {
    const clientId = req.apiClient?.id || req.ip;
    const now = Date.now();

    if (!requestCount.has(clientId)) requestCount.set(clientId, []);

    const timestamps = requestCount.get(clientId);
    while (timestamps.length && timestamps[0] < now - windowMs) timestamps.shift();

    if (timestamps.length >= max) {
        const retryAfter = Math.ceil((timestamps[0] + windowMs - now) / 1000);
        return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: `Try again ${retryAfter} second(s)`,
        limit: max,
        window: `${windowMs / 60000} minutes`
});
    }

    timestamps.push(now);
    next();
};
}