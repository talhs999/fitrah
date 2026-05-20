-- Add cap options columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS cap_dropper_image TEXT,
ADD COLUMN IF NOT EXISTS cap_pump_image TEXT;

-- Add selected cap column to order_items table
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS selected_cap TEXT DEFAULT 'dropper';
