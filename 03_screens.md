# 03 — Screens

All 20 screens for the MVP. Each entry has: **purpose → wireframe (RTL) → spec → copy → behavior → next-states**.

Frame size: **1920 × 1080**. Direction: RTL by default.

Section organization (mirrors the Figma sections requested):
- 01 Welcome — S01, S02
- 02 Assistant — S03, S04, S05
- 03 Wayfinding — S08, S09, S10
- 04 Services — S06, S07, S11
- 05 Private Continuation — S12, S13, S14, S15
- 06 Safety & Errors — S16, S17, S18, S19, S20

---

# Section 01 — Welcome

## S01 · Main Welcome Screen

**Purpose:** First impression. In <3 seconds, the user knows: where they are, what this is for, and what to tap.

### Wireframe (RTL — read right to left)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [⌂] [♿] [عربي|English]      ١٤ شعبان · ٠٢:٤٥ م       BrightEdu × KAU│ ← header
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                                                                      │
│   أهلًا بك في الحرم الجامعي                                            │ ← display/hero
│   كيف أقدر أساعدك اليوم؟                                              │ ← display/lg text/secondary
│                                                                      │
│   اسأل المساعد الذكي أو اختر خدمة سريعة.                               │ ← body/lg
│                                                                      │
│   ┌────────────────────────────────────────────────────────────┐     │
│   │  ✨  مساعد الحرم الذكي                                      │     │ ← C04 compact
│   │                                                            │     │
│   │  ┌─────────────────────────┐ [🎤]      [→ اسأل]            │     │
│   │  │ اكتب سؤالك هنا...        │                               │     │
│   │  └─────────────────────────┘                               │     │
│   │  مقترحات: [وين شؤون الطلبة؟] [مواعيد المكتبة]                │     │
│   └────────────────────────────────────────────────────────────┘     │
│                                                                      │
│   خدمات سريعة                                                        │ ← title/md
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│   │ 🧭      │ │ 🏢      │ │ ⏰      │ │ 📄      │ │ 🗺️      │       │ ← C06 quick actions
│   │ أين     │ │ شؤون    │ │ مواعيد   │ │ استلام   │ │ الخريطة │       │
│   │ أذهب؟   │ │ الطلبة  │ │ الخدمات  │ │ الوثائق  │ │         │       │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ [⌂ الرئيسية]   اللوحة عامة — البيانات الخاصة تتم عبر الجوال [مساعدة]│ ← footer
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- Hero block top: starts at Y=240, max width 1280, anchored to safe-zone center.
- Assistant card: 1280×280 (full-width on 12-col with 80px margins).
- Quick actions row: 5 cards × 280, gap 24, total 1496 — fits within margins.
- Background: subtle navy line-pattern (campus map abstraction) at 4% opacity, top-aligned.
- Idle attract motion: hero text drift 8px every 4s.

### Copy

| Slot | Arabic | English (when toggled) |
|------|--------|-------------------------|
| Hero | أهلًا بك في الحرم الجامعي | Welcome to the Smart Campus |
| Subtitle | كيف أقدر أساعدك اليوم؟ | How can I help you today? |
| Helper | اسأل المساعد الذكي أو اختر خدمة سريعة. | Ask the assistant or pick a quick action. |
| Section title | خدمات سريعة | Quick services |
| Footer | اللوحة عامة — البيانات الخاصة تتم عبر الجوال | Public board — private requests continue on phone |

### Quick action set (5)
1. أين أذهب؟ — wayfinding entry → S08
2. شؤون الطلبة — service detail → S07
3. مواعيد الخدمات — hours overview → S11
4. استلام الوثائق — document pickup → S07 (variant)
5. الخريطة — directory map → S08

### Behavior
- Tap assistant input → S03 with focus on input.
- Tap any suggestion chip → S04 with that question pre-asked.
- Tap any quick action → corresponding screen.
- No interaction for 60s → C22 idle attract motion intensifies.
- No interaction for 5min → switches to ambient clock screen.

### Next states
- S03 (Assistant), S07 (Service detail), S08 (Map), S11 (Hours)

---

## S02 · Language Selection (modal-on-Welcome)

**Purpose:** Lightweight overlay to confirm/switch language. Not a full screen — invoked only when user taps the language switcher.

### Wireframe

