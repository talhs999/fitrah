-- ============================================================
-- Run this SQL in your Supabase SQL Editor:
-- https://app.supabase.com → Project → SQL Editor
-- ============================================================

-- 1. Create site_settings table (stores SMTP + newsletter config)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- SMTP Config
  smtp_host TEXT DEFAULT 'smtp.gmail.com',
  smtp_port INTEGER DEFAULT 587,
  smtp_secure BOOLEAN DEFAULT FALSE,
  smtp_user TEXT DEFAULT '',
  smtp_pass TEXT DEFAULT '',
  from_name TEXT DEFAULT 'Fitrah Beard Oil',
  admin_email TEXT DEFAULT '',
  -- Newsletter / CTA Section
  newsletter_enabled BOOLEAN DEFAULT TRUE,
  newsletter_discount_percent INTEGER DEFAULT 10,
  newsletter_discount_code TEXT DEFAULT 'WELCOME10',
  newsletter_max_uses INTEGER DEFAULT 0,  -- 0 = unlimited
  newsletter_use_count INTEGER DEFAULT 0,
  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert a default row if none exists
INSERT INTO site_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- 3. RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Admin (authenticated) can read & write
CREATE POLICY "Admin full access to site_settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Public can read non-sensitive fields (for newsletter display on homepage)
CREATE POLICY "Public can read newsletter settings"
  ON site_settings
  FOR SELECT
  TO anon
  USING (TRUE);

-- 4. Also update the coupons system in payment_settings table
-- Add a newsletter_subscribers table to track who subscribed
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  discount_code TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (subscribe)
CREATE POLICY "Public can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Admin can read all subscribers
CREATE POLICY "Admin can read newsletter subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (TRUE);
