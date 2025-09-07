# 🚀 Vercel Deployment Guide for KGR-I Website

## 📋 Prerequisites

Before deploying to Vercel, ensure you have:
- ✅ Supabase project created and configured
- ✅ Database schema and tables set up
- ✅ Admin user created
- ✅ Environment variables ready

## 🌐 Step-by-Step Deployment

### 1. **Prepare Your Supabase Configuration**

Get these values from your Supabase project:
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project
- Go to **Settings > API**

Copy these values:
```
Project URL: https://YOUR_PROJECT_REF.supabase.co
anon public key: eyJ0eXAiOiJKV1Q...
service_role key: eyJ0eXAiOiJKV1Q...
```

### 2. **Deploy to Vercel**

#### Option A: Deploy via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository: `madgod87/kgr1websitev1`
4. Click **"Deploy"** (it will fail initially - this is expected)

#### Option B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

### 3. **Configure Environment Variables**

After the initial deployment (even if it fails):

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings > Environment Variables**
3. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_anon_key` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_service_role_key` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `your_random_secret` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | Production |
| `NEXTAUTH_URL` | `https://your-preview-url.vercel.app` | Preview |
| `NEXTAUTH_URL` | `http://localhost:3000` | Development |

### 4. **Generate Secure Secrets**

For `NEXTAUTH_SECRET`, generate a random string:
```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. **Redeploy**

After adding environment variables:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger automatic deployment

## ✅ Deployment Checklist

### Before Deployment:
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Admin user created
- [ ] Storage buckets created (`gallery-images`, `file-uploads`)
- [ ] RLS policies configured
- [ ] Environment variables copied

### After Deployment:
- [ ] All environment variables added to Vercel
- [ ] Build succeeds without errors
- [ ] Website loads correctly
- [ ] Admin login works
- [ ] Database connections working
- [ ] File uploads functional

## 🐛 Common Issues & Solutions

### Issue 1: "supabaseUrl is required"
**Solution**: Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel environment variables

### Issue 2: Build fails during "Collecting page data"
**Solution**: Ensure all environment variables are set for all environments (Production, Preview, Development)

### Issue 3: Deprecated package warnings
**Solution**: These are warnings only and won't break deployment. We've removed the deprecated packages.

### Issue 4: Database connection errors
**Solution**: 
1. Verify Supabase URL is correct
2. Check that anon key is valid
3. Ensure RLS policies allow public access where needed

### Issue 5: Admin login not working
**Solution**:
1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Ensure admin user exists in database

## 🔍 Testing Deployment

### 1. **Basic Functionality**
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Footer displays correctly
- [ ] Logo appears properly

### 2. **Admin Functions**
- [ ] Admin login page accessible
- [ ] Login with valid credentials works
- [ ] Dashboard loads after login
- [ ] Logout functionality works

### 3. **Database Features**
- [ ] Notifications page loads
- [ ] Gallery page loads
- [ ] Block profile displays data

### 4. **File Operations**
- [ ] Image uploads work (if applicable)
- [ ] File downloads work
- [ ] Storage permissions correct

## 🎯 Production URLs

After successful deployment, your URLs will be:
- **Main Site**: `https://your-project-name.vercel.app`
- **Admin Login**: `https://your-project-name.vercel.app/login`
- **API Endpoints**: `https://your-project-name.vercel.app/api/*`

## 🔒 Security Considerations

1. **Environment Variables**: Never expose service role keys
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure Supabase CORS settings if needed
4. **Rate Limiting**: Consider adding rate limiting for API routes
5. **Domain Verification**: Use custom domain for production

## 📞 Support

If deployment issues persist:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Verify all environment variables are correct
4. Test with a minimal configuration first

Remember: The first deployment might fail due to missing environment variables - this is normal! Just add the variables and redeploy.

---

**Happy Deploying! 🚀**
