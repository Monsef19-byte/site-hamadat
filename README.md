# Hamadat Promotion Immobilière - Website & Admin Dashboard

Modern real estate website and admin dashboard built with Next.js, Supabase, and Tailwind CSS.

## 🚀 Features

### Website
- ✅ Bilingual (French + Arabic with RTL support)
- ✅ Responsive design (mobile-first)
- ✅ Project showcase with detailed pages
- ✅ Image galleries
- ✅ Virtual tour integration
- ✅ Contact form with WhatsApp integration
- ✅ SEO-friendly URLs

### Admin Dashboard
- ✅ Secure authentication (Supabase Auth)
- ✅ CRUD operations for residences
- ✅ Image upload management
- ✅ Virtual tour management
- ✅ Featured project highlighting
- ✅ Real-time database sync

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Hosting**: Vercel
- **Domain**: Hostinger

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)
- Hostinger account (for domain)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd hamadat-website
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Required variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Get these from your Supabase project settings.

### 3. Setup Supabase Database

Run the migration in your Supabase SQL editor:

```sql
-- Create residences table
CREATE TABLE residences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_fr VARCHAR NOT NULL,
  name_ar VARCHAR NOT NULL,
  location VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'Projet en cours',
  total_units INTEGER,
  typology VARCHAR,
  description_fr TEXT,
  description_ar TEXT,
  featured_on_home BOOLEAN DEFAULT false,
  featured_image_id UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  slug VARCHAR UNIQUE
);

-- Create images table
CREATE TABLE residence_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  residence_id UUID REFERENCES residences(id) ON DELETE CASCADE,
  image_url VARCHAR NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

-- Create virtual tours table
CREATE TABLE residence_tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  residence_id UUID REFERENCES residences(id) ON DELETE CASCADE UNIQUE,
  tour_url VARCHAR NOT NULL,
  featured_on_pages BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

**Admin Panel**: `http://localhost:3000/admin`
- Demo credentials (development only):
  - Email: `admin@hamadat.dz`
  - Password: `admin123`

## 📁 Project Structure

```
hamadat-website/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── (public)      # Public pages
│   │   ├── admin/        # Protected admin routes
│   │   ├── projets/      # Projects pages
│   │   └── contact/      # Contact page
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities, hooks, translations
│   ├── types/            # TypeScript interfaces
│   └── app/globals.css   # Global styles & design tokens
├── public/
│   ├── residences/       # Project images (organized by name)
│   └── images/           # Logo, UI assets
├── supabase/
│   └── migrations/       # Database schema
└── package.json
```

## 🎨 Design System

### Colors
- **Primary**: #0e736f (Dark Teal)
- **Secondary**: #1b948d (Medium Teal - CTAs)
- **Neutral**: #3a3b3d, #808082
- **Base**: #000000, #ffffff

### Typography
- **Headlines**: Poppins (Bold)
- **Body**: Inter (Regular)

### Components
- Buttons (Primary, Secondary)
- Cards
- Forms
- Navigation
- Footers
- Image Galleries

All components are responsive and accessible (WCAG 2.1 AA).

## 🌐 Languages

The website supports:
- **French (FR)** - Default, left-to-right
- **Arabic (AR)** - Right-to-left layout support

Language preference is saved in localStorage.

## 📝 Adding a New Residence

### Via Admin Dashboard:
1. Navigate to `/admin/residences/new`
2. Fill in all required fields:
   - Name (FR + AR)
   - Location
   - Status (Projet en cours / Livré / Vendu)
   - Total units
   - Typologies
   - Descriptions (FR + AR)
   - Upload images
   - Add virtual tour URL (optional)
3. Choose visibility options:
   - Featured on homepage
   - Show virtual tour
4. Submit

### Via Database:
Insert directly into `residences` table and upload images to `residence_images`.

## 📸 Adding Images

Images are stored in `/public/residences/[residence-name]/`

**Format**: JPG (recommended for web)
**Size**: Optimize for web (1200px width recommended)
**Naming**: Descriptive names (e.g., `vue-jour-1.jpg`)

Images are referenced in the database with relative paths: `/residences/elysia/vue-jour-1.jpg`

## 🚁 Virtual Tours

To add a virtual tour:
1. Get an embed URL from your 3D tour provider (Matterport, Kuula, etc.)
2. Add URL in the residence form under "URL Visite Virtuelle"
3. Toggle "Afficher la visite virtuelle" to show on main pages

Supported:
- Matterport embeds
- Kuula embeds
- Custom iframe embeds

## 🔐 Authentication

Admin login is handled by Supabase Auth.

**In production:**
- Use strong, unique passwords
- Enable 2FA in Supabase
- Regularly update admin credentials

**Development:**
- Demo credentials are hardcoded (change before deploying)
- Use `.env.local` to override

## 📦 Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

During setup:
- Link to your GitHub repo
- Set environment variables in Vercel dashboard
- Enable auto-deploy on git push

### 2. Setup Domain (Hostinger)

1. Go to Hostinger DNS settings
2. Add Vercel nameservers or create CNAME records
3. Point domain to Vercel
4. Wait for propagation (24-48 hours)

**Vercel DNS settings for Hostinger:**
- Add these CNAME records in Hostinger DNS manager

### 3. Setup Email

Configure email for contact forms:
- Use a service like SendGrid, Mailgun, or AWS SES
- Update contact form handler in `/src/app/contact/page.tsx`

## 🔧 Configuration

### Update Company Info

Edit these files:
- `/src/lib/translations.ts` - Site copy and translations
- `/src/app/admin/residences/new/page.tsx` - Form defaults
- `/src/components/Footer.tsx` - Contact info

### Update Colors

Edit `/tailwind.config.js`:
```js
colors: {
  primary: {
    600: '#1b948d',  // CTA color
    700: '#0e736f',  // Primary
  },
}
```

### Update Fonts

Google Fonts are imported in `/src/app/globals.css`:
- Poppins (headlines)
- Inter (body text)

## 📱 Responsive Breakpoints

```
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  > 1024px
```

All pages are optimized for all screen sizes.

## 🎯 Performance

- Image optimization via Next.js `next/image`
- Automatic code splitting
- CSS minification via Tailwind
- Zero client-side rendering for static pages

**Lighthouse Target**: 90+ on all metrics

## 🐛 Troubleshooting

### Images not showing
- Check path in database matches files in `/public/residences/`
- Ensure images are in correct format (JPG/PNG)
- Check image file permissions

### Admin login not working
- Verify `.env.local` has correct Supabase keys
- Check Supabase Auth is enabled
- Ensure admin user exists in Supabase

### Virtual tour not embedding
- Test iframe URL directly
- Check browser console for embed errors
- Verify provider allows iframes

### RTL Arabic not displaying correctly
- Check `dir="rtl"` is set on container
- Verify font supports Arabic characters
- Test in Firefox/Chrome (best support)

## 📞 Support

For issues or questions:
1. Check the documentation above
2. Review Supabase docs: https://supabase.com/docs
3. Check Next.js docs: https://nextjs.org/docs
4. Contact: contact@hamadat.dz

## 📄 License

Proprietary - Hamadat Promotion Immobilière

---

**Version**: 1.0.0
**Last Updated**: May 2024
**Built with**: Next.js, Supabase, Tailwind CSS
