-- 1. Create a default category
INSERT INTO public.categories (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000001', 'Beard Care', 'beard-care')
ON CONFLICT (slug) DO NOTHING;

-- 2. Assign all existing products to this category if they don't have one
UPDATE public.products
SET category_id = '00000000-0000-0000-0000-000000000001'
WHERE category_id IS NULL;
