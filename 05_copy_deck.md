# 05 — Copy Deck

Arabic-first copy for every screen and component. English provided as secondary.

**Tone rules:** clear · warm · short · reassuring · institutional Saudi.

**Forbidden:** scary warnings, blame, technical AI jargon, over-promising, slang.

---

## A. System-wide strings

| Key | Arabic | English |
|-----|--------|---------|
| `app.name` | لوحة الحرم الذكية | Smart Campus Board |
| `app.brand` | BrightEdu × KAU | BrightEdu × KAU |
| `nav.home` | الرئيسية | Home |
| `nav.back` | الرجوع | Back |
| `nav.help` | مساعدة | Help |
| `nav.cancel` | إلغاء | Cancel |
| `nav.retry` | إعادة المحاولة | Try again |
| `nav.continue` | متابعة | Continue |
| `nav.done` | تم | Done |
| `lang.arabic` | عربي | Arabic |
| `lang.english` | English | English |
| `lang.choose` | اختر اللغة | Choose language |
| `time.now` | الآن | Now |
| `time.minute` | دقيقة | min |
| `time.minutes` | دقائق | min |
| `time.last_updated` | آخر تحديث: قبل {n} دقيقة | Last updated {n} min ago |
| `accessibility.toggle` | مسار ميسر | Accessible route |

---

## B. Welcome (S01, S02)

| Slot | Arabic | English |
|------|--------|---------|
| Hero headline | أهلًا بك في الحرم الجامعي | Welcome to the Smart Campus |
| Hero subtitle | كيف أقدر أساعدك اليوم؟ | How can I help you today? |
| Helper line | اسأل المساعد الذكي أو اختر خدمة سريعة. | Ask the assistant or pick a quick action. |
| Section: quick services | خدمات سريعة | Quick services |
| Footer privacy hint | اللوحة عامة — البيانات الخاصة تتم عبر الجوال. | Public board — private requests continue on phone. |
| Quick action 1 | أين أذهب؟ | Where to go? |
| Quick action 2 | شؤون الطلبة | Student Affairs |
| Quick action 3 | مواعيد الخدمات | Service hours |
| Quick action 4 | استلام الوثائق | Document pickup |
| Quick action 5 | الخريطة | Campus map |
| Idle nudge | اقترب لتبدأ | Approach to begin |
| Lang modal title | اختر اللغة · Choose language | (same) |

---

## C. AI Assistant (S03, S04, S05)

### C.1 Assistant identity

| Slot | Arabic | English |
|------|--------|---------|
| Assistant name | مساعد الحرم الذكي | Smart Campus Assistant |
| Greeting | كيف أقدر أساعدك؟ | How can I help? |
| Subtitle | اسألني عن المباني، الخدمات، المواعيد، أو كيفية بدء طلب. | Ask about buildings, services, hours, or starting a request. |
| Input placeholder | اكتب سؤالك أو اضغط للتحدث... | Type your question or tap to speak... |
| Suggestions section | مقترحات شائعة | Common suggestions |
| Privacy banner | لن يتم عرض أي بيانات شخصية على هذه الشاشة. | No personal data will be shown on this screen. |

### C.2 Suggestion chips (use 5–7 of these)

- وين شؤون الطلبة؟ — Where is Student Affairs?
- مواعيد المكتبة — Library hours
- استلام إثبات قيد — Pick up enrollment letter
- أقرب كافتيريا — Nearest cafeteria
- البوابة الرئيسية — Main gate
- أبغى وثيقة تخرج — Request graduation certificate (yellow tier)
- أبغى أعرف معدلي — Check my GPA (black tier — triggers S16)

### C.3 Sample answers

**Wayfinding (public-safe, green):**
> شؤون الطلبة موجودة في مبنى رقم ٤. تبعد عنك تقريبًا ٦ دقائق مشي. أقدر أعرض لك المسار على الخريطة.

EN:
> Student Affairs is in Building 4, about a 6-minute walk from here. I can show you the route on the map.

**Hours (public-safe, green):**
> الكافتيريا مفتوحة الآن. ساعات العمل: ٧:٣٠ ص — ٦:٠٠ م. تقع بالقرب من مبنى الخدمات الطلابية، وتبعد عنك ٤ دقائق مشي.

EN:
> The cafeteria is open now. Hours: 7:30 AM – 6:00 PM. It's near the Student Services building, about 4 minutes away.

