-- Run this to instantly verify your admin email so you don't need to check your inbox!
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@fitrah.com';
