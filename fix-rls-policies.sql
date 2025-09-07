-- Disable RLS temporarily for gallery_images table
ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;

-- Or alternatively, create new policies that work with our custom auth system
-- (Uncomment the section below if you prefer to keep RLS enabled)

/*
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can manage gallery images" ON public.gallery_images;

-- Create new policies that don't rely on auth.uid()
CREATE POLICY "Public can view gallery images" ON public.gallery_images
    FOR SELECT USING (true);

CREATE POLICY "Allow all operations on gallery_images" ON public.gallery_images
    FOR ALL USING (true);
*/
