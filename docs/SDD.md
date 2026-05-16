# CetakNow SDD

Current implementation is a dependency-free Node.js MVP because local PHP/Composer is unavailable. It preserves the planned SaaS behavior and can later be ported to Laravel + Filament.

## Architecture
- `src/server.js`: HTTP routes.
- `src/db.js`: JSON persistence.
- `src/pdf.js`: PDF validation/page count.
- `src/payment.js`: Billplz mock/live provider seam.
- `src/cleanup.js`: scheduled file cleanup.
- `storage/pdfs`: private uploads.

## Security
- Uploaded PDFs are not served publicly.
- Admin download route checks role/shop ownership.
- Files auto-delete after 7 days.
