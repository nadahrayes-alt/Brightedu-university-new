// All demo scenarios from the spec (04_flow.md + 05_copy_deck.md + 06_demo_walkthrough.md).
// Use this as the single source of truth when wiring the prototype.

export interface Scenario {
  id: string;
  /** What the user does at the kiosk. */
  trigger: string;
  /** What screens appear, in order. */
  flow: string[];
  /** Expected privacy tier of the answer. */
  tier: 'green' | 'yellow' | 'black' | 'system';
  /** What the assistant says (Arabic). */
  ar: string;
  /** What the assistant says (English). */
  en: string;
  notes?: string;
}

// ──────────────────────────────────────────────────────────────────────
// Public-safe scenarios (Green tier — answered fully on the kiosk)
// ──────────────────────────────────────────────────────────────────────

export const GREEN_SCENARIOS: Scenario[] = [
  {
    id: 'wayfinding-student-affairs',
    trigger: 'وين شؤون الطلبة؟',
    flow: ['/assistant', '/assistant/answer/student-affairs', '/map/student-affairs'],
    tier: 'green',
    ar: 'شؤون الطلبة في مبنى ٤، ٦ دقائق مشي. أقدر أعرض لك المسار.',
    en: 'Student Affairs is in Building 4, about a 6-minute walk. I can show the route.',
  },
  {
    id: 'hours-library',
    trigger: 'مواعيد المكتبة',
    flow: ['/assistant', '/hours/library'],
    tier: 'green',
    ar: 'المكتبة مفتوحة الآن. ساعات العمل: ٨:٠٠ ص — ٨:٠٠ م.',
    en: 'The library is open now. Hours: 8:00 AM – 8:00 PM.',
  },
  {
    id: 'hours-cafeteria',
    trigger: 'أقرب كافتيريا',
    flow: ['/assistant', '/hours/cafeteria'],
    tier: 'green',
    ar: 'الكافتيريا مفتوحة الآن، ٤ دقائق مشي.',
    en: 'The cafeteria is open now, 4 minutes away.',
  },
  {
    id: 'queue-student-affairs',
    trigger: 'كم طول الانتظار في شؤون الطلبة؟',
    flow: ['/assistant', '/queue'],
    tier: 'green',
    ar: 'الانتظار الحالي متوسط، ١٢ دقيقة. ذروة الانتظار بين ١١ ص و ١ م.',
    en: 'Current wait is medium, about 12 minutes. Peak hours are 11 AM – 1 PM.',
  },
  {
    id: 'main-gate',
    trigger: 'البوابة الرئيسية',
    flow: ['/assistant', '/map/main-gate'],
    tier: 'green',
    ar: 'البوابة الرئيسية الشرقية، ٥ دقائق مشي.',
    en: 'Main East Gate, 5 minutes away.',
  },
];

// ──────────────────────────────────────────────────────────────────────
// Yellow tier — starts on kiosk, finishes on phone
// ──────────────────────────────────────────────────────────────────────

export const YELLOW_SCENARIOS: Scenario[] = [
  {
    id: 'enrollment-letter',
    trigger: 'استلام إثبات قيد',
    flow: ['/assistant', '/start-request/enrollment', '/qr', '/qr/success'],
    tier: 'yellow',
    ar: 'أقدر أبدأ لك الطلب، لكن تفاصيل المستند تظهر على جوالك. هل أنشئ رمز QR؟',
    en: "I can start the request, but the document details only appear on your phone. Shall I generate a QR?",
  },
  {
    id: 'graduation-cert',
    trigger: 'أبغى وثيقة تخرج',
    flow: ['/assistant', '/start-request/graduation', '/qr', '/qr/success'],
    tier: 'yellow',
    ar: 'طلب وثيقة التخرج يحتاج تحقق خاص. امسح الرمز وكمل من جوالك.',
    en: 'A graduation certificate request requires private verification. Scan and continue on your phone.',
  },
  {
    id: 'update-info',
    trigger: 'أبغى أعدّل بياناتي',
    flow: ['/assistant', '/start-request/update_info', '/qr', '/qr/success'],
    tier: 'yellow',
    ar: 'تعديل البيانات يتم بأمان من الجوال. أنشئ رمز QR للمتابعة.',
    en: 'Updating personal info is done securely on your phone. Generate a QR to continue.',
  },
];

// ──────────────────────────────────────────────────────────────────────
// Black tier — never on the public screen, refusal + QR continuation
// ──────────────────────────────────────────────────────────────────────

export const BLACK_SCENARIOS: Scenario[] = [
  {
    id: 'gpa',
    trigger: 'أبغى أعرف معدلي',
    flow: ['/assistant', '/refusal', '/qr', '/qr/success'],
    tier: 'black',
    ar: 'لا يمكن عرض المعدل على شاشة عامة. أكمل من جوالك بأمان.',
    en: "GPA can't be shown on a public screen. Continue safely on your phone.",
  },
  {
    id: 'exam-location',
    trigger: 'وين اختباري؟',
    flow: ['/assistant', '/refusal', '/qr', '/qr/success'],
    tier: 'black',
    ar: 'موقع الاختبار خاص بحسابك. امسح الرمز للمتابعة.',
    en: "Exam location is tied to your account. Scan the code to continue.",
  },
  {
    id: 'academic-warning',
    trigger: 'هل عندي إنذار أكاديمي؟',
    flow: ['/assistant', '/refusal', '/qr', '/qr/success'],
    tier: 'black',
    ar: 'الإنذارات الأكاديمية تظهر فقط على جوالك بعد التحقق.',
    en: 'Academic warnings only appear on your phone after verification.',
  },
  {
    id: 'finance',
    trigger: 'تفاصيل حالتي المالية',
    flow: ['/assistant', '/refusal', '/qr', '/qr/success'],
    tier: 'black',
    ar: 'البيانات المالية تظهر فقط في قناة خاصة وآمنة.',
    en: 'Financial information only appears on a private, secure channel.',
  },
  {
    id: 'advisor-message',
    trigger: 'رسالة المرشد',
    flow: ['/assistant', '/refusal', '/qr', '/qr/success'],
    tier: 'black',
    ar: 'رسائل المرشد خاصة بحسابك. أكمل من جوالك.',
    en: 'Advisor messages are tied to your account. Continue on your phone.',
  },
  {
    id: 'document-preview',
    trigger: 'وريني وثيقتي',
    flow: ['/assistant', '/refusal', '/qr', '/qr/success'],
    tier: 'black',
    ar: 'محتوى الوثائق لا يظهر على شاشة عامة.',
    en: "Document content doesn't appear on a public screen.",
  },
];

