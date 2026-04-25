-- ==========================================
-- FITRAH E-COMMERCE COMPLETE SUPABASE SCHEMA
-- ==========================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  arabic TEXT DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  purpose TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  accent TEXT,
  bg TEXT NOT NULL DEFAULT '#ebebeb',
  text_color TEXT DEFAULT '#111111',
  description TEXT NOT NULL DEFAULT '',
  ingredients TEXT[],
  how_to_use TEXT NOT NULL DEFAULT '',
  scent TEXT NOT NULL DEFAULT '',
  size TEXT NOT NULL DEFAULT '30ml',
  stock BOOLEAN DEFAULT true,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sale_price NUMERIC,
  tags TEXT[] DEFAULT '{}',
  gallery_images TEXT[] DEFAULT '{}'
);

-- Add missing columns just in case the table already exists from older seeds
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS sale_price NUMERIC,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#111111';

ALTER TABLE public.products 
ALTER COLUMN ingredients DROP NOT NULL,
ALTER COLUMN accent DROP NOT NULL;

-- 3. Create Orders Tables
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'Processing' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_at_time NUMERIC NOT NULL
);

-- 4. Set Up Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (auth.email() = 'admin@fitrah.com');

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (auth.email() = 'admin@fitrah.com');

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (auth.email() = 'admin@fitrah.com');

-- Categories Policies
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories USING (auth.email() = 'admin@fitrah.com');

-- Orders Policies
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view orders" ON public.orders;
CREATE POLICY "Admins can view orders" ON public.orders FOR SELECT USING (auth.email() = 'admin@fitrah.com');

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (auth.email() = 'admin@fitrah.com');

-- Order Items Policies
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view order items" ON public.order_items;
CREATE POLICY "Admins can view order items" ON public.order_items FOR SELECT USING (auth.email() = 'admin@fitrah.com');

-- 5. Create Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
CREATE POLICY "Anyone can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can insert product images" ON storage.objects;
CREATE POLICY "Admins can insert product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.email() = 'admin@fitrah.com');

DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
CREATE POLICY "Admins can update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.email() = 'admin@fitrah.com');

DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.email() = 'admin@fitrah.com');

-- 6. Insert Default Category and Assign Products
INSERT INTO public.categories (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000001', 'Beard Care', 'beard-care')
ON CONFLICT (slug) DO NOTHING;

UPDATE public.products
SET category_id = '00000000-0000-0000-0000-000000000001'
WHERE category_id IS NULL;
