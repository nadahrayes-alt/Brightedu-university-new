# BrightEdu × KAU — Smart Campus Board (MVP)

A complete design specification for the public, large-screen interactive campus board.
Arabic-first · Touch-optimized · Public/Private safe · 1920 × 1080 landscape.

---

## How to read this spec

This folder mirrors a real Figma file structure. Each document maps directly to a page or section in Figma.

| File | Figma page | What's inside |
|------|------------|---------------|
| `00_README.md` | Cover | Vision, principles, demo storyline summary |
| `01_foundations.md` | 🎨 Foundations | Color, typography, spacing, grid, motion, accessibility tokens |
| `02_components.md` | 🧩 Components | Every reusable component with anatomy, states, props |
| `03_screens.md` | 🖥️ Screens | All 20 screens with wireframes, specs, copy, and behavior |
| `04_flow.md` | 🎬 Demo Flow | Connected prototype storyline for stakeholder demo |
| `05_copy_deck.md` | ✍️ Copy | Arabic (primary) + English (secondary) strings, by screen |

---

## Product in one sentence

> A calm, institutional, Arabic-first interactive board that answers public questions immediately and **moves anything private to the student's phone via QR**.

---

## North-star principles (decision filter)

When designing or reviewing any element, run it through these:

1. **Arabic-first, not translated.** RTL is the canonical layout. English is a toggle, not a parallel.
2. **Public screen ≠ private channel.** If a stranger could read it over the user's shoulder, it doesn't go on the board.
3. **Seconds to clarity.** A user 1.5m away should know what to tap within 3 seconds.
4. **Privacy as warmth, not warning.** A QR handoff is a service, not an error. No red, no shouting.
5. **Touch-grade, not mouse-grade.** 64px minimum hit target. 72px+ for primaries.
6. **Smart, but bounded.** The assistant guides; it never decides academic outcomes.

---

## What "done" looks like for this MVP

- 20 screens designed at 1920×1080, RTL-correct.
- 1 Mini design system (tokens + components) consumable by Figma libraries.
- 1 Connected prototype flow that demos the 16-step storyline below.
- 1 Arabic copy deck (verified phrasing, not Google-translated).
- Public-safe answers, private-handoff QR, sensitive refusal, and timeout — all visualized.

---

## Demo storyline (16 beats)

This is the connected story the prototype must tell:

1. Idle → **Welcome** screen with greeting + quick actions.
2. User taps **عربي** (already default, confirms language).
3. User opens **AI assistant**.
4. User asks: *"وين شؤون الطلبة؟"*
5. Assistant responds with location + walking time + suggested actions.
6. User taps **عرض الخريطة**.
7. **Map screen** shows route, 6 min walk, 450 m, queue: medium.
8. User taps **ابدأ التوجيه** → directional confirmation.
9. User returns to assistant, asks: *"أبغى أطلع وثيقة تخرج"*.
10. Assistant explains this requires private continuation.
11. **QR continuation screen** appears with 5:00 timer.
12. User scans → **QR Scanned Success** state.
13. User asks: *"أبغى أعرف معدلي"*.
14. **Sensitive Data Refusal** screen — calm, with QR option.
15. Inactivity → **Session Timeout Modal** with 20s countdown.
16. Returns to **Welcome** screen. Loop closed.

---

## Visual identity in one paragraph

A modern Saudi institutional product. Calm navy and trust-blue with generous whitespace, rounded 24–32px geometry, IBM Plex Sans Arabic at large display sizes, and a single accent for AI moments. Soft campus map abstraction in the background — never literal Google Maps. Privacy moments use a gentle violet, never red. The whole thing should feel like the university's *quiet competence* — premium, not flashy.

---

## What this board is NOT

- Not a chatbot stretched to a TV.
- Not a marketing landing page.
- Not a student mobile app on a big screen.
- Not an admin dashboard.
- Not a sci-fi AI demo.

It's a **service layer** — a self-service desk that happens to be a screen.
