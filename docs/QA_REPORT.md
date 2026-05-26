# QA Report

## Current Status

- MVP build: production-pilot ready.
- Deployment: Railway deployment completed.
- Local checks: unit tests and syntax checks pass.
- Database: PostgreSQL on Railway; local JSON fallback when `DATABASE_URL` is unset.

## Local Verification

Run:

```bash
npm test
npm run dev
```

Manual test:
- Open `/shop/qalamirma`.
- Upload valid PDF.
- Pay through mock Billplz page.
- Login as shop admin.
- Confirm order appears.

## Production Smoke Test

After Railway deployment, verify:
- Open Railway app URL and confirm landing page loads.
- Check `/health` returns `{ "ok": true }` and `mode: "postgres"` when Railway `DATABASE_URL` is active.
- Subscribe to a plan using the current payment flow.
- Complete shop setup from the subscription confirmation page.
- Open generated `/shop/:slug` link.
- Upload a valid PDF and submit an order.
- Complete payment flow.
- Login as shop admin and confirm the order appears with correct file, price, status, and pickup slot.

## Remaining QA Before Real Commercial Use

- Replace mock Billplz flow with live credentials.
- Run one real low-value payment transaction.
- Confirm PDF uploads persist after Railway restart/redeploy.
- Confirm cleanup command removes expired PDFs without affecting active orders.
