const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function completeFix() {
  try {
    console.log('🔧 Fixing database and storage issues...\n');

    // 1. Make storage bucket public
    console.log('1. Making gallery-images bucket public...');
    const { error: bucketError } = await supabase.storage
      .updateBucket('gallery-images', { public: true });

    if (bucketError) {
      console.error('❌ Could not make bucket public:', bucketError);
      console.log('🔧 Please manually set the bucket to public in Supabase Dashboard → Storage');
    } else {
      console.log('✅ Gallery images bucket is now public');
    }

    // 2. Get a valid admin user ID for testing
    console.log('\n2. Getting valid admin user ID...');
    const { data: admins, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .limit(1);

    if (adminError || !admins || admins.length === 0) {
      console.error('❌ No admin users found:', adminError);
      return;
    }

    const validAdminId = admins[0].id;
    console.log('✅ Found valid admin ID:', validAdminId);

    // 3. Test insert with valid admin ID
    console.log('\n3. Testing insert with valid admin ID...');
    const testImage = {
      filename: 'test-image.jpg',
      url: 'https://example.com/test.jpg',
      alt_text: 'Test image',
      uploaded_by: validAdminId,
      file_size: 1024
    };

    const { data: insertData, error: insertError } = await supabase
      .from('gallery_images')
      .insert([testImage])
      .select();

    if (insertError) {
      console.error('❌ Insert still failing:', insertError);
      
      if (insertError.message.includes('row-level security')) {
        console.log('\n🔧 RLS ISSUE DETECTED:');
        console.log('Please run this SQL command in Supabase Dashboard → SQL Editor:');
        console.log('ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;');
      }
    } else {
      console.log('✅ Insert works! Cleaning up test record...');
      await supabase
        .from('gallery_images')
        .delete()
        .eq('filename', 'test-image.jpg');
      
      console.log('\n🎉 All issues fixed! Photo upload should work now.');
    }

    // 4. Update the schema to add permission columns if they don't exist
    console.log('\n4. Checking admin permissions...');
    const { data: adminWithPerms, error: permError } = await supabase
      .from('admins')
      .select('notification_access, photo_access')
      .limit(1);

    if (permError && permError.code === '42703') {
      console.log('❌ Permission columns missing');
      console.log('🔧 Please run this SQL in Supabase Dashboard:');
      console.log('ALTER TABLE public.admins ADD COLUMN notification_access BOOLEAN DEFAULT true;');
      console.log('ALTER TABLE public.admins ADD COLUMN photo_access BOOLEAN DEFAULT true;');
    } else if (adminWithPerms) {
      console.log('✅ Permission columns exist');
      
      // Update existing admins to have permissions
      const { error: updateError } = await supabase
        .from('admins')
        .update({ 
          notification_access: true, 
          photo_access: true 
        })
        .is('notification_access', null);

      if (updateError) {
        console.log('⚠️  Could not update permissions:', updateError.message);
      } else {
        console.log('✅ Admin permissions updated');
      }
    }

  } catch (error) {
    console.error('Script error:', error);
  }
}

completeFix();
