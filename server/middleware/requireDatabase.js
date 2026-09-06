import { env } from '../config/env.js';

export const requireDatabase = (req, res, next) => {
	if (!env.isDatabaseConfigured) {
		return res.status(503).json({
			error: 'Database is not configured. Copy .env.example to .env and set SUPABASE_URL and SUPABASE_ANON_KEY.',
		});
	}
	return next();
};
