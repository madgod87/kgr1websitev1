# Security Notice

## Credential Removal

**⚠️ IMPORTANT**: All hardcoded credentials have been removed from this codebase for security reasons.

### What Was Removed
- Default admin username and password from all files
- Hardcoded bcrypt password hashes
- Example credentials in documentation

### What You Need to Do

#### 1. Create Your Admin Credentials

**Option A: Using Environment Variables**
```bash
export ADMIN_USERID="your_chosen_username"
export ADMIN_PASSWORD="your_secure_password"
node create-admin.js
```

**Option B: Manual SQL Setup**
1. Edit `create-main-admin.sql`
2. Replace `YOUR_ADMIN_USERNAME` and `YOUR_BCRYPT_PASSWORD_HASH` with your values
3. Generate password hash using `node generate-admin-hash.js`
4. Run the SQL in your Supabase dashboard

#### 2. Security Best Practices

- ✅ Use strong, unique passwords
- ✅ Store credentials in environment variables
- ✅ Never commit credentials to git
- ✅ Rotate passwords regularly
- ✅ Use different credentials for development and production

### Files Updated for Security

The following files had hardcoded credentials removed:
- `create-admin.js`
- `create-main-admin.sql`
- `generate-admin-hash.js`
- `README.md`
- `WARP.md`
- `SETUP.md`

### Production Deployment

When deploying to production:
1. Set `ADMIN_USERID` and `ADMIN_PASSWORD` in your environment variables
2. Never use the same credentials as development
3. Consider implementing 2FA for additional security

---

**Remember**: Security is not optional. Always use unique, strong credentials for your deployments.
