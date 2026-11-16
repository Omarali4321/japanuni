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

## Public university API

The migration foundation exposes these read-only catalog routes:

- `GET /api/universities?page=0&size=12&search=Aichi`
- `GET /api/universities/:id`
- `POST /api/universities/compare` with `{ "universityIds": [1, 3] }`

List filters include `search`, `cityId`, `maxTuition`, `minRanking`, `institutionType`, `mediumOfInstruction`, `preArrivalAdmission`, and `intake`. `size` is limited to 50 and `page` is non-negative. Search covers the imported school name, programs, faculty, degree, speciality, and description fields.

Successful responses use `{ "data": ... }`; list responses additionally include `{ "meta": { "page", "size", "totalElements", "totalPages" } }`. Errors use `{ "error": { "code", "message", "details" } }`. Compare requires 2–4 unique IDs and returns 404 with `missingIds` if any requested university does not exist. ## Authenticated user API

Authentication uses a signed JWT in a secure `HttpOnly` cookie named `japanuni_session`; tokens are never returned to JavaScript or stored in `localStorage`. Set `JWT_SECRET` locally and in Vercel environment variables.

- `POST /api/auth/register` with `{ "email", "password", "fullName" }`
- `POST /api/auth/login` with `{ "email", "password" }`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `PUT /api/users/me` with optional `fullName`, `bio`, `nationality`, `avatarUrl`
- `GET /api/favorites`
- `POST /api/favorites/:universityId`
- `DELETE /api/favorites/:universityId`
- `GET /api/universities/:id/reviews`
- `POST /api/universities/:id/reviews` with `rating` and optional `comment`
- `PUT /api/reviews/:reviewId` (owner only)
- `DELETE /api/reviews/:reviewId` (owner only)

Passwords are hashed with bcrypt. Registration always creates `USER`; no demo users or seed accounts are created. Auth errors, validation errors, missing resources, and ownership failures use the same `{ "error": { "code", "message", "details" } }` contract.

## Public content API

- `GET /api/scholarships?page=0&size=12&search=&universityId=`
- `GET /api/scholarships/:id`
- `GET /api/guides/admission?page=0&size=12`
- `GET /api/guides/visa?page=0&size=12`
- `GET /api/guides/student-life?page=0&size=12`
- `GET /api/cities?page=0&size=12`

Content list endpoints use the same `{ data, meta }` response format as the university catalog. `size` is limited to 50 and `page` is non-negative. Empty Neon tables return `data: []`, `totalElements: 0`, and `totalPages: 0`; no placeholder content is generated.

## Vercel production deployment

For the current repository layout, create the Vercel project with **Root Directory** set to `next-api`. Vercel will detect the Next.js framework from `next-api/vercel.json`; use the default install/build settings (`npm install`/`npm run build`) and do not deploy the legacy `frontend/` directory as the same project.

The existing Vite SPA can still be built and hosted separately, but its production `VITE_API_URL` must point to the API deployment. Because authentication uses an HttpOnly host cookie, a separate frontend hostname cannot share the session cookie with the API. The supported production path for cookie auth is therefore to serve the UI from the same Next.js deployment/origin (a future UI migration), or place both behind one custom domain/reverse proxy. Do not treat two unrelated `*.vercel.app` projects as a cookie-compatible production setup.

Required Vercel environment variables for the `next-api` project:

```text
DATABASE_URL=Neon pooled connection string with sslmode=require
JWT_SECRET=random production secret, at least 32 characters
```

Set them for Production, Preview, and Development as appropriate. Never commit `.env.local`, Neon credentials, JWT secrets, CSV data, or generated `.next` output. `DIRECT_URL` is not required by the current read-only/runtime code and should remain unset unless a separately approved migration workflow needs it.

Before creating an external deployment, validate locally:

```bash
cd next-api
npm ci
npm run build
```

The deployment target is intentionally limited to the Next API project in this phase; no Vercel deployment or external resource is created by the repository.

If the legacy Vite SPA is deployed as a separate project, use `npm install && npm run build` in `frontend/` because that package currently has no committed lockfile. Prefer the Next API project as the production source of truth until the UI is moved to the same origin.

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
