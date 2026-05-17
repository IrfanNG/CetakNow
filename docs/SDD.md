# CetakNow SDD

Current implementation is a dependency-free Node.js MVP because local PHP/Composer is unavailable. It preserves the planned SaaS behavior and can later be ported to Laravel + Filament.

## Architecture
- `src/server.js`: HTTP routes for landing, subscriptions, self-serve shop setup, shop orders, admin, payment.
- `src/db.js`: JSON persistence for shops, shop pricing, pickup slots, orders, payments, notifications, and paid subscriptions.
- `src/pdf.js`: PDF validation/page count.
- `src/payment.js`: Billplz mock/live provider seam.
- `src/cleanup.js`: scheduled file cleanup.
- `storage/pdfs`: private uploads.

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
