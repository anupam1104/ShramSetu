import express from 'express';
import shramiksRoutes from './routes/shramiks.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	if (req.method === 'OPTIONS') return res.sendStatus(204);
	return next();
});
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({ ok: true, service: 'shram-setu-api' });
});

app.use('/api/shramiks', shramiksRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.use((error, req, res, _next) => {
	console.error(error);
	res.status(error.status || 500).json({ error: error.message || 'Internal server error.' });
});

export default app;
