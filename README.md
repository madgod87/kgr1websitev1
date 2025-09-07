# Bankura2Block Next.js with Supabase

A modern Next.js application for the Krishnagar-I Development Block government website with Supabase backend integration.

## Features

- **Authentication System**: Secure admin login with JWT tokens
- **Admin Management**: Main admin can create and manage sub-admins
- **Notification System**: Create, edit, and manage notifications
- **Gallery Management**: Upload and manage gallery images
- **File Management**: Upload and manage PDFs, Excel files, and documents
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Database**: PostgreSQL with Supabase
- **File Storage**: Supabase Storage for all file uploads
- **Deployment**: Optimized for Vercel deployment

## Technology Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **JWT** for authentication

### Backend & Database
- **Supabase** (PostgreSQL database + Storage)
- **Row Level Security (RLS)** for data security
- **Bcrypt** for password hashing

### Deployment
- **Vercel** for hosting
- **Environment variables** for configuration

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## Setup Instructions

### 1. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the contents of `supabase-schema.sql` to create tables and policies
4. Run the contents of `create-main-admin.sql` to create the main admin user

### 2. Storage Setup

1. In your Supabase dashboard, go to Storage
2. Create two buckets:
   - `gallery-images` (public)
   - `file-uploads` (public)
3. Set up storage policies in the SQL editor (see commented sections in `supabase-schema.sql`)

### 3. Environment Variables

1. Copy `.env.local` and update with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 4. Installation

```bash
npm install
```

### 5. Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Admin Access

### Main Admin Credentials
- **User ID**: `madgod87`
- **Password**: `Beta@Alpha#1991`

The main admin can:
- Create sub-admin accounts
- Manage all notifications
- Upload and manage files/gallery images
- View dashboard analytics

### Sub-Admin Access
Sub-admins can be created by the main admin and have access to:
- Notification management
- File uploads
- Gallery management
- Dashboard (limited view)

## Deployment to Vercel

### 1. GitHub Integration
1. Push your code to GitHub
2. Connect your Vercel account to GitHub
3. Import your repository to Vercel

### 2. Environment Variables
Add all environment variables to your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (set to your Vercel domain)

### 3. Deploy
Vercel will automatically deploy when you push to your main branch.

## User Rules Integration

This application follows your specified user rules:
- ✅ **Dynamic URL allocation** for HTML and PDF files
- ✅ **Local storage** of admin credentials and notifications  
- ✅ **Git repository integration** for portability across machines
- ✅ **Persistent data** that survives server restarts

## Security Features

- Password hashing with bcrypt
- JWT token expiration
- HTTP-only secure cookies
- CORS protection
- Row Level Security on database
- File upload validation
- XSS protection headers
