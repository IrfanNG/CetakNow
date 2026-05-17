---
target: landing page
total_score: 22
p0_count: 0
p1_count: 2
timestamp: 2026-05-17T05-39-28Z
slug: src-views-js-landingpage
---
# CetakNow Landing Page Critique

Target: `src/views.js:landingPage`, visual URL `http://127.0.0.1:3000/`
Register: brand landing page, inferred from route `/` and SaaS acquisition copy.
Context note: `PRODUCT.md` and `DESIGN.md` are missing, so brand intent is inferred from repo docs and current UI.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Lead form has required fields, but no inline validation, loading, or visible submission state before redirect. |
| 2 | Match System / Real World | 3 | BM copy speaks to shop owners clearly, but mixed English labels weaken local trust. |
| 3 | User Control and Freedom | 2 | Desktop anchors exist, but mobile hides section nav entirely and form has no secondary escape. |
| 4 | Consistency and Standards | 2 | Strong brand colors, but repeated card systems, mixed icon styles, and layered legacy CSS reduce cohesion. |
| 5 | Error Prevention | 2 | Required fields help, but phone/email/location lack guidance beyond placeholders. |
| 6 | Recognition Rather Than Recall | 3 | Core value is visible, but pricing and signup are far down the page. |
| 7 | Flexibility and Efficiency | 1 | No quick mobile CTA, sticky signup, or alternate contact path for busy owners. |
| 8 | Aesthetic and Minimalist Design | 2 | Clean, but too template-like: card grids, centered stacks, generic pills, repeated sections. |
| 9 | Error Recovery | 2 | Native browser validation exists, but no friendly recovery copy or preserved error state visible here. |
| 10 | Help and Documentation | 1 | No FAQ, onboarding expectations, WhatsApp/contact fallback, or trust support section. |
| **Total** | | **22/40** | **Acceptable, solid base but needs sharper conversion and stronger brand POV.** |

## Anti-Patterns Verdict

Looks polished enough for an MVP demo, but still has visible AI/SaaS-template fingerprints. The main tells are repeated card grids, centered section rhythm, Inter/system font default, pill nav, generic benefit chips, and icon bullets that do not feel custom to a print-shop workflow.

Automated detector: `npx impeccable detect --json src/views.js public/styles.css` did not complete in this sandbox run. Manual deterministic scan found `Inter`, `#fff`, many `background:white` patterns, legacy glass/sticky nav code, repeated `quote-card-grid` structures, and card-heavy sections.

Browser inspection: desktop and mobile screenshots were captured through Playwright. Browser overlay injection was not available through the current tool surface.

## Overall Impression

The page is trustworthy and readable, but the conversion path is too buried and the visual system feels safer than the business opportunity. Biggest opportunity: make the landing page feel like a working print-order machine, not a generic SaaS explanation page.

## What's Working

1. Brand colors now align with the logo, navy, yellow, and light-blue hero feel coherent.
2. The value proposition is understandable in one glance: upload PDF, pay first, pickup slot.
3. Mobile layout does not break, form fields stack correctly and pricing remains readable.

## Priority Issues

### [P1] Primary conversion is buried below the whole narrative
Why it matters: shop owners who are already convinced must scroll through every section before the form.
Fix: add a persistent or early `Daftar Minat` CTA in hero/nav on mobile and desktop. Keep `Log Masuk` secondary because it is for existing admins.
Suggested command: `impeccable polish landing page`

### [P1] The page uses generic SaaS/card grammar too much
Why it matters: the product solves messy print-shop operations, but the visuals mostly show abstract cards, icons, and text blocks.
Fix: replace at least one repeated card section with a concrete order-flow visual: WhatsApp mess before, CetakNow structured order after, PDF/payment/pickup timeline.
Suggested command: `impeccable bolder landing page`

### [P2] Mobile navigation hides every section link and leaves no fast CTA
Why it matters: mobile owners lose orientation and must scroll manually to subscribe.
Fix: show one compact mobile CTA bar: `Daftar Minat` plus `Harga`, or turn the logo row into logo + CTA.
Suggested command: `impeccable adapt landing page`

### [P2] Mixed BM and English weakens the local owner voice
Why it matters: “Submit Interest”, “Priority manual support”, and “Data Protected” feel less natural beside BM copy.
Fix: localize CTA and trust labels: `Hantar Minat`, `Sokongan Manual Diutamakan`, `Fail Dilindungi`.
Suggested command: `impeccable clarify landing page`

### [P2] Design system debt is leaking through CSS
Why it matters: multiple historical landing systems still exist in `public/styles.css`, with `!important` overrides and duplicate nav/button rules. Future polish will become fragile.
Fix: extract the active landing tokens and remove dead landing v1/v2 selectors after visual approval.
Suggested command: `impeccable extract landing design system`

## Cognitive Load

Failures: 3 of 8, moderate.

Failed items: single focus, progressive disclosure, minimal choices at nav/form. The nav has 7 visible choices on desktop, the landing repeats similar sections before the main form, and the form asks for all lead details at once.

## Persona Red Flags

Jordan, first-timer: understands the headline, but may not know what happens after submitting interest. No “kami hubungi dalam X hari” reassurance near the button.

Casey, distracted mobile user: nav is hidden, primary CTA appears only after long scrolling, form has many text fields and no WhatsApp shortcut.

Riley, stress tester: phone input accepts anything, form has no inline error copy, and long shop/location/message text may stress layout or backend review.

## Minor Observations

- Hero logo is large and clear, but it competes with the headline instead of supporting it.
- `0 shop leads direkodkan` may reduce trust on a public landing page. Hide until there is traction, or phrase as internal MVP status.
- Emoji/icons in audience cards feel inconsistent with the polished logo direction.
- The thank-you page contains an em dash and English-first copy, while the landing is BM-first.

## Questions to Consider

1. Should this feel more like a local trusted shop tool, or a modern SaaS platform for many print shops?
2. Should `Log Masuk` stay visible in the hero nav, or should `Daftar Minat` become the dominant nav action?
3. Do we want to keep the long education page, or compress it into a shorter conversion page?
