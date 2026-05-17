---
name: CetakNow
description: Local print-shop ordering system that turns WhatsApp chaos into paid, organized pickup orders.
colors:
  navy: "#062b66"
  navy-deep: "#071426"
  blue: "#0b4f9f"
  yellow: "#ffc20a"
  yellow-soft: "#fff4c7"
  ice: "#eaf4ff"
  hero-bg: "#f7fbff"
  hero-bg-mid: "#e8f4ff"
  hero-bg-end: "#d7ecff"
  text: "#142033"
  text-deep: "#061a3d"
  text-muted: "#64748b"
  border: "#e2e8f0"
  field-border: "#cbd5e1"
  surface: "#ffffff"
  surface-soft: "#f8fbff"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(3rem, 6.2vw, 5.7rem)"
    fontWeight: 950
    lineHeight: 0.94
    letterSpacing: "-0.065em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 3.2vw, 3.1rem)"
    fontWeight: 950
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.08rem"
    fontWeight: 900
    lineHeight: 1.2
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 650
    lineHeight: 1.65
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 950
    lineHeight: 1
    letterSpacing: "0.16em"
rounded:
  sm: "12px"
  md: "18px"
  lg: "22px"
  xl: "36px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "28px"
  xl: "38px"
  section: "76px"
components:
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.pill}"
    padding: "12px 25px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.navy}"
    rounded: "{rounded.pill}"
    padding: "11px 22px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "28px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "12px"
---

# Design System: CetakNow

## 1. Overview

**Creative North Star: "The Order Counter"**

CetakNow should feel like a clean, reliable print-shop counter where every file, payment, and pickup slot has a clear place. The visual system is local, trustworthy, and efficient: bright enough to feel approachable, structured enough to earn confidence from small shop owners who are tired of WhatsApp chaos.

The system rejects generic SaaS template visuals, over-corporate fintech styling, childish student-project UI, excessive glassmorphism, repeated identical card grids, vague startup jargon, and English-first copy. It should look operational, not ornamental. If a design move does not help an owner understand order flow, payment discipline, pickup clarity, or trust, it should be removed.

**Key Characteristics:**
- Navy and yellow brand contrast, anchored by the CetakNow logo.
- BM-first copy with practical owner-facing language.
- Large confident headings, simple sections, and visible conversion actions.
- Light hero surfaces for logo clarity, dark operational bands for trust and structure.
- Mobile-first CTA access for busy shop owners.

## 2. Colors

The palette is a local operations palette: navy for trust and control, yellow for decisive action, light blue for clarity and approachability.

