-- 1. Ensure ingredients and accent columns can be null, or have defaults, since our form doesn't strictly enforce them yet.
ALTER TABLE public.products 
ALTER COLUMN ingredients DROP NOT NULL,
ALTER COLUMN accent DROP NOT NULL;

-- 2. Add RLS Policies so Admins can actually Create, Update, and Delete Products
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.email() = 'admin@fitrah.com');

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (auth.email() = 'admin@fitrah.com');

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (auth.email() = 'admin@fitrah.com');
