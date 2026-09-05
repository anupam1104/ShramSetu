-- Demo admin account for the admin portal.
-- Run schema.sql first, then run this file in the Supabase SQL editor.
-- Login credentials: phone 9000000000, password 1234.

insert into public.admins (name, phone, employee_id, city, password_hash)
values (
  'Shram Setu Admin',
  '9000000000',
  'ADM-001',
  'Kolkata',
  extensions.crypt('1234', extensions.gen_salt('bf'))
)
on conflict (phone) do update set
  name = excluded.name,
  employee_id = excluded.employee_id,
  city = excluded.city,
  password_hash = excluded.password_hash;