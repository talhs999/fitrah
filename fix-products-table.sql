-- ============================================
-- FITRAH: Fix missing columns and constraints
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add the missing text_color column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS text_color TEXT DEFAULT '#111111';

-- 2. Make arabic column nullable (form says "Optional")
ALTER TABLE public.products 
ALTER COLUMN arabic DROP NOT NULL;

-- 3. Make image column have a default (so products can be saved without image initially)
ALTER TABLE public.products 
ALTER COLUMN image SET DEFAULT '';

-- 4. Make subtitle, tagline, description, how_to_use, scent, size have defaults
-- so partial saves don't crash
ALTER TABLE public.products 
ALTER COLUMN subtitle SET DEFAULT '',
ALTER COLUMN tagline SET DEFAULT '',
ALTER COLUMN description SET DEFAULT '',
ALTER COLUMN how_to_use SET DEFAULT '',
ALTER COLUMN scent SET DEFAULT '',
ALTER COLUMN size SET DEFAULT '30ml';

-- Verify: Check that text_color column now exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' AND table_schema = 'public'
ORDER BY ordinal_position;
