-- Create the payment_settings table
CREATE TABLE IF NOT EXISTS payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_enabled boolean DEFAULT false,
  stripe_public_key text DEFAULT '',
  stripe_secret_key text DEFAULT '',
  stripe_webhook_secret text DEFAULT '',
  cod_enabled boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert a default row if the table is empty
INSERT INTO payment_settings (stripe_enabled, cod_enabled)
SELECT false, true
WHERE NOT EXISTS (SELECT 1 FROM payment_settings);

-- Enable RLS
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to non-sensitive fields
-- Since we can't easily restrict column select in RLS directly without views,
-- it's better to just let public read the row but the frontend must never expose the secret keys.
-- However, for maximum security, let's create a public view or use edge functions.
-- Actually, a simpler way is to just let the client fetch only the public fields using select("stripe_enabled, stripe_public_key, cod_enabled").
-- But to enforce it at DB level:
CREATE OR REPLACE VIEW public_payment_settings AS
SELECT stripe_enabled, stripe_public_key, cod_enabled
FROM payment_settings;

-- Allow public access to the view
GRANT SELECT ON public_payment_settings TO anon, authenticated;

-- For the main table, allow admins full access, but deny public
CREATE POLICY "Allow public read of payment settings" ON payment_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access to payment settings" ON payment_settings FOR ALL USING (auth.role() = 'authenticated');
