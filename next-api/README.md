# JapanUni Next API foundation

This is an isolated Next.js App Router foundation for the backend migration. The existing `frontend/` React SPA and `backend/` Spring Boot API remain the source of truth and are not imported or modified.

## Current scope

- Next.js App Router with TypeScript.
- Node.js Route Handler at `GET /api/health`.
- Read-only PostgreSQL connectivity probe using `DATABASE_URL`.
- Prisma schema manually mapped from the current Spring/JPA domain model.
- No Prisma migrations, seed execution, or application data writes.

The Neon database is currently empty, so `prisma db pull` returned `P4001` and could not discover models. The local schema now describes the tables and relations required by the existing backend. It has not been applied to Neon.

Because the source database is empty, this is a reviewed manual mapping from the JPA annotations rather than an introspected schema. Before applying it, review PostgreSQL precision/timezone choices (`Decimal(38,2)` and `timestamptz(6)`) against the intended Neon schema.

## Local usage

```bash
cp .env.example .env.local
npm install
npm run db:validate
npm run build
npm run dev
```

Before running Prisma commands, set the pooled Neon connection string in `.env.local`. Do not commit the file or paste credentials into chat.

`npm run db:validate` checks the local Prisma configuration without changing the database. `npm run db:pull` is only useful for an already-populated database and is not part of this empty-database preparation. Do not run `prisma migrate`, `prisma db push`, `prisma generate`, seed scripts, or ad-hoc SQL until the schema-application step is explicitly approved.

The schema models these tables: `users`, `cities`, `universities`, `university_images`, `scholarships`, `favorites`, `reviews`, `admission_guides`, `visa_guides`, and `student_life_articles`. `users.role` is represented by the `Role` enum with `USER` and `ADMIN`. `favorites` has a unique `(user_id, university_id)` constraint; `university_images` has a composite `(university_id, image_url)` key.

## School CSV importer

The supplied `School_Search_Result.csv` must be read as CP932/Shift-JIS. The inspected file contains 3,888 data rows and 233 unique school names. The importer expects these exact headers: `Major of Study 1`, `Major of Study 2`, `School Name`, `Type`, `Faculty`, `Web site(faculty/department)`, `Major /Speciality  Division` (two spaces before `Division`), `Degree`, `Begins in(1)`, `Begins in(2)`, `Medium of Instruction`, and `Pre-arrival admission`.

The importer groups rows by normalized `School Name`, collapsing the 3,888 rows into 233 university records while preserving faculty/degree/major/intake/medium/pre-arrival values as deduplicated pipe-separated fields. CSV rows do not provide a city, tuition, ranking, language requirements, or images, so those fields remain nullable and no city is fabricated. The faculty/department URL is retained in both `websiteUrl` (existing application field) and `sourceUrl`; `sourceDataset`, `sourceKey`, `sourceRowHash`, and `sourceRowCount` provide provenance and repeatability. Empty source values remain null/omitted rather than being replaced with invented data.

Run a local dry run only:

```bash
npm run import:schools -- --file /path/to/School_Search_Result.csv
```

For the supplied local file, the command is:

```bash
npm run import:schools -- --file data/School_Search_Result.csv
```

The importer is idempotent through the unique normalized `sourceKey` and Prisma `upsert`. The `--apply` flag performs database writes and is intentionally not used in this phase. Do not run it against Neon until schema application and the write step are separately approved. The local `data/` directory is ignored and the CSV is not committed.

With PostgreSQL reachable, `GET http://localhost:3000/api/health` should return JSON `status: "ok"`. Without `DATABASE_URL` or a reachable database it returns HTTP 503; the route never changes the database.
