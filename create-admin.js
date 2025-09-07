const bcrypt = require('bcrypt');
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

async function createAdminUser() {
  try {
    // SECURITY: Replace these with your actual admin credentials
    const userid = process.env.ADMIN_USERID || 'your_admin_username';
    const password = process.env.ADMIN_PASSWORD || 'your_secure_password';
    
    if (userid === 'your_admin_username' || password === 'your_secure_password') {
      console.error('⚠️  Please set ADMIN_USERID and ADMIN_PASSWORD environment variables');
      console.error('   or edit this script with your actual admin credentials.');
      process.exit(1);
    }
    
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    console.log('Creating admin user:', userid);

    // Insert admin user
    const { data, error } = await supabase
      .from('admins')
      .insert([
        {
          userid: userid,
          password_hash: passwordHash,
          role: 'main_admin',
          is_active: true
        }
      ])
      .select();

    if (error) {
      console.error('Error creating admin user:', error);
      return;
    }

    console.log('Admin user created successfully:', data);
  } catch (error) {
    console.error('Script error:', error);
  }
}

createAdminUser();
