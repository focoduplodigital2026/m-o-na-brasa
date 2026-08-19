-- Mão na Brasa Burger - schema inicial Supabase
-- Rode este arquivo no Supabase Dashboard > SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'staff')),
  name text,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text,
  ingredients text,
  price numeric(10,2) not null default 0,
  old_price numeric(10,2),
  badge text,
  image_url text,
  active boolean not null default true,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addon_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  required boolean not null default false,
  max_items int,
  sort_order int not null default 0,
  active boolean not null default true
);

create table if not exists public.addons (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.addon_groups(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  active boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'gallery' check (type in ('gallery', 'instagram')),
  image_url text not null,
  alt text,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  initials text,
  rating int not null default 5 check (rating between 1 and 5),
  comment text not null,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  whatsapp text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  phone text,
  whatsapp text,
  delivery_type text not null check (delivery_type in ('entrega', 'retirada')),
  address jsonb,
  payment_method text not null,
  change_for numeric(10,2),
  notes text,
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'recebido' check (status in ('recebido', 'confirmado', 'preparando', 'pronto', 'saiu_entrega', 'entregue', 'cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity int not null default 1,
  unit_price numeric(10,2) not null default 0,
  notes text
);

create table if not exists public.order_item_addons (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  addon_id uuid references public.addons(id) on delete set null,
  addon_name text not null,
  price numeric(10,2) not null default 0
);

create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text,
  discount_type text not null default 'fixed' check (discount_type in ('fixed', 'percent', 'combo')),
  discount_value numeric(10,2) not null default 0,
  min_order_value numeric(10,2),
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select auth.uid() is not null;
$$;

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.addon_groups enable row level security;
alter table public.addons enable row level security;
alter table public.gallery_images enable row level security;
alter table public.reviews enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_item_addons enable row level security;
alter table public.promotions enable row level security;

create policy "profiles admin read" on public.profiles for select using (public.is_admin());
create policy "profiles self read" on public.profiles for select using (auth.uid() = id);

create policy "public read settings" on public.settings for select using (true);
create policy "admin write settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());

create policy "public read categories" on public.categories for select using (active = true or public.is_admin());
create policy "admin write categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "public read products" on public.products for select using (active = true or public.is_admin());
create policy "admin write products" on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "public read addon groups" on public.addon_groups for select using (active = true or public.is_admin());
create policy "admin write addon groups" on public.addon_groups for all using (public.is_admin()) with check (public.is_admin());

create policy "public read addons" on public.addons for select using (active = true or public.is_admin());
create policy "admin write addons" on public.addons for all using (public.is_admin()) with check (public.is_admin());

create policy "public read gallery" on public.gallery_images for select using (active = true or public.is_admin());
create policy "admin write gallery" on public.gallery_images for all using (public.is_admin()) with check (public.is_admin());

create policy "public read reviews" on public.reviews for select using (active = true or public.is_admin());
create policy "admin write reviews" on public.reviews for all using (public.is_admin()) with check (public.is_admin());

create policy "public create customers" on public.customers for insert with check (true);
create policy "admin read customers" on public.customers for select using (public.is_admin());
create policy "admin write customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());

create policy "public create orders" on public.orders for insert with check (true);
create policy "admin read orders" on public.orders for select using (public.is_admin());
create policy "admin update orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());

create policy "public create order items" on public.order_items for insert with check (true);
create policy "admin read order items" on public.order_items for select using (public.is_admin());

create policy "public create order item addons" on public.order_item_addons for insert with check (true);
create policy "admin read order item addons" on public.order_item_addons for select using (public.is_admin());

create policy "public read promotions" on public.promotions for select using (active = true or public.is_admin());
create policy "admin write promotions" on public.promotions for all using (public.is_admin()) with check (public.is_admin());

insert into public.settings (key, value) values
('site', '{
  "brandShort": "Mão na Brasa",
  "brandTag": "Burger",
  "whatsapp": "5564992360895",
  "whatsappDisplay": "(64) 99236-0895",
  "instagram": "@mao_na_brasa_burger",
  "instagramUrl": "https://www.instagram.com/mao_na_brasa_burger/",
  "hours": "Segunda a domingo, 18:00 as 23:30",
  "address": "Endereco configuravel da hamburgueria"
}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.categories (name, sort_order) values
('Combos', 1),
('Hamburgueres', 2),
('Porcoes', 3),
('Bebidas', 4),
('Sobremesas', 5),
('Promocoes', 6)
on conflict do nothing;

insert into public.addon_groups (name, sort_order) values
('Carnes & complementos', 1),
('Salada', 2),
('Molhos', 3),
('Batatas', 4)
on conflict do nothing;

-- Com esta versão simples, qualquer usuário cadastrado/logado no Supabase Auth
-- pode editar o admin. Para produção, o ideal é voltar para controle por role.

-- Storage para imagens.
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

create policy "public read site images"
on storage.objects for select
using (bucket_id = 'site-images');

create policy "admin upload site images"
on storage.objects for insert
with check (bucket_id = 'site-images' and public.is_admin());

create policy "admin update site images"
on storage.objects for update
using (bucket_id = 'site-images' and public.is_admin())
with check (bucket_id = 'site-images' and public.is_admin());

create policy "admin delete site images"
on storage.objects for delete
using (bucket_id = 'site-images' and public.is_admin());
