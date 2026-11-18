# JapanUni Vercel Deployment Guide

## Prerequisites
- Neon PostgreSQL database (free tier)
- Vercel account
- GitHub repository connected to Vercel

---

## 1. Neon Database Setup

### Create Neon Project
1. Go to [console.neon.tech](https://console.neon.tech)
2. Create new project: `japanuni`
3. Choose region closest to your users
4. Copy **Pooled connection string** (contains `-pooler` in hostname)

### Connection String Format
```
postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
```

---

## 2. Vercel Project Setup

### Create Vercel Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repository: `Omarali4321/japanuni`
3. **Root Directory**: `next-api` (critical!)
4. Framework: Next.js (auto-detected)
5. Build Command: `npm run build` (default)
6. Output Directory: `.next` (default)

### Environment Variables (Required)
Add in Vercel Dashboard → Settings → Environment Variables:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Your Neon pooled connection string | Production, Preview, Development |
| `JWT_SECRET` | **Generate your own** (see below) | Production, Preview, Development |

> **Note**: Generate a secure JWT_SECRET: `openssl rand -base64 32`

---

## 3. Database Migration

After first successful Vercel deployment:

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Pull environment variables locally
vercel env pull .env.local

# Run migration
cd next-api
npx prisma migrate deploy
```

### Option B: Local with Neon Direct URL
```bash
# Add DIRECT_URL to .env.local (non-pooled connection from Neon)
DIRECT_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Run migration
cd next-api
npx prisma migrate deploy
```

### Option C: Neon SQL Editor
1. Go to Neon Console → SQL Editor
2. Run the migration SQL from `prisma/migrations/*/migration.sql`

---

## 4. Verify Deployment

### Health Check
```
GET https://your-app.vercel.app/api/health
```
Expected: `{"status":"ok"}`

### Test Auth Flow
```bash
# Register
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get profile (use cookie from login)
curl https://your-app.vercel.app/api/users/me \
  -H "Cookie: japanuni_session=<cookie_value>"
```

### Test Favorites
```bash
# Add favorite (university ID from /api/universities)
curl -X POST https://your-app.vercel.app/api/favorites/1 \
  -H "Cookie: japanuni_session=<cookie_value>"

# List favorites
curl https://your-app.vercel.app/api/favorites \
  -H "Cookie: japanuni_session=<cookie_value>"
```

---

## 5. Production Checklist

- [ ] Neon database created and `DATABASE_URL` set in Vercel
- [ ] `JWT_SECRET` set in Vercel (generate your own: `openssl rand -base64 32`)
- [ ] Vercel project Root Directory = `next-api`
- [ ] First deployment successful
- [ ] `prisma migrate deploy` executed
- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] Auth flow works (register → login → /api/users/me)
- [ ] Favorites work (add/remove/list)
- [ ] Reference data loads (universities, scholarships, guides)
- [ ] Dark mode works
- [ ] Command palette (⌘K) works

---

## 6. Troubleshooting

### Build Fails: "data/ not found"
- Ensure `outputFileTracingIncludes` in `next.config.mjs` includes `data/**/*`
- Verify `prebuild` script runs: `npm run build` locally first

### Database Connection Fails
- Check `DATABASE_URL` uses **pooled** connection (has `-pooler`)
- Verify `sslmode=require` in connection string
- Ensure Neon allows connections from Vercel IPs (default: allow all)

### Prisma Client Not Generated
- Verify `postinstall: prisma generate` in package.json
- Check Vercel build logs for "prisma generate" step

### Auth Cookie Not Set
- Ensure `JWT_SECRET` is set in Vercel (not just locally)
- Check cookie domain: should work on `*.vercel.app` subdomains

---

## 7. Useful Commands

```bash
# Local development
cd next-api
cp .env.example .env.local
# Edit .env.local with your Neon DATABASE_URL and JWT_SECRET
npm install
npm run dev

# Local build test
rm -rf data && npm run build

# Database commands
npx prisma studio          # Open Prisma Studio
npx prisma migrate status  # Check migration status
npx prisma db pull         # Introspect existing database

# Vercel
vercel logs                # View deployment logs
vercel env ls              # List environment variables
```

