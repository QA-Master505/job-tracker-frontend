# Job Tracker — Frontend

A React single-page application for tracking job applications. Built with Vite, Tailwind CSS, and React Router, it connects to the [Job Tracker Backend](https://github.com/QA-Master505/job-tracker-backend) REST API.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool and dev server |
| Tailwind CSS | 3 | Utility-first styling |
| React Router | 7 | Client-side routing |
| Axios | 1 | HTTP client |
| Prettier | 3 | Code formatting |
| ESLint | 10 | Code linting |

---

## Project Structure

```
job-tracker-frontend/
├── src/
│   ├── api/
│   │   └── axiosConfig.js       # Axios instance with JWT interceptor
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx       # Top navigation bar
│   │   │   └── Footer.jsx       # Page footer
│   │   └── jobs/
│   │       ├── JobCard.jsx      # Individual job application card
│   │       └── JobForm.jsx      # Add / Edit modal form
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state, login, logout, register
│   ├── hooks/
│   │   └── useAuth.js           # Hook to consume AuthContext
│   ├── pages/
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── LoginPage.jsx        # Login form
│   │   ├── RegisterPage.jsx     # Registration form
│   │   └── DashboardPage.jsx    # Job applications dashboard
│   ├── utils/
│   │   └── helpers.js           # formatDate, statusColor, STATUS_OPTIONS
│   ├── App.jsx                  # Router and layout wrapper
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind directives
├── .env                         # Environment variables (not committed)
├── .gitignore
├── index.html
├── Makefile                     # Developer shortcuts
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Job Tracker Backend running at `http://localhost:8000`

### Installation

```bash
# Clone the repository
git clone https://github.com/QA-Master505/job-tracker-frontend.git
cd job-tracker-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

> All Vite environment variables must be prefixed with `VITE_` to be accessible in the browser.

### Start Development Server

```bash
npm run dev
# or
make dev
```

The app runs at **http://localhost:5173**

---

## Makefile Commands

| Command | Description | npm Equivalent |
|---|---|---|
| `make dev` | Start development server | `npm run dev` |
| `make build` | Build for production | `npm run build` |
| `make preview` | Preview production build locally | `npm run preview` |
| `make install` | Install dependencies | `npm install` |
| `make lint` | Run ESLint | `npm run lint` |
| `make lint-fix` | Auto-fix ESLint errors | `npm run lint:fix` |
| `make format` | Format all source files with Prettier | `npm run format` |
| `make clean` | Remove dist and cache | `npm run clean` |

Run `make help` to print this list in the terminal.

---

## Features

- **Authentication** — Register, login, and logout with JWT stored in `localStorage`
- **Dashboard** — View all job applications with live stats (total, applied, interview, offer, rejected)
- **Add / Edit / Delete** — Full CRUD for job applications via modal form
- **Status badges** — Colour-coded: Applied (blue), Interview (yellow), Offer (green), Rejected (red), No Response (grey)
- **Job URL links** — Opens job posting in a new tab, always resolves to an absolute URL
- **Responsive layout** — 1 → 2 → 3 column grid, mobile-friendly navbar

---

## API Integration

All requests go through `src/api/axiosConfig.js`, which:

- Sets `baseURL` from `VITE_API_URL`
- Attaches `Authorization: Bearer <token>` to every request automatically

| Endpoint | Method | Description |
|---|---|---|
| `/auth/register` | POST | Create a new user account |
| `/auth/login` | POST | Login and receive JWT |
| `/jobs` | GET | Fetch all jobs for the logged-in user |
| `/jobs` | POST | Create a new job application |
| `/jobs/{id}` | PUT | Update an existing job application |
| `/jobs/{id}` | DELETE | Delete a job application |

---

## Testing

> Testing is not yet configured. Planned for a future phase.

---

## Deployment

> Deployment configuration is not yet set up. Planned for a future phase.

Recommended platforms: **Vercel**, **Netlify**, or **GitHub Pages** for static hosting.

---

## Related

- [Job Tracker Backend](https://github.com/QA-Master505/job-tracker-backend) — FastAPI REST API with JWT authentication
