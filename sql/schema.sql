-- Run this once in your Supabase project's SQL Editor (Supabase dashboard -> SQL Editor -> New query).

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  volume text not null default '',
  description text not null default '',
  image_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

-- Anyone (including logged-out visitors) can read products, so the public site can display them.
create policy "Public can read products"
  on products for select
  using (true);

-- Only logged-in users (your admin account) can add, edit, or delete products.
create policy "Authenticated users can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update products"
  on products for update
  to authenticated
  using (true);

create policy "Authenticated users can delete products"
  on products for delete
  to authenticated
  using (true);

-- Storage bucket for product photos. Run in the SQL editor too, or create a bucket named
-- "product-images" (public) from Storage -> New bucket in the dashboard instead.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table inquiries enable row level security;

-- Anyone can submit an enquiry from the public contact form...
create policy "Public can submit inquiries"
  on inquiries for insert
  to anon, authenticated
  with check (true);

-- ...but only you (logged in) can read the submitted enquiries.
create policy "Authenticated users can read inquiries"
  on inquiries for select
  to authenticated
  using (true);

-- Seed the 9 original products so the site isn't empty on first load.
-- (Image URLs are left blank -- add real photos from the admin dashboard after deploying.)
insert into products (name, volume, description, sort_order) values
  ('Red Kochchi Sauce', '250ml Bottle', 'A fiery, fruit-forward chilli sauce crafted with premium ingredients for an unforgettable taste.', 1),
  ('Green Kochchi Sauce', '250ml Bottle', 'Bright, herbaceous heat built on green chilli, lime and garlic -- sharp, fresh, unmistakably Sri Lankan.', 2),
  ('Seeni Sambol', '350g Jar', 'Caramelised onion relish, slow-cooked with authentic spice -- refined for modern gourmet kitchens.', 3),
  ('Premium Coconut Oil', '500ml / 1L Jar', 'RBD coconut oil -- a timeless essential, crafted with uncompromising quality, straight from the island.', 4),
  ('Roasted Chilli Powder', '500g Pack', 'Deep, smoky heat from slow-roasted chillies -- the backbone of authentic Sri Lankan cooking.', 5),
  ('Unroasted Curry Powder', '1kg Pack', 'A balanced blend of coriander, fenugreek, cardamom and more -- an everyday essential, done right.', 6),
  ('Cinnamon Quills', '100g Pack', 'True Ceylon cinnamon, hand-rolled to grade C4 -- sweet, delicate, and unmistakably premium.', 7),
  ('Young Jackfruit (Polos) Curry', '675g Jar', 'A hearty, spiced jackfruit curry -- a beloved island classic, ready straight from the jar.', 8),
  ('Garcinia (Goraka)', '200g Pack', 'The sun-dried souring fruit essential to island cuisine -- earthy, tart, quietly indispensable.', 9)
on conflict do nothing;
