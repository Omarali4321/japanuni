# JapanUni

A full-stack platform helping international students explore Japanese universities, scholarships, admission requirements, visas, and student life.

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Backend | Java 21, Spring Boot 3, Spring Security, JPA, PostgreSQL |
| Frontend | React 18, Vite, TailwindCSS, Framer Motion, Axios |
| DevOps | Docker, Docker Compose |

## Project structure

```
├── backend/          # Spring Boot REST API
├── frontend/         # React + Vite SPA
├── docker-compose.yml
└── README.md
```

## Quick start with Docker

```bash
# From project root
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- PostgreSQL: localhost:5432

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@japanuni.com | admin123 |
| Student | student@japanuni.com | student123 |

## Run locally (development)

### Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20+
- PostgreSQL 16

### 1. Database

```bash
createdb japanuni
# Or via psql:
# CREATE USER japanuni WITH PASSWORD 'japanuni';
# CREATE DATABASE japanuni OWNER japanuni;
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # optional — edit if needed
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/japanuni
export SPRING_DATASOURCE_USERNAME=japanuni
export SPRING_DATASOURCE_PASSWORD=japanuni

mvn spring-boot:run
```

API runs at **http://localhost:8080**

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at **http://localhost:5173** (Vite proxies `/api` to the backend).

## API routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login (JWT) |
| GET | `/api/users/me` | User | Profile |
| PUT | `/api/users/me` | User | Update profile |
| GET | `/api/universities` | Public | Search & filter (pagination) |
| GET | `/api/universities/{id}` | Public | University details |
| POST | `/api/universities/compare` | Public | Compare 2–4 universities |
| GET | `/api/universities/{id}/reviews` | Public | Reviews |
| POST | `/api/universities/{id}/reviews` | User | Add review |
| GET | `/api/scholarships` | Public | List scholarships |
| GET | `/api/favorites` | User | Saved universities |
| POST | `/api/favorites/{id}` | User | Add favorite |
| DELETE | `/api/favorites/{id}` | User | Remove favorite |
| GET | `/api/guides/admission` | Public | Admission guides |
| GET | `/api/guides/visa` | Public | Visa guides |
| GET | `/api/guides/student-life` | Public | Student life articles |
| GET | `/api/cities` | Public | Cities |
| GET | `/api/admin/stats` | Admin | Dashboard stats |

## Sample universities

- University of Tokyo
- Kyoto University
- Osaka University
- Waseda University
- Keio University
- Tokyo Institute of Technology

## Deployment

### Docker (recommended)

1. Set production values in `.env` (strong `JWT_SECRET`, DB password, `CORS_ALLOWED_ORIGINS`).
2. `docker compose -f docker-compose.yml up -d --build`
3. Put a reverse proxy (Nginx/Caddy) with HTTPS in front of port 80.

### Manual

1. Build backend: `cd backend && mvn -DskipTests package`
2. Run JAR: `java -jar target/japanuni-backend-1.0.0.jar`
3. Build frontend: `cd frontend && npm run build`
4. Serve `frontend/dist` with Nginx; proxy `/api` to the backend.

## Environment variables

See `.env.example`, `backend/.env.example`, and `frontend/.env.example`.

## License

MIT
