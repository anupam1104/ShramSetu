import dotenv from 'dotenv';

dotenv.config();

export const env = {
	port: Number(process.env.PORT || 4000),
	supabaseUrl: (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim(),
	supabaseAnonKey: (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '').trim(),
};

if (!env.supabaseUrl || !env.supabaseAnonKey) {
	throw new Error('Missing SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
}
