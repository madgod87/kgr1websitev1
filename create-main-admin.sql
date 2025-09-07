-- Insert main admin user
-- Password: Beta@Alpha#1991
-- This is a bcrypt hash of the password (you'll need to run this after setting up your database)

INSERT INTO public.admins (userid, password_hash, role, is_active) 
VALUES (
    'madgod87',
    '$2b$12$6Y2/72Pk38DHfFJlFHghHuMU4aluMckQvYzU1eo5hVXGNSsknJWiu', -- bcrypt hash for Beta@Alpha#1991
    'main_admin',
    true
);

-- Note: You'll need to generate the actual bcrypt hash for "Beta@Alpha#1991"
-- You can do this by running the Node.js script below or using the admin creation API endpoint

/*
const bcrypt = require('bcryptjs');
const password = 'Beta@Alpha#1991';
const saltRounds = 12;

bcrypt.hash(password, saltRounds, function(err, hash) {
  console.log('Password hash:', hash);
});
*/