// ──────────────────────────────────────────────────────────────────────
// System scenarios — errors, expiry, timeout, idle
// ──────────────────────────────────────────────────────────────────────

export const SYSTEM_SCENARIOS: Scenario[] = [
  {
    id: 'qr-expired',
    trigger: 'لم يمسح المستخدم خلال ٥ دقائق',
    flow: ['/qr', '/qr/expired'],
    tier: 'system',
    ar: 'انتهت صلاحية الرمز. أنشئ رمزًا جديدًا للمتابعة.',
    en: 'Code expired. Generate a new code to continue.',
  },
  {
    id: 'inactivity-timeout',
    trigger: '٩٠ ثانية بدون تفاعل',
    flow: ['/timeout', '/ended', '/'],
    tier: 'system',
    ar: 'هل ما زلت تستخدم اللوحة؟ ستنتهي الجلسة خلال ٢٠ ثانية.',
    en: 'Are you still using the board? Session ends in 20 seconds.',
  },
  {
    id: 'service-error',
    trigger: 'فشل الاتصال بالخدمة',
    flow: ['/error'],
    tier: 'system',
    ar: 'تعذر إكمال الطلب الآن. جرّب مرة أخرى أو توجه لأقرب مكتب.',
    en: "Couldn't complete the request. Try again or visit the nearest desk.",
  },
  {
    id: 'cancelled-by-user',
    trigger: 'ضغط المستخدم "إلغاء" على QR',
    flow: ['/qr', '/'],
    tier: 'system',
    ar: 'تم إلغاء الجلسة. شكرًا لاستخدامك اللوحة.',
    en: 'Session cancelled. Thanks for using the board.',
  },
];

// ──────────────────────────────────────────────────────────────────────
// The full 16-beat demo storyline (matches 04_flow.md)
// ──────────────────────────────────────────────────────────────────────

export interface DemoBeat {
  step: number;
  beat: string;
  screen: string;
  trigger: string;
  next: string;
  notes?: string;
}

export const DEMO_STORYLINE: DemoBeat[] = [
  { step: 1,  beat: 'Idle attract',                screen: '/',                                trigger: 'After 60s on home', next: '/' },
  { step: 2,  beat: 'User taps to start',          screen: '/',                                trigger: 'Tap anywhere',     next: '/' },
  { step: 3,  beat: 'Confirm language',            screen: '/lang',                            trigger: 'Tap globe icon',   next: '/' },
  { step: 4,  beat: 'Open assistant',              screen: '/',                                trigger: 'Tap assistant',    next: '/assistant' },
  { step: 5,  beat: 'Ask wayfinding question',     screen: '/assistant',                       trigger: 'Tap "وين شؤون الطلبة؟"', next: '/assistant/answer/student-affairs' },
  { step: 6,  beat: 'See answer',                  screen: '/assistant/answer/student-affairs', trigger: 'auto',            next: '/assistant/answer/student-affairs' },
  { step: 7,  beat: 'Tap "عرض المسار"',             screen: '/assistant/answer/student-affairs', trigger: 'Tap CTA',         next: '/map/student-affairs' },
  { step: 8,  beat: 'Tap "ابدأ التوجيه"',           screen: '/map/student-affairs',             trigger: 'Tap primary CTA',  next: '/map/student-affairs', notes: '1.5s overlay' },
  { step: 9,  beat: 'Return to assistant',         screen: '/map/student-affairs',             trigger: 'Tap home/back',    next: '/assistant' },
  { step: 10, beat: 'Ask graduation document',     screen: '/assistant',                       trigger: 'Tap suggestion "أبغى وثيقة تخرج"', next: '/start-request/graduation' },
  { step: 11, beat: 'Tap "متابعة عبر QR"',          screen: '/start-request/graduation',       trigger: 'Tap CTA',          next: '/qr' },
  { step: 12, beat: 'Confirm continuation',        screen: '/qr',                              trigger: 'auto',             next: '/qr', notes: 'Header switches to private mode' },
  { step: 13, beat: 'QR appears (5:00 timer)',     screen: '/qr',                              trigger: 'auto',             next: '/qr' },
  { step: 14, beat: 'Simulated scan',              screen: '/qr',                              trigger: 'Tap QR (demo)',    next: '/qr/success' },
  { step: 15, beat: 'Sensitive query → refusal',   screen: '/assistant',                       trigger: 'Tap "أبغى أعرف معدلي"', next: '/refusal' },
  { step: 16, beat: 'Inactivity → timeout',        screen: 'any',                              trigger: 'After 90s idle',   next: '/timeout', notes: 'leads to /ended → /' },
];

export const ALL_SCENARIOS: Scenario[] = [
  ...GREEN_SCENARIOS,
  ...YELLOW_SCENARIOS,
  ...BLACK_SCENARIOS,
  ...SYSTEM_SCENARIOS,
];
