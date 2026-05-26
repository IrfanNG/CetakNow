# CetakNow MVP

Multi-tenant online printing order system for print shops. CetakNow lets shop owners subscribe, set up a public shop link, accept PDF print orders, collect payment, manage orders, monitor revenue, and clean up uploaded files after 7 days.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open:

```txt
http://localhost:3000
http://localhost:3000/shop/qalamirma
http://localhost:3000/login
```

Demo logins:

```txt
Super admin: admin@cetaknow.local / password
Shop admin:  admin@qalamirma.local / password
Owner:       owner@cetaknow.local / password
```

## Features

- SaaS landing page with monthly and yearly subscription checkout.
- Self-service shop setup after successful subscription payment.
- Multi-tenant public shop pages using shop slugs.
- PDF-only order upload with page counting, price calculation, and pickup slots.
- Mock payment flow with a Billplz provider seam for live integration.
- Shop admin dashboard for orders, revenue, settings, products, and paper sizes.
- Super admin dashboard for shops, subscriptions, revenue, and platform monitoring.
- PostgreSQL support for Railway production, with local JSON fallback for development.
- Private PDF upload storage and 7-day cleanup command.

## Tech Stack

- Node.js 20+
- Native HTTP server, no web framework
- PostgreSQL via `pg`
- Local JSON fallback at `data/db.json`
- Node test runner for unit tests
- Playwright for optional end-to-end checks
- Railway deployment

## Environment

Copy `.env.example` to `.env` and configure:

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `DATABASE_URL` | PostgreSQL connection string; leave unset for JSON fallback |
| `PGSSLMODE` | Use `require` on Railway |
| `UPLOAD_DIR` | Private PDF upload directory |
| `SESSION_SECRET` | Long random session secret |
| `PORT` | Server port; defaults to `3000` |
| `HOST` | Server host; defaults to `127.0.0.1` |

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start local development server |
| `npm start` | Start production server |
| `npm run test:unit` | Run unit tests |
| `npm run test:e2e` | Run Playwright tests |
| `npm run test:all` | Run unit and e2e tests |
| `npm run db:migrate` | Create PostgreSQL schema |
| `npm run db:seed` | Seed PostgreSQL data |
| `npm run db:setup` | Migrate and seed PostgreSQL |
| `npm run db:check` | Check PostgreSQL connection |
| `npm run cleanup` | Delete expired uploaded PDFs |

## Usage

### Local JSON mode

Leave `DATABASE_URL` unset or commented in `.env`, then run:

```bash
npm run dev
```

The app stores development data in `data/db.json`.

### PostgreSQL mode

Set `DATABASE_URL`, then run:

```bash
npm run db:setup
npm start
```

Health check:

```bash
curl http://localhost:3000/health
```

Expected response includes:

```json
{ "ok": true, "mode": "postgres" }
```

## Main Routes

| Route | Purpose |
|---|---|
| `/` | SaaS landing page |
| `/subscriptions` | Create subscription lead |
| `/subscriptions/:code/confirmation` | Subscription confirmation and shop setup |
| `/shop/:slug` | Public shop order page |
| `/orders/:code/confirmation` | Customer order confirmation |
| `/login` | Admin login |
| `/admin` | Admin dashboard |
| `/admin/orders` | Order management |
| `/admin/revenue` | Revenue monitoring |
| `/admin/settings` | Shop settings |
| `/health` | Runtime health check |

## Deployment

Railway is the target platform.

Production checklist:

1. Add PostgreSQL service.
2. Set `DATABASE_URL`, `PGSSLMODE=require`, `SESSION_SECRET`, and `UPLOAD_DIR=/data/pdfs`.
3. Mount a Railway volume at `/data`.
4. Run `npm run db:migrate`, then `npm run db:seed`.
5. Verify `/health` returns PostgreSQL mode.

Full guide: [`docs/RAILWAY_DEPLOYMENT.md`](docs/RAILWAY_DEPLOYMENT.md).

## Project Docs

- [`docs/PRD.md`](docs/PRD.md) — product scope
- [`docs/SDD.md`](docs/SDD.md) — system design
- [`docs/TASKS.md`](docs/TASKS.md) — delivery checklist
- [`docs/QA_REPORT.md`](docs/QA_REPORT.md) — testing and release status
- [`docs/RAILWAY_DEPLOYMENT.md`](docs/RAILWAY_DEPLOYMENT.md) — deployment guide

## Current Status

CetakNow is production-pilot ready on Railway. The remaining commercial blocker is replacing the mock payment flow with live Billplz credentials and confirming one real low-value payment transaction in production.

## License

Private project. All rights reserved.
