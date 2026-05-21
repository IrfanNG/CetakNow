# CetakNow — Railway Deployment Guide

## Prerequisites

- [Railway](https://railway.com) account
- GitHub repository pushed with the CetakNow code
- PostgreSQL service added to your Railway project

---

## Step 1: Create a Railway Project

1. Go to [Railway Dashboard](https://railway.com/dashboard)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your CetakNow repository

Railway will auto-detect the Node.js project and run `npm start`.

---

## Step 2: Add PostgreSQL

1. In your Railway project, click **New**
2. Select **Database** → **Add PostgreSQL**
3. Railway will provision a PostgreSQL instance and inject `DATABASE_URL` into your app environment

---

## Step 3: Set Environment Variables

In your Railway project, go to **Variables** and add:

| Variable | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Enables production mode |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Auto-injected by Railway PostgreSQL plugin |
| `UPLOAD_DIR` | `/data/pdfs` | Points to the mounted Volume path |
| `SESSION_SECRET` | `<long-random-secret>` | Generate a 64-char random string (`openssl rand -hex 32`) |
| `PGSSLMODE` | `require` | Railway PostgreSQL requires SSL |

> `DATABASE_URL` is automatically set by Railway when you add the PostgreSQL plugin. You don't need to manually enter it.

---

## Step 4: Create a Volume for Persistent PDF Storage

1. In your Railway project, click **New** → **Volume**
2. Set the **Mount Path** to `/data`
3. Railway will create a persistent volume at that mount path
4. The app creates `/data/pdfs` on startup automatically (via `UPLOAD_DIR`)

This ensures uploaded PDFs survive restarts and redeploys.

---

## Step 5: Run Database Migration & Seed

After environment variables and PostgreSQL are set, run these one-time commands.

### Option A — Via Railway CLI

```bash
railway run npm run db:migrate
railway run npm run db:seed
railway run npm run db:check
```

### Option B — Via Railway Dashboard (One-off Commands)

1. Go to your project → **Deployments**
2. Click the **...** menu → **Run Command**
3. Enter: `npm run db:migrate`
4. Repeat for `npm run db:seed`

### Option C — Local with Public URL

If Railway is not set up yet, you can run migration locally using the public connection string:

```bash
DATABASE_URL="<your-railway-postgres-public-url>" npm run db:migrate
DATABASE_URL="<your-railway-postgres-public-url>" npm run db:seed
```

> The public URL is found in the PostgreSQL service dashboard on Railway.

---

## Step 6: Health Check

The app exposes a `GET /health` endpoint:

```json
{ "ok": true, "mode": "postgres", "uptime": 123.45 }
```

You can configure Railway to use this as a health check endpoint (optional).

Verify manually:

```bash
curl https://your-app.railway.app/health
```

---

## Step 7: Verify the Deployment

1. Open the Railway-generated URL
2. Confirm the landing page loads
3. Test key flows (see smoke test checklist below)

---

## Running Cleanup (Expired Files)

Cleanup removes PDF files older than 7 days and marks them as deleted in the database.

**Manual run:**

```bash
railway run npm run cleanup
```

**Scheduled via Railway Cron (optional):**

Add a Cron job in Railway that runs `npm run cleanup` daily.

---

## Available npm Scripts

| Script | Purpose |
|---|---|
| `npm start` | Start production server |
| `npm run dev` | Start development server (auto host) |
| `npm run db:migrate` | Run PostgreSQL schema migration |
| `npm run db:seed` | Seed initial data (shops, products, etc.) |
| `npm run db:setup` | Migrate + seed in one command |
| `npm run db:check` | Verify PostgreSQL connection |
| `npm run cleanup` | Delete expired PDF files |
| `npm run test:unit` | Run unit tests |

---

## Smoke Test Checklist

After deployment, verify each:

- [ ] Landing page loads (`/`)
- [ ] Shop page loads (`/shop/qalamirma`)
- [ ] Super admin login works (`/login`)
- [ ] Shop owner login works
- [ ] Public PDF upload works (create order)
- [ ] Mock payment completes successfully
- [ ] Order appears in shop dashboard (`/admin/orders`)
- [ ] Order persists after Railway redeploy/restart
- [ ] File download works from order detail
- [ ] Revenue page loads (`/admin/revenue`)
- [ ] Cleanup command runs without errors (`npm run cleanup`)
- [ ] No horizontal overflow on mobile viewports

---

## Local Development (JSON Fallback)

Without `DATABASE_URL`, CetakNow runs entirely on `data/db.json`. No PostgreSQL needed:

```bash
cp .env.example .env
# Edit .env — leave DATABASE_URL unset or commented
npm start
```

This is ideal for quick testing and development.

---

## Troubleshooting

### Connection refused / PostgreSQL not reachable
- Check that `DATABASE_URL` is set correctly
- On Railway, ensure `PGSSLMODE=require` is set
- Run `npm run db:check` to test connectivity

### Volume permission errors
- Railway volumes are mounted as the runtime user
- The app calls `fs.mkdir(UPLOAD_DIR, { recursive: true })` on startup
- If permission issues persist, verify the mount path matches `UPLOAD_DIR`

### Uploaded files missing after redeploy
- Ensure a Volume is mounted at `/data`
- Verify `UPLOAD_DIR=/data/pdfs` is set in environment variables
- Files stored in the Volume survive restarts; files outside the Volume do not

### App crashes on startup
- Run `node --check src/server.js` to verify syntax
- Check Railway logs for specific error messages
- Ensure all environment variables are correctly set
