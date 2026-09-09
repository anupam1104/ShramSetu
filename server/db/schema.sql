create extension if not exists pgcrypto;

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  employee_id text not null unique,
  city text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

revoke all on table public.admins from anon;
revoke all on table public.admins from public;
grant select, insert, update, delete on table public.admins to service_role;

drop function if exists public.authenticate_admin(text, text);

create or replace function public.authenticate_admin(identifier text, password text)
returns table (id uuid, name text, phone text, employee_id text, city text)
language sql
security definer
set search_path = public, extensions
as $$
  select a.id, a.name, a.phone, a.employee_id, a.city
  from public.admins a
  where (a.phone = identifier or a.employee_id = identifier)
    and a.password_hash = crypt(password, a.password_hash);
$$;

revoke all on function public.authenticate_admin(text, text) from public;
grant execute on function public.authenticate_admin(text, text) to anon;
grant execute on function public.authenticate_admin(text, text) to service_role;

-- Create a new admin account (city-tagged). City drives the pending-approval
-- queue: every admin whose login city matches the shramik's city sees the
-- registration. Passwords are bcrypt-hashed with pgcrypto.
drop function if exists public.create_admin(text, text, text, text, text);

create or replace function public.create_admin(
  admin_name text,
  admin_phone text,
  admin_employee_id text,
  admin_city text,
  admin_password text
)
returns table (id uuid, name text, phone text, employee_id text, city text)
language sql
security definer
set search_path = public, extensions
as $$
  insert into public.admins (name, phone, employee_id, city, password_hash)
  values (
    admin_name,
    admin_phone,
    admin_employee_id,
    admin_city,
    crypt(admin_password, gen_salt('bf'))
  )
  returning id, name, phone, employee_id, city;
$$;

revoke all on function public.create_admin(text, text, text, text, text) from public;
grant execute on function public.create_admin(text, text, text, text, text) to anon;
grant execute on function public.create_admin(text, text, text, text, text) to service_role;

drop function if exists public.approve_shramik(uuid);

create or replace function public.approve_shramik(shramik_uuid uuid)
returns table (id uuid, verified boolean, shramik_id text)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.shramiks s
  set verified = true,
      shramik_id = coalesce(s.shramik_id, 'SS-' || lpad((floor(random() * 900000) + 100000)::text, 6, '0'))
  where s.id = shramik_uuid
    and s.verified = false
  returning s.id, s.verified, s.shramik_id;
end;
$$;

-- This procedure is invoked by the API using SUPABASE_SERVICE_ROLE_KEY after
-- it validates the admin token and city. Do not expose approval directly to
-- browser clients through the public anon role.
revoke all on function public.approve_shramik(uuid) from public;
revoke execute on function public.approve_shramik(uuid) from anon;
grant execute on function public.approve_shramik(uuid) to service_role;

create table if not exists public.shramiks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  skill text not null,
  verified boolean not null default false,
  shramik_id text unique,
  rating numeric(2, 1) not null default 0,
  jobs_count integer not null default 0,
  distance text not null default 'New nearby worker',
  hourly_rate integer not null default 250,
  phone text not null,
  city text not null,
  location_key text not null,
  area text not null,
  experience text not null,
  services text[] not null default '{}',
  photo text,
  bio text,
  created_at timestamptz not null default now()
);

-- Safe to run on an existing project as well as a fresh one. The display city
-- stays untouched; location_key is the canonical routing key used by the
-- server to match a shramik with admins from the same city.
alter table public.shramiks add column if not exists location_key text;
update public.shramiks
set location_key = lower(trim(split_part(city, '|', 1)))
where location_key is null or location_key = '';
alter table public.shramiks alter column location_key set not null;
create unique index if not exists shramiks_phone_unique on public.shramiks (phone);
create index if not exists shramiks_pending_location_idx
  on public.shramiks (location_key, created_at desc)
  where verified = false;

alter table public.shramiks enable row level security;

grant select, insert on table public.shramiks to anon;
grant select, insert, update, delete on table public.shramiks to service_role;

drop policy if exists "Public can read shramiks" on public.shramiks;
create policy "Public can read shramiks"
  on public.shramiks for select
  using (true);

drop policy if exists "Public can submit shramiks" on public.shramiks;
create policy "Public can submit shramiks"
  on public.shramiks for insert
  with check (verified = false and location_key = lower(trim(split_part(city, '|', 1))));

alter table public.shramiks add column if not exists password_hash text;
alter table public.customers add column if not exists password_hash text;

drop function if exists public.authenticate_shramik(text, text);

create or replace function public.authenticate_shramik(identifier text, password text)
returns table (id uuid, name text, phone text, skill text, verified boolean, shramik_id text, city text)
language sql
security definer
set search_path = public, extensions
as $$
  select s.id, s.name, s.phone, s.skill, s.verified, s.shramik_id, s.city
  from public.shramiks s
  where (s.phone = identifier or s.shramik_id = identifier)
    and s.password_hash is not null
    and s.password_hash = crypt(password, s.password_hash);
$$;

revoke all on function public.authenticate_shramik(text, text) from public;
grant execute on function public.authenticate_shramik(text, text) to anon;
grant execute on function public.authenticate_shramik(text, text) to service_role;

drop function if exists public.authenticate_customer(text, text);

create or replace function public.authenticate_customer(identifier text, password text)
returns table (id uuid, name text, phone text, address text)
language sql
security definer
set search_path = public, extensions
as $$
  select c.id, c.name, c.phone, c.address
  from public.customers c
  where c.phone = identifier
    and c.password_hash is not null
    and c.password_hash = crypt(password, c.password_hash);
