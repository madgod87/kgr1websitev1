-- Disable RLS for gallery_images table
ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;

-- Add permission columns if they don't exist
ALTER TABLE public.admins 
ADD COLUMN IF NOT EXISTS notification_access BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS photo_access BOOLEAN DEFAULT true;

-- Update existing admin users to have all permissions
UPDATE public.admins SET notification_access = true, photo_access = true WHERE notification_access IS NULL OR photo_access IS NULL;

-- Disable RLS on storage.objects table (this is the key fix for upload issues)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Or alternatively, create permissive policies for storage (uncomment if you prefer to keep RLS)
/*
-- Drop existing restrictive policies on storage.objects
DROP POLICY IF EXISTS "Anyone can view files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;

-- Create new permissive policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (true);
*/
