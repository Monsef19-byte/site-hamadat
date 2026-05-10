# ASSETS COLLECTED — Hamadat Promotion Immobilière
**Date:** May 9, 2026  
**Status:** Complete — awaiting font file confirmation before implementation

---

## ✅ A. BRAND IDENTITY

### Official Colors (from Mini Chart PDF)
| Token | Hex | Usage |
|-------|-----|-------|
| Primary Teal | `#0e7470` | Logo, CTAs, links, badges, section accents |
| Secondary Teal | `#1a958b` | Hover states, gradient ends, teal accent |
| Dark Charcoal | `#3c3d3f` | Text, headings, logo wordmark |
| Medium Gray | `#808082` | Logo building element, subtle text |

**Official Gradients:**
- Teal: `#1a958b → #0e7470` (left to right)
- Charcoal: `#3c3d3f → #808082` (left to right)

> ⚠️ Color corrections needed in code: current `#0e736f` → `#0e7470`, `#1b948d` → `#1a958b`, `#3a3b3d` → `#3c3d3f`

---

### Fonts (from Mini Chart PDF)
| Font | Role | Status |
|------|------|--------|
| **Crassula** | Primary UI font (headings, nav, body) | ⚠️ NOT on system — need file |
| **Tahu** | Accent/tagline script font | ✅ Installed at `~/Library/Fonts/Tahu!.ttf` |

**Brand Tagline:** *"La où le rêve prend toit"* (in Tahu)

---

### Logo Variations (from Mini Chart PDF)
| Variation | Background | Usage |
|-----------|------------|-------|
| Horizontal — full color | White | Primary logo — header/nav |
| Vertical — full color | White | Standalone uses, footer |
| Vertical — reversed | Teal `#0e7470` | Dark backgrounds |
| Horizontal — outline | Teal `#0e7470` | Teal backgrounds, social media |

> Logo source: `/Users/macbookpro/Downloads/MINI CHART HAMADAT (1).pdf`  
> Needs extraction as PNG/SVG for web use.

---

## ✅ B. DESIGN REFERENCES

### Lagom Development (lagom-development.com) — Inspected
**What to borrow:**
- Full-viewport hero with large photo + text overlay bottom-left
- Minimal nav: logo | links | phone number | accent CTA button
- Warm off-white background (not pure white — closer to `#f5f0ea`)
- Staggered/offset image+text scroll sections with large animated typography
- Section counter numbers (001, 002…) for editorial hierarchy
- Generous whitespace between sections
- Floating phone/contact FAB (bottom-right corner)

### Range Developments (rangedevelopmentsgroup.com)
**Known patterns:** Clean, luxury real estate focus, strong project card grids, bold photography.

### Allys Mu (allys.mu/en/projects)
**What to borrow:** Clean project grid — each card shows name, location, type badge. Hover reveals CTA. No cluttered info.

### Oussama Promotion (oussamapromotion.com)
**What to borrow:** Algerian market-optimized layout, bilingual toggle visible in nav, phone number prominent, WhatsApp integration.

---

## ✅ C. PROJECT PHOTOS

All photos available in project subdirectories:

| Project | Photos | Location |
|---------|--------|----------|
| Elysia | 14 images (Vue 001–Nuit 3) | `/elysia/` |
| Les 3 Princes | 9 images (Vue 2–DRONE) | `/les-3-princes/` |
| Lumalac | 2 images | `/lumalac/` |
| Marmo | 3 images | `/marmo/` |
| Orea | 11 images (b1–test) | `/orea/` |
| Vertdalya | 3 images (includes cleaned render) | `/vertdalya/` |

---

## ✅ D. PROJECT DATA (CORRECTED)

> ⚠️ The existing codebase had significantly wrong unit counts and statuses. Use data below.

| Project | Location | Units | Typology | Status | Available |
|---------|----------|-------|----------|--------|-----------|
| Elysia | Jijel | 56 | F3 (96m², 110m²) | En cours | — |
| Les 3 Princes | Dely Brahim, Alger | 43 | F3–F6, Simplex + Duplex | Fini | — |
| Lumalac | Dely Brahim, Alger | 8 | 6×F3, 2×Triplex F7 | En cours | — |
| Marmo | Dely Brahim, Alger | 8 | 6×F3, 2×Duplex F6 | Livré | — |
| Orea | Dely Brahim, Alger | 38 | F3–F6 | En cours | 2 F3, 1 F4 (livraison 24 mois) |
| Vertdalya | Dely Brahim, Alger | 10 | Loft 270m² | Fini | Disponible |

**Total real units: 163** (not 450+ as stated in current code)

---

## ✅ E. CONTACT INFO (Standard — to be updated later)

| Field | Value |
|-------|-------|
| Email | contact@hamadat.dz |
| Phone | +213 21 XX XX XX |
| Address | Alger, Algérie |
| Social | TBD |

---

## ⚠️ ONE OPEN QUESTION BEFORE IMPLEMENTATION

**Crassula font file** — Crassula is the primary brand font but is NOT on the system and NOT on Google Fonts. Two options:

- **Option A:** You provide the Crassula `.ttf` / `.otf` file → I self-host it in the project (best fidelity to brand)
- **Option B:** Use **Nunito** (Google Fonts, free) as web substitute — very similar rounded geometric sans-serif that reads identically at normal font weights

Please confirm before I start.
