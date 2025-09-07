# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a government website management system for Krishnagar-I Development Block built with Next.js 15 and Supabase. The application provides a secure admin interface for managing notifications, galleries, and file uploads with role-based access control.

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS 4, React Hook Form
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Authentication**: Custom JWT-based system using bcryptjs
- **Deployment**: Vercel-optimized with Turbopack

### Key Components

**Authentication System** (`src/lib/auth.ts`, `src/middleware.ts`):
- Custom JWT authentication with HTTP-only cookies
- Role-based access control (main_admin, sub_admin)
- Middleware protection for `/admin` routes
- Password hashing with bcrypt (12 salt rounds)

**Database Layer** (`src/lib/supabase.ts`):
- Dual Supabase clients: public and service role
- Row Level Security (RLS) policies for all tables
- TypeScript interfaces for all database entities
- Admin, Notification, GalleryImage, FileUpload types

**Admin Hierarchy**:
- Main Admin: Can create sub-admins, full access to all features
- Sub-Admins: Can manage content but cannot create other admins
- Self-referential admin table with `created_by` relationships

### Database Schema

**Core Tables**:
- `admins`: User management with role-based permissions
- `notifications`: Content management with activity status
- `gallery_images`: Image gallery with metadata
- `file_uploads`: Document management with categorization

**Security Features**:
- RLS enabled on all tables
- UUID primary keys
- Automated `updated_at` triggers
- Foreign key constraints with cascading

### File Storage
- Two Supabase Storage buckets: `gallery-images`, `file-uploads`
- Public access for reading, admin-only for uploads/deletes
- File categorization: pdf, excel, image, other

## Development Commands

### Setup and Installation
```powershell
# Clone and install dependencies
npm install

# Generate strong NEXTAUTH_SECRET
node generate-admin-hash.js
```

### Development Server
```powershell
# Start development server with Turbopack
npm run dev

# Access the application
# http://localhost:3000 - Public site
# http://localhost:3000/login - Admin login
# http://localhost:3000/admin - Admin dashboard
```

### Building and Deployment
```powershell
# Production build with Turbopack
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Database Management
```powershell
# Run database schema setup (in Supabase SQL Editor)
# Execute: supabase-schema.sql

# Create main admin user (in Supabase SQL Editor)
# Execute: create-main-admin.sql
```

## Admin Access

### Creating Admin Credentials
**SECURITY**: Default credentials removed for security reasons.

To create admin account:
1. Set `ADMIN_USERID` and `ADMIN_PASSWORD` environment variables
2. Run `node create-admin.js` to create main admin
3. Or manually edit `create-main-admin.sql` with your credentials

### Admin Management
- Main admin can create sub-admins via `/admin/sub-admins`
- Password hashing handled automatically by `src/lib/auth.ts`
- Admin status can be toggled (active/inactive)

## Key File Locations

### Configuration Files
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint setup
- `tsconfig.json` - TypeScript configuration
- `tailwindcss.config.js` - Tailwind CSS 4 configuration
- `vercel.json` - Deployment configuration

### Application Structure
```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Protected admin pages
│   ├── api/               # API routes
│   ├── login/             # Authentication page
│   └── page.tsx           # Public homepage
├── lib/                   # Core utilities
│   ├── auth.ts           # Authentication logic
│   ├── supabase.ts       # Database client & types
│   └── notifications.ts   # Notification utilities
└── middleware.ts          # Route protection
```

### Database Scripts
- `supabase-schema.sql` - Complete database schema with RLS
- `create-main-admin.sql` - Main admin user creation
- `generate-admin-hash.js` - Password hash generator

## Environment Variables

### Required Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000  # Update for production
```

## User Rules Integration

This application implements specific user preferences:
- **Dynamic URL allocation**: Files served directly via URLs instead of downloads
- **Local persistence**: Admin credentials and notifications stored locally in database
- **Git integration**: All data is committed to repository for cross-machine portability
- **Server restart resilience**: Data persists through server restarts via database storage

## Development Notes

### Authentication Flow
1. User logs in via `/login` with userid/password
2. Credentials verified against `admins` table with bcrypt
3. JWT token issued and stored in HTTP-only cookie
4. Middleware validates token for `/admin/*` routes
5. Role-based permissions enforced at API level

### File Upload Process
1. Files uploaded to Supabase Storage buckets
2. Metadata stored in `gallery_images` or `file_uploads` tables
3. Public URLs generated for direct access
4. File categorization and size tracking included

### Security Considerations
- All database operations use service role key
- Row Level Security policies prevent unauthorized access
- Password hashing with high salt rounds (12)
- JWT tokens expire and require re-authentication
- CORS protection and XSS headers configured
