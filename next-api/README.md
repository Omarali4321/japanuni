# JapanUni Next API foundation

This is an isolated Next.js App Router foundation for the backend migration. The existing `frontend/` React SPA and `backend/` Spring Boot API remain the source of truth and are not imported or modified.

## Current scope

- Next.js App Router with TypeScript.
- Node.js Route Handler at `GET /api/health`.
- Read-only PostgreSQL connectivity probe using `DATABASE_URL`.
- No Prisma schema, migrations, seed execution, or application data writes.

The Prisma schema is intentionally deferred until the existing PostgreSQL database can be inspected with a real connection. The next database step should use Prisma introspection (`prisma db pull`) against the existing database and must not run `prisma migrate` or `prisma db push`.

## Local usage

```bash
cp .env.example .env.local
npm install
npm run build
npm run dev
```

With PostgreSQL running, `GET http://localhost:3000/api/health` should return a JSON `status: "ok"` response. Without `DATABASE_URL` or a reachable database it returns HTTP 503; the route never changes the database.
