create table if not exists public.hl_vendors (
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

create table if not exists public.hl_buyers (
  id text primary key,
  full_name text not null,
  email text not null,
  phone text not null,
  orders_count integer not null default 0,
  joined_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hl_vendor_business_email_accounts (
  vendor_id text primary key,
  local_part text not null,
  domain text not null default 'hostlanka.online',
  forwarding_email text not null default '',
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hl_vendor_business_email_messages (
  id text primary key,
  vendor_id text not null,
  sender text not null,
  subject text not null,
  preview text not null,
  received_at timestamptz not null default now(),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.hl_vendors enable row level security;
alter table public.hl_buyers enable row level security;
alter table public.hl_vendor_business_email_accounts enable row level security;
alter table public.hl_vendor_business_email_messages enable row level security;

drop policy if exists "Allow read vendors" on public.hl_vendors;
create policy "Allow read vendors" on public.hl_vendors for select using (true);

drop policy if exists "Allow write vendors" on public.hl_vendors;
create policy "Allow write vendors" on public.hl_vendors for all using (true) with check (true);

drop policy if exists "Allow read buyers" on public.hl_buyers;
create policy "Allow read buyers" on public.hl_buyers for select using (true);

drop policy if exists "Allow write buyers" on public.hl_buyers;
create policy "Allow write buyers" on public.hl_buyers for all using (true) with check (true);

drop policy if exists "Allow read business email accounts" on public.hl_vendor_business_email_accounts;
create policy "Allow read business email accounts" on public.hl_vendor_business_email_accounts for select using (true);

drop policy if exists "Allow write business email accounts" on public.hl_vendor_business_email_accounts;
create policy "Allow write business email accounts" on public.hl_vendor_business_email_accounts for all using (true) with check (true);

drop policy if exists "Allow read business email messages" on public.hl_vendor_business_email_messages;
create policy "Allow read business email messages" on public.hl_vendor_business_email_messages for select using (true);

drop policy if exists "Allow write business email messages" on public.hl_vendor_business_email_messages;
create policy "Allow write business email messages" on public.hl_vendor_business_email_messages for all using (true) with check (true);
