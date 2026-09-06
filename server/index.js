import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
	console.log(`Shram Setu API listening on http://localhost:${env.port}`);
	if (!env.isDatabaseConfigured) {
		console.warn('Database is not configured. Copy .env.example to .env and set SUPABASE_URL and SUPABASE_ANON_KEY.');
	}
});
