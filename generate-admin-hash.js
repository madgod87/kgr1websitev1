const bcrypt = require('bcryptjs');

const password = 'Beta@Alpha#1991';
const saltRounds = 12;

async function generateHash() {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log('Password hash for admin user:');
        console.log(hash);
        console.log('\nUpdate your SQL with this hash:');
        console.log(`UPDATE public.admins SET password_hash = '${hash}' WHERE userid = 'madgod87';`);
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

generateHash();
