import { supabaseRequest } from '../db/connection.js';

export const registerCustomer = async (req, res) => {
  const { name, phone, address = '', password } = req.body || {};

  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Name, phone, and password are required.' });
  }
  if (!/^\d{10}$/.test(String(phone))) {
    return res.status(400).json({ error: 'Enter a valid 10-digit phone number.' });
  }
  if (String(password).length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters.' });
  }

  const rows = await supabaseRequest('rpc/create_customer', {
    method: 'POST',
    body: JSON.stringify({
      customer_name: String(name).trim(),
      customer_phone: String(phone),
      customer_address: String(address).trim(),
      customer_password: String(password),
    }),
  });
  const customer = Array.isArray(rows) ? rows[0] : rows;

  if (!customer) return res.status(400).json({ error: 'Could not create customer account.' });
  return res.status(201).json({ ...customer, role: 'customer' });
};

export const loginCustomer = async (req, res) => {
  const { phone, password } = req.body || {};

  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and password are required.' });
  }

  const rows = await supabaseRequest('rpc/authenticate_customer', {
    method: 'POST',
    body: JSON.stringify({
      customer_phone: String(phone),
      customer_password: String(password),
    }),
  });
  const customer = Array.isArray(rows) ? rows[0] : rows;

  if (!customer) return res.status(401).json({ error: 'Invalid customer credentials.' });
  return res.json({ ...customer, role: 'customer' });
};
