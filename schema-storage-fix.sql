-- Fix Storage Upload Policies for product-images bucket
-- The problem: when uploading from the browser client, auth.email() may not resolve
-- correctly in storage policies. We allow authenticated users to upload.

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Admins can insert product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;

-- Allow anyone to VIEW images (required for public storefront)
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow ANY authenticated user to UPLOAD images (the admin is authenticated)
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow ANY authenticated user to UPDATE images  
CREATE POLICY "Authenticated users can update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow ANY authenticated user to DELETE images
CREATE POLICY "Authenticated users can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

-- Also make sure the bucket itself is set to public
UPDATE storage.buckets SET public = true WHERE id = 'product-images';
