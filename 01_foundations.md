# 01 — Foundations

Design tokens for the Smart Campus Board. Lift these directly into Figma variables / styles.

---

## 1. Color tokens

All values are hex. Pair as **token name → role** so semantics survive future restyling.

### 1.1 Brand & primary

| Token | Hex | Role |
|-------|-----|------|
| `brand/primary` | `#2F5BFF` | Primary actions, focused states, route lines |
| `brand/deep` | `#0F172A` | Headings on light, header bar |
| `brand/campus` | `#1E40AF` | Map fills, secondary brand, KAU accent |
| `brand/soft` | `#EEF4FF` | AI assistant surface, hover wash, selected chip bg |

### 1.2 Neutral / surface

| Token | Hex | Role |
|-------|-----|------|
| `surface/canvas` | `#FFFFFF` | Page background |
| `surface/raised` | `#F8FAFC` | Cards on canvas |
| `surface/sunken` | `#F1F5F9` | Input fields, inset rails |
| `border/subtle` | `#E2E8F0` | Card borders, dividers |
| `text/primary` | `#111827` | Body, headings |
| `text/secondary` | `#64748B` | Supporting text, metadata |
| `text/muted` | `#94A3B8` | Placeholder, disabled |

### 1.3 Status

| Token | Foreground | Background | Use |
|-------|------------|------------|-----|
| `status/success` | `#16A34A` | `#DCFCE7` | Open, low queue, available, scanned-OK |
| `status/warning` | `#F59E0B` | `#FEF3C7` | Closing soon, medium queue, QR expiring |
| `status/error` | `#DC2626` | `#FEE2E2` | True system errors only — NOT for privacy refusal |
| `status/info` | `#2563EB` | `#DBEAFE` | Neutral info banners |

### 1.4 Privacy (this is the special one)

| Token | Hex | Role |
|-------|-----|------|
| `privacy/violet` | `#6D5DF6` | QR continuation, "needs phone" tier |
| `privacy/violet-bg` | `#F1EFFF` | QR card surface, privacy banner |
| `privacy/black` | `#111827` | "Black tier — not on public screen" badge |
| `privacy/black-bg` | `#E5E7EB` | Black-tier badge surface |

> **Rule:** privacy ≠ error. Never use red for QR handoff or sensitive refusal. Violet = "we're protecting you."

### 1.5 Pairing rules

- Always pair color with **icon + text**. No color-only meaning (accessibility).
- Minimum contrast on the board: **AA Large** (3:1 for ≥24px / bold ≥18.66px) — but aim for AAA where feasible because users stand 1–2m back.

---

## 2. Typography

### 2.1 Fonts

- **Arabic:** IBM Plex Sans Arabic (weights: 400, 500, 600, 700)
- **English:** Inter (weights: 400, 500, 600, 700)
- Fallback: system Arabic / Helvetica Neue

### 2.2 Type scale (designed for 1.5m viewing)

| Token | Size | Line height | Weight | Use |
|-------|------|-------------|--------|-----|
| `display/hero` | 64px | 76px | 700 | Welcome headline only |
| `display/lg` | 48px | 60px | 700 | Page titles, large refusal |
| `title/lg` | 36px | 44px | 600 | Section titles, modal titles |
| `title/md` | 30px | 38px | 600 | Card titles |
| `title/sm` | 26px | 34px | 600 | Service card name |
| `body/lg` | 22px | 32px | 400 | Assistant responses, descriptions |
| `body/md` | 20px | 30px | 400 | Default body |
| `body/sm` | 18px | 26px | 400 | Captions, metadata |
| `button/lg` | 24px | 28px | 600 | Primary buttons |
| `button/md` | 20px | 24px | 600 | Secondary, chips |
| `badge` | 18px | 22px | 500 | Status chips, timer |

### 2.3 RTL/LTR rules

- Arabic frames: `direction: rtl`, paragraph alignment **start** (right).
- Numbers: keep **Hindi-Arabic numerals optional**; for the MVP, **use Eastern Arabic numerals (٠–٩) for times and queue counts** when in Arabic context — except for QR timer which remains Latin (00:00) for legibility.
- Mixed runs: bidi isolate building numbers (`مبنى 4` stays correct via `&lrm;`).
- English screens: `direction: ltr`, identical scale.

### 2.4 Reading rules

- Max line length: **65 Arabic characters** (~52 English).
- No body text under 18px on any screen.
- No more than **3 lines** of body copy in a single block — break with cards.

---

## 3. Spacing & layout

### 3.1 Base unit

`4px` base. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 120.

### 3.2 Canvas

- Frame: **1920 × 1080** (landscape, single board).
- Outer margin: **80px** left/right, **64px** top/bottom.
- Grid: **12 columns**, gutter **24px**, column width derived (~138px).
- Safe interaction zone: vertical 200–960 (top 200px header reserved, bottom 80px footer).

### 3.3 Radii

| Token | Value | Use |
|-------|-------|-----|
| `radius/sm` | 12px | Inputs, chips |
| `radius/md` | 18px | Buttons |
| `radius/lg` | 24px | Cards |
| `radius/xl` | 32px | Hero cards, QR card |
| `radius/pill` | 999px | Pill buttons, status chips |

### 3.4 Elevation (shadow)

