# JapanUni

Next.js 14 App Router + React 18 + TS + Tailwind. Prisma -> Neon Postgres. Deploy: Vercel project `japanuni` (Root Directory `next-api`). Prod: https://japanuni.vercel.app

## Layout
- All code in `next-api/`: `app/(site)` pages, `app/api/*/route.ts` handlers, `components/`, `lib/` (auth = jose JWT in HttpOnly cookie + bcrypt; `prisma.ts`, `data.ts`).
- Reference data (universities, cities, scholarships, guides) = JSON in `data/`, built by `scripts/build-data.mjs` (prebuild). Only user data lives in Neon (`prisma/schema.prisma`).

## Commands (run from next-api/)
- Verify: `bash scripts/check.sh` (tsc + eslint + build). `--no-build` for fast check.
- Dev: `npm run dev`. Never run `prisma migrate reset`, `db push --force-reset` or destructive SQL.

## Rules
- Never read or print `.env*` values. New env vars -> `.env.example` + Vercel.
- API handlers: validate input with zod (`lib/*-validation.ts`), check auth via `lib/auth.ts`; admin routes require ADMIN role.
- Prefer Server Components; add `'use client'` only for interactivity.
- Don't rewrite working code outside the task scope.
