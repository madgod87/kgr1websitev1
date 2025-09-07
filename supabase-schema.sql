-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admins table
CREATE TABLE public.admins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    userid VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('main_admin', 'sub_admin')),
    created_by UUID REFERENCES public.admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES public.admins(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create gallery_images table
CREATE TABLE public.gallery_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    uploaded_by UUID NOT NULL REFERENCES public.admins(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_size BIGINT NOT NULL
);

-- Create file_uploads table
CREATE TABLE public.file_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES public.admins(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    category VARCHAR(20) NOT NULL CHECK (category IN ('pdf', 'excel', 'image', 'other'))
);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins table
CREATE POLICY "Admins can view all admin records" ON public.admins
    FOR SELECT USING (true);

CREATE POLICY "Main admin can insert new admins" ON public.admins
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()::uuid AND role = 'main_admin' AND is_active = true
        )
    );

CREATE POLICY "Admins can update their own record" ON public.admins
    FOR UPDATE USING (id = auth.uid()::uuid);

CREATE POLICY "Main admin can update all admin records" ON public.admins
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()::uuid AND role = 'main_admin' AND is_active = true
        )
    );

-- Create RLS policies for notifications table
CREATE POLICY "Anyone can view active notifications" ON public.notifications
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage notifications" ON public.notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()::uuid AND is_active = true
        )
    );

-- Create RLS policies for gallery_images table
CREATE POLICY "Anyone can view gallery images" ON public.gallery_images
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery images" ON public.gallery_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()::uuid AND is_active = true
        )
    );

-- Create RLS policies for file_uploads table
CREATE POLICY "Anyone can view file uploads" ON public.file_uploads
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage file uploads" ON public.file_uploads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()::uuid AND is_active = true
        )
    );

-- Create storage buckets (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES 
-- ('gallery-images', 'gallery-images', true),
-- ('file-uploads', 'file-uploads', true);

-- Create storage policies
-- CREATE POLICY "Anyone can view files" ON storage.objects 
--     FOR SELECT USING (bucket_id IN ('gallery-images', 'file-uploads'));

-- CREATE POLICY "Admins can upload files" ON storage.objects 
--     FOR INSERT WITH CHECK (
--         bucket_id IN ('gallery-images', 'file-uploads') AND
--         EXISTS (
--             SELECT 1 FROM public.admins 
--             WHERE id = auth.uid()::uuid AND is_active = true
--         )
--     );

-- CREATE POLICY "Admins can delete files" ON storage.objects 
--     FOR DELETE USING (
--         bucket_id IN ('gallery-images', 'file-uploads') AND
--         EXISTS (
--             SELECT 1 FROM public.admins 
--             WHERE id = auth.uid()::uuid AND is_active = true
--         )
--     );
