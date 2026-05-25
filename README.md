# Snoop.ai

Competitor monitoring dashboard that watches Bluesky for keyword matches, analyzes posts with AI, and surfaces prioritized events in a web UI.

## Architecture

| Layer | Tech | Role |
|-------|------|------|
| **Scraper** | C++ (`scraper/`) | Connects to Bluesky Jetstream, matches competitor keywords, emits JSON matches |
| **Backend** | FastAPI + SQLite | Auth, profiles, events API, Groq AI analysis, scraper pipeline |
| **Frontend** | Next.js + React | Dashboard, competitor feed, profiles, sort/filter/search |

```text
Bluesky Jetstream → C++ scraper → Python pipeline → Groq AI → SQLite
                                                      ↓
                                            Next.js frontend
```

## Prerequisites

Install these before setting up the project:

- **Git**
- **Node.js** 18+ (20+ recommended)
- **pnpm** — `npm install -g pnpm`
- **Python** 3.11 or 3.12
- **CMake** 3.14+
- **C++ compiler** with C++17 support (Xcode Command Line Tools on macOS: `xcode-select --install`)
- **OpenSSL** (usually included with macOS/Linux; required for the C++ scraper)
- **Groq API key** — [https://console.groq.com](https://console.groq.com)

---

## 1. Clone the repository

```bash
git clone <your-repo-url>
cd snoop.ai
```

---

## 2. Backend (Python / FastAPI)

### Install dependencies

From the project root:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

> The pinned dependency list lives in `backend/requirements.txt`. A shorter list also exists at the repo root in `requirements.txt`, but use the backend file for a full install.

### Environment variables

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_random_jwt_secret_here
```

Generate a secret key (example):

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Run the backend

Always start uvicorn from the **`backend/`** directory so `.env` and the SQLite database path resolve correctly:

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

API base URL: **http://127.0.0.1:8000**

Health check: http://127.0.0.1:8000/

The SQLite database is created automatically at `backend/market_monitor.db`.

---

## 3. C++ scraper (optional, for live Bluesky matches)

The backend can auto-start the scraper on startup. You must build the binary first.

### Build the scraper

```bash
cd scraper
mkdir -p build
cd build
cmake .. -DCPR_USE_SYSTEM_CURL=ON
cmake --build .
```

The executable should exist at:

```text
scraper/build/scraper
```

The backend launches it as `../scraper/build/scraper` relative to the `backend/` working directory.

### Disable the scraper

If you only want the API and UI (no live ingestion), comment out the scraper task in `backend/app/main.py`:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # asyncio.create_task(run_cpp_engine())
    yield
```

Restart uvicorn after changing this.

---

## 4. Frontend (Next.js)

### Install dependencies

```bash
cd frontend
pnpm install
```

If you do not use pnpm, you can use `npm install` instead, but the repo is set up with `pnpm-lock.yaml`.

### Environment variables

Copy the example env file:

```bash
cp .env.example .env.local
```

Default contents:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Change the URL if your backend runs on a different host or port.

### Run the frontend

```bash
cd frontend
pnpm dev
```

App URL: **http://localhost:3000**

---

## 5. Run everything (demo / local dev)

Use **three terminals** (or run the scraper via the backend lifespan as above):

| Terminal | Directory | Command |
|----------|-----------|---------|
| 1 | `backend/` | `source venv/bin/activate && uvicorn app.main:app --reload` |
| 2 | `frontend/` | `pnpm dev` |
| 3 (optional) | — | Scraper is started by the backend if enabled in `main.py` |

### First-time usage

1. Open http://localhost:3000
2. **Sign up** or **log in** (email + password)
3. Create a **monitoring profile** with competitors and keywords
4. Open **Dashboard** or **Competitors** to view events (once the scraper + AI pipeline stores them)

---

## Project structure

```text
snoop.ai/
├── backend/                 # FastAPI API, auth, DB, scraper pipeline
│   ├── app/                 # Main app, auth, AI client, models
│   ├── routes/              # API route handlers
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Secrets (not committed)
├── frontend/                # Next.js UI
│   ├── app/                 # Pages (dashboard, competitors, profiles, …)
│   ├── components/        # UI components
│   └── lib/                 # API client, hooks, utilities
├── scraper/                 # C++ Bluesky keyword matcher
│   └── build/scraper        # Compiled binary (after cmake build)
└── README.md
```

---

## API overview

| Endpoint | Description |
|----------|-------------|
| `POST /auth/signup` | Create account |
| `POST /auth/login` | Login (OAuth2 form: `username` = email) |
| `GET /auth/me` | Current user |
| `GET /profiles` | List monitoring profiles |
| `GET /profiles/{id}/events?limit=50` | Competitor events |
| `GET /profiles/{id}/metrics` | Dashboard metrics |
| `GET /scraper/config` | Scraper profile/keyword config |

---

## Troubleshooting

### `GROQ_API_KEY is missing`

Add `GROQ_API_KEY` to `backend/.env` and restart uvicorn from the `backend/` folder.

### Groq `429` / rate limit

The free tier has a daily token cap. The scraper calls Groq for every matched post. Options:

- Wait for the quota to reset or use a new API key
- Disable the scraper in `main.py` (see above)
- Use the app with existing events already in the database

### Backend hangs or login is slow

Usually caused by heavy scraper + AI load on SQLite. Ensure only one uvicorn instance runs on port 8000. Restart the backend if it becomes unresponsive.

### `market_monitor.db-wal` / `.db-shm` files

Normal with SQLite WAL mode. They are gitignored. Do not delete them while the server is running.

### Scraper fails to start

- Confirm `scraper/build/scraper` exists (rebuild with CMake)
- Run uvicorn from `backend/` so the relative path `../scraper/build/scraper` is correct

### Frontend cannot reach the API

- Backend must be running on port 8000
- Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Restart `pnpm dev` after changing env vars

### Hydration warnings on `/competitors`

Hard-refresh the page. If issues persist, clear site data for localhost and reload.

---

### Please reach out to vraj20patel03@gmail.com if you have any questions
