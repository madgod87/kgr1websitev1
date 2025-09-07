# 🏛️ KGR-I Official Website

![KGR-I Logo](public/logo/logo.png)

**The official website for Krishnagar-I Development Block, Nadia District, West Bengal.**

A modern Next.js application with Supabase backend integration for efficient governance and citizen services.

## 🌟 Features

### 🔐 Security & Authentication
- **Secure Admin Login** with captcha system
- **5-attempt lockout** with 100-second timeout
- **JWT token authentication** for admin sessions
- **Row Level Security (RLS)** on database

### 🎨 User Experience
- **Responsive Design** with mobile-first approach
- **Smooth Scrolling Navigation** to page sections
- **Professional Government Branding** with official logo
- **SEO Optimized** with comprehensive metadata

### 🛠️ Admin Management
- **Main admin** can create and manage sub-admins
- **Notification System** for announcements
- **Gallery Management** for photo uploads
- **File Management** for PDFs and documents

### 🚀 Technical Stack
- **Frontend**: Next.js 15.5.2, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Authentication**: JWT with bcryptjs hashing
- **Deployment**: Optimized for Vercel

## 🏗️ Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard pages
│   ├── api/            # API routes
│   ├── login/          # Admin login
│   ├── gallery/        # Image gallery
│   ├── notifications/  # Public notifications
│   └── layout.tsx      # Root layout
├── components/         # React components
│   ├── Header.tsx     # Navigation with logo
│   ├── Footer.tsx     # Footer with logo
│   ├── Hero.tsx       # Homepage hero section
│   └── Services.tsx   # Services section
└── lib/
    ├── auth.ts        # Authentication utilities
    ├── supabase.ts    # Database client
    └── notifications.ts # Notification functions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/madgod87/kgr1websitev1.git
   cd kgr1websitev1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXTAUTH_SECRET=your_random_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Visit** `http://localhost:3000`

## 🔧 Build & Deploy

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

## 🏛️ Government Features

### 📢 Citizen Services
- **Public Notifications** with file attachments
- **Government Scheme Information**
- **Contact Information** for officials
- **Office Hours** and location details

### 📊 Administrative Tools
- **Notification Management** - Create, edit, publish
- **Gallery Management** - Upload and organize photos
- **User Management** - Admin and sub-admin accounts
- **File Storage** - Secure document management

## 🔗 Important Links

- **Live Website**: [KGR-I Official Website](https://your-domain.com)
- **Admin Login**: `/login`
- **GitHub Repository**: [https://github.com/madgod87/kgr1websitev1](https://github.com/madgod87/kgr1websitev1)

## 📊 Recent Updates

### v1.0.0 - Complete Rebrand (Latest)
- ✅ **KGR-I Branding** with official government logo
- ✅ **Captcha Security** for admin login
- ✅ **Smooth Navigation** with scroll-to-section
- ✅ **SEO Optimization** for all pages
- ✅ **Production Ready** build configuration
- ✅ **Updated Dependencies** - React 19.1.1, Node types 24.3.1
- ✅ **Zero Vulnerabilities** in security audit

## 🛡️ Security Features

- ✅ **Password Hashing** with bcrypt (12 rounds)
- ✅ **JWT Token Expiration** for session management
- ✅ **CAPTCHA Protection** after failed login attempts
- ✅ **Account Lockout** mechanism
- ✅ **Row Level Security** on database
- ✅ **File Upload Validation** and size limits
- ✅ **CORS Protection** on API endpoints

## 🎯 User Rules Compliance

This application follows your specified user rules:
- ✅ **Dynamic URL allocation** for HTML and PDF files
- ✅ **Local storage** of admin credentials and notifications
- ✅ **Git repository integration** for portability across machines
- ✅ **Persistent data** that survives server restarts

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📄 License

This project is for official government use by Krishnagar-I Development Block, Nadia District, West Bengal.

---

**Developed for Digital India Initiative** 🇮🇳

**Contact**: BDO Office, Krishnagar-I Development Block  
**Email**: bdo.krishnagar1@gmail.com  
**Phone**: 9733374108
