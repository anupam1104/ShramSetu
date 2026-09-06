import crypto from 'crypto';
import { env } from '../config/env.js';

const toBase64Url = (value) => Buffer.from(value).toString('base64url');
const fromBase64Url = (value) => Buffer.from(value, 'base64url').toString('utf8');

const sign = (payload) =>
	crypto.createHmac('sha256', env.sessionSecret).update(payload).digest('base64url');

export const createAdminToken = (admin) => {
	const body = toBase64Url(JSON.stringify({
		sub: admin.id,
		name: admin.name,
		phone: admin.phone,
		empId: admin.employee_id || admin.empId,
		city: admin.city,
		role: 'admin',
		exp: Math.floor(Date.now() / 1000) + env.sessionTtlSeconds,
	}));
	return `${body}.${sign(body)}`;
};

export const verifyAdminToken = (token) => {
	if (!token || !token.includes('.')) return null;
	const [payload, signature] = token.split('.');
	if (!payload || !signature) return null;

	const expected = sign(payload);
	const left = Buffer.from(signature);
	const right = Buffer.from(expected);
	if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) return null;

	try {
		const claims = JSON.parse(fromBase64Url(payload));
		if (claims.role !== 'admin' || !claims.sub || claims.exp * 1000 < Date.now()) return null;
		return claims;
	} catch {
		return null;
	}
};

export const readBearerToken = (req) => {
	const header = req.headers.authorization || '';
	if (header.startsWith('Bearer ')) return header.slice(7).trim();
	return '';
};
