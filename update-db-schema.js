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

async function updateSchema() {
  try {
    console.log('Updating database schema...');

    // Update existing admin users to have permissions
    const { data, error } = await supabase
      .from('admins')
      .update({ 
        notification_access: true, 
        photo_access: true 
      })
      .is('notification_access', null)
      .select();

    if (error) {
      console.error('Error updating schema:', error);
      return;
    }

    console.log('Schema updated successfully!');
    console.log(`Updated ${data?.length || 0} admin users with default permissions`);
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

updateSchema();
