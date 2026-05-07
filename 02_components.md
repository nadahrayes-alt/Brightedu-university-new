# 02 — Components

Every reusable component for the Smart Campus Board. Each entry has: **anatomy → states → props → spec → usage rules**.

In Figma, build these as a single `Components` page with auto-layout and variants.

---

## C01 — Header bar

**Persistent. 100px tall. RTL canonical.**

### Anatomy (RTL — reading right to left)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [⌂ ⚆ ع/EN]    [date · time]                  [BrightEdu × KAU]     │
└──────────────────────────────────────────────────────────────────────┘
```

In RTL: brand logo on the **right**, controls on the **left**. (Mirror for LTR.)

### Slots
- **Brand block** (right in RTL): `BrightEdu` mark · vertical divider · `KAU` mark, height 56px, color `text/primary`.
- **Centered live block:** date + time, `body/sm` `text/secondary`. Hidden during private flows.
- **Controls cluster** (left in RTL): home, accessibility, language. Each 64×64.

### States
- `default` — full opacity, all controls visible.
- `in-session` — adds a thin 4px progress bar under the header showing session lifespan.
- `private-mode` — center block hides date/time, replaces with `🔒 وضع خاص` chip in `privacy/violet`.
- `error` — header stays neutral; error is shown in main stage, never here.

### Don'ts
- No notifications. No user avatar. No search.

---

## C02 — Footer bar

**Persistent. 80px tall.**

### Anatomy (RTL)

```
┌──────────────────────────────────────────────────────────────────────┐
│ [⌂ الرئيسية]      "خصوصيتك محمية — لن تظهر بياناتك على هذه الشاشة"   │
│                                              [مساعدة] [02:45 ▾]      │
└──────────────────────────────────────────────────────────────────────┘
```

### Slots
- Home button (left in RTL): pill, `radius/pill`, height 56, label `الرئيسية` + home icon.
- Privacy hint (center): `body/sm` `text/secondary`, single line.
- Help link + Session timer chip (right in RTL).

### Session timer chip
- Shows `mm:ss` of remaining session.
- Tap → opens timeout modal early (user can choose to end).

---

## C03 — Language switcher

### Anatomy
Pill segmented control, two segments: `عربي` | `English`. 56px tall, 200px wide.

### States
- `active` (selected): background `brand/primary`, text white.
- `inactive`: transparent, text `text/primary`, border `border/subtle`.
- `transitioning`: 240ms cross-fade as direction flips.

Tap **must** trigger a 240ms fade + RTL/LTR axis swap of the entire frame, not an instant flip.

---

## C04 — AI Assistant card (the centerpiece)

**Used on:** Welcome (compact) and Assistant screen (expanded).

### 4.1 Anatomy — compact (Welcome variant)

```
┌──────────────────────────────────────────────────────┐
│  ✨  مساعد الحرم الذكي                                │
│                                                      │
│  اسألني عن المباني، الخدمات، المواعيد،                 │
│  أو كيفية بدء طلب.                                    │
│                                                      │
│  ┌──────────────────────────────┐  [🎤]  [→ اسأل]   │
│  │  اكتب سؤالك هنا...            │                    │
│  └──────────────────────────────┘                    │
│                                                      │
│  مقترحات:  [وين شؤون الطلبة؟] [مواعيد المكتبة]        │
└──────────────────────────────────────────────────────┘
```

### 4.2 Anatomy — expanded (Assistant screen)

The card becomes a left/right two-pane layout (see screen S03/S04 spec) with conversation transcript above the input bar.

### Slots (compact)
- AI sparkle icon — 32px, `brand/primary`.
- Assistant name — `title/md`, `text/primary`.
- Prompt copy — `body/lg`, `text/secondary`, max 2 lines.
- Input field — `surface/sunken`, 72px tall, `radius/md`, placeholder `body/lg` `text/muted`.
- Voice button — circular 72×72, `brand/soft` bg, mic icon `brand/primary`.
- Send button — 72px tall, primary style.
- Suggestion chips — 56px, pill, `surface/raised` bg, tap fills the input.

### States
- `idle` — placeholder visible, suggestions visible.
- `typing` — user is composing; suggestions dim to 60%.
- `thinking` — assistant is processing; show 3-dot bounce in transcript.
- `responding` — answer renders progressively (no typewriter; reveal in chunks).
- `error` — inline soft message above input, never blocking.

---

## C05 — Message bubbles

Used inside the assistant transcript. **No avatars on the user side** (it's a public board — minimize personal cues).

### Variants

| Variant | Side (RTL) | Background | Text |
|---------|-----------|------------|------|
| `assistant.text` | right | `brand/soft` | `text/primary` |
| `assistant.rich` | right | `surface/raised` w/ embedded card | inherits |
| `user.text` | left | `surface/sunken` | `text/primary` |
| `system.privacy` | center | `privacy/violet-bg` border `privacy/violet` | `text/primary` |

### Rich assistant message can embed:
- **Map preview card** (mini, 320×180)
- **Service card** (mini variant)
- **QR suggestion card** (call-to-action only, not the actual QR)

Each rich bubble shows max **2 inline CTAs**. More → push to dedicated screen.

### Spec
- Max width: 720px. Padding 24px. Radius 24px (with 8px tail on the speaker side, optional — keep subtle).
- Min height 80px. `body/lg` text.

---

## C06 — Quick action button

Used on Welcome and as inline shortcuts.

### Anatomy

```
┌──────────────────────────┐
│   [icon 48px]            │
│                          │
│   شؤون الطلبة             │  ← title/sm
│   مبنى 4                  │  ← body/sm text/secondary
└──────────────────────────┘
```

### Spec
- 280×180. `surface/raised` bg. `border/subtle` 1px. `radius/lg`. `elevation/1`.
- Hover/press: lift to `elevation/2`, border becomes `brand/primary`.
- Selected (post-tap, before transition): bg → `brand/soft`.

### Variants
- `default`
- `with-status` — adds a status chip in top-left corner (RTL: top-right).
- `featured` (used for "Ask the assistant"): `brand/primary` bg, white text, sparkle icon.

---

## C07 — Service card

Used in directory grid and as detail summary.

### Anatomy

```
┌──────────────────────────────────────────────────────────┐
│  [icon 48]  شؤون الطلبة                  [● مفتوح]       │
│                                                          │
│  مبنى 4 — الدور الأرضي                                   │
│  ⏱ 8:00 ص — 3:00 م     👥 الانتظار: ١٢ دقيقة            │
│                                                          │
│              ┌────────────────────────┐                  │
│              │   عرض الموقع    →     │                  │
│              └────────────────────────┘                  │
└──────────────────────────────────────────────────────────┘
```

### Spec
- 580×220. `surface/canvas`. `border/subtle`. `radius/lg`. `elevation/1`.
- Title `title/sm`. Location `body/md` `text/secondary`. Meta row `body/sm`.

### Status chip variants (top-left in RTL)
| Status | Foreground | Background | Dot |
|--------|------------|-----------|-----|
| `مفتوح` (open) | `status/success` | `status/success-bg` | ● |
| `يغلق قريبًا` (closing soon) | `status/warning` | `status/warning-bg` | ● |
| `مغلق` (closed) | `text/secondary` | `surface/sunken` | ○ |
| `مزدحم` (busy) | `status/warning` | `status/warning-bg` | ⫶ |

### Queue badges (inside meta row)
- Low: `status/success` dot + `الانتظار: ٥ دقائق`
- Medium: `status/warning` dot + `الانتظار: ١٢ دقيقة`
- High: `status/error` foreground but **on neutral bg** (no red panic) + `الانتظار: ٢٥ دقيقة`

---

## C08 — Map route card

Used on Map screen as the side panel.

### Anatomy

```
┌──────────────────────────────────────────────────┐
│  [icon] الوجهة                                    │
│  شؤون الطلبة                            ← title/lg│
│  مبنى 4 — الدور الأرضي                            │
│  ─────────────────────────────────────────       │
│   🚶  ٦ دقائق مشي                                 │
│   📏  ٤٥٠ متر                                     │
│   🚪  أقرب بوابة: الشرقية                          │
│   👥  الانتظار: متوسط (١٢ د)                       │
│   ♿  مسار ميسر متاح                               │
│  ─────────────────────────────────────────       │
│  ┌──────────────────────────┐                    │
│  │     ابدأ التوجيه    →    │  ← primary         │
│  └──────────────────────────┘                    │
│  ┌──────────────────────────┐                    │
│  │     مسار ميسر  ♿         │  ← toggle         │
│  └──────────────────────────┘                    │
│         خدمات قريبة          ← tertiary link     │
└──────────────────────────────────────────────────┘
```

### Spec
- 480 wide × full main-stage height. `surface/raised`. `radius/lg`. `elevation/1`.
- Padding 32px.
- Each meta row 56px, icon 32px, separator dotted `border/subtle` between rows.

---

## C09 — Walking time badge

A small, reusable inline pill.

```
[🚶 ٦ دقائق مشي]
```

- 48px tall. `radius/pill`. `surface/raised`. `body/md` `text/primary`.
- Icon 24px on the leading side (right in RTL).

---

## C10 — Queue status badge

```
[● انتظار متوسط · ١٢ د]
```

States: `low` `med` `high` (see C07 status colors). Used standalone or inside C07/C08.

---

## C11 — QR continuation card

The single most important privacy moment. Treat it as a hero component.

### Anatomy

```
┌────────────────────────────────────────────────────────┐
│  🛡  أكمل من جوالك                          [🔒 خاص]   │
│                                                        │
│  لحماية خصوصيتك، لن نعرض أي بيانات                     │
│  شخصية على هذه الشاشة.                                 │
│                                                        │
│       ┌──────────────────────────┐                     │
│       │                          │                     │
│       │       [QR 320×320]       │                     │
│       │                          │                     │
│       └──────────────────────────┘                     │
│                                                        │
│         صلاحية الرمز:    04:32  ← timer/lg            │
│                                                        │
│  امسح الرمز خلال ٥ دقائق للمتابعة بأمان.                │
│                                                        │
│  [ إلغاء ]            [ إنشاء رمز جديد ]              │
└────────────────────────────────────────────────────────┘
```

### Spec
- 720×900. Centered. `surface/canvas` with **subtle `privacy/violet-bg` halo** (40px outer glow at 30%).
- Border `privacy/violet` 2px. `radius/xl` (32px). `elevation/3`.
- QR area: minimum 320×320px (board viewing distance demands this). White bg, 24px inner padding.
- Timer: `display/lg` 48px, monospace digits (`Latin numerals 04:32`), color shifts:
  - 5:00–1:00 → `text/primary`
  - 1:00–0:30 → `status/warning`
  - <0:30 → `privacy/violet` (NOT red — still privacy, not error)

### States

| State | Visual | Copy |
|-------|--------|------|
| `generated` | QR sharp, timer counting | "أكمل الطلب من جوالك" |
| `scanning` | QR dims 50%, ring spinner around it | "جارٍ التحقق من المسح..." |
| `success` | QR replaced by `status/success` ✓ in 320×320 area | "تم نقل الطلب إلى جوالك" |
| `expired` | QR overlaid with diagonal hash + violet wash | "انتهت صلاحية الرمز" |
| `failed` | QR replaced by `status/error` x icon | "تعذر إنشاء الرمز — حاول مرة أخرى" |

### Don'ts
- No red border. No skull. No "warning" iconography. This is a **service**, not an error.

---

## C12 — Sensitive data refusal card

Used when the assistant must refuse showing data publicly.

### Anatomy

```
┌──────────────────────────────────────────────────────┐
│             [🛡 64px privacy/violet]                  │
│                                                      │
│      لا يمكن عرض هذه البيانات على شاشة عامة          │
│                  ← display/lg, centered              │
│                                                      │
│   لحماية خصوصيتك، امسح رمز QR وكمل من جوالك          │
│             بعد التحقق.                               │
│                  ← body/lg text/secondary            │
│                                                      │
│       ┌──────────────────────────┐                   │
│       │      [QR 240×240]         │                   │
│       └──────────────────────────┘                   │
│                                                      │
│              [🔒 لا يظهر على شاشة عامة]               │  ← black-tier badge
│                                                      │
│  [ الرجوع للرئيسية ]      [ أكمل من الجوال ]         │
└──────────────────────────────────────────────────────┘
```

### Spec
- Card 880×880, centered. `surface/canvas`. Border `privacy/violet` 2px. `radius/xl`.
- Tone: **calm, protective, parental** — not blocking, not punishing.
- Smaller QR (240) than the dedicated QR screen — this is a *suggestion*, not the primary continuation. Tap "أكمل من الجوال" to expand to full QR continuation card.

---

## C13 — Privacy notice banner

Slim banner used in any screen that touches personal data.

```
┌──────────────────────────────────────────────────────┐
│  🛡  لن يتم عرض أي بيانات شخصية على هذه الشاشة.      │
└──────────────────────────────────────────────────────┘
```

- 56px tall. `privacy/violet-bg`. Border-left (RTL: border-right) 4px `privacy/violet`. `body/md`.
- Lives in the context band (zone/band, 80px) when active.

---

## C14 — Status chip (taxonomy)

A single component, multiple variants, dot + label.

| Token | Label AR | Label EN | Foreground | Background |
|-------|----------|----------|-----------|-----------|
| `chip/open` | مفتوح | Open | `status/success` | `status/success-bg` |
| `chip/closed` | مغلق | Closed | `text/secondary` | `surface/sunken` |
| `chip/closing` | يغلق قريبًا | Closing soon | `status/warning` | `status/warning-bg` |
| `chip/available` | متاح | Available | `status/success` | `status/success-bg` |
| `chip/needs-qr` | يحتاج QR | Needs phone | `privacy/violet` | `privacy/violet-bg` |
| `chip/public-safe` | عام وآمن | Public-safe | `status/success` | `status/success-bg` |
| `chip/private` | خاص | Private | `privacy/violet` | `privacy/violet-bg` |
| `chip/black-tier` | لا يظهر هنا | Phone only | `privacy/black` | `privacy/black-bg` |
| `chip/unavailable` | تعذر الخدمة | Unavailable | `status/error` | `status/error-bg` |

Spec: 48px tall, `radius/pill`, `badge` text. Always icon+label.

---

## C15 — Buttons

### Sizes
- `lg` — 72×min 240. Primary actions on board.
- `md` — 64×min 200. Secondary.
- `sm` — 56×min 160. Tertiary, footer.

### Variants

| Variant | Background | Text | Border | When |
|---------|-----------|------|--------|------|
| `primary` | `brand/primary` | white | none | Main action per screen — only ONE per stage |
| `secondary` | `surface/canvas` | `brand/primary` | 2px `brand/primary` | Alternatives |
| `tertiary` | transparent | `brand/primary` | none | Inline links, "تخطّي" |
| `privacy` | `privacy/violet` | white | none | "أكمل من الجوال", "امسح QR" |
| `cancel` | `surface/sunken` | `text/primary` | none | Cancel, back, dismiss |
| `danger` | `status/error` | white | none | Destructive only — basically unused on this board |
| `disabled` | `surface/sunken` | `text/muted` | none | Non-interactive |
| `loading` | inherits + spinner replaces label | - | - | Async waits |

### Spec
- `radius/md` (18px). `button/lg` text. Icon 24px on leading side (right in RTL).
- Pressed: scale 0.98, 120ms.
- Focus ring: 4px `brand/primary` outline + 2px white inset offset.

---

## C16 — Session timeout modal

```
┌────────────────────────────────────────────┐
│              [⏱ 64px]                      │
│                                            │
│      هل ما زلت تستخدم اللوحة؟              │
│         ← title/lg, centered               │
│                                            │
│   ستنتهي الجلسة خلال [ 20 ] ثانية          │
│              لحماية خصوصيتك.                │
│                                            │
│   ───── countdown ring (240ms tick) ────   │
│                                            │
│   [ إنهاء الجلسة ]      [ نعم، أكمل ]      │
│        ← cancel              ← primary     │
└────────────────────────────────────────────┘
```

- Modal 720×560, centered. Backdrop `text/primary` at 40% opacity.
- Countdown is a horizontal ring filling left-to-right (or RTL: right-to-left).
- **Auto-dismisses to Welcome** at 0 if no interaction. Any tap inside `نعم، أكمل` resets the session.

---

## C17 — Error / Service unavailable card

```
┌──────────────────────────────────────────┐
│        [ℹ 48 text/secondary]              │
│                                          │
│      تعذر إكمال الطلب الآن                │
│         ← title/md                       │
│                                          │
│   جرّب مرة أخرى أو توجه                   │
│   لأقرب مكتب خدمة.                        │
│         ← body/lg text/secondary         │
│                                          │
│  [ الرجوع للرئيسية ]  [ إعادة المحاولة ]  │
└──────────────────────────────────────────┘
```

- Card 640×480, `surface/raised`, `radius/lg`, `elevation/2`.
- Friendly icon — info/concerned, **not** alarm. No red unless it is a true system fault. Use neutral by default.

---

## C18 — Accessible-route toggle

A specialized toggle.

```
[ ♿  مسار ميسر ]   ⬜ → ✅
```

- Pill, 64px tall, 240px wide.
- Off: `surface/raised`, icon `text/secondary`.
- On: `brand/primary` bg, white text/icon, 4px focus ring.
- When toggled, the map route re-renders (480ms) showing accessible path; meta row updates time/distance.

---

## C19 — Map canvas

Stylized illustrated campus, NOT a real map tile.

### Spec
- Aspect: ~1.6:1, fills main stage minus side panel (~1280×820).
- Vector illustration, palette: `brand/campus` for buildings (8% fill, 1.5px stroke), `surface/sunken` ground, `text/secondary` labels.
- Buildings are simplified rectangles with rounded 12px corners and labels in `body/md`.
- Route: 6px stroke `brand/primary`, dashed during draw, solid after, with subtle glow.
- Endpoints:
  - Start (user): pulsing dot 24px in `brand/primary`, double-ring ambient pulse.
  - Destination: pin 48px in `privacy/violet` (or `brand/primary` for non-private destinations), with label flag.
- Accessible-route variant: route stroke becomes 6px `status/success` with small ♿ markers at elevators/ramps.

---

## C20 — Voice input mic state

For the assistant input.

| State | Icon | Color | Animation |
|-------|------|-------|-----------|
| `idle` | mic | `brand/primary` | none |
| `listening` | mic with ring | `brand/primary` | pulsing 1.6s loop, 3 expanding rings |
| `transcribing` | mic with spinner | `brand/primary` | spinner |
| `error` | mic-off | `text/secondary` | none, with inline tooltip "تعذر السماع" |

---

## C21 — AI tier badge

Compact, used inline in assistant answers and on service cards.

| Badge | AR label | Color | When |
|-------|----------|-------|------|
| Green tier | عام وآمن | `status/success` | FAQs, directions, hours |
| Yellow tier | يحتاج استكمال | `status/warning` | Document services that start here, finish on phone |
| Black tier | لا يظهر على شاشة عامة | `privacy/black` on `privacy/black-bg` | GPA, warnings, financial, exam locations |

Use sparingly — one badge per answer, not per sentence.

---

## C22 — Idle / attract mode (loop)

When the board has no user for >60s after returning to Welcome:

- Hero text gently animates (drift up/down 8px, 4s loop).
- A faint ambient ring pulses on the assistant card.
- "اقترب لتبدأ" (small) appears every 12s and fades.
- After 5min idle: switch to a clean clock + KAU branding screen with a single "اضغط للبدء" CTA.

---

## Component checklist for Figma

- [ ] All components built with **auto-layout**.
- [ ] All components have **RTL** and **LTR** variants (or use Figma's "Direction" handling).
- [ ] All states (`default`, `hover`, `pressed`, `focus`, `disabled`, `loading`) are real variants, not separate components.
- [ ] All text uses type styles, not hard-coded sizes.
- [ ] All colors are tokens, not hex.
- [ ] All icons are from the chosen library (Phosphor or Lucide), single weight.
