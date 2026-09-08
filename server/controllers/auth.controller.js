import { supabaseRequest } from '../db/connection.js';
import { createAdminToken } from '../auth/session.js';

export const loginAdmin = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Admin phone/ID and password are required.' });
  }

  const normalizedId = String(identifier).trim();
  const rows = await supabaseRequest('rpc/authenticate_admin', {
    method: 'POST',
    body: JSON.stringify({ identifier: normalizedId, password }),
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
        admin_phone: String(phone).trim(),
        admin_employee_id: String(employee_id).trim(),
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

export const loginShramik = async (req, res) => {
  const { identifier, phone, password } = req.body;
  const idToUse = String(identifier || phone || '').trim();

  if (!idToUse || !password) {
    return res.status(400).json({ error: 'Shramik phone/ID and password are required.' });
  }

  try {
    const rows = await supabaseRequest('rpc/authenticate_shramik', {
      method: 'POST',
      body: JSON.stringify({ identifier: idToUse, password }),
    });
    const shramik = Array.isArray(rows) ? rows[0] : rows;
    if (!shramik) return res.status(401).json({ error: 'Invalid Shramik credentials.' });

    // Retrieve full shramik record from DB
    const [fullRecord] = await supabaseRequest(`shramiks?id=eq.${shramik.id}`);
    return res.json({
      ...(fullRecord || shramik),
      shramikId: shramik.shramik_id,
      hourlyRate: fullRecord?.hourly_rate || 250,
      jobsCount: fullRecord?.jobs_count || 0,
      role: 'shramik',
    });
  } catch (error) {
    return res.status(error.status || 401).json({ error: error.message || 'Shramik login failed.' });
  }
};

export const loginCustomer = async (req, res) => {
  const { phone, password } = req.body;
  const normalizedPhone = String(phone || '').trim();

  if (!normalizedPhone || !password) {
    return res.status(400).json({ error: 'Phone and password are required.' });
  }

  try {
    const rows = await supabaseRequest('rpc/authenticate_customer', {
      method: 'POST',
      body: JSON.stringify({ identifier: normalizedPhone, password }),
    });
    const customer = Array.isArray(rows) ? rows[0] : rows;
    if (!customer) return res.status(401).json({ error: 'Invalid customer credentials.' });

    return res.json({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      role: 'customer',
    });
  } catch (error) {
    return res.status(error.status || 401).json({ error: error.message || 'Customer login failed.' });
  }
};

export const registerCustomer = async (req, res) => {
  const { name, phone, address, password } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Name, phone, and password are required.' });
  }

  try {
    const rows = await supabaseRequest('rpc/create_customer', {
      method: 'POST',
      body: JSON.stringify({
        cust_name: name.trim(),
        cust_phone: String(phone).trim(),
        cust_address: address || '',
        cust_password: password,
      }),
    });
    const customer = Array.isArray(rows) ? rows[0] : rows;
    if (!customer) return res.status(400).json({ error: 'Could not create customer.' });

    return res.status(201).json({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      role: 'customer',
    });
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message || 'Customer registration failed.' });
  }
};

