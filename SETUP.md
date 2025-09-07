# Project Setup Guide

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd kgr1websitev1
   npm install
   ```

2. **Database Setup**
   - Create Supabase project
   - Run `supabase-schema.sql` in SQL Editor
   - Run `create-main-admin.sql` in SQL Editor
   - Create storage buckets: `gallery-images`, `file-uploads`

3. **Environment Variables**
   - Copy `.env.local` template
   - Update with your Supabase credentials
   - Generate a strong `NEXTAUTH_SECRET`

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Create Admin Account**
   ```bash
   # Set your admin credentials
   export ADMIN_USERID="your_username"
   export ADMIN_PASSWORD="your_password"
   node create-admin.js
   ```

6. **Login**
   - Visit `http://localhost:3000/login`
   - Use the credentials you created above

## Deployment Checklist

- [ ] Database schema deployed
- [ ] Main admin user created
- [ ] Storage buckets created
- [ ] Environment variables set in Vercel
- [ ] Domain configured in Vercel
- [ ] NEXTAUTH_URL updated for production

## Troubleshooting

**Login Issues:**
- Check if main admin user exists in database
- Verify password hash is correct
- Check JWT secret is set

**Database Connection:**
- Verify Supabase URL and keys
- Check RLS policies are enabled
- Ensure service role key has proper permissions

**File Uploads:**
- Verify storage buckets exist
- Check bucket policies
- Ensure file size limits are configured