**Document request (yellow tier):**
> أقدر أبدأ لك الطلب، لكن تفاصيل الوثيقة تظهر فقط على جوالك. هل أنشئ لك رمز QR لإكمال الطلب بأمان؟

EN:
> I can start the request for you, but the document details will only appear on your phone. Shall I generate a QR code to continue safely?

**Graduation document (yellow → leading to QR):**
> طلب وثيقة التخرج يحتاج تحقق خاص. امسح الرمز وكمل من جوالك.

EN:
> A graduation certificate request requires private verification. Scan the code and continue on your phone.

**Assistant didn't understand:**
> لم أفهم سؤالك تمامًا. جرّب صياغة أخرى أو اختر من المقترحات.

EN:
> I didn't quite catch that. Try rephrasing or pick a suggestion.

---

## D. Wayfinding & Map (S08, S09, S10)

| Slot | Arabic | English |
|------|--------|---------|
| Map title | المسار إلى {destination} | Route to {destination} |
| Walking time | {n} دقائق مشي | {n} min walk |
| Distance | {n} متر | {n} m |
| Nearest gate | أقرب بوابة: {name} | Nearest gate: {name} |
| Queue current | الانتظار الحالي: {level} ({n} د) | Current wait: {level} ({n} min) |
| Queue: low | منخفض | Low |
| Queue: medium | متوسط | Medium |
| Queue: high | مرتفع | High |
| Accessible available | مسار ميسر متاح | Accessible route available |
| CTA primary | ابدأ التوجيه | Start directions |
| CTA accessible | مسار ميسر | Accessible route |
| CTA nearby | خدمات قريبة | Nearby services |
| Direction overlay | توجه نحو {gate} | Head toward {gate} |
| Accessible note | يتضمن المصعد في مبنى ٢ ومنحدر مبنى ٤ | Includes elevator in Building 2 and ramp at Building 4 |
| Queue page title | حالة الانتظار — {service} | Wait status — {service} |
| Queue tip | ذروة الانتظار عادةً بين ١١ ص و ١ م. الفترة الأهدأ بعد ٢ م. | Peak wait is usually 11 AM – 1 PM. Quietest after 2 PM. |

---

## E. Services Directory (S06, S07, S11)

| Slot | Arabic | English |
|------|--------|---------|
| Page title | دليل خدمات الحرم | Campus services |
| Search placeholder | ابحث عن خدمة... | Search a service... |
| Category: all | الكل | All |
| Category: students | خدمات الطلاب | Student services |
| Category: facilities | المرافق | Facilities |
| Category: documents | الوثائق | Documents |
| Category: support | الدعم | Support |
| Category: emergency | الطوارئ | Emergency |
| Card CTA | عرض الموقع | View location |
| Status: open | مفتوح | Open |
| Status: closed | مغلق | Closed |
| Status: closing soon | يغلق قريبًا | Closing soon |
| Status: busy | مزدحم | Busy |
| Hours label | ساعات العمل | Hours |
| Wait label | الانتظار | Wait |

### Service detail (S07)

| Slot | Arabic | English |
|------|--------|---------|
| Available services | الخدمات المتاحة هنا | Services available here |
| Tier: public-safe | عام وآمن | Public-safe |
| Tier: needs continuation | يحتاج استكمال على الجوال | Continues on phone |
| Tier: black | لا يظهر على شاشة عامة | Phone only |
| CTA: start request | ابدأ طلبًا | Start a request |
| CTA: view map | عرض الخريطة | View on map |

### Sample service card data (for demo)

- **شؤون الطلبة** — مبنى ٤ — الدور الأرضي — مفتوح — ٨:٠٠ ص–٣:٠٠ م — انتظار: ١٢ د
- **القبول والتسجيل** — مبنى ١ — مفتوح — ٨:٠٠ ص–٣:٠٠ م — انتظار: ٢٥ د
- **نقطة استلام الوثائق** — مبنى ٤ — شباك ٣ — مفتوح — ٩:٠٠ ص–٢:٠٠ م — انتظار: ٥ د
- **المكتبة** — مبنى ٢ — مفتوح — ٨:٠٠ ص–٨:٠٠ م — انتظار: ٥ د
- **الكافتيريا** — مبنى الخدمات الطلابية — مفتوح — ٧:٣٠ ص–٦:٠٠ م
- **الدعم التقني** — مبنى ٣ — مفتوح — ٨:٠٠ ص–٤:٠٠ م — انتظار: ١٠ د
- **العيادة الجامعية** — مبنى ٦ — مفتوح
- **مركز الأنشطة** — مبنى ٥ — يغلق قريبًا

