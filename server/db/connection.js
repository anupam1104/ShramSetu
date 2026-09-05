import { env } from '../config/env.js';

export const supabaseRequest = async (path, options = {}) => {
	const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
		...options,
		headers: {
			apikey: env.supabaseAnonKey,
			Authorization: `Bearer ${env.supabaseAnonKey}`,
			'Content-Type': 'application/json',
			...options.headers,
		},
	});

	if (!response.ok) {
		const body = await response.text();
		const error = new Error(body || `Database request failed with status ${response.status}.`);
		error.status = response.status;
		throw error;
	}

	if (response.status === 204) return null;
	return response.json();
};
