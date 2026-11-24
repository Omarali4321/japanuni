# JapanUni

Каталог японских университетов, стипендий и гайдов — https://japanuni.vercel.app

## Стек
Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Prisma + Neon PostgreSQL · Vercel

## Структура
```
next-api/            # всё приложение (Vercel Root Directory)
  app/(site)/        # страницы
  app/api/           # Route Handlers (auth, universities, favorites, reviews, admin…)
  components/        # UI
  lib/               # auth (jose/bcrypt), prisma, data, валидация
  prisma/            # schema.prisma (пользовательские данные в Neon)
  data/, data-src/   # справочные JSON, генерируются scripts/build-data.mjs (prebuild)
```

## Локально
```bash
cd next-api
cp .env.example .env.local   # DATABASE_URL (Neon pooled), JWT secret
npm install
npm run dev
```

Деплой: push в `main` → Vercel (см. DEPLOYMENT_GUIDE.md).
