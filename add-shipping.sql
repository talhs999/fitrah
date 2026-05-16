ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS local_shipping_rate numeric DEFAULT 0;
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS standard_shipping_rate numeric DEFAULT 9.95;
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS free_shipping_threshold numeric DEFAULT 80.00;
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS local_shipping_city text DEFAULT 'Lahore';
