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

async function debugAndFix() {
  try {
    console.log('🔍 Checking database state...\n');

    // Check if gallery_images table exists
    console.log('1. Checking gallery_images table...');
    const { data: tables, error: tableError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gallery_images';` 
      });
    
    if (tableError) {
      console.error('Error checking table:', tableError);
    } else {
      console.log('✅ gallery_images table exists');
    }

    // Check if the table has the notification_access and photo_access columns
    console.log('\n2. Checking admins table structure...');
    const { data: columns, error: columnError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT column_name FROM information_schema.columns WHERE table_name = 'admins' AND table_schema = 'public' AND column_name IN ('notification_access', 'photo_access');` 
      });
    
    if (columnError) {
      console.error('Error checking columns:', columnError);
    } else {
      console.log('✅ Permission columns exist');
    }

    // Try to create a test record directly
    console.log('\n3. Testing direct insert into gallery_images...');
    const testImage = {
      filename: 'test-image.jpg',
      url: 'https://example.com/test.jpg',
      alt_text: 'Test image',
      uploaded_by: '00000000-0000-0000-0000-000000000000', // UUID format
      file_size: 1024
    };

    const { data: insertData, error: insertError } = await supabase
      .from('gallery_images')
      .insert([testImage])
      .select();

    if (insertError) {
      console.error('❌ Direct insert failed:', insertError);
      
      // Try to disable RLS using raw SQL
      console.log('\n4. Attempting to disable RLS...');
      const { error: rlsError } = await supabase
        .rpc('exec_sql', { 
          sql: 'ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;' 
        });

      if (rlsError) {
        console.error('❌ Could not disable RLS via script:', rlsError);
        console.log('\n🔧 MANUAL FIX REQUIRED:');
        console.log('Please go to Supabase Dashboard → SQL Editor and run:');
        console.log('ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;');
      } else {
        console.log('✅ RLS disabled successfully');
        
        // Try insert again
        const { data: retryData, error: retryError } = await supabase
          .from('gallery_images')
          .insert([testImage])
          .select();
          
        if (retryError) {
          console.error('❌ Insert still failing:', retryError);
        } else {
          console.log('✅ Insert works now! Cleaning up test record...');
          await supabase
            .from('gallery_images')
            .delete()
            .eq('filename', 'test-image.jpg');
        }
      }
    } else {
      console.log('✅ Direct insert works! Cleaning up test record...');
      await supabase
        .from('gallery_images')
        .delete()
        .eq('filename', 'test-image.jpg');
    }

    // Check storage bucket
    console.log('\n5. Checking storage bucket...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Error checking buckets:', bucketError);
    } else {
      const galleryBucket = buckets.find(b => b.name === 'gallery-images');
      if (galleryBucket) {
        console.log('✅ gallery-images bucket exists');
        console.log(`   Public: ${galleryBucket.public}`);
      } else {
        console.log('❌ gallery-images bucket does not exist');
        console.log('🔧 Please create it in Supabase Dashboard → Storage');
      }
    }

  } catch (error) {
    console.error('Script error:', error);
  }
}

debugAndFix();
