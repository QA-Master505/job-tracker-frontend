# job-tracker-frontend

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://job-tracker-frontend-green-sigma.vercel.app)
[![GitHub last commit](https://img.shields.io/github/last-commit/QA-Master505/job-tracker-frontend)](https://github.com/QA-Master505/job-tracker-frontend/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/QA-Master505/job-tracker-frontend)](https://github.com/QA-Master505/job-tracker-frontend)

React SPA for tracking job applications. Connects to the [job-tracker-backend](https://github.com/QA-Master505/job-tracker-backend) FastAPI REST API for authentication and job CRUD.

---

## Tech Stack

| Technology | Version |
|---|---|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 3 |
| React Router | 7 |
| Axios | 1 |

---

## Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `VITE_API_URL` | Yes | Base URL of the backend API | `http://localhost:8000` |

> Vite only exposes variables prefixed with `VITE_` to the browser bundle.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
echo "VITE_API_URL=http://localhost:8000" > .env.local

# 3. Start dev server
npm run dev
```

App runs at **http://localhost:5173**.

The backend must be running at the URL set in `VITE_API_URL`.

---

## Deployment

The project is deployed on **Vercel** with automatic deploys on push to `main`.

`vercel.json` rewrites all routes to `index.html` so React Router handles client-side navigation correctly.

**Required:** set `VITE_API_URL` in the Vercel project dashboard under **Settings → Environment Variables** before deploying, otherwise all API calls will fail.

---

## Testing

UI and end-to-end tests for this project live in the dedicated
[job-tracker-tests](https://github.com/QA-Master505/job-tracker-tests)
repository and run against the production Vercel + Railway stack.
No test code lives in this repository.

| Suite | Tool | What It Tests |
|-------|------|--------------|
| E2E Tests | Playwright Chromium | Full browser journeys — register, login, job CRUD, logout |
| UI Spec Tests | Playwright Chromium | Component-level — forms, modals, validation states, error messages |
| BDD Tests | Cucumber + Playwright | Gherkin acceptance scenarios — auth, jobs, profile |

All three suites use `data-testid` attributes added to this codebase for
stable, role-independent element targeting. They run against the production
Vercel URL automatically.

→ [E2E Test Documentation](https://github.com/QA-Master505/job-tracker-tests/blob/main/docs/README-e2e-tests.md)
→ [UI Spec Test Documentation](https://github.com/QA-Master505/job-tracker-tests/blob/main/docs/README-ui-spec-tests.md)
→ [BDD Test Documentation](https://github.com/QA-Master505/job-tracker-tests/blob/main/docs/README-bdd-tests.md)

---

## npm Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run format` | Format `src/` with Prettier |
| `npm run clean` | Delete `dist/` and `node_modules/.cache` |

## Makefile

A `Makefile` wraps the npm scripts for convenience. Run `make help` to see all available targets.

| Command | Description |
|---------|-------------|
| `make dev` | Start the development server (`npm run dev`) |
| `make build` | Production build to `dist/` (`npm run build`) |
| `make preview` | Serve the production build locally (`npm run preview`) |
| `make install` | Install all dependencies (`npm install`) |
| `make lint` | Run ESLint (`npm run lint`) |
| `make lint-fix` | Auto-fix ESLint errors (`npm run lint:fix`) |
| `make format` | Format `src/` with Prettier (`npm run format`) |
| `make clean` | Delete `dist/` and `node_modules/.cache` (`npm run clean`) |

### Docker Note

The frontend itself does not use Docker — it runs on Vercel in production and via `make dev`
locally. However, when developing locally, the backend must be running for API calls to work.
The quickest way to start the full stack locally:

```bash
# In job-tracker-backend/
make docker-up   # starts PostgreSQL + FastAPI on localhost:8000

# In job-tracker-frontend/
make dev         # starts Vite dev server on localhost:5173
```

Set `VITE_API_URL=http://localhost:8000` in `.env.local` before running `make dev`.

---

## 🔗 Related Repositories

| Repository | Description | Link |
|------------|-------------|------|
| `job-tracker-backend` | FastAPI + PostgreSQL backend | [GitHub](https://github.com/QA-Master505/job-tracker-backend) |
| `job-tracker-tests` | Full QA automation suite | [GitHub](https://github.com/QA-Master505/job-tracker-tests) |
