---
target: "src/views.js#admin-dashboard"
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-05-17T14-11-53Z
slug: src-views-js-admin-dashboard
---
# Admin Dashboard Critique

Score: 28/40
Target: src/views.js#admin-dashboard

Anti-pattern verdict: improved structure, but still reference-copy risk. Sidebar and KPI rhythm are solid. Main issue is too many same-weight KPI cards, icon glyphs, placeholder navigation, and mixed BM/English copy.

Priority issues:
- P1: Sidebar has dead/duplicate IA. Orders and Overview both route to /admin; Settings routes to scaffold page.
- P1: KPI row is visually polished but equal-weight. No primary operational next action.
- P2: Unicode icons look prototype-like and weaken professional trust.
- P2: Insight panels feel generic. Conversion and ratio bars repeat dashboard-template language.
- P2: Mixed language labels reduce local confidence.

Recommended fixes:
- Distill sidebar IA and add real current-state affordances.
- Polish KPI hierarchy and primary workflow action.
- Replace glyph icons with CSS icon tokens or text-led badges.
- Clarify copy into BM-first owner/staff language.
