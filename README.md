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
