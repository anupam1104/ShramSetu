const buckets = new Map();

export const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 10 } = {}) => (req, res, next) => {
	const key = `${req.ip}:${req.path}:${req.body?.identifier || ''}`;
	const now = Date.now();
	const recent = (buckets.get(key) || []).filter((stamp) => now - stamp < windowMs);
	if (recent.length >= max) {
		return res.status(429).json({ error: 'Too many attempts. Try again later.' });
	}
	recent.push(now);
	buckets.set(key, recent);
	return next();
};