$$;

revoke all on function public.authenticate_customer(text, text) from public;
grant execute on function public.authenticate_customer(text, text) to anon;
grant execute on function public.authenticate_customer(text, text) to service_role;

drop function if exists public.create_customer(text, text, text, text);

create or replace function public.create_customer(
  cust_name text,
  cust_phone text,
  cust_address text,
  cust_password text
)
returns table (id uuid, name text, phone text, address text)
language sql
security definer
set search_path = public, extensions
as $$
  insert into public.customers (name, phone, address, password_hash)
  values (
    cust_name,
    cust_phone,
    cust_address,
    crypt(cust_password, gen_salt('bf'))
  )
  on conflict (phone) do update
  set name = excluded.name,
      address = coalesce(excluded.address, public.customers.address),
      password_hash = crypt(cust_password, gen_salt('bf'))
  returning id, name, phone, address;
$$;

revoke all on function public.create_customer(text, text, text, text) from public;
grant execute on function public.create_customer(text, text, text, text) to anon;
grant execute on function public.create_customer(text, text, text, text) to service_role;

drop function if exists public.register_shramik(text, text, text, text, text, text, text[], text, text, text, integer);

create or replace function public.register_shramik(
  s_name text,
  s_skill text,
  s_phone text,
  s_city text,
  s_area text,
  s_experience text,
  s_services text[],
  s_photo text,
  s_bio text,
  s_password text,
  s_hourly_rate integer default 250
)
returns table (id uuid, name text, skill text, phone text, city text, verified boolean)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  insert into public.shramiks (
    name, skill, phone, city, location_key, area, experience, services, photo, bio, verified, hourly_rate, password_hash
  )
  values (
    s_name, s_skill, s_phone, s_city, lower(trim(split_part(s_city, '|', 1))), s_area, s_experience, s_services, s_photo, s_bio, false,
    coalesce(s_hourly_rate, 250),
    case when s_password is not null and s_password <> '' then crypt(s_password, gen_salt('bf')) else null end
  )
  returning shramiks.id, shramiks.name, shramiks.skill, shramiks.phone, shramiks.city, shramiks.verified;
end;
$$;

revoke all on function public.register_shramik(text, text, text, text, text, text, text[], text, text, text, integer) from public;
grant execute on function public.register_shramik(text, text, text, text, text, text, text[], text, text, text, integer) to anon;
grant execute on function public.register_shramik(text, text, text, text, text, text, text[], text, text, text, integer) to service_role;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  address text,
  password_hash text,
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;
grant select, insert, update on table public.customers to anon;
grant select, insert, update, delete on table public.customers to service_role;

drop policy if exists "Public can read customers" on public.customers;
create policy "Public can read customers"
  on public.customers for select
  using (true);

drop policy if exists "Public can create customers" on public.customers;
create policy "Public can create customers"
  on public.customers for insert
  with check (true);

drop policy if exists "Public can update customers" on public.customers;
create policy "Public can update customers"
  on public.customers for update
  using (true);

create table if not exists public.bookings (
  id text primary key,
  shramik_id uuid not null references public.shramiks(id),
  customer_id uuid references public.customers(id),
  service_name text not null,
  scheduled_date text not null,
  scheduled_time text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  service_fee integer not null,
  platform_fee integer not null default 50,
  total_amount integer not null,
  start_code text,
  status text not null default 'Confirmed' check (status in ('Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Paid')),
  started_at timestamptz,
  completed_at timestamptz,
  duration_minutes integer,
  payment_method text check (payment_method in ('cash', 'online')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (shramik_id, scheduled_date, scheduled_time)
);

alter table public.bookings add column if not exists started_at timestamptz;
alter table public.bookings add column if not exists completed_at timestamptz;
alter table public.bookings add column if not exists duration_minutes integer;
alter table public.bookings add column if not exists customer_id uuid references public.customers(id);
alter table public.bookings alter column start_code drop not null;
alter table public.bookings add column if not exists payment_method text check (payment_method in ('cash', 'online'));
alter table public.bookings add column if not exists paid_at timestamptz;

-- Backfill the normalized customer table and connect existing bookings without
-- deleting the legacy customer columns used by older deployed clients.
insert into public.customers (name, phone, address)
select distinct on (customer_phone)
  customer_name,
  customer_phone,
  customer_address
from public.bookings
where customer_phone is not null
  and customer_name is not null
order by customer_phone, created_at desc
on conflict (phone) do update
set name = excluded.name,
    address = coalesce(excluded.address, public.customers.address);

update public.bookings b
set customer_id = c.id
from public.customers c
where b.customer_id is null
  and b.customer_phone = c.phone;

create index if not exists bookings_customer_idx on public.bookings (customer_id);
create index if not exists bookings_shramik_idx on public.bookings (shramik_id);
alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings add constraint bookings_status_check
  check (status in ('Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Paid'));

alter table public.bookings enable row level security;

grant select, insert on table public.bookings to anon;
grant select, insert, update, delete on table public.bookings to service_role;

drop policy if exists "Public can read bookings" on public.bookings;
create policy "Public can read bookings"
  on public.bookings for select
  using (true);

drop policy if exists "Public can create bookings" on public.bookings;
create policy "Public can create bookings"
  on public.bookings for insert
  with check (status = 'Pending');

grant update on table public.bookings to anon;

drop policy if exists "Booking state transitions are server controlled" on public.bookings;
create policy "Booking state transitions are server controlled"
  on public.bookings for update
  using (true)
  with check (status in ('Confirmed', 'In Progress', 'Completed', 'Paid'));
