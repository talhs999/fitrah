-- Add gallery_images column to products to support multiple images
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