### Hours screen (S11)

| Slot | Arabic | English |
|------|--------|---------|
| Status open | الخدمة مفتوحة الآن | Service is open now |
| Status closed | الخدمة مغلقة الآن | Service is closed now |
| Status closing | تغلق بعد قليل | Closing soon |
| Hours line | ساعات العمل: {open} — {close} | Hours: {open} – {close} |
| Location line | تقع بالقرب من {area} | Near {area} |
| Distance line | تبعد عنك {n} دقائق مشي | About {n} min walk |
| Timeline now marker | الآن {time} | Now {time} |

---

## F. Private Continuation (S12, S13, S14, S15)

### S12 — Start request

| Slot | Arabic | English |
|------|--------|---------|
| Title (graduation) | وثيقة تخرج | Graduation certificate |
| Tier badge | 🔒 خاص — جوال فقط | 🔒 Private — phone only |
| Body | لإكمال طلب وثيقة التخرج، نحتاج التحقق من هويتك. لحماية خصوصيتك، التفاصيل تظهر فقط على جوالك. | To complete the graduation certificate request, we need to verify your identity. For your privacy, details only appear on your phone. |
| What happens after scan | ما الذي يحدث بعد المسح؟ | What happens after scanning? |
| Step 1 | التحقق من الهوية عبر النفاذ الموحد. | Identity verification via Nafath. |
| Step 2 | مراجعة الطلب من جوالك. | Review the request on your phone. |
| Step 3 | إشعار عند جاهزية الوثيقة. | Notification when the document is ready. |
| Primary CTA | متابعة عبر QR → | Continue via QR → |

### S13 — QR continuation

| Slot | Arabic | English |
|------|--------|---------|
| Header private chip | 🔒 وضع خاص | 🔒 Private mode |
| Card title | أكمل من جوالك | Continue on your phone |
| Privacy line | لحماية خصوصيتك، لن نعرض أي بيانات شخصية على هذه الشاشة. | For your privacy, we won't show any personal data on this screen. |
| Timer label | صلاحية الرمز: | Code expires in: |
| Helper | امسح الرمز خلال ٥ دقائق للمتابعة بأمان. | Scan within 5 minutes to continue safely. |
| Footer line | بعد المسح، ستتابع الطلب من جوالك بأمان. | After scanning, continue securely on your phone. |
| CTA cancel | إلغاء | Cancel |
| CTA regenerate | إنشاء رمز جديد | Generate new code |

### S14 — Scanned success

| Slot | Arabic | English |
|------|--------|---------|
| Hero | تم نقل الطلب إلى جوالك | Request transferred to your phone |
| Body | يمكنك الآن متابعة الخطوات هناك بأمان. | You can continue the steps there safely. |
| Auto-return note | ستعود اللوحة إلى الشاشة الرئيسية خلال ٥ ثوانٍ. | The board returns to home in 5 seconds. |
| CTA | العودة الآن | Return now |

### S15 — QR expired

| Slot | Arabic | English |
|------|--------|---------|
| Title | انتهت صلاحية الرمز | Code expired |
| Body | لحماية خصوصيتك، تنتهي الرموز تلقائيًا. أنشئ رمزًا جديدًا للمتابعة. | Codes expire automatically for your privacy. Generate a new code to continue. |
| CTA primary | إنشاء رمز جديد | Generate new code |

---

## G. Sensitive Data Refusal (S16)

| Slot | Arabic | English |
|------|--------|---------|
| Title | لا يمكن عرض هذه البيانات على شاشة عامة | This information can't be shown on a public screen |
| Body | لحماية خصوصيتك، امسح رمز QR وكمل من جوالك بعد التحقق. | For your privacy, scan the QR code and continue on your phone after verification. |
| Supporting | البيانات الأكاديمية والشخصية تظهر فقط في قناة خاصة وآمنة. | Academic and personal data only appear through a private, secure channel. |
| Black-tier badge | لا يظهر على شاشة عامة | Phone-only |
| CTA primary | أكمل من الجوال | Continue on phone |
| CTA secondary | الرجوع للرئيسية | Back to home |

### Trigger phrases (assistant should map these to S16)

- أبغى أعرف معدلي
- وين اختباري؟
- هل عندي إنذار أكاديمي؟
- أبغى أشوف تفاصيل حالتي المالية
- أبغى أشوف رسالة المرشد
- وريني وثيقتي
- جدولي
- درجاتي

