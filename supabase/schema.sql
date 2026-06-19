create table if not exists public.vendors (
  id text primary key,
  business_name text not null,
  owner_name text not null,
  email text not null,
  location text not null,
  phone text not null,
  logo_url text not null,
  owner_photo_url text not null,
  whatsapp_number text not null,
  whatsapp_available boolean not null default true,
  address text not null,
  lat double precision not null default 6.9271,
  lng double precision not null default 79.8612,
  delivery_mode text not null default 'areas' check (delivery_mode in ('areas', 'radius')),
  delivery_areas jsonb not null default '[]'::jsonb,
  delivery_radius_km integer not null default 10,
  visibility jsonb not null default '{"ownerName":true,"phone":true,"address":true,"deliveryInfo":true,"whatsapp":true}'::jsonb,
  products jsonb not null default '[]'::jsonb,
  improvement_notes text not null default '',
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  submitted_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.buyers (
  id text primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  orders_count integer not null default 0,
  joined_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vendors enable row level security;
alter table public.buyers enable row level security;

drop policy if exists "Allow read vendors" on public.vendors;
create policy "Allow read vendors" on public.vendors for select using (true);

drop policy if exists "Allow write vendors" on public.vendors;
create policy "Allow write vendors" on public.vendors for all using (true) with check (true);

drop policy if exists "Allow read buyers" on public.buyers;
create policy "Allow read buyers" on public.buyers for select using (true);

drop policy if exists "Allow write buyers" on public.buyers;
create policy "Allow write buyers" on public.buyers for all using (true) with check (true);
