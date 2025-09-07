const bcrypt = require('bcryptjs');

// SECURITY: Set your password via environment variable or edit this script
const password = process.env.ADMIN_PASSWORD;
const userid = process.env.ADMIN_USERID || 'YOUR_ADMIN_USERNAME';
const saltRounds = 12;

if (!password) {
  console.error('⚠️  Please set ADMIN_PASSWORD environment variable.');
  console.error('   Example: ADMIN_PASSWORD="your_password" node generate-admin-hash.js');
  process.exit(1);
}

async function generateHash() {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Password hash for admin user:');
        console.log(hash);
        console.log('\nUpdate your SQL with this hash:');
        console.log(`UPDATE public.admins SET password_hash = '${hash}' WHERE userid = '${userid}';`);
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

generateHash();
