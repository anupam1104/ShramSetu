import { supabaseRequest } from '../db/connection.js';

export const loginAdmin = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Admin phone/ID and password are required.' });
  }

  const [admin] = await supabaseRequest('rpc/authenticate_admin', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });

  if (!admin) return res.status(401).json({ error: 'Invalid admin credentials.' });

  return res.json({ ...admin, empId: admin.employee_id, role: 'admin' });
};