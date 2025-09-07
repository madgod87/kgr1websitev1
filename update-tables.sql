-- Add category column to gallery_images table
ALTER TABLE public.gallery_images 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general';

-- Create slideshow_images table
CREATE TABLE IF NOT EXISTS public.slideshow_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    uploaded_by UUID NOT NULL REFERENCES public.admins(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_size BIGINT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Disable RLS for slideshow_images table
ALTER TABLE public.slideshow_images DISABLE ROW LEVEL SECURITY;

-- Add some sample categories
COMMENT ON COLUMN public.gallery_images.category IS 'Category: overview, services, digital, community, governance, development, infrastructure, welfare, education, environment, general';
COMMENT ON TABLE public.slideshow_images IS 'Images for the main page slideshow (max 12 images)';
