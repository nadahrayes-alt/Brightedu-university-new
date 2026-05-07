# 04 — Demo Flow (Connected Prototype)

The connected story to wire up in Figma's prototype mode for stakeholder demos.

Total runtime target: **3 minutes**, narratable.

---

## The 16-beat storyline

Map each beat to: **screen → trigger → next**. This is what you wire in Figma's prototype tab.

| # | Beat | Screen | Trigger (in prototype) | Next | Notes |
|---|------|--------|-------------------------|------|-------|
| 1 | Idle attract | S01 (idle variant) | After 60s on S01 — auto | S01 | Hero drift loops |
| 2 | User taps to start | S01 | Tap anywhere | S01 (active) | Subtle ripple feedback |
| 3 | User confirms language | S02 (modal) | Tap 🌐 | back to S01 | Already Arabic — confirms |
| 4 | Open assistant | S01 | Tap assistant input | S03 | Focus on input |
| 5 | Ask "وين شؤون الطلبة؟" | S03 | Tap suggestion chip `وين شؤون الطلبة؟` | S04 | Show typing indicator first 1.4s |
| 6 | See answer | S04 | (auto-render) | S04 | Tier badge `عام وآمن` visible |
| 7 | Tap "عرض المسار" | S04 | Tap CTA | S08 | Route draws in 480ms |
| 8 | Tap "ابدأ التوجيه" | S08 | Tap primary CTA | S08 + overlay | 1.5s confirmation overlay |
| 9 | Return to assistant | S08 | Tap home/back | S03 | Transcript preserved |
| 10 | Ask graduation document | S03 | Tap suggestion `أبغى وثيقة تخرج` | S04' | Assistant explains private |
| 11 | Tap "متابعة عبر QR" | S04' | Tap CTA | S12 | Privacy banner appears |
| 12 | Confirm continuation | S12 | Tap `متابعة عبر QR →` | S13 | Header switches to private-mode |
| 13 | QR appears (5:00) | S13 | Auto | S13 | Timer counts |
| 14 | Simulated scan | S13 | (demo trigger — tap QR) | S14 | Success animation |
| 15 | User asks GPA (after Welcome return) | S03 | Tap suggestion `أبغى أعرف معدلي` | S16 | Direct route to refusal |
| 16 | Inactivity → timeout | (any screen) | After 90s idle (or demo button) | S18 → S19 → S01 | Closes the loop |

---

## Demo narration script (Arabic, for the presenter)

Use this as the live voiceover during the stakeholder demo.

> **(1) أمام لوحة الحرم الذكية، يظهر للطالب ترحيب هادئ.**
> "أهلًا بك في الحرم الجامعي. كيف أقدر أساعدك اليوم؟"
>
> **(2) الطالب يلمس الشاشة، فتنشط الجلسة.**
> اللوحة تستجيب فورًا — الواجهة تتقدم خطوة بخطوة بدون تشتيت.
>
> **(3) اللغة الافتراضية عربية، وفي حال احتاج الزائر اللغة الإنجليزية، فهو يبدّلها بضغطة واحدة.**
>
> **(4) الطالب يضغط على المساعد الذكي.**
> الواجهة لا تُشبه روبوت دردشة صغير — هي لوحة كاملة مصممة لشاشة كبيرة.
>
> **(5–7) الطالب يسأل: "وين شؤون الطلبة؟"**
> المساعد يجيب فورًا: مبنى ٤، ٦ دقائق مشي، انتظار متوسط. ويعرض المسار على خريطة مبسطة للحرم.
>
> **(8) عند الضغط على "ابدأ التوجيه"، تظهر إشارة بسيطة باتجاه البوابة الشرقية.**
>
> **(9–11) ثم يطلب الطالب وثيقة تخرج.**
> هنا، اللوحة تتعرف أن هذا طلب خاص — لا يمكن إكماله على شاشة عامة.
> فتشرح بهدوء: "لإكمال طلب وثيقة التخرج، نحتاج التحقق من هويتك. لحماية خصوصيتك، التفاصيل تظهر فقط على جوالك."
>
> **(12–13) اللوحة تنشئ رمز QR صالح لخمس دقائق.**
> رأس الصفحة يدخل "وضع خاص"، ولا تظهر أي بيانات شخصية على الشاشة.
>
> **(14) الطالب يمسح الرمز، فتنتقل الجلسة إلى جواله بأمان.**
> "تم نقل الطلب إلى جوالك. يمكنك الآن متابعة الخطوات هناك بأمان."
>
> **(15) في سيناريو آخر، يسأل الطالب: "أبغى أعرف معدلي".**
> اللوحة لا ترفض بقسوة — بل تحمي بهدوء:
> "لا يمكن عرض هذه البيانات على شاشة عامة. لحماية خصوصيتك، امسح رمز QR وكمل من جوالك بعد التحقق."
>
> **(16) بعد فترة من عدم الاستخدام، تنبّه اللوحة الطالب.**
> "هل ما زلت تستخدم اللوحة؟ ستنتهي الجلسة خلال ٢٠ ثانية لحماية خصوصيتك."
> ثم تعود تلقائيًا إلى الشاشة الرئيسية، جاهزة للطالب التالي.

---

## Prototype wiring tips (Figma)

- Use **smart animate** between S04 → S08 (the route draw works well as a smart animate of the SVG path).
- Use **after delay** triggers for: idle attract loop on S01, auto-return on S14 and S19, timeout countdown on S18.
- Use **overlay** for S02 (language modal) and S18 (timeout modal) so the underlying screen stays visible.
- Build a "demo trigger" hidden button on S13 to simulate the scan → S14 (in real product this is event-driven from backend).
- For the privacy/refusal moments (S16), mark the trigger chips on S03 with descriptive names like `→ refusal (gpa)` so the demo flow is searchable.

---

## Out-of-scope for MVP demo (record for later)

These are intentionally excluded from the 3-minute demo but should be acknowledged:

- Voice input flow (mic listening UI exists as a state but isn't part of the demo path).
- Multi-user concurrent sessions (single user assumed).
- Live backend (queue numbers and hours are static demo data).
- Offline state.
- Admin override / staff handoff to a human.
- Notifications / paging.
- Authenticated identity on the board itself (deliberately absent — that's why QR exists).