```
                           ┌─────────────────────────────┐
                           │       اختر اللغة              │
                           │       Choose language        │
                           │                              │
                           │   [  🇸🇦  عربي         ✓  ]  │
                           │   [  🇬🇧  English          ]  │
                           │                              │
                           │          [ تم ]              │
                           └─────────────────────────────┘
```

### Spec
- Modal 560×400, centered, backdrop 40% navy.
- Two large pill rows, 88px tall each, with check on selected.
- Selecting → 240ms cross-fade + RTL/LTR swap of underlying frame.

### Behavior
- Selection persists for the session only — resets to Arabic on session end.

---

# Section 02 — Assistant

## S03 · AI Assistant — Main / Empty

**Purpose:** Full conversational stage. User has chosen to talk to the assistant.

### Wireframe (RTL)

```
┌──────────────────────────────────────────────────────────────────────┐
│ [⌂] [♿] [ع|EN]    مساعد الحرم الذكي           BrightEdu × KAU       │ ← header (title shown center)
├──────────────────────────────────────────────────────────────────────┤
│  🛡  لن يتم عرض أي بيانات شخصية على هذه الشاشة.                     │ ← C13 privacy banner
├──────────────────────────────────────────────────────────────────┬───┤
│                                                                  │   │
│   [✨ 64]  مساعد الحرم الذكي                                      │ مقترحات │
│   كيف أقدر أساعدك؟                                                │   │
│   اسألني عن المباني، الخدمات، المواعيد، أو كيفية بدء طلب.          │ [وين شؤون الطلبة؟] │
│                                                                  │   │
│   (transcript area — empty here, scrollable when filled)         │ [مواعيد المكتبة] │
│                                                                  │   │
│                                                                  │ [استلام إثبات قيد] │
│                                                                  │   │
│                                                                  │ [أقرب كافتيريا] │
│                                                                  │   │
│                                                                  │ [البوابة الرئيسية] │
├──────────────────────────────────────────────────────────────────┴───┤
│  ┌────────────────────────────────────────────────┐  [🎤]  [→ إرسال]│ ← input bar
│  │ اكتب سؤالك أو اضغط للتحدث...                    │                  │
│  └────────────────────────────────────────────────┘                  │
├──────────────────────────────────────────────────────────────────────┤
│ [⌂ الرئيسية]   خصوصيتك محمية      [مساعدة] [02:45 ▾]                │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- 8-col main + 4-col side panel (suggestions). Gap 32px.
- Suggestion panel: `surface/raised`, sticky, scrollable list of 5–7 chips.
- Input bar: 96px tall, anchored above footer. Field 72px, mic 72×72, send 72×min 200.

### Copy
- Heading: `مساعد الحرم الذكي`
- Greeting: `كيف أقدر أساعدك؟`
- Subtitle: `اسألني عن المباني، الخدمات، المواعيد، أو كيفية بدء طلب.`
- Placeholder: `اكتب سؤالك أو اضغط للتحدث...`
- Sidebar title: `مقترحات شائعة`

### Behavior
- On entry: assistant greeting fades in (240ms), suggestions stagger in (60ms each).
- Tap mic → C20 listening state.
- Tap suggestion → fills input + auto-sends → S04.

---

## S04 · Assistant — Question + Answer (wayfinding example)

**Purpose:** Show how an assistant exchange renders, with a rich answer card.

### Wireframe (the exchange: "وين شؤون الطلبة؟")

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
├──────────────────────────────────────────────────────────────────────┤
│ 🛡 privacy banner                                                    │
├──────────────────────────────────────────────────────────────────┬───┤
│                                                                  │   │
│                            ┌──────────────────────────┐         │ … │
│                            │ وين شؤون الطلبة؟          │  ← user │   │
│                            └──────────────────────────┘         │   │
│                                                                  │   │
│  ┌────────────────────────────────────────────┐                  │   │
│  │ ✨ مساعد الحرم  · [عام وآمن]                │                  │   │
│  │ شؤون الطلبة موجودة في مبنى رقم ٤.            │                  │   │
│  │ تبعد عنك تقريبًا ٦ دقائق مشي.                 │                  │   │
│  │                                              │                  │   │
│  │ ┌──────────────────────────────────────┐    │                  │   │
│  │ │ [mini-map preview 320×180]            │    │                  │   │
│  │ │ شؤون الطلبة · مبنى ٤                  │    │                  │   │
│  │ │ ٦ دقائق · ٤٥٠ م · انتظار متوسط         │    │                  │   │
│  │ └──────────────────────────────────────┘    │                  │   │
│  │                                              │                  │   │
│  │ [ عرض المسار → ] [ خدمات شؤون الطلبة ]      │                  │   │
│  └────────────────────────────────────────────┘                  │   │
│                                                                  │   │
├──────────────────────────────────────────────────────────────────┴───┤
│  Input bar                                                           │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- Assistant bubble max width 720, embedded mini map card 640×220.
- Tier badge `عام وآمن` in green chip, top-right of bubble (RTL).
- Two CTAs side-by-side, 64px tall each.

### Copy
- User: `وين شؤون الطلبة؟`
- Assistant: `شؤون الطلبة موجودة في مبنى رقم ٤. تبعد عنك تقريبًا ٦ دقائق مشي. أقدر أعرض لك المسار على الخريطة.`
- CTAs: `عرض المسار →` · `خدمات شؤون الطلبة` · `الرجوع للرئيسية` (tertiary)

### Behavior
- "عرض المسار" → S08 (full map).
- "خدمات شؤون الطلبة" → S07 (service detail).

---

## S05 · Quick Actions Screen

**Purpose:** Standalone screen reached when user taps "الخدمات" or "أين أذهب؟" — full grid of quick actions with categories.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
├──────────────────────────────────────────────────────────────────────┤
│ كيف أقدر أساعدك؟                            [بحث 🔍 اكتب اسم خدمة] │ ← title/lg
├──────────────────────────────────────────────────────────────────────┤
│  [الكل] [خدمات الطلاب] [المرافق] [الوثائق] [الدعم] [الطوارئ]        │ ← category chips
├──────────────────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                        │
│  │ شؤون   │ │ القبول │ │ الوثائق │ │ الدعم  │                        │
│  │ الطلبة │ │ والتسجيل│ │ نقطة ٣  │ │ التقني │                        │ ← C06 cards (5×4 grid possible)
│  └────────┘ └────────┘ └────────┘ └────────┘                        │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                        │
│  │ المكتبة │ │ الكافتر│ │ العيادة │ │ الأنشطة│                        │
│  └────────┘ └────────┘ └────────┘ └────────┘                        │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- 4-column card grid, gap 24px. Each card 360×220 (wider than welcome quick actions).
- Category chips: 56px tall, scrollable horizontally if overflow.

---

# Section 03 — Wayfinding

## S08 · Map & Route Screen

**Purpose:** Show route from current location to destination with all wayfinding meta.

### Wireframe (RTL — note map is on the LEFT, side panel on the RIGHT, because RTL puts the "primary content" on the right and supporting on the left, BUT for maps a strong convention is map on one side, panel on the other — we'll keep panel on the **right** so it reads first in RTL)

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
├──────────────────────────────────────────────────────────────────────┤
│  المسار إلى شؤون الطلبة                                              │ ← title/lg
├──────────────────────────────────────────────────────────────┬───────┤
│                                                              │       │
│                                                              │  📍   │
│           [ stylized illustrated campus map ]                │ الوجهة│
│                                                              │ شؤون  │
│                  ●─────────────●●●●●●●●●● 📍                 │ الطلبة│
│                  أنت هنا       (route line, animated)        │ مبنى ٤│
│                                                              │       │
│           [building blocks, labels, route]                   │ ─────│
│                                                              │ 🚶 ٦ د│
│                                                              │ 📏 ٤٥٠م│
│                                                              │ 🚪 شرقية│
│                                                              │ 👥 متوسط│
│                                                              │ ♿ متاح │
│                                                              │ ─────│
│                                                              │ [ابدأ │
│                                                              │ التوجيه│
│                                                              │ →]    │
│                                                              │       │
│                                                              │ [♿ مسار│
│                                                              │ ميسر] │
│                                                              │       │
│                                                              │ خدمات │
│                                                              │ قريبة │
├──────────────────────────────────────────────────────────────┴───────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- Map area: ~1280×820. Side panel C08 480 wide.
- Route draws on entry: 480ms stroke animation, dashed → solid.
- Pulsing "you are here" dot at start. Pin at destination.

### Copy
- Title: `المسار إلى {destination}`
- Time: `٦ دقائق مشي` (Eastern Arabic numerals; English variant: `6 min walk`)
- Distance: `٤٥٠ متر`
- Entrance: `أقرب بوابة: الشرقية`
- Queue: `الانتظار الحالي: متوسط (١٢ د)`
- Accessible: `مسار ميسر متاح`
- Primary CTA: `ابدأ التوجيه`
- Secondary: `مسار ميسر ♿`
- Tertiary: `خدمات قريبة`

### Behavior
- Tap "ابدأ التوجيه" → directional confirmation overlay (briefly, 1.5s) showing `توجه نحو البوابة الشرقية` with arrow, then back to map.
- Tap "مسار ميسر" → S09 (map re-renders with accessible route).
- Tap "خدمات قريبة" → small list overlay of nearby services within 3 min walk.

---

## S09 · Accessible Route Variant

**Purpose:** Same as S08 with the accessible route active.

### Differences from S08
- Route stroke: 6px `status/success`.
- Small ♿ markers at elevators/ramps along the route.
- Side panel time updates: `٨ دقائق مشي` (slightly longer).
- Toggle pill becomes ON state (`brand/primary` bg).
- New side note (under meta): `يتضمن المصعد في مبنى ٢ ومنحدر مبنى ٤`.

---

## S10 · Queue / Waiting Status Screen

**Purpose:** Live status of a service's queue. Reachable from a service detail or from "كم طول الانتظار؟" assistant query.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
├──────────────────────────────────────────────────────────────────────┤
│  حالة الانتظار — شؤون الطلبة                                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌────────────────────────────────────────────┐                     │
│   │     ●●●●●●●●●●●●●●●●○○○○○                  │ ← queue visual (12/20)│
│   │       الانتظار الحالي: متوسط                │                     │
│   │       متوسط الانتظار: ١٢ دقيقة              │                     │
│   │       آخر تحديث: قبل دقيقة                  │                     │
│   └────────────────────────────────────────────┘                     │
│                                                                      │
│   نصيحة:                                                             │
│   ذروة الانتظار عادةً بين ١١ ص و ١ م. الفترة الأهدأ بعد ٢ م.            │
│                                                                      │
│   [ عرض الموقع ]   [ خدمات بديلة ]   [ الرجوع ]                     │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- Queue visualization: 20 dots, filled = waiting, empty = capacity.
- Live tag with last-updated timestamp.

---

# Section 04 — Services

## S06 · Campus Services Directory

**Purpose:** Browse all services as cards.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
├──────────────────────────────────────────────────────────────────────┤
│  دليل خدمات الحرم                          [بحث 🔍]                  │
├──────────────────────────────────────────────────────────────────────┤
│  [الكل] [خدمات الطلاب] [المرافق] [الوثائق] [الدعم] [الطوارئ]         │
├──────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐  │
│  │ 🏢 شؤون الطلبة      [● مفتوح]│ │ 📚 المكتبة         [● مفتوح] │  │
│  │ مبنى ٤ — الدور الأرضي         │ │ مبنى ٢                       │  │
│  │ ⏱ ٨:٠٠ ص — ٣:٠٠ م            │ │ ⏱ ٨:٠٠ ص — ٨:٠٠ م           │  │ ← C07 service cards
│  │ 👥 الانتظار: ١٢ د             │ │ 👥 الانتظار: ٥ د             │  │
│  │              [عرض الموقع →]   │ │              [عرض الموقع →]  │  │
│  └──────────────────────────────┘ └──────────────────────────────┘  │
│  ┌──────────────────────────────┐ ┌──────────────────────────────┐  │
│  │ 📄 نقطة استلام    [● مفتوح]   │ │ ☕ الكافتيريا       [● مفتوح] │  │
│  │ الوثائق — مبنى ٤ شباك ٣      │ │ مبنى الخدمات الطلابية         │  │
│  │ ⏱ ٩:٠٠ ص — ٢:٠٠ م            │ │ ⏱ ٧:٣٠ ص — ٦:٠٠ م           │  │
│  │ 👥 الانتظار: ٥ د              │ │                              │  │
│  └──────────────────────────────┘ └──────────────────────────────┘  │
│  (3 rows × 2 cols visible at once, scrollable vertically if needed) │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- 2-column grid (cards are large for board legibility). Gap 24.
- Card → tap → S07 (detail).
- Search field is large (72px tall).

### Service set (8 cards minimum for demo)
1. شؤون الطلبة — مبنى 4 — مفتوح — ١٢ د
2. القبول والتسجيل — مبنى 1 — مفتوح — ٢٥ د (high)
3. نقطة استلام الوثائق — مبنى 4 شباك 3 — مفتوح — ٥ د
4. المكتبة — مبنى 2 — مفتوح — ٥ د
5. الكافتيريا — مبنى الخدمات — مفتوح
6. الدعم التقني — مبنى 3 — مفتوح — ١٠ د
7. العيادة الجامعية — مبنى 6 — مفتوح
8. مركز الأنشطة — مبنى 5 — يغلق قريبًا

---

## S07 · Service Details

**Purpose:** Deep view of a single service.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
├──────────────────────────────────────────────────────────────────────┤
│ 🏢 شؤون الطلبة                                       [● مفتوح]      │ ← title/lg + chip
├──────────────────────────────────────────────────────┬───────────────┤
│                                                      │               │
│   الموقع: مبنى ٤ — الدور الأرضي                       │  [mini-map    │
│                                                      │   preview     │
│   ⏱ ساعات العمل: ٨:٠٠ ص — ٣:٠٠ م                     │   320×320]    │
│   👥 الانتظار: متوسط (١٢ دقيقة)                       │               │
│   🚶 ٦ دقائق مشي · ٤٥٠ متر                            │  [ عرض على    │
│                                                      │   الخريطة → ] │
│                                                      │               │
│   الخدمات المتاحة هنا:                                │               │
│   • إثبات قيد           [يحتاج استكمال على الجوال]    │               │
│   • وثيقة تخرج          [خاص — جوال فقط]              │               │
│   • تعديل بيانات        [يحتاج استكمال على الجوال]    │               │
│   • استشارة عامة        [عام وآمن]                    │               │
│                                                      │               │
│   [ ابدأ طلبًا ]   [ عرض الخريطة ]   [ الرجوع ]      │               │
│                                                      │               │
├──────────────────────────────────────────────────────┴───────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- 8-col main + 4-col map preview side. The map preview is interactive on tap → S08.
- Each available service has a tier badge (C21).

### Behavior
- Tap a service item that's "خاص" → S12 (start request, leading to QR).
- Tap a service item that's "عام وآمن" → can be answered inline (open assistant).

---

## S11 · Service Hours Answer

**Purpose:** A focused answer screen shown when the user asks "متى تفتح X؟"

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ☕  الكافتيريا مفتوحة الآن                          [● مفتوح]       │ ← display/lg
│                                                                      │
│   ساعات العمل: ٧:٣٠ ص — ٦:٠٠ م                                       │
│   تقع بالقرب من مبنى الخدمات الطلابية                                 │
│   تبعد عنك ٤ دقائق مشي                                                │
│                                                                      │
│   ┌──────────────────────────────────────────┐                       │
│   │   اليوم  ٧:٣٠ ص ━━━━━━━━━━━━━━━━━━ ٦:٠٠ م│                       │
│   │              ▲ الآن ٢:٤٥ م                │ ← timeline of hours  │
│   └──────────────────────────────────────────┘                       │
│                                                                      │
│   [ عرض الموقع → ]   [ خدمات قريبة ]   [ الرجوع ]                   │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

---

# Section 05 — Private Continuation

## S12 · Start Service Request

**Purpose:** User has chosen a service that needs private continuation. Explain it. Hand off via QR.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
├──────────────────────────────────────────────────────────────────────┤
│  🛡  لن يتم عرض أي بيانات شخصية على هذه الشاشة.                     │ ← C13
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   📄  وثيقة تخرج                          [🔒 خاص — جوال فقط]        │
│                                                                      │
│   لإكمال طلب وثيقة التخرج، نحتاج التحقق من هويتك.                     │
│   لحماية خصوصيتك، التفاصيل تظهر فقط على جوالك.                       │
│                                                                      │
│   ما الذي يحدث بعد المسح؟                                            │
│   • التحقق من الهوية عبر النفاذ الموحد.                              │
│   • مراجعة الطلب من جوالك.                                          │
│   • إشعار عند جاهزية الوثيقة.                                        │
│                                                                      │
│   [ متابعة عبر QR → ]    [ الرجوع ]                                 │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- Centered content block, max width 1280.
- Tier badge inline with title.
- Steps as a clean numbered/bulleted list, `body/lg`, generous line-height.

### Behavior
- Tap "متابعة عبر QR" → S13.

---

## S13 · QR Private Continuation

**Purpose:** The handoff. The board generates a QR with a 5:00 expiry.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER (private-mode variant: 🔒 وضع خاص chip in center)             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│         ┌────────────────────────────────────────────┐              │
│         │  🛡  أكمل من جوالك              [🔒 خاص]   │              │
│         │                                            │              │
│         │  لحماية خصوصيتك، لن نعرض أي بيانات          │              │
│         │  شخصية على هذه الشاشة.                      │              │
│         │                                            │              │
│         │     ┌──────────────────────┐               │              │
│         │     │                      │               │              │
│         │     │     [ QR 320×320 ]   │               │  ← C11        │
│         │     │                      │               │              │
│         │     └──────────────────────┘               │              │
│         │                                            │              │
│         │      صلاحية الرمز:    04:32                │              │
│         │                                            │              │
│         │  امسح الرمز خلال ٥ دقائق للمتابعة بأمان.     │              │
│         │                                            │              │
│         │  [ إلغاء ]      [ إنشاء رمز جديد ]          │              │
│         └────────────────────────────────────────────┘              │
│                                                                      │
│              بعد المسح، ستتابع الطلب من جوالك بأمان.                  │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- C11 component centered, 720×900.
- Subtle violet halo on the card. Background canvas stays white.
- Timer counts down per second, color shifts at thresholds (see C11).

### Behavior
- 5:00 → 0:00 countdown.
- On scan (simulated trigger for demo): → S14.
- On expiry: → S15.
- "إلغاء" → returns to S07 or S03.

---

## S14 · QR Scanned Success

**Purpose:** Confirm handoff worked.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER (private-mode)                                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│              ┌──────────────────────────┐                            │
│              │                          │                            │
│              │    [✓ 120 success/green] │                            │
│              │                          │                            │
│              └──────────────────────────┘                            │
│                                                                      │
│              تم نقل الطلب إلى جوالك                                   │ ← display/lg
│                                                                      │
│           يمكنك الآن متابعة الخطوات هناك بأمان.                       │
│                                                                      │
│           ستعود اللوحة إلى الشاشة الرئيسية خلال ٥ ثوانٍ.                │
│                                                                      │
│              [ العودة الآن ]                                          │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- Centered hero with success check (large 120px, `status/success` on white).
- Optional micro-animation: check draws in (240ms), card scales 0.96→1.0.
- Auto-return to S01 after 5s.

---

## S15 · QR Expired

**Purpose:** Soft, non-alarming expiry state.

### Wireframe

Same layout as S13, but:
- QR is overlaid with diagonal hash + 40% violet wash.
- Title: `انتهت صلاحية الرمز`
- Body: `لحماية خصوصيتك، تنتهي الرموز تلقائيًا. أنشئ رمزًا جديدًا للمتابعة.`
- Primary CTA changes to: `إنشاء رمز جديد`
- Secondary: `الرجوع`

**No red. No "expired" stamp shouting at the user.** Tone stays calm.

---

# Section 06 — Safety & Errors

## S16 · Sensitive Data Refusal

**Purpose:** User asked for GPA / warnings / financial / exam location / private advisor message. The board refuses on screen and offers QR continuation.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER (private-mode)                                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│       ┌────────────────────────────────────────────┐                │
│       │             [🛡 96 privacy/violet]          │                │
│       │                                            │                │
│       │   لا يمكن عرض هذه البيانات على شاشة عامة    │ ← display/lg   │
│       │                                            │                │
│       │   لحماية خصوصيتك، امسح رمز QR وكمل من        │                │
│       │   جوالك بعد التحقق.                          │                │
│       │                                            │                │
│       │   البيانات الأكاديمية والشخصية تظهر فقط      │                │
│       │   في قناة خاصة وآمنة.                       │                │
│       │                                            │                │
│       │      ┌──────────────────┐                  │                │
│       │      │  [ QR 240×240 ]  │                  │                │
│       │      └──────────────────┘                  │                │
│       │                                            │                │
│       │   [🔒 لا يظهر على شاشة عامة]                │ ← black-tier   │
│       │                                            │                │
│       │  [ الرجوع للرئيسية ]   [ أكمل من الجوال ]   │                │
│       └────────────────────────────────────────────┘                │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- C12 component, 880×880, centered.
- Violet halo. NO red. NO error iconography.
- Black-tier badge near bottom.
- Small QR (240) — this is a *suggestion*; tapping `أكمل من الجوال` opens full S13.

### Trigger queries (record these for the demo and for QA)
- `أبغى أعرف معدلي` (GPA)
- `وين اختباري؟` (exam location)
- `هل عندي إنذار أكاديمي؟` (academic warning)
- `أبغى أشوف تفاصيل حالتي المالية` (financial)
- `أبغى أشوف رسالة المرشد` (advisor message)
- `وريني وثيقتي` (document preview)

---

## S17 · Error / Service Unavailable

**Purpose:** Graceful failure state.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER                                                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│              ┌────────────────────────────────────┐                  │
│              │          [ℹ 64]                    │                  │
│              │                                    │                  │
│              │   تعذر إكمال الطلب الآن              │                  │
│              │                                    │                  │
│              │   جرّب مرة أخرى أو توجه               │                  │
│              │   لأقرب مكتب خدمة.                  │                  │
│              │                                    │                  │
│              │   [أقرب مكتب: شؤون الطلبة — مبنى ٤] │                  │
│              │                                    │                  │
│              │  [ الرجوع ] [ إعادة المحاولة ]      │                  │
│              └────────────────────────────────────┘                  │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Variants
- `map-unavailable` — same layout, copy: `تعذر تحميل الخريطة الآن`.
- `service-data-unavailable` — copy: `تعذر تحديث حالة الخدمة`.
- `qr-failed` — copy: `تعذر إنشاء الرمز`. (Uses violet, not error red.)
- `assistant-unsure` — copy: `لم أفهم سؤالك تمامًا — جرّب صياغة أخرى أو اختر من المقترحات.`

### Spec
- Friendly icon (info, not alarm). Neutral colors. No red unless true system fault.

---

## S18 · Session Timeout Modal

**Purpose:** Warn before ending a session for privacy.

### Wireframe

Modal C16, overlaid on whatever screen is currently active.

```
                  ┌────────────────────────────────────────────┐
                  │              [⏱ 64]                         │
                  │                                            │
                  │      هل ما زلت تستخدم اللوحة؟              │
                  │                                            │
                  │   ستنتهي الجلسة خلال [ 20 ] ثانية           │
                  │             لحماية خصوصيتك.                │
                  │                                            │
                  │  ──────── countdown ring ──────────       │
                  │                                            │
                  │  [ إنهاء الجلسة ]      [ نعم، أكمل ]       │
                  └────────────────────────────────────────────┘
