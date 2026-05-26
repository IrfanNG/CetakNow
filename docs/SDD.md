# CetakNow SDD

Current implementation is a dependency-free Node.js MVP because local PHP/Composer is unavailable. It preserves the planned SaaS behavior and can later be ported to Laravel + Filament.

## MVP Status
- **Build status**: Production-pilot ready.
- **Deployment status**: Railway deployment completed.
- **Runtime database**: PostgreSQL on Railway when `DATABASE_URL` is configured; local JSON fallback when it is not.
- **Upload storage**: Private PDF storage via `UPLOAD_DIR`; Railway should point this to the mounted persistent volume path.
- **Remaining commercial blocker**: replace/mock-to-live Billplz credentials before real paid customer operation.

## Architecture
- `src/server.js`: HTTP routes for landing, subscriptions, self-serve shop setup, shop orders, admin, payment.
- `src/db.js`: persistence adapter for shops, pricing, pickup slots, orders, payments, notifications, and paid subscriptions. Uses PostgreSQL when `DATABASE_URL` exists; otherwise uses local JSON fallback.
- `src/pdf.js`: PDF validation/page count.
- `src/payment.js`: Billplz mock/live provider seam.
- `src/cleanup.js`: scheduled file cleanup.
- `scripts/db-migrate.js`, `scripts/db-seed.js`, `scripts/db-check.js`: PostgreSQL deployment setup and verification.
- `storage/pdfs` or configured `UPLOAD_DIR`: private uploads.

## Deployment
- Platform: Railway.
- App start command: `npm start`.
- Health check: `GET /health` returns mode and uptime.
- Required production variables: `NODE_ENV`, `DATABASE_URL`, `UPLOAD_DIR`, `SESSION_SECRET`, `PGSSLMODE`.
- Deployment guide: `docs/RAILWAY_DEPLOYMENT.md`.

## Subscription Setup Flow
- Owner selects monthly or yearly plan from landing pricing.
- Owner enters email and phone, then pays through the subscription payment flow.
- After paid status, `/subscriptions/:code/confirmation` displays the shop setup form.
- Setup creates an active shop, pricing row, default pickup slots, links `subscriptions.shop_id`, and redirects back to confirmation.
- Confirmation then shows the generated `/shop/:slug` link.

## Security
- Uploaded PDFs are not served publicly.
- Admin download route checks role/shop ownership.
- Files auto-delete after 7 days.
