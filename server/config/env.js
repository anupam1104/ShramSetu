import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
dotenv.config({ path: path.join(projectRoot, '.env') });

const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim();
// Keep this key on the API only. It lets the API enforce the authenticated
// admin's city boundary instead of exposing approval RPCs to browser clients.
const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const clientUrls = (process.env.CLIENT_URL || 'http://localhost:5173')
	.split(',')
	.map((url) => url.trim().replace(/\/$/, ''))
	.filter(Boolean);

let sessionSecret = (process.env.SESSION_SECRET || '').trim();
if (!sessionSecret) {
	sessionSecret = crypto.randomBytes(32).toString('hex');
	console.warn('SESSION_SECRET is not set. Using an ephemeral secret; admin sessions reset on restart. Copy .env.example to .env.');
}

export const env = {
	port: Number(process.env.PORT || 4000),
	clientUrl: clientUrls[0] || 'http://localhost:5173',
	clientUrls,
	supabaseUrl,
	supabaseAnonKey,
	supabaseServiceRoleKey,
	sessionSecret,
	sessionTtlSeconds: Number(process.env.SESSION_TTL_SECONDS || 60 * 60 * 12),
	isDatabaseConfigured: Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey)),
};
