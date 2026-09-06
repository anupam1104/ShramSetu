import { supabaseRequest } from '../db/connection.js';
import { createAdminToken } from '../auth/session.js';

export const loginAdmin = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Admin phone/ID and password are required.' });
  }

  const rows = await supabaseRequest('rpc/authenticate_admin', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
  const admin = Array.isArray(rows) ? rows[0] : rows;

  if (!admin) return res.status(401).json({ error: 'Invalid admin credentials.' });

  const token = createAdminToken(admin);
  return res.json({
    token,
    id: admin.id,
    name: admin.name,
    phone: admin.phone,
    employee_id: admin.employee_id,
    empId: admin.employee_id,
    city: admin.city,
    role: 'admin',
  });
};

export const registerAdmin = async (req, res) => {
  const { name, phone, empId, employeeId, city, password } = req.body;
  const employee_id = employeeId || empId;

  if (!name || !phone || !employee_id) {
    return res.status(400).json({ error: 'name, phone, and employee ID are required.' });
  }
  if (!city) return res.status(400).json({ error: 'Admin city is required.' });
  if (!password || String(password).length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters.' });
  }

  let admin;
  try {
    const rows = await supabaseRequest('rpc/create_admin', {
      method: 'POST',
      body: JSON.stringify({
        admin_name: name,
        admin_phone: phone,
        admin_employee_id: employee_id,
        admin_city: city,
        admin_password: password,
      }),
    });
    admin = Array.isArray(rows) ? rows[0] : rows;
  } catch (error) {
    if (error.status === 409) {
      return res.status(409).json({ error: 'Admin phone or employee ID is already registered.' });
    }
    throw error;
  }

  if (!admin) return res.status(400).json({ error: 'Could not create admin.' });

  const token = createAdminToken(admin);
  return res.status(201).json({
    token,
    id: admin.id,
    name: admin.name,
    phone: admin.phone,
    employee_id: admin.employee_id,
    empId: admin.employee_id,
    city: admin.city,
    role: 'admin',
  });
};
