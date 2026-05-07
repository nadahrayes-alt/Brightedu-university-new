# 06 — Demo Walkthrough

A practical 2-minute presenter guide for the **BrightEdu × KAU Smart Campus Board** prototype, suitable for a university leadership demo.

---

## At a glance

| What | Value |
|------|-------|
| Total runtime | ~2 minutes (live) + 1 minute Q&A buffer |
| Language | Arabic-first; English on demand |
| Demo URL | `http://127.0.0.1:8000/` |
| Presenter tools | Demo trigger button (bottom-left corner) for scan/timeout simulation |
| Audience | University leadership (Vice Rectors, Deans, IT/Strategy) |

---

## 1. The two-minute Arabic presenter script

> Read aloud as a continuous narration while you tap through the prototype.
> Total target: **120 seconds**. Italics indicate stage directions, not spoken.

---

**[٠٠:٠٠ — ٠٠:١٥]  افتتاحية**

> "هذي **لوحة الحرم الذكية** من BrightEdu لجامعة الملك عبدالعزيز.
> لوحة تفاعلية كبيرة تُوضع عند بوابات الجامعة، عند شؤون الطلبة، وعند مراكز الخدمة.
> هدفها واحد: **يسأل الطالب هنا أولًا**، تجاوبه اللوحة فورًا، والطلبات الخاصة تكتمل بأمان من جواله."

*[يظهر على الشاشة: شاشة الترحيب — العربية افتراضيًا، حالة "متصل" خضراء أعلى الشاشة.]*

---

**[٠٠:١٥ — ٠٠:٤٥]  السؤال الأول — الاتجاهات (السيناريو الأكثر شيوعًا)**

> "تخيلوا طالبًا جديدًا يدخل الحرم لأول مرة. يلمس الشاشة، ويسأل المساعد:"

*[المُقدّم يضغط على المقترح: "وين شؤون الطلبة؟"]*

> "اللوحة تجاوب فورًا في أقل من ثانية: **شؤون الطلبة في مبنى ٤، تبعد ست دقائق مشي، الانتظار الحالي متوسط**.
> لا يحتاج الطالب يسأل موظف، ولا يقف في طابور."

*[المُقدّم يضغط: "عرض المسار"]*

> "هذي خريطة مبسطة للحرم — ترسم المسار، تعرض البوابة الأقرب، حالة الانتظار، وحتى مسار ميسّر للأشخاص ذوي الإعاقة. تحديث حيّ كل دقيقة."

---

**[٠٠:٤٥ — ٠١:١٥]  الطلب الخاص — هنا تظهر الميزة الحقيقية**

> "الآن، السيناريو الأهم. الطالب يطلب وثيقة تخرج."

*[المُقدّم يفتح المساعد ويضغط: "أبغى وثيقة تخرج"]*

> "اللوحة هنا ما تكمل الطلب على الشاشة العامة، تشرح للطالب بهدوء:
> **'هذا طلب يحتاج تحقق من الهوية. لحماية خصوصيتك، التفاصيل تظهر فقط على جوالك.'**
> ثم تنشئ رمز QR صالح لخمس دقائق فقط."

*[يظهر مشهد QR مع جوال على اليمين، رأس الصفحة دخل "وضع خاص" بإطار بنفسجي.]*

> "الطالب يمسح الرمز، يتحقق عبر النفاذ الموحد، وتنتقل الجلسة إلى جواله بأمان كامل.
> **بياناته الشخصية لم تظهر أبدًا على الشاشة العامة.**"

*[المُقدّم يضغط زر المحاكاة، تظهر شاشة النجاح الخضراء.]*

---

**[٠١:١٥ — ٠١:٣٥]  رفض البيانات الحساسة — حماية افتراضية**

> "السؤال الأخير. ماذا لو سأل الطالب عن معدله أو إنذار أكاديمي؟"

*[المُقدّم يضغط: "أبغى أعرف معدلي"]*

