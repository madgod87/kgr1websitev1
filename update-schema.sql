-- Add permission fields to admins table
ALTER TABLE public.admins 
ADD COLUMN notification_access BOOLEAN DEFAULT true,
ADD COLUMN photo_access BOOLEAN DEFAULT true;

-- Update existing admin users to have all permissions
UPDATE public.admins SET notification_access = true, photo_access = true WHERE role = 'main_admin';

-- Add comments to explain the permission fields
COMMENT ON COLUMN public.admins.notification_access IS 'Can create, edit, and manage notifications';
COMMENT ON COLUMN public.admins.photo_access IS 'Can upload, delete, and manage gallery photos';
