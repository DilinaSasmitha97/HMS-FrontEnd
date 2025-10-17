# Smart Healthcare System Frontend (React + Vite + Tailwind)

Dev quickstart (Windows PowerShell):

1. Install deps
	- npm install
2. Start dev server
	- npm run dev

Notes:
- Tailwind CSS is configured via `postcss.config.cjs` and `tailwind.config.cjs`. Directives are in `src/index.css`.
- Vite proxy forwards `/api` to `http://localhost:5000` for backend integration.
- Configure API base via `VITE_API_URL` if needed.

Project structure highlights:
- `src/components/ui/*` — Reusable Tailwind components (Button, Input, Select, Card, Stepper, Table)
- `src/pages/*` — Core modules (Appointments, Records, Doctor, Lab, Patients)
- `src/lib/api.js` — Axios instance and API base URL