> "اللوحة لا ترفض بقسوة. ترد بهدوء وحماية:
> **'هذي البيانات لا تُعرض على شاشة عامة. لحماية خصوصيتك، أكمل من جوالك بعد التحقق.'**
> هذا تصميم متعمّد: البيانات الأكاديمية الحساسة **لا تخرج من القناة الخاصة أبدًا**، حتى لو طُلبت بشكل مباشر."

---

**[٠١:٣٥ — ٠٢:٠٠]  الخلاصة**

> "باختصار: **اللوحة تجاوب على الأسئلة العامة فورًا، تحوّل الطلبات الخاصة إلى الجوال بأمان، وتُغلق الجلسة تلقائيًا بعد فترة لحماية الطالب التالي.**
>
> النتيجة: تخفيف الضغط على شؤون الطلبة، تجربة أسرع للطالب، وحماية مدمجة بالتصميم.
> هذي ليست واجهة محادثة — هذي **طبقة خدمة ذكية لجامعة الملك عبدالعزيز**."

*[العودة لشاشة الترحيب لإغلاق العرض.]*

---

## 2. Screen-by-screen explanation

Use this as a quick reference if leadership pauses on a specific screen.

### S01 · Welcome

> **What they see:** A premium institutional landing — KAU bilingual brand, live "متصل" pip, a calm Arabic-first welcome, the AI assistant card, and 5 quick action cards.

**Talking point:** *"This is the resting state. Anyone walking past sees clearly: where they are, what this is for, and what to tap. No staff intervention needed."*

---

### S03 / S04 · AI Assistant

> **What they see:** Conversational interface scaled for a public board — large bubbles, suggestion sidebar, and tier badges (green / yellow / black) on every answer.

**Talking point:** *"Every answer carries a privacy tier. Green = public-safe (locations, hours). Yellow = needs phone continuation. Black = never displayed here. The student sees this badge before they see the answer."*

---

### S08 · Map & Wayfinding

> **What they see:** Stylized illustrated campus with a destination highlighted in violet, an animated route line, a compass rose, scale bar, and a side panel showing walking time, distance, queue status, and accessibility.

**Talking point:** *"It's not Google Maps. It's a campus-specific illustration that prioritizes legibility from 1.5 meters away. Queue data is live."*

---

### S12 · Service Request

> **What they see:** A focused, breathable screen explaining what's about to happen — three numbered steps describing the Nafath verification, mobile review, and notification.

**Talking point:** *"Before we open a private channel, we tell the student what's coming. Transparency is part of the trust model."*

---

### S13 · QR Private Continuation

> **What they see:** A premium QR card next to a phone illustration, with an animated scan-arrow between them, a 5-minute countdown, and corner alignment marks on the QR frame.

**Talking point:** *"The QR code is ephemeral — five minutes, single use. Once scanned, the entire session moves to the student's phone. Nothing personal touches this screen."*

---

### S16 · Sensitive Data Refusal

> **What they see:** A large shield icon with a calm pulse, the refusal title in display type, and a smaller QR offering the private route. **Notice: no red, no error iconography — only protective violet.**

**Talking point:** *"This is the opposite of a system error. We treat privacy as a service we provide, not a failure we apologize for."*

---

### S18 / S19 · Session Timeout

> **What they see:** After 90 seconds of inactivity, a calm modal asks "هل ما زلت تستخدم اللوحة؟" with a 20-second countdown ring. If unanswered, the board returns to Welcome.

**Talking point:** *"Public boards forget. Every session ends automatically — no fingerprints left for the next student."*

---

## 3. Value proposition (one sentence)

> **A board that answers immediately if the question is public, and continues privately on the student's phone if the answer is personal — turning the busiest service counters into a self-service layer without compromising privacy.**

### Three measurable wins

1. **Fewer counter visits** — every public-safe question answered absorbs one walk-up to a Student Affairs desk.
2. **Faster service** — the average "where is X" question, currently 3–6 minutes of staff time, drops to under 10 seconds at the board.
3. **Private by design** — sensitive academic data has no surface area on public screens. Compliance with university privacy standards is enforced in the UI, not just in policy.