---

## H. Errors (S17)

| Variant | Arabic | English |
|---------|--------|---------|
| Generic | تعذر إكمال الطلب الآن. جرّب مرة أخرى أو توجه لأقرب مكتب خدمة. | Couldn't complete the request right now. Try again or visit the nearest service desk. |
| Map unavailable | تعذر تحميل الخريطة الآن. | The map is temporarily unavailable. |
| Service data | تعذر تحديث حالة الخدمة. | Service status couldn't be updated. |
| QR failed | تعذر إنشاء الرمز. حاول مرة أخرى. | Couldn't generate the code. Please try again. |
| Assistant didn't understand | لم أفهم سؤالك تمامًا. جرّب صياغة أخرى أو اختر من المقترحات. | I didn't catch that. Try rephrasing or pick a suggestion. |
| Nearest desk hint | أقرب مكتب: {service} — {location} | Nearest desk: {service} — {location} |

---

## I. Session timeout (S18, S19)

| Slot | Arabic | English |
|------|--------|---------|
| Modal title | هل ما زلت تستخدم اللوحة؟ | Are you still using the board? |
| Modal body | ستنتهي الجلسة خلال {n} ثانية لحماية خصوصيتك. | The session will end in {n} seconds for your privacy. |
| CTA continue | نعم، أكمل | Yes, continue |
| CTA end | إنهاء الجلسة | End session |
| Ended hero | تم إنهاء الجلسة | Session ended |
| Ended body | تمت إعادة اللوحة إلى الشاشة الرئيسية. | The board has returned to the home screen. |

---

## J. Privacy / safety vocabulary (consistent reuse)

| Concept | Arabic | English |
|---------|--------|---------|
| For your privacy | لحماية خصوصيتك | For your privacy |
| Continue on your phone | أكمل من جوالك | Continue on your phone |
| Public screen | شاشة عامة | Public screen |
| Private mode | وضع خاص | Private mode |
| Scan to continue | امسح للمتابعة | Scan to continue |
| Verify identity | التحقق من الهوية | Verify identity |
| Safely | بأمان | Safely |
| Won't appear here | لا يظهر هنا | Won't appear here |
| Public-safe | عام وآمن | Public-safe |
| Needs continuation | يحتاج استكمال | Needs continuation |

---

## K. Microcopy "do" / "don't" examples

| Situation | ✅ DO say | ❌ DON'T say |
|-----------|-----------|--------------|
| Refusing GPA | "لا يمكن عرض هذه البيانات على شاشة عامة. لحماية خصوصيتك، أكمل من جوالك." | "ممنوع عرض هذه البيانات." / "تم رفض الطلب." |
| QR expired | "انتهت صلاحية الرمز. أنشئ رمزًا جديدًا للمتابعة." | "خطأ! الرمز غير صالح." |
| Assistant unsure | "لم أفهم سؤالك تمامًا. جرّب صياغة أخرى." | "السؤال غير مدعوم." |
| Service closed | "الخدمة مغلقة حاليًا. تفتح غدًا الساعة ٨ ص." | "غير متاح." |
| High queue | "الانتظار الحالي مرتفع — حوالي ٢٥ دقيقة." | "ازدحام شديد!" |
| Timeout | "هل ما زلت تستخدم اللوحة؟" | "ستُنهى الجلسة قريبًا!" |

---

## L. Number formatting

- **In Arabic context:** use Eastern Arabic numerals (٠–٩) for times, distances, queue counts.
  - Examples: `٦ دقائق` · `٤٥٠ متر` · `١٢ دقيقة` · `٨:٠٠ ص`
- **Exceptions (always Latin numerals):**
  - QR expiry timer (`04:32`) — for high-glance legibility.
  - Building numbers in mixed Arabic-English contexts where the building is named with Latin numbers.
- **English context:** Latin numerals throughout.
- **AM/PM:**
  - Arabic: `ص` for morning, `م` for afternoon/evening.
  - English: `AM` / `PM`.

---

## M. Final voice & tone reminders

- "أبشر" — sparingly, for warmth on welcome moments only.
- "أقدر أساعدك" — preferred over "هل تحتاج مساعدة؟" — proactive, not passive.
- "أكمل من جوالك" — the universal handoff phrase. Use it consistently.
- Avoid "للأسف" (regretfully) — implies failure where there isn't one.
- Avoid exclamation marks. The board never shouts.
- One idea per sentence. Two sentences max per message.
