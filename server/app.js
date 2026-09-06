import express from 'express';
import { env } from './config/env.js';
import { pingDatabase } from './db/connection.js';
import { requireDatabase } from './middleware/requireDatabase.js';
import shramiksRoutes from './routes/shramiks.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

const isLocalOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/i.test(origin || '');

app.use((req, res, next) => {
	const origin = req.headers.origin;
	const normalizedOrigin = String(origin || '').replace(/\/$/, '');
	const allowOrigin = origin && (env.clientUrls.includes(normalizedOrigin) || isLocalOrigin(origin))
		? origin
		: env.clientUrl;
	res.header('Access-Control-Allow-Origin', allowOrigin);
	res.header('Vary', 'Origin');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
	if (req.method === 'OPTIONS') return res.sendStatus(204);
	return next();
});
app.use(express.json());

app.get('/health', async (req, res) => {
	const database = await pingDatabase();
	res.status(database.ok || !env.isDatabaseConfigured ? 200 : 503).json({
		ok: true,
		service: 'shram-setu-api',
		database: env.isDatabaseConfigured ? (database.ok ? 'connected' : 'unreachable') : 'not_configured',
	});
});

app.use('/api', requireDatabase);
app.use('/api/shramiks', shramiksRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use((error, req, res, _next) => {
	console.error(error);
	const status = error.status || 500;
	const message = status >= 500 ? 'Internal server error.' : (error.message || 'Request failed.');
	res.status(status).json({ error: message });
});

export default app;