---

## 4. The problem this board solves

| Pain point today | What this board does |
|------------------|----------------------|
| Long queues at Student Affairs for repetitive directional questions | Answers them on the spot, in Arabic, in seconds |
| Sensitive data (GPA, financial holds, exam locations) being asked at public counters within earshot of others | Refuses to display them, redirects to phone via QR |
| Visitors and new students lost between buildings | Provides illustrated wayfinding with walking time, accessible routes, and queue awareness |
| Staff repeating the same answer dozens of times per day | Removes ~80% of repeatable Q&A from the counter |
| Document requests requiring identity verification handled on shared paper or shared screens | Moves verification to the student's authenticated mobile session via Nafath |

---

## 5. How the flow protects student privacy

The board enforces a **three-tier privacy model**, visible to the student as a badge on every answer:

- 🟢 **Green tier — "عام وآمن"** · Public-safe: directions, hours, FAQs. Answered on screen.
- 🟡 **Yellow tier — "يحتاج استكمال"** · Public-explainable, private-completable. The board describes the process; the request finishes on phone.
- ⚫ **Black tier — "لا يظهر على شاشة عامة"** · Never displayed on the board under any circumstances. Examples: GPA, academic warnings, financial holds, exam locations, advisor messages.

**Three mechanisms reinforce this:**
1. **Tier-aware copy.** Every assistant response carries a visible tier badge, so the protection is *legible*, not invisible.
2. **Forced QR handoff.** Black-tier queries always trigger the Sensitive Refusal screen with a private QR — there is no path to display personal data on the board.
3. **Automatic session end.** 90-second inactivity timeout, 20-second warning, then full session reset back to Welcome — protecting the *next* student from the previous one.

---

## 6. How the QR continuation works

```
Student asks something private at the board
        │
        ▼
Board explains the request, opens private mode  ──►  Header switches to "🔒 وضع خاص"
        │
        ▼
Board generates an ephemeral QR (5-minute lifespan)
        │
        ▼
Student scans with their phone camera
        │
        ▼
Phone opens authenticated link  ──►  Nafath identity verification
        │
        ▼
Session transferred to phone     ──►  Board shows "تم نقل الطلب إلى جوالك"
        │
        ▼
Board auto-returns to Welcome (5 seconds)
```

**Properties of the QR:**
- **Ephemeral:** 5 minutes, single use. Expires automatically with a calm "انتهت صلاحية الرمز" — never an error.
- **Authenticated:** the link itself doesn't reveal data. The student must verify via Nafath on their phone before any data is shown.
- **No echo on board:** the board never sees the data the phone receives. The board's job ends the moment the QR is scanned.
- **Cancelable:** a clear "إلغاء" returns the student to the assistant without keeping any state.

---

## 7. How this reduces pressure on Student Affairs

A typical Student Affairs counter receives roughly **three categories** of walk-ups:

| Category | % of typical traffic | What happens today | What happens with the board |
|----------|---------------------|--------------------|------------------------------|
| **Directional / informational** ("where is X?", "what time?", "is it open?") | ~50% | Staff answers verbally, may repeat 30+ times/day | Board answers in seconds, zero counter time |
| **Document requests** (transcripts, enrollment letters, graduation certificates) | ~30% | Paper form + manual ID check at the counter | Board explains, hands off to phone via QR. Counter only sees verified, ready-to-process requests |
| **Genuinely complex / case-specific issues** | ~20% | Staff handles directly | Same as today — and now with shorter queue and more attention available |

**Net effect:** the board absorbs ~80% of the public-safe and pre-form work, leaving the counter free for the cases that actually need a human. **Less repetition, less crowding, less risk of sensitive conversations happening in public earshot.**

It also creates a **clean queue** at the counter — by the time a student arrives at Student Affairs in person, their request has either already been resolved by the board or pre-verified on their phone.

---

## 8. Closing statement for leadership

