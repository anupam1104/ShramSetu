import { readBearerToken, verifyAdminToken } from '../auth/session.js';

export const requireAdmin = (req, res, next) => {
	const admin = verifyAdminToken(readBearerToken(req));
	if (!admin) {
		return res.status(401).json({ error: 'Admin sign-in required.' });
	}
	req.admin = admin;
	return next();
};
