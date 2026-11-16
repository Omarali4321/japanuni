# JapanUni Next API foundation

This is an isolated Next.js App Router foundation for the backend migration. The existing `frontend/` React SPA and `backend/` Spring Boot API remain the source of truth and are not imported or modified.

## Current scope

- Next.js App Router with TypeScript.
- Node.js Route Handler at `GET /api/health`.
- Read-only PostgreSQL connectivity probe using `DATABASE_URL`.
- Prisma tooling configured for read-only database introspection.
- No Prisma migrations, seed execution, or application data writes.

The Prisma schema is intentionally only a datasource/generator scaffold until the Neon PostgreSQL database can be inspected with a real connection. The next database step should use Prisma introspection (`prisma db pull`) against Neon and must not run `prisma migrate` or `prisma db push`.

## Local usage

```bash
cp .env.example .env.local
npm install
npm run db:validate
npm run build
npm run dev
```

Before running the Prisma commands, replace the placeholder `DATABASE_URL` in `.env.local` with the pooled Neon connection string from the Neon dashboard. Use the pooled URL for application traffic and this read-only introspection phase. A direct Neon URL can be kept as a future `DIRECT_URL`, but it is intentionally unused until a separately approved schema-administration workflow exists.

`npm run db:validate` checks the local Prisma configuration without changing the database. `npm run db:pull` reads the existing schema and updates only `prisma/schema.prisma`; `npm run db:pull:print` prints the introspected schema without updating that file. Neither command writes to PostgreSQL.

No Neon connection string is configured in this workspace, so introspection cannot be run yet. Create the Neon project/database in the Neon dashboard and store its pooled connection string locally in `.env.local`; do not paste credentials into chat or commit them. With PostgreSQL reachable, `GET http://localhost:3000/api/health` should return JSON `status: "ok"`. Without `DATABASE_URL` or a reachable database it returns HTTP 503; the route never changes the database.
