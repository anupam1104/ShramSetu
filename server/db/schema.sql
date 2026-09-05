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

create or replace function public.authenticate_admin(identifier text, password text)
returns table (id uuid, name text, phone text, employee_id text, city text)
language sql
security definer
set search_path = public
as $$
  select a.id, a.name, a.phone, a.employee_id, a.city
  from public.admins a
  where (a.phone = identifier or a.employee_id = identifier)
    and a.password_hash = extensions.crypt(password, a.password_hash);
$$;

revoke all on function public.authenticate_admin(text, text) from public;
grant execute on function public.authenticate_admin(text, text) to anon;

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

revoke all on function public.approve_shramik(uuid) from public;
grant execute on function public.approve_shramik(uuid) to anon;

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
  area text not null,
  experience text not null,
  services text[] not null default '{}',
  photo text,
  bio text,
  created_at timestamptz not null default now()
);

alter table public.shramiks enable row level security;

grant select, insert on table public.shramiks to anon;

drop policy if exists "Public can read shramiks" on public.shramiks;
create policy "Public can read shramiks"
  on public.shramiks for select
  using (true);

drop policy if exists "Public can submit shramiks" on public.shramiks;
create policy "Public can submit shramiks"
  on public.shramiks for insert
  with check (verified = false);

create table if not exists public.bookings (
  id text primary key,
  shramik_id uuid not null references public.shramiks(id),
  service_name text not null,
  scheduled_date text not null,
  scheduled_time text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text,
  service_fee integer not null,
  platform_fee integer not null default 50,
  total_amount integer not null,
  start_code text not null,
  status text not null default 'Confirmed' check (status in ('Pending', 'Confirmed', 'Completed', 'Cancelled', 'Paid')),
  created_at timestamptz not null default now(),
  unique (shramik_id, scheduled_date, scheduled_time)
);

alter table public.bookings enable row level security;

grant select, insert on table public.bookings to anon;

drop policy if exists "Public can read bookings" on public.bookings;
create policy "Public can read bookings"
  on public.bookings for select
  using (true);

drop policy if exists "Public can create bookings" on public.bookings;
create policy "Public can create bookings"
  on public.bookings for insert
  with check (status = 'Confirmed');