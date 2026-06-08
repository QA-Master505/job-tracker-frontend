# job-tracker-frontend

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

---

## 🔗 Related Repositories

| Repository | Description | Link |
|------------|-------------|------|
| `job-tracker-backend` | FastAPI + PostgreSQL backend | [GitHub](https://github.com/QA-Master505/job-tracker-backend) |
| `job-tracker-tests` | Full QA automation suite | [GitHub](https://github.com/QA-Master505/job-tracker-tests) |