### Primary
- **Counter Navy** (#062b66): primary brand authority color. Use for admin-facing buttons, key headings, login accents, and serious trust moments.
- **Deep Night Navy** (#071426): dark section background for problem, workflow, and final CTA bands. Use when the page needs operational weight.
- **Action Yellow** (#ffc20a): primary conversion color. Use for `Daftar`, `Daftar Sekarang`, selected plan emphasis, step numbers, checks, and high-intent actions.

### Secondary
- **Working Blue** (#0b4f9f): supporting brand blue for section labels, links, and secondary emphasis.
- **Print Ice** (#eaf4ff): soft supporting tint for light brand surfaces.

### Neutral
- **Paper White** (#ffffff): main card and form surface. Use sparingly and intentionally, not as endless identical cards.
- **Soft Counter Surface** (#f8fbff): form panel background and subtle surface contrast.
- **Ink Text** (#142033): default text color for readable body and card content.
- **Deep Ink** (#061a3d): hero heading and high-emphasis text.
- **Muted Slate** (#64748b): secondary explanatory copy. Do not use on dark colored backgrounds unless contrast remains strong.
- **Line Grey** (#e2e8f0): card, divider, and panel borders.

### Named Rules

**The Yellow Means Action Rule.** Yellow is reserved for conversion, selection, and progress signals. Do not use it as random decoration.

**The Navy Builds Trust Rule.** Dark navy sections should carry operational trust: pain, security, workflow, or final decision moments.

## 3. Typography

**Display Font:** Inter with system sans fallbacks  
**Body Font:** Inter with system sans fallbacks  
**Label/Mono Font:** No mono font. Labels use uppercase Inter with tracking.

**Character:** The current type system is utilitarian and direct. It favors speed and clarity over editorial personality, matching the product’s local operations purpose.

### Hierarchy
- **Display** (950, `clamp(3rem, 6.2vw, 5.7rem)`, 0.94): hero headline only. Use tight tracking for confident brand impact.
- **Headline** (950, `clamp(2rem, 3.2vw, 3.1rem)`, 1.05): major section titles and conversion blocks.
- **Title** (900, `1.08rem`, 1.2): card titles, pricing titles, dashboard labels.
- **Body** (650, `1rem`, 1.65): explanatory copy, form reassurance, problem statements. Keep body copy within 65-75ch.
- **Label** (950, `0.72rem`, 0.16em tracking, uppercase): section kickers only. Avoid repeating it mechanically in every small block.

### Named Rules

**The Owner Reads Fast Rule.** Use short BM-first sentences. If the copy sounds like a startup pitch deck, rewrite it like a shop owner would explain it.

## 4. Elevation

CetakNow uses a hybrid depth system: mostly flat structured sections, with soft shadows only for cards, logo previews, and conversion elements. Elevation should feel like paper and counter surfaces, not floating glass panels.

### Shadow Vocabulary
- **Card Soft Lift** (`0 18px 55px rgba(15,23,42,.06)`): pricing cards and calm white surfaces.
- **Dark Section Card Lift** (`0 18px 55px rgba(0,0,0,.12)`): white cards on navy bands.
- **CTA Glow** (`0 16px 36px rgba(255,194,10,.24)`): primary acquisition CTAs only.
- **Logo Drop** (`0 20px 30px rgba(6,43,102,.18)`): logo mark treatment in hero and device preview.

### Named Rules

**The Counter Surface Rule.** Surfaces may lift just enough to separate from the counter. No dramatic glass, blur, neon glow, or floating dashboard fantasy.

## 5. Components

### Buttons
- **Shape:** pill radius (`999px`) for marketing CTAs and primary actions.
- **Primary:** Action Yellow background (#ffc20a), Deep Night Navy text (#071426), heavy font, `12px 25px` or larger for nav and pricing CTAs.
- **Hover / Focus:** slight yellow brightening, `translateY(-1px)`, visible 3px yellow focus outline with offset.
- **Secondary:** white or translucent white with Counter Navy text. Use for admin login or lower-priority actions.

### Chips
- **Style:** compact pill labels with strong font weight. Hero mini-links use checkmark-led text.
- **State:** chips are informational by default. Do not make decorative chip clouds.

### Cards / Containers
- **Corner Style:** small operational radius (`12px`) for marketing cards, larger radius (`18px-22px`) for forms and app panels.
- **Background:** Paper White for cards, Soft Counter Surface for forms.
- **Shadow Strategy:** use Card Soft Lift only when the surface competes with background color.
- **Border:** Line Grey border for light surfaces; avoid colored side stripes.
- **Internal Padding:** 28px for standard cards, 22px for form panels, 34px for pricing cards.

### Inputs / Fields
- **Style:** white background, Line Grey or Field Border stroke, 12px radius, 12px padding.
- **Focus:** visible yellow focus outline. Validation should stay quiet until browser/user reports invalid input.
- **Error / Disabled:** invalid fields use yellow warning outline, not aggressive red unless submission truly fails.

### Navigation
- **Desktop:** logo left, section links right, `Daftar` as primary yellow CTA, `Log Masuk` as secondary pill.
- **Mobile:** logo plus compact `Daftar`; hide secondary section links and login to preserve owner speed.
- **Behavior:** acquisition CTA must stay easier to find than admin login on marketing surfaces.

### Signature Component: Order Trust Band
Dark navy bands communicate operational trust. Use them for pain points, workflow, security, and final CTA. Each band should answer one concrete owner concern, not repeat generic benefits.

## 6. Do's and Don'ts

### Do:
- **Do** keep `Daftar` / `Daftar Sekarang` as the dominant marketing actions and `Log Masuk` secondary.
- **Do** use navy for trust, yellow for action, and light blue for calm explanation.
- **Do** write BM-first copy with practical shop-owner language.
- **Do** show concrete order flow: file, price, payment, status, pickup.
- **Do** maintain WCAG AA contrast, visible focus states, and 44px touch targets.
- **Do** keep mobile signup reachable without long manual scrolling.

### Don't:
- **Don't** use generic SaaS template visuals, especially repeated identical card grids.
- **Don't** use over-corporate fintech styling or make the page feel like a bank.
- **Don't** make the interface look like a childish student-project UI.
- **Don't** use excessive glassmorphism, decorative blur panels, gradient text, or neon effects.
- **Don't** use vague startup jargon when direct BM copy would be clearer.
- **Don't** make English-first copy the default for owner-facing surfaces.
- **Don't** let `Log Masuk` compete visually with `Daftar` or `Daftar Sekarang` on landing pages.