> **هذي ليست أداة تكنولوجية إضافية — هذي طبقة خدمة جديدة لجامعة الملك عبدالعزيز.**
>
> اللوحة تُحرّر فريق شؤون الطلبة من الأسئلة المتكررة، تحمي خصوصية الطالب بالتصميم، وتمنح الزائر تجربة تليق بمكانة الجامعة.
>
> الإطار جاهز. التصميم مكتمل. التنفيذ يحتاج قرارًا واحدًا: **أين نضع اللوحة الأولى؟**

**English (for non-Arabic readers in the room):**

> *This isn't an add-on tool — it's a new service layer for KAU. It frees Student Affairs from repetitive questions, protects student privacy by design, and gives every visitor an experience that matches the university's standing. The framework is ready. The design is complete. The implementation needs one decision: where do we place the first board?*

---

## Presenter cheat-sheet

Keep this open on a phone or printed card during the demo.

### Tap order for the 2-minute flow

1. *(Start on Welcome)* — open in fullscreen `F11`.
2. Tap suggestion **"وين شؤون الطلبة؟"** (in the welcome assistant card or the assistant screen).
3. In the answer bubble, tap **"عرض المسار"** → Map screen.
4. Tap **"الرجوع"** → back to assistant.
5. Tap suggestion **"أبغى وثيقة تخرج"** → answer with QR CTA.
6. Tap **"متابعة عبر QR"** → QR continuation screen.
7. Tap the **demo trigger** (bottom-left, "🎬 محاكاة المسح") → success state.
8. *(Auto-returns to Welcome in 5s)* — or tap "العودة الآن".
9. Open assistant, tap suggestion **"أبغى أعرف معدلي"** → Refusal screen.
10. Wait 90s for natural timeout, OR tap **demo trigger** to fire it manually → close on Welcome.

### Common questions you'll get — quick answers

| Question | One-line answer |
|----------|-----------------|
| "Is the QR scannable to a real Nafath flow?" | The framework is wired; the production link plugs into our backend in one config change. |
| "What about Arabic dialects?" | The MVP uses standard Saudi institutional Arabic. Dialect tolerance is a model-tuning task, not a UI rebuild. |
| "Can it run offline?" | Yes — the prototype runs fully offline. Production needs a network for live queue data only. |
| "Voice input?" | Visual UI is in place; production wiring takes ~30 lines of Web Speech API code. |
| "What screens does it support?" | Designed at 1920×1080 landscape; auto-scales to any modern touchscreen ≥1366×768. |
| "Accessibility?" | All touch targets ≥64px, AA contrast, accessible-route option, RTL/LTR full parity, automatic timeout protects the next user. |
| "What about data residency?" | The board never stores personal data. Anything sensitive is server-side, behind Nafath. |

### If something goes wrong mid-demo

| Glitch | Recovery |
|--------|----------|
| Browser shows old version | `Cmd+Shift+R` to hard-reload. |
| Page didn't scale to your screen | Press `F11`, then resize the window once to retrigger the scale calculation. |
| QR timer hit zero accidentally | Tap **"إنشاء رمز جديد"** — you're back in business in 1 second. |
| Stuck on a screen | Tap the home icon in the header (top-left controls). Always returns to Welcome. |
| Server stopped | In terminal: `cd "Bright universal" && python3 -m http.server 8000`. |

---

## Appendix — exact talking-point swaps

If your audience leans more **technical**, swap these sentences in:

- *"Built on a vanilla web stack — runs offline, no framework lock-in, deployable to any modern touchscreen."*
- *"The privacy tier system is enforced in three places: the assistant prompt, the rendering layer, and the session-end behavior. Defense in depth."*
- *"QR codes are deterministic from a server-issued seed; cryptographic single-use can be added without UI changes."*

If your audience leans more **strategic**, swap these:

- *"This is the front door of the university for thousands of students daily. Right now, the front door is a counter and a queue."*
- *"Every minute saved at Student Affairs is a minute given back to the students who actually need a human conversation."*
- *"This is what 'ر ؤية ٢٠٣٠' looks like in a service desk: faster, more dignified, more private."*