```

### Spec
- Triggered after 90s of no interaction (configurable). Modal blocks underlying screen.
- 20s countdown. Tap anywhere outside the modal also dismisses (resets session).
- Tap "نعم، أكمل" → modal closes, session resets, return to current screen.
- Tap "إنهاء الجلسة" or 0s → S19.

---

## S19 · Session Ended

**Purpose:** Briefly confirm session ended, then auto-return to Welcome.

### Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                                                                      │
│                                                                      │
│                       تم إنهاء الجلسة                                │ ← display/lg, centered
│                                                                      │
│                  تمت إعادة اللوحة إلى الشاشة الرئيسية                  │ ← body/lg text/secondary
│                                                                      │
│                                                                      │
│                                                                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Spec
- Minimal. No header/footer (or muted).
- 3s display, then auto-fade to S01.

---

## S20 · Return to Home (transition state)

**Purpose:** The brief transitional state between any screen and S01 (welcome). Used after timeout, after success, or when user taps Home.

### Spec
- 480ms cross-fade out of current screen (decelerate easing).
- Welcome screen fades in with its motion choreography (hero drift, quick action stagger).
- Loop closed.

---

## Screen-to-screen transition map

```
                ┌───────────────────────────────────────┐
                ▼                                       │
              S01 Welcome ─────► S05 Quick actions ─────┤
                │                                       │
                ├──► S03 Assistant ─► S04 Q+A ──────────┤
                │                       │               │
                ├──► S06 Directory ─► S07 Service ──────┤
                │                       │               │
                ├──► S08 Map ─► S09 Accessible          │
                │       │                               │
                │       └──► S10 Queue ─────────────────┤
                │                                       │
                └──► S11 Hours ─────────────────────────┤
                                                        │
              S04/S07 ─► S12 Start ─► S13 QR ─► S14 ───┤
                                       │               │
                                       └─► S15 Expired─┤
                                                        │
              (any private query) ─► S16 Refusal ──────┤
                                                        │
              (any error) ─────────► S17 ──────────────┤
                                                        │
              (90s idle) ───────────► S18 ─► S19 ──► S20┘
```