- `elevation/0`: none — sunken surfaces.
- `elevation/1`: `0 2px 8px rgba(15,23,42,0.04)` — resting cards.
- `elevation/2`: `0 8px 24px rgba(15,23,42,0.08)` — hover/active cards.
- `elevation/3`: `0 16px 48px rgba(15,23,42,0.12)` — modals, QR card.

Keep shadows soft — institutional, not floaty.

### 3.5 Touch targets

| Element | Min height | Min width |
|---------|-----------|-----------|
| Primary button | 72px | 240px |
| Secondary button | 64px | 200px |
| Quick action card | 180px | 280px |
| Service card | 200px | 380px |
| Icon-only button | 64px | 64px |
| Chip | 56px | auto |

Spacing **between** touch targets: **min 16px** to prevent mis-taps.

---

## 4. Iconography

- **Style:** outlined, 2px stroke, rounded caps, 24×24 base grid.
- **Library:** Phosphor (Regular) or Lucide — single style throughout.
- **Sizes used on board:** 24, 32, 48, 64.
- **Color:** inherit from text token; status icons use status foreground.
- **No emoji** in production UI (except optionally on idle attract loop).

Required icon set:
`map-pin`, `arrow-right`, `arrow-left`, `home`, `globe`, `microphone`, `qr-code`, `lock`, `shield-check`, `clock`, `walking`, `wheelchair`, `building`, `cafeteria`, `book` (library), `medical-cross`, `chat-circle-dots`, `sparkle` (AI), `check-circle`, `x-circle`, `info-circle`, `warning-circle`.

---

## 5. Motion

### 5.1 Duration tokens

| Token | ms | Use |
|-------|-----|-----|
| `motion/fast` | 120 | Press feedback, hover |
| `motion/base` | 240 | Page transitions, card reveal |
| `motion/slow` | 480 | Map route draw, QR generate |
| `motion/ambient` | 2000+ | Idle attract loop, typing dots |

### 5.2 Easing

- `ease/standard`: `cubic-bezier(0.2, 0, 0, 1)` — default.
- `ease/decelerate`: `cubic-bezier(0, 0, 0, 1)` — entrances.
- `ease/accelerate`: `cubic-bezier(0.3, 0, 1, 1)` — exits.

### 5.3 Choreography

- Welcome: hero text fades + drifts up 12px, then quick actions stagger in (60ms each).
- Assistant typing: three-dot bounce, 1.4s loop.
- Route draw: SVG stroke-dashoffset 0→full over 480ms.
- QR appear: scale 0.96→1.0 + opacity 0→1, 240ms.
- Timer: countdown ring fills smoothly, snap red-violet at <30s **only** for QR (not for refusal).
- Language flip: 240ms cross-fade + RTL/LTR axis swap; never instant.

### 5.4 Banned motion

- Bounce on errors. Flashing. Parallax on map. Auto-rotating carousels. Anything >800ms for utility transitions.

---

## 6. Accessibility (board-specific)

- **Contrast:** all text ≥ 4.5:1 vs background; ≥3:1 for ≥24px.
- **Focus ring:** 4px `brand/primary` outline + 2px white inset offset, on every interactive element.
- **Reach:** primary CTAs anchored bottom 280–960px from floor (assume 1.0m–1.4m board base height + screen).
- **Wheelchair user reach zone:** keep critical CTAs **below the vertical midline** (Y > 540) so a seated user can reach.
- **No gesture-only actions** — every swipe/scroll must have a button equivalent.
- **Voice input** is optional addition; never the only path.
- **Audio cues** must always have visual equivalents.
- **Timeout warning** must precede actual timeout by 20s (covered in component spec).
- **Accessible-route toggle** persists for the session.

---

## 7. Layout zones (the board's anatomy)

```
┌────────────────────────────────────────────────────────────────────┐ 0
│  HEADER (h: 100, bg: surface/canvas, border-bottom: subtle)        │
│  [logo KAU × BrightEdu]      [date · time]      [🌐 ع/EN] [♿] [⌂]│
├────────────────────────────────────────────────────────────────────┤ 100
│                                                                    │
│  CONTEXT BAND (h: 80, optional)                                    │
│  Privacy banner OR breadcrumbs OR "live" status                    │
├────────────────────────────────────────────────────────────────────┤ 180
│                                                                    │
│                                                                    │
│  MAIN STAGE (h: 820)                                               │
│  Two-pane (8 col primary / 4 col context) or 12-col grid           │
│                                                                    │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤ 1000
│  FOOTER (h: 80)                                                    │
│  [⌂ الرئيسية]   privacy hint   [help]   [session: 02:45 ▾]        │
└────────────────────────────────────────────────────────────────────┘ 1080
```

Zone tokens:
- `zone/header` — 100px tall, always visible.
- `zone/band` — 80px optional secondary band.
- `zone/main` — 820–900px tall, the work area.
- `zone/footer` — 80px, persistent navigation.

---

## 8. Background treatment

- **Default canvas:** `surface/canvas` (#FFFFFF).
- **Welcome / hero:** subtle abstract campus-map line pattern at 4% opacity, top-aligned, monochrome navy.
- **Privacy moments (QR, refusal):** soft `privacy/violet-bg` wash on the active card only — never on the whole canvas.
- **Map screen:** stylized campus illustration (vector, low-detail), NOT a satellite image.

No gradients on buttons. One subtle gradient max on the welcome hero (navy → deep navy, 0–10% opacity wash).
