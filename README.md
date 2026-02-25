# Placewise

A location-based community platform — like Reddit, but every post is anchored to a real-world place with an external link (Google Maps, Yelp, etc.). Users discover and share places organised by community topics.

## Monorepo Structure

```
placewise/
├── apps/
│   ├── api/          # Python / FastAPI backend
│   ├── web/          # React web app (map-based)
│   └── mobile/       # React Native / Expo (iOS + Android)
├── packages/
│   └── shared/       # Shared TypeScript types, API client, TanStack Query hooks
├── docker-compose.yml
└── README.md
```

## Tech Stack

| Layer | Tech |
|-------|------|
| API | Python 3.12, FastAPI, SQLAlchemy 2 (async), Alembic, PostgreSQL 16 |
| Auth | Google OAuth 2.0 → JWT |
| Web | React 18, Vite, TypeScript, Tailwind CSS, Leaflet, TanStack Query, React Router v6 |
| Mobile | Expo SDK 51, React Native, TypeScript, react-native-maps, Expo Router |
| Shared | TypeScript, TanStack Query hooks, typed fetch client |

---

## Prerequisites

- **Python 3.12+** and **uv** (`pip install uv`)
- **Node.js 20+** and **Yarn 1.x** (`npm i -g yarn`)
- **Docker + Docker Compose** (for the postgres + api + web services)
- **Expo CLI** (`npm i -g expo-cli`) for mobile dev
- A **Google OAuth 2.0 Client ID** (create one at console.cloud.google.com)

---

## Quickstart (Docker — recommended for API + Web)

```bash
# 1. Clone and enter the repo
git clone <repo-url> placewise && cd placewise

# 2. Copy and fill in environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET

cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local if your API URL differs from http://localhost:8000

# 3. Start postgres + API + web
docker compose up --build

# 4. Run migrations (first time only)
docker compose exec api alembic upgrade head
```

- API: http://localhost:8000 (OpenAPI docs at /docs)
- Web: http://localhost:5173

---

## Local Dev (without Docker)

### API

```bash
cd apps/api

# Create a virtual environment and install deps
uv venv && source .venv/bin/activate
uv pip install -e ".[dev]"

# Copy and fill in env vars
cp .env.example .env

# Start postgres separately (or use: docker compose up postgres -d)

# Run migrations
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload
```

### Web

```bash
# From repo root
yarn install

cd apps/web
cp .env.example .env.local
yarn dev
```

### Mobile

```bash
cd apps/mobile
yarn install   # or: npx expo install

# Start Expo dev server
npx expo start
# Press i for iOS simulator, a for Android emulator, or scan QR with Expo Go
```

---

## API Overview

Base URL: `http://localhost:8000/api/v1`
Interactive docs: http://localhost:8000/docs

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/google` | — | Exchange Google ID token → JWT |
| GET | `/auth/me` | ✓ | Current user |
| GET | `/communities` | — | List communities |
| POST | `/communities` | ✓ | Create community |
| GET | `/communities/:slug` | — | Community detail |
| GET | `/communities/:slug/posts` | — | Posts in community |
| POST | `/communities/:slug/posts` | ✓ | Create post |
| GET | `/posts/nearby` | — | Posts near lat/lng |
| GET | `/posts/:id` | — | Post detail |
| POST | `/posts/:id/vote` | ✓ | Upvote / downvote |
| GET | `/posts/:id/comments` | — | List comments |
| POST | `/posts/:id/comments` | ✓ | Add comment |

---

## Environment Variables

### `apps/api/.env`

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | asyncpg connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `JWT_SECRET` | Long random string for signing JWTs |
| `CORS_ORIGINS` | Comma-separated allowed origins |

### `apps/web/.env.local`

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (default: empty — proxied via Vite) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for frontend popup |

---

## Database Migrations

```bash
# Inside apps/api (with venv activated or via docker exec)

# Generate a new migration after model changes
alembic revision --autogenerate -m "describe change"

# Apply migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1
```

---

## Project Decisions

- **FastAPI over Django**: async-native, minimal boilerplate, automatic OpenAPI docs
- **Expo over bare React Native**: one codebase → iOS + Android, fastest path to production via EAS Build
- **Leaflet over Mapbox**: free, no API key required for the map tiles (OpenStreetMap)
- **`packages/shared`**: single source of truth for types, API calls, and data-fetching hooks shared between web and mobile
- **No Celery/Redis**: synchronous background tasks are sufficient to start
- **No image uploads**: not in scope for v1
