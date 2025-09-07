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

async function fixRLS() {
  try {
    console.log('Fixing RLS policies for gallery_images table...');

    // Disable RLS for gallery_images table
    const { error } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;'
    });

    if (error) {
      console.error('Error fixing RLS:', error);
      console.log('\nPlease run this SQL command manually in Supabase dashboard:');
      console.log('ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;');
      return;
    }

    console.log('RLS policies fixed successfully!');
    console.log('Gallery images table now allows unrestricted access.');
    
  } catch (error) {
    console.error('Script error:', error);
    console.log('\nPlease run this SQL command manually in Supabase dashboard:');
    console.log('ALTER TABLE public.gallery_images DISABLE ROW LEVEL SECURITY;');
  }
}

fixRLS();
