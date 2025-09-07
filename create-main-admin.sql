-- SECURITY: Insert main admin user with YOUR credentials
-- Replace USERNAME and PASSWORD_HASH with your actual values

INSERT INTO public.admins (userid, password_hash, role, is_active) 
VALUES (
    'YOUR_ADMIN_USERNAME',  -- Replace with your chosen admin username
    'YOUR_BCRYPT_PASSWORD_HASH',  -- Replace with bcrypt hash of your password
    'main_admin',
    true
);

-- HOW TO GENERATE PASSWORD HASH:
-- Run this Node.js script with your actual password:

/*
const bcrypt = require('bcryptjs');
const password = 'YOUR_SECURE_PASSWORD';  -- Replace with your actual password
const saltRounds = 12;

bcrypt.hash(password, saltRounds, function(err, hash) {
  console.log('Password hash:', hash);
});
*/
