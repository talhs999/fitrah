-- Add Bank Transfer columns to payment_settings
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS bank_transfer_enabled boolean DEFAULT false;
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS bank_name text DEFAULT '';
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS bank_account_name text DEFAULT '';
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS bank_account_number text DEFAULT '';
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS bank_iban text DEFAULT '';
ALTER TABLE payment_settings ADD COLUMN IF NOT EXISTS bank_instructions text DEFAULT '';
