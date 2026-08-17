-- Add new columns for customizable newsletter text
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS newsletter_heading text DEFAULT 'Get {discountPercent}% off
your first order.',
ADD COLUMN IF NOT EXISTS newsletter_description text DEFAULT 'Subscribe to the Fitrah newsletter and receive an exclusive discount code instantly, plus early access to new product launches.';
