-- =============================================================
-- hl_products — normalized products (replace JSONB in vendors)
-- =============================================================
create table if not exists public.hl_products (
  id            text primary key default gen_random_uuid()::text,
  vendor_id     text not null references public.hl_vendors(id) on delete cascade,
  title         text not null,
  description   text not null default '',
  category      text not null default 'Birthday',
  price         numeric(10,2) not null default 0,
  media         text,                          -- primary image URL
  images        jsonb not null default '[]'::jsonb,  -- all images
  weights       jsonb not null default '[]'::jsonb,  -- e.g. ["500g","1kg","2kg"]
  sales_count   integer not null default 0,
  is_available  boolean not null default true,
  status        text not null default 'active' check (status in ('active','archived','draft')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- hl_inventory — stock tracking per product
-- =============================================================
create table if not exists public.hl_inventory (
  id            text primary key default gen_random_uuid()::text,
  product_id    text not null references public.hl_products(id) on delete cascade unique,
  vendor_id     text not null references public.hl_vendors(id) on delete cascade,
  quantity      integer not null default 0 check (quantity >= 0),
  low_stock_threshold integer not null default 5,
  track_inventory boolean not null default false,  -- false = unlimited / no tracking
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- hl_orders — order tracking
-- =============================================================
create table if not exists public.hl_orders (
  id            text primary key default gen_random_uuid()::text,
  vendor_id     text not null references public.hl_vendors(id) on delete cascade,
  buyer_id      text references public.hl_buyers(id),
  product_id    text not null references public.hl_products(id),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  delivery_address text not null,
  weight        text,
  quantity      integer not null default 1,
  amount        numeric(10,2) not null,
  status        text not null default 'Pending' check (status in ('Pending','Confirmed','Baking','Out for Delivery','Delivered','Cancelled')),
  notes         text not null default '',
  ordered_at    timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- RLS
-- =============================================================
alter table public.hl_products enable row level security;
alter table public.hl_inventory enable row level security;
alter table public.hl_orders enable row level security;

drop policy if exists "Allow read hl_products" on public.hl_products;
create policy "Allow read hl_products" on public.hl_products for select using (true);

drop policy if exists "Allow write hl_products" on public.hl_products;
create policy "Allow write hl_products" on public.hl_products for all using (true) with check (true);

drop policy if exists "Allow read hl_inventory" on public.hl_inventory;
create policy "Allow read hl_inventory" on public.hl_inventory for select using (true);

drop policy if exists "Allow write hl_inventory" on public.hl_inventory;
create policy "Allow write hl_inventory" on public.hl_inventory for all using (true) with check (true);

drop policy if exists "Allow read hl_orders" on public.hl_orders;
create policy "Allow read hl_orders" on public.hl_orders for select using (true);

drop policy if exists "Allow write hl_orders" on public.hl_orders;
create policy "Allow write hl_orders" on public.hl_orders for all using (true) with check (true);

-- =============================================================
-- Indexes
-- =============================================================
create index if not exists idx_hl_products_vendor on public.hl_products(vendor_id);
create index if not exists idx_hl_inventory_vendor on public.hl_inventory(vendor_id);
create index if not exists idx_hl_inventory_product on public.hl_inventory(product_id);
create index if not exists idx_hl_orders_vendor on public.hl_orders(vendor_id);
create index if not exists idx_hl_orders_buyer on public.hl_orders(buyer_id);
create index if not exists idx_hl_orders_status on public.hl_orders(status);

-- =============================================================
-- Function: migrate existing JSONB products into hl_products
-- Run once after creating the tables above
-- =============================================================
create or replace function public.migrate_vendor_products()
returns text as $$
declare
  v record;
  p jsonb;
  pid text;
  migrated integer := 0;
begin
  for v in select id, products from public.hl_vendors where products is not null and products != '[]'::jsonb loop
    for p in select jsonb_array_elements(v.products) loop
      insert into public.hl_products (id, vendor_id, title, description, category, price, media, images)
      values (
        coalesce(p->>'id', gen_random_uuid()::text),
        v.id,
        p->>'title',
        coalesce(p->>'description', ''),
        coalesce(p->>'category', 'Birthday'),
        (p->>'price')::numeric,
        p->>'media',
        case when p->>'media' is not null then jsonb_build_array(p->>'media') else '[]'::jsonb end
      )
      on conflict (id) do nothing;
      migrated := migrated + 1;
    end loop;
  end loop;
  return format('Migrated %s products from vendors JSONB into hl_products', migrated);
end;
$$ language plpgsql security definer;

-- Usage: select public.migrate_vendor_products();
