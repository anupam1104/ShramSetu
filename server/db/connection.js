import { env } from '../config/env.js';

const publicMessageFor = (status, body) => {
	try {
		const parsed = JSON.parse(body);
		if (parsed.code === '23505' || status === 409) return 'That booking slot is already taken.';
		if (parsed.code === '23503') return 'The selected worker is not available.';
		if (parsed.code === '22P02') return 'Invalid identifier.';
		if (status === 401 || status === 403) return 'Database access was denied.';
	} catch {
		// Fall through to a generic message rather than leaking PostgREST text.
	}
	if (status >= 400 && status < 500) return 'Request could not be completed.';
	return 'Database request failed.';
};

export const supabaseRequest = async (path, options = {}) => {
	if (!env.isDatabaseConfigured) {
		const error = new Error('Database is not configured.');
		error.status = 503;
		throw error;
	}

	// Prefer the server-only service role. The browser never receives this key;
	// authorization is performed by our Express middleware before this helper is
	// called. The anon-key fallback keeps existing local/dev setups working.
	const databaseKey = env.supabaseServiceRoleKey || env.supabaseAnonKey;
	const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
		...options,
		headers: {
			apikey: databaseKey,
			Authorization: `Bearer ${databaseKey}`,
			'Content-Type': 'application/json',
			...options.headers,
		},
	});

	if (!response.ok) {
		const body = await response.text();
		const error = new Error(publicMessageFor(response.status, body));
		error.status = response.status === 409 ? 409 : (response.status >= 400 && response.status < 500 ? response.status : 502);
		throw error;
	}

	if (response.status === 204) return null;
	return response.json();
};

export const pingDatabase = async () => {
	if (!env.isDatabaseConfigured) return { ok: false, reason: 'not_configured' };
	try {
		const response = await fetch(`${env.supabaseUrl}/rest/v1/shramiks?select=id&limit=1`, {
			headers: {
				apikey: env.supabaseServiceRoleKey || env.supabaseAnonKey,
				Authorization: `Bearer ${env.supabaseServiceRoleKey || env.supabaseAnonKey}`,
			},
		});
		// Do not expose response bodies (they can contain provider details), but
		// make the HTTP status available to the health route for deployment
		// troubleshooting: 401/403 means key, 404 usually means schema/URL.
		if (!response.ok) return { ok: false, reason: 'database_http_error', status: response.status };
		return { ok: true };
	} catch (error) {
		return { ok: false, reason: 'network_error', detail: error?.cause?.code || error?.name || 'fetch_failed' };
	}
};
