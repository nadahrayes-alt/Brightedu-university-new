/**
 * Smart Campus Assistant — intent catalog.
 *
 * Every utterance the kiosk can recognise (voice, text fallback, or quick
 * action) maps to one of these intents. The category drives whether the
 * response is shown directly on the public board or routed through identity
 * verification → QR.
 *
 * Categories:
 *   - public-safe     → green. Answer immediately on the kiosk.
 *   - private         → personal data. University ID → QR.
 *   - human-decision  → red. Staff/authority approval required. ID → QR.
 *   - restricted      → must never appear on the public screen. ID → QR.
 *   - ambiguous       → fallback: ask the user to clarify.
 */

export type IntentCategory =
  | 'public-safe'
  | 'private'
  | 'human-decision'
  | 'restricted'
  | 'ambiguous';

export type IntentIconKind =
  | 'map' | 'clock' | 'building' | 'list' | 'verify' | 'qr' | 'back'
  | 'home' | 'phone' | 'document' | 'queue' | 'event' | 'calendar'
  | 'wifi' | 'wrench' | 'food' | 'book' | 'cross' | 'sparkle' | 'arrow'
  | 'shield' | 'gavel' | 'alert';

export type ActionVariant = 'primary' | 'secondary' | 'privacy' | 'cancel' | 'ghost';

export interface IntentAction {
  ar: string;
  en: string;
  /** Where to navigate when pressed. Use `kind: 'back'` to pop history. */
  to?: string;
  kind?: 'navigate' | 'verify' | 'back' | 'home' | 'retry';
  variant?: ActionVariant;
  iconKind?: IntentIconKind;
}

export interface IntentDef {
  id: string;
  category: IntentCategory;

  /** What the assistant says it understood: "فهمت أنك تريد: <recognition>" */
  recognitionAr: string;
  recognitionEn: string;

  /** Short response body (Arabic-first kiosk tone, action-oriented). */
  responseAr: string;
  responseEn: string;

  /** Optional secondary note placed under the response (e.g. privacy hint). */
  noteAr?: string;
  noteEn?: string;

  /** Optional badge override. If omitted, a default badge is derived from the
   *  intent category by `agentRules.ts`. */
  badgeAr?: string;
  badgeEn?: string;
  badgeTone?: 'public-safe' | 'needs-qr' | 'private' | 'unavailable' | 'black-tier';
  badgeIconKind?: 'shield' | 'lock' | 'gavel' | 'alert';

  /** Action buttons shown on the response card, in display order. */
  actions: IntentAction[];

  /** Phrases the matcher uses for mock voice + text recognition. The first AR
   *  phrase doubles as the canonical demo utterance for quick-action chips. */
  phrasesAr: string[];
  phrasesEn: string[];

  /** Voice-only direct navigation. When true and the input source is voice,
   *  the assistant flashes the recognition (`فهمت أنك تريد: …`) for a beat and
   *  then navigates straight to `voiceDirectRoute` instead of rendering the
   *  chat response card. Typed input ALWAYS shows the chat response, even for
   *  intents flagged as `voiceDirect`. Reserved for explicit navigation
   *  commands like "افتح الخريطة" / "اعرض الخدمات" / "الرئيسية". */
  voiceDirect?: boolean;
  voiceDirectRoute?: string;
}

/** Reusable verify+back button pair for private / human-decision / restricted
 *  intents. Centralised so privacy logic is identical everywhere. */
const verifyAndBack: IntentAction[] = [
  { ar: 'بدء التحقق',   en: 'Start verification', kind: 'verify', variant: 'privacy', iconKind: 'shield' },
  { ar: 'رجوع',         en: 'Back',               kind: 'back',   variant: 'cancel',  iconKind: 'back' },
];

/** ═════════════════════════════════════════════════════════════════════
 *  PUBLIC-SAFE / GREEN — answered directly on the kiosk.
 *  ═════════════════════════════════════════════════════════════════════ */

const PUBLIC_INTENTS: IntentDef[] = [
  {
    id: 'student-affairs-location',
    category: 'public-safe',
    recognitionAr: 'موقع شؤون الطلبة',
    recognitionEn: 'Student Affairs location',
    responseAr: 'شؤون الطلبة موجودة في مبنى ٤، الدور الأرضي. تبعد عنك تقريبًا ٦ دقائق مشي.',
    responseEn: 'Student Affairs is in Building 4 — Ground floor. About a 6-minute walk from here.',
    actions: [
      { ar: 'عرض الخريطة',          en: 'Show on map',         to: '/map/student-affairs',           variant: 'primary',   iconKind: 'map' },
      { ar: 'ساعات العمل',          en: 'Working hours',        to: '/hours/student-affairs',         variant: 'secondary', iconKind: 'clock' },
      { ar: 'خدمات شؤون الطلبة',    en: 'Student Affairs services', to: '/service/student-affairs',  variant: 'secondary', iconKind: 'building' },
      { ar: 'رجوع',                 en: 'Back',                 kind: 'back',                         variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['وين شؤون الطلبة', 'شؤون الطلبة', 'مكان شؤون الطلبة', 'موقع شؤون الطلبة'],
    phrasesEn: ['where is student affairs', 'student affairs', 'student affairs location'],
  },
  {
    id: 'admissions-location',
    category: 'public-safe',
    recognitionAr: 'موقع القبول والتسجيل',
    recognitionEn: 'Admissions & Registration location',
    responseAr: 'القبول والتسجيل في مبنى ١. تبعد عنك تقريبًا ٨ دقائق مشي.',
    responseEn: 'Admissions & Registration is in Building 1. About an 8-minute walk from here.',
    actions: [
      { ar: 'عرض الخريطة',  en: 'Show on map',     to: '/map/admissions',           variant: 'primary',   iconKind: 'map' },
      { ar: 'ساعات العمل',  en: 'Working hours',    to: '/hours/admissions',         variant: 'secondary', iconKind: 'clock' },
      { ar: 'استفسار قبول', en: 'Admission inquiry', to: '/admissions/inquiry',      variant: 'secondary', iconKind: 'list' },
      { ar: 'رجوع',         en: 'Back',             kind: 'back',                    variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['وين القبول والتسجيل', 'القبول والتسجيل', 'مكان القبول'],
    phrasesEn: ['where is admissions', 'admissions and registration', 'admissions'],
  },
  {
    id: 'show-campus-map',
    category: 'public-safe',
    recognitionAr: 'عرض خريطة الحرم',
    recognitionEn: 'Show the campus map',
    responseAr: 'هذه خريطة الحرم. اختر مبنى لرؤية موقعه واتجاهات الوصول.',
    responseEn: 'Here is the campus map. Pick a building to view its location and walking directions.',
    actions: [
      { ar: 'فتح الخريطة', en: 'Open the map', to: '/map/main-gate', variant: 'primary',   iconKind: 'map' },
      { ar: 'الخدمات',     en: 'Services',     to: '/services',      variant: 'secondary', iconKind: 'list' },
      { ar: 'رجوع',        en: 'Back',         kind: 'back',         variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['الخريطة', 'اعرض الخريطة', 'عرض الخريطة', 'خريطة الحرم'],
    phrasesEn: ['show the map', 'campus map', 'show campus map', 'map'],
  },
  {
    id: 'cafeteria-info',
    category: 'public-safe',
    recognitionAr: 'مواعيد الكافتيريا',
    recognitionEn: 'Cafeteria hours',
    responseAr: 'الكافتيريا مفتوحة الآن. ساعات العمل من ٧:٣٠ صباحًا إلى ٦:٠٠ مساءً.',
    responseEn: 'The cafeteria is open now. Hours: 7:30 AM – 6:00 PM.',
    actions: [
      { ar: 'عرض الموقع',     en: 'Show location',  to: '/map/cafeteria',         variant: 'primary',   iconKind: 'map' },
      { ar: 'قائمة اليوم',    en: "Today's menu",   to: '/cafeteria/menu',        variant: 'secondary', iconKind: 'food' },
      { ar: 'العروض النشطة',  en: 'Active offers',  to: '/cafeteria/offers',      variant: 'secondary', iconKind: 'sparkle' },
      { ar: 'رجوع',           en: 'Back',           kind: 'back',                 variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['متى تفتح الكافتيريا', 'مواعيد الكافتيريا', 'الكافتيريا', 'أقرب كافتيريا'],
    phrasesEn: ['cafeteria hours', 'when does the cafeteria open', 'nearest cafeteria', 'cafeteria'],
  },
  {
    id: 'cafeteria-menu',
    category: 'public-safe',
    recognitionAr: 'قائمة طعام اليوم',
    recognitionEn: "Today's cafeteria menu",
    responseAr: 'هذه قائمة الطعام لليوم في الكافتيريا الجامعية.',
    responseEn: "Here's today's cafeteria menu.",
    actions: [
      { ar: 'فتح القائمة',  en: 'Open the menu',  to: '/cafeteria/menu',   variant: 'primary',   iconKind: 'food' },
      { ar: 'العروض',       en: 'Offers',         to: '/cafeteria/offers', variant: 'secondary', iconKind: 'sparkle' },
      { ar: 'رجوع',         en: 'Back',           kind: 'back',            variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['قائمة الطعام', 'قائمة الطعام اليوم', 'منيو الكافتيريا'],
    phrasesEn: ['cafeteria menu', "today's menu", 'food menu'],
  },
  {
    id: 'events-today',
    category: 'public-safe',
    recognitionAr: 'فعاليات اليوم',
    recognitionEn: "Today's events",
    responseAr: 'هذه الفعاليات المتاحة اليوم في الحرم. التسجيل في فعالية يحتاج تحقق من الرقم الجامعي.',
    responseEn: 'Here are the events available on campus today. Registering for an event requires University ID verification.',
    actions: [
      { ar: 'عرض الفعاليات', en: 'View events',   to: '/events/today',     variant: 'primary',   iconKind: 'event' },
      { ar: 'الأندية',        en: 'Clubs',         to: '/clubs/directory',  variant: 'secondary', iconKind: 'list' },
      { ar: 'رجوع',           en: 'Back',          kind: 'back',            variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['فعاليات اليوم', 'الفعاليات اليوم', 'الفعاليات', 'أنشطة اليوم'],
    phrasesEn: ['events today', "today's events", 'activities today'],
  },
  {
    id: 'queue-status',
    category: 'public-safe',
    recognitionAr: 'حالة الانتظار',
    recognitionEn: 'Queue status',
    responseAr: 'الانتظار المتوقع في شؤون الطلبة متوسط، حوالي ١٠–١٥ دقيقة. يمكن استعراض حالة بقية الخدمات.',
    responseEn: 'Estimated wait at Student Affairs is medium, around 10–15 minutes. You can also view other services.',
    actions: [
      { ar: 'عرض حالة الانتظار', en: 'View queue status', to: '/queue',                  variant: 'primary',   iconKind: 'queue' },
      { ar: 'موقع شؤون الطلبة',   en: 'Student Affairs map', to: '/map/student-affairs',  variant: 'secondary', iconKind: 'map' },
      { ar: 'رجوع',               en: 'Back',               kind: 'back',                 variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['حالة الانتظار', 'الانتظار', 'الزحمة', 'كم مدة الانتظار'],
    phrasesEn: ['queue status', 'wait time', 'how busy is it', 'congestion'],
  },
  {
    id: 'service-hours',
    category: 'public-safe',
    recognitionAr: 'مواعيد الخدمات',
    recognitionEn: 'Service hours',
    responseAr: 'هذه قائمة الخدمات الجامعية وساعات عملها. اختر خدمة لعرض موقعها على الخريطة.',
    responseEn: 'Here is the list of campus services and their working hours. Pick a service to view its location on the map.',
    actions: [
      { ar: 'عرض الخدمات', en: 'View services', to: '/services',     variant: 'primary',   iconKind: 'list' },
      { ar: 'الخريطة',      en: 'Map',           to: '/map/main-gate', variant: 'secondary', iconKind: 'map' },
      { ar: 'رجوع',         en: 'Back',          kind: 'back',         variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['مواعيد الخدمات', 'ساعات العمل', 'الخدمات', 'دوام الخدمات'],
    phrasesEn: ['service hours', 'working hours', 'services', 'opening hours'],
  },
  {
    id: 'document-pickup-info',
    category: 'public-safe',
    recognitionAr: 'مكان استلام الوثائق',
    recognitionEn: 'Document pickup location',
    responseAr: 'استلام الوثائق في مبنى ٤ — شباك ٣. أكمل من جوالك بأمان لعرض رمز الاستلام أو متابعة الطلب.',
    responseEn: 'Document pickup is at Building 4 — Counter 3. Continue privately on your phone to view your pickup code or track a request.',
    actions: [
      { ar: 'عرض الخريطة',     en: 'Show on map',  to: '/map/document-pickup',     variant: 'primary',   iconKind: 'map' },
      { ar: 'ساعات العمل',     en: 'Working hours', to: '/hours/document-pickup',  variant: 'secondary', iconKind: 'clock' },
      { ar: 'متابعة طلبي',     en: 'Track my request', to: '#intent:request-status', variant: 'secondary', iconKind: 'document' },
      { ar: 'رجوع',            en: 'Back',          kind: 'back',                  variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['وين أستلم الوثائق', 'استلام الوثائق', 'مكان الاستلام'],
    phrasesEn: ['where do i pick up documents', 'document pickup', 'pickup location'],
  },
  {
    id: 'library-info',
    category: 'public-safe',
    recognitionAr: 'موقع المكتبة',
    recognitionEn: 'Library location',
    responseAr: 'المكتبة في مبنى ٢. مفتوحة من ٨:٠٠ صباحًا إلى ٨:٠٠ مساءً. يمكنك البحث في الفهرس مباشرة.',
    responseEn: 'The library is in Building 2. Open 8:00 AM – 8:00 PM. You can search the catalog directly.',
    actions: [
      { ar: 'البحث في الفهرس',   en: 'Search the catalog', to: '/library/catalog',     variant: 'primary',   iconKind: 'book' },
      { ar: 'القاعات الدراسية',  en: 'Study rooms',         to: '/library/study-rooms', variant: 'secondary', iconKind: 'building' },
      { ar: 'عرض الموقع',         en: 'Show on map',         to: '/map/library',         variant: 'secondary', iconKind: 'map' },
      { ar: 'رجوع',                en: 'Back',                 kind: 'back',               variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['وين المكتبة', 'المكتبة', 'موقع المكتبة', 'البحث في الفهرس'],
    phrasesEn: ['where is the library', 'library', 'library location', 'search the catalog'],
  },
  {
    id: 'tech-support-info',
    category: 'public-safe',
    recognitionAr: 'موقع الدعم التقني',
    recognitionEn: 'Tech Support location',
    responseAr: 'الدعم التقني في مبنى ٣. يمكنك مراجعة دليل حل مشاكل الواي فاي والدخول الموحّد مباشرة.',
    responseEn: 'Tech Support is in Building 3. You can review the Wi-Fi and SSO troubleshooting guides directly.',
    actions: [
      { ar: 'مشكلة واي فاي',   en: 'Wi-Fi issue',    to: '/tech/wifi', variant: 'primary',   iconKind: 'wifi' },
      { ar: 'دخول موحّد',       en: 'SSO issue',      to: '/tech/sso',  variant: 'secondary', iconKind: 'wrench' },
      { ar: 'عرض الموقع',       en: 'Show on map',    to: '/map/tech-support', variant: 'secondary', iconKind: 'map' },
      { ar: 'رجوع',              en: 'Back',           kind: 'back',     variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['وين الدعم التقني', 'الدعم التقني'],
    phrasesEn: ['where is tech support', 'tech support'],
  },
  {
    id: 'wifi-help',
    category: 'public-safe',
    recognitionAr: 'مشكلة في الواي فاي',
    recognitionEn: 'Wi-Fi issue',
    responseAr: 'هذا دليل عام لحل أكثر مشاكل الواي فاي شيوعًا. لا يحتاج تسجيل دخول.',
    responseEn: "Here's a general Wi-Fi troubleshooting guide. No login required.",
    actions: [
      { ar: 'فتح الدليل',     en: 'Open the guide', to: '/tech/wifi',     variant: 'primary',   iconKind: 'wifi' },
      { ar: 'فتح تذكرة دعم', en: 'Open a ticket',   to: '#intent:support-ticket-open', variant: 'secondary', iconKind: 'document' },
      { ar: 'رجوع',           en: 'Back',            kind: 'back',          variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['مشكلة في الواي فاي', 'الواي فاي', 'الإنترنت ما يشتغل', 'مشكلة واي فاي'],
    phrasesEn: ['wifi issue', 'wifi problem', 'internet not working', 'wi-fi'],
  },
  {
    id: 'sso-help',
    category: 'public-safe',
    recognitionAr: 'مشاكل الدخول الموحّد',
    recognitionEn: 'SSO login issues',
    responseAr: 'هذا دليل عام لحل مشاكل الدخول الموحّد (SSO). لإعادة تعيين كلمة المرور تحتاج تحقق آمن.',
    responseEn: 'Here is a general guide for SSO login issues. To reset your password you need secure verification.',
    actions: [
      { ar: 'فتح الدليل',          en: 'Open the guide',  to: '/tech/sso',                  variant: 'primary',   iconKind: 'wrench' },
      { ar: 'إعادة تعيين كلمة المرور', en: 'Reset password', to: '#intent:reset-password',    variant: 'secondary', iconKind: 'shield' },
      { ar: 'رجوع',                  en: 'Back',            kind: 'back',                     variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['مشاكل الدخول الموحد', 'الدخول الموحد', 'sso', 'مشكلة دخول'],
    phrasesEn: ['sso issues', 'sso login', 'single sign on', 'login issues'],
  },
  {
    id: 'emergency-info',
    category: 'public-safe',
    recognitionAr: 'الحالات الطارئة',
    recognitionEn: 'Emergency information',
    responseAr: 'في حالات الطوارئ الصحية، اتصل برقم الطوارئ الجامعية فورًا أو توجه للعيادة.',
    responseEn: 'For medical emergencies, call the campus emergency line immediately or head to the clinic.',
    actions: [
      { ar: 'بطاقة الطوارئ', en: 'Emergency card', to: '/clinic/emergency', variant: 'primary',   iconKind: 'cross' },
      { ar: 'موقع العيادة', en: 'Clinic location',  to: '/map/clinic',       variant: 'secondary', iconKind: 'map' },
      { ar: 'رجوع',          en: 'Back',             kind: 'back',           variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['الحالات الطارئة', 'الطوارئ', 'الإسعاف', 'حالة طارئة'],
    phrasesEn: ['emergency', 'urgent', 'emergency information', 'help'],
  },
  {
    id: 'general-consultation',
    category: 'public-safe',
    recognitionAr: 'استشارة عامة',
    recognitionEn: 'General consultation',
    responseAr: 'يمكنك بدء استشارة عامة في شؤون الطلبة أو العيادة الجامعية. الاستشارة الشخصية تحتاج تحقق آمن.',
    responseEn: 'You can start a general consultation at Student Affairs or the University Clinic. Personal consultations need secure verification.',
    actions: [
      { ar: 'شؤون الطلبة',  en: 'Student Affairs',  to: '/student-affairs/info', variant: 'primary',   iconKind: 'building' },
      { ar: 'العيادة',       en: 'Clinic',           to: '/clinic/info',          variant: 'secondary', iconKind: 'cross' },
      { ar: 'رجوع',          en: 'Back',             kind: 'back',                variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['استشارة عامة', 'أحتاج استشارة', 'مساعدة عامة'],
    phrasesEn: ['general consultation', 'i need help', 'general advice'],
  },
];

/** ═════════════════════════════════════════════════════════════════════
 *  NAV COMMANDS — voice-only direct navigation.
 *  Same chat-style response as any public intent for typed input, but voice
 *  utterances bypass the chat card and navigate directly. Reserved for
 *  unambiguous "open / show / go to" verbs that the user clearly intends as
 *  navigation rather than a question.
 *  ═════════════════════════════════════════════════════════════════════ */

const NAV_COMMAND_INTENTS: IntentDef[] = [
  {
    id: 'nav-open-map',
    category: 'public-safe',
    voiceDirect: true,
    voiceDirectRoute: '/map/main-gate',
    recognitionAr: 'فتح الخريطة',
    recognitionEn: 'Open the map',
    responseAr: 'تم فتح الخريطة. يمكنك اختيار مبنى لرؤية موقعه واتجاهات الوصول.',
    responseEn: 'Map opened. Pick a building to view its location and walking directions.',
    actions: [
      { ar: 'فتح الخريطة', en: 'Open the map', to: '/map/main-gate', variant: 'primary',   iconKind: 'map' },
      { ar: 'الخدمات',     en: 'Services',     to: '/services',       variant: 'secondary', iconKind: 'list' },
      { ar: 'رجوع',        en: 'Back',         kind: 'back',          variant: 'cancel',   iconKind: 'back' },
    ],
    phrasesAr: ['افتح الخريطة', 'فتح الخريطة', 'وريني الخريطة', 'افتح خريطة الحرم'],
    phrasesEn: ['open the map', 'open map', 'show me the map', 'open campus map'],
  },
  {
    id: 'nav-show-services',
    category: 'public-safe',
    voiceDirect: true,
    voiceDirectRoute: '/services',
    recognitionAr: 'عرض دليل الخدمات',
    recognitionEn: 'Show the services directory',
    responseAr: 'تم فتح دليل الخدمات الجامعية. اختر خدمة لعرض موقعها وساعات عملها.',
    responseEn: 'Services directory opened. Pick a service to view its location and hours.',
    actions: [
      { ar: 'دليل الخدمات', en: 'Services directory', to: '/services',       variant: 'primary',   iconKind: 'list' },
      { ar: 'الخريطة',       en: 'Campus map',          to: '/map/main-gate',  variant: 'secondary', iconKind: 'map' },
      { ar: 'رجوع',          en: 'Back',                kind: 'back',          variant: 'cancel',   iconKind: 'back' },
    ],
    phrasesAr: ['اعرض الخدمات', 'افتح الخدمات', 'دليل الخدمات', 'اعرض دليل الخدمات'],
    phrasesEn: ['show services', 'open services', 'services directory', 'show the services directory'],
  },
  {
    id: 'nav-home',
    category: 'public-safe',
    voiceDirect: true,
    voiceDirectRoute: '/home',
    recognitionAr: 'العودة للرئيسية',
    recognitionEn: 'Back to home',
    responseAr: 'تم الرجوع للشاشة الرئيسية.',
    responseEn: 'Returning to the home screen.',
    actions: [
      { ar: 'الرئيسية', en: 'Home', to: '/home', variant: 'primary', iconKind: 'home' },
      { ar: 'رجوع',     en: 'Back', kind: 'back', variant: 'cancel', iconKind: 'back' },
    ],
    phrasesAr: ['الرئيسية', 'ارجع للرئيسية', 'الصفحة الرئيسية', 'الرجوع للرئيسية'],
    phrasesEn: ['home', 'go home', 'back to home', 'main screen'],
  },
  {
    id: 'nav-open-queue',
    category: 'public-safe',
    voiceDirect: true,
    voiceDirectRoute: '/queue',
    recognitionAr: 'فتح حالة الانتظار',
    recognitionEn: 'Open queue status',
    responseAr: 'تم فتح شاشة حالة الانتظار للخدمات الجامعية.',
    responseEn: 'Queue status opened for campus services.',
    actions: [
      { ar: 'حالة الانتظار', en: 'Queue status', to: '/queue', variant: 'primary',   iconKind: 'queue' },
      { ar: 'رجوع',           en: 'Back',          kind: 'back', variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['افتح حالة الانتظار', 'افتح الانتظار', 'شاشة الانتظار'],
    phrasesEn: ['open queue', 'open the queue', 'queue screen', 'open queue status'],
  },
  {
    id: 'nav-events-today',
    category: 'public-safe',
    voiceDirect: true,
    voiceDirectRoute: '/events/today',
    recognitionAr: 'فتح فعاليات اليوم',
    recognitionEn: "Open today's events",
    responseAr: 'تم فتح صفحة فعاليات اليوم.',
    responseEn: "Today's events opened.",
    actions: [
      { ar: 'فعاليات اليوم', en: "Today's events", to: '/events/today', variant: 'primary',   iconKind: 'event' },
      { ar: 'رجوع',           en: 'Back',           kind: 'back',         variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['افتح فعاليات اليوم', 'وريني الفعاليات', 'افتح الفعاليات'],
    phrasesEn: ['open events', 'open today events', 'open the events page'],
  },
];

/** ═════════════════════════════════════════════════════════════════════
 *  PRIVATE — University ID then QR.
 *  ═════════════════════════════════════════════════════════════════════ */

const PRIVATE_INTENTS: IntentDef[] = [
  {
    id: 'request-status',
    category: 'private',
    recognitionAr: 'حالة طلبي',
    recognitionEn: 'My request status',
    responseAr: 'متابعة حالة الطلب تحتوي على بيانات خاصة ولا تظهر تفاصيلها على شاشة عامة. للمتابعة، أدخل رقمك الجامعي ثم أكمل من جوالك بأمان.',
    responseEn: 'Tracking your request involves personal data and is not displayed on a public screen. To continue, enter your University ID and continue securely on your phone.',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/document-pickup?action=my-request-status', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['حالة طلبي', 'متابعة طلب', 'وين طلبي', 'حالة الطلب', 'متابعة الطلب'],
    phrasesEn: ['my request status', 'track my request', 'request tracking', 'request status'],
  },
  {
    id: 'pickup-transcript',
    category: 'private',
    recognitionAr: 'استلام كشف الدرجات',
    recognitionEn: 'Pick up transcript',
    responseAr: 'كشف الدرجات يحتوي على بيانات أكاديمية خاصة ولا يظهر على شاشة عامة. أدخل رقمك الجامعي ثم أكمل من جوالك بأمان.',
    responseEn: 'Transcripts contain personal academic data and are not shown on a public screen. Enter your University ID and continue securely on your phone.',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/document-pickup?action=pick-up-transcript', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['كشف درجات', 'أبغى كشف درجات', 'استلام كشف درجات', 'الكشف الأكاديمي'],
    phrasesEn: ['transcript', 'pick up transcript', 'request transcript', 'grade report'],
  },
  {
    id: 'pickup-graduation',
    category: 'private',
    recognitionAr: 'وثيقة التخرج',
    recognitionEn: 'Graduation certificate',
    responseAr: 'طلب وثيقة التخرج يحتاج تحققًا وفحص أهلية، ثم اعتماد الموظف قبل الإصدار. أكمل من جوالك بأمان.',
    responseEn: 'Graduation certificate requests need verification and eligibility checks, then staff approval before issuance. Continue securely on your phone.',
    badgeAr: 'يحتاج اعتماد الموظف',
    badgeEn: 'Needs staff approval',
    actions: [
      { ar: 'بدء التحقق',   en: 'Start verification', kind: 'verify', to: '/request/graduation', variant: 'privacy', iconKind: 'shield' },
      { ar: 'معرفة الخطوات', en: 'See the steps',     to: '/start-request/student-affairs?action=graduation-certificate', variant: 'secondary', iconKind: 'list' },
      { ar: 'رجوع',          en: 'Back',                kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['وثيقة تخرج', 'أبغى وثيقة تخرج', 'استلام وثيقة تخرج', 'شهادة التخرج'],
    phrasesEn: ['graduation certificate', 'graduation document', 'pick up graduation', 'graduation'],
  },
  {
    id: 'enrollment-letter',
    category: 'private',
    recognitionAr: 'إثبات قيد',
    recognitionEn: 'Enrollment letter',
    responseAr: 'إصدار إثبات القيد آلي بعد التحقق من الرقم الجامعي. لن يظهر الخطاب على شاشة عامة — يصلك على جوالك.',
    responseEn: 'Enrollment letters are issued automatically after University ID verification. The letter never appears on the public screen — it reaches you on your phone.',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/request/enrollment', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['إثبات قيد', 'إصدار إثبات قيد', 'أبغى إثبات قيد', 'خطاب تعريف'],
    phrasesEn: ['enrollment letter', 'issue enrollment letter', 'proof of enrollment'],
  },
  {
    id: 'update-info',
    category: 'private',
    recognitionAr: 'تحديث البيانات الشخصية',
    recognitionEn: 'Personal information update',
    responseAr: 'تحديث البيانات الشخصية يحتاج تحققًا خاصًا ومراجعة الموظف قبل تعديل السجل.',
    responseEn: 'Updating personal information requires private verification and staff review before any record change.',
    badgeAr: 'يحتاج اعتماد الموظف',
    badgeEn: 'Needs staff approval',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/student-affairs?action=update-info', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['تحديث بياناتي', 'تعديل بياناتي', 'تحديث البيانات', 'تغيير رقم الجوال'],
    phrasesEn: ['update my info', 'update personal information', 'change my phone', 'update info'],
  },
  {
    id: 'admission-status',
    category: 'private',
    recognitionAr: 'حالة قبولي',
    recognitionEn: 'My admission status',
    responseAr: 'متابعة حالة القبول تكشف بيانات شخصية. أدخل رقمك الجامعي ثم أكمل من جوالك بأمان.',
    responseEn: 'Admission status involves personal data. Enter your University ID and continue securely on your phone.',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/admissions?action=my-admission-status', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['حالة قبولي', 'هل تم قبولي', 'متابعة قبول'],
    phrasesEn: ['my admission status', 'am i accepted', 'admission status'],
  },
  {
    id: 'reset-password',
    category: 'private',
    recognitionAr: 'إعادة تعيين كلمة المرور',
    recognitionEn: 'Reset password',
    responseAr: 'إعادة تعيين كلمة المرور إجراء على حسابك ولا يتم على شاشة عامة. أدخل رقمك الجامعي ثم أكمل من جوالك.',
    responseEn: "Resetting a password is an account action and never happens on a public screen. Enter your University ID and continue privately on your phone.",
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/tech-support?action=reset-password', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['نسيت كلمة المرور', 'إعادة تعيين كلمة المرور', 'تغيير كلمة السر'],
    phrasesEn: ['reset password', 'forgot password', 'change password'],
  },
  {
    id: 'support-ticket-open',
    category: 'private',
    recognitionAr: 'فتح تذكرة دعم فني',
    recognitionEn: 'Open a support ticket',
    responseAr: 'فتح تذكرة دعم يحتوي على تفاصيل خاصة بالحساب أو الجهاز. أدخل رقمك الجامعي ثم أكمل من جوالك.',
    responseEn: 'Opening a support ticket includes account or device details. Enter your University ID and continue privately on your phone.',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/tech-support?action=support-ticket', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['فتح تذكرة دعم', 'تذكرة دعم فنية', 'بلاغ مشكلة'],
    phrasesEn: ['open support ticket', 'open a ticket', 'report issue'],
  },
  {
    id: 'borrow-book',
    category: 'private',
    recognitionAr: 'إعارة كتاب',
    recognitionEn: 'Borrow a book',
    responseAr: 'الإعارة مرتبطة بحسابك في المكتبة. أدخل رقمك الجامعي ثم أكمل من جوالك.',
    responseEn: 'Borrowing is tied to your library account. Enter your University ID and continue privately on your phone.',
    actions: [
      { ar: 'بدء التحقق',         en: 'Start verification',   kind: 'verify', to: '/start-request/library?action=borrow-a-book', variant: 'privacy', iconKind: 'shield' },
      { ar: 'البحث في الفهرس',    en: 'Search the catalog',    to: '/library/catalog',                                            variant: 'secondary', iconKind: 'book' },
      { ar: 'رجوع',                en: 'Back',                  kind: 'back',                                                      variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['إعارة كتاب', 'استعارة كتاب', 'استعير كتاب'],
    phrasesEn: ['borrow a book', 'check out a book', 'book loan'],
  },
  {
    id: 'reserve-study-room',
    category: 'private',
    recognitionAr: 'حجز قاعة دراسية',
    recognitionEn: 'Reserve a study room',
    responseAr: 'حجز القاعة باسمك يحتاج تحقق من الرقم الجامعي. يمكنك استعراض القاعات المتاحة بدون تحقق.',
    responseEn: 'Reserving a room under your name needs University ID verification. You can browse available rooms without verification.',
    actions: [
      { ar: 'بدء التحقق',          en: 'Start verification',  kind: 'verify', to: '/start-request/library?action=reserve-a-study-room', variant: 'privacy', iconKind: 'shield' },
      { ar: 'استعراض القاعات',     en: 'Browse rooms',         to: '/library/study-rooms',                                                variant: 'secondary', iconKind: 'building' },
      { ar: 'رجوع',                 en: 'Back',                 kind: 'back',                                                              variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['حجز قاعة دراسية', 'حجز قاعة المكتبة', 'حجز غرفة'],
    phrasesEn: ['reserve a study room', 'book a study room', 'study room booking'],
  },
  {
    id: 'reserve-hall',
    category: 'private',
    recognitionAr: 'حجز قاعة',
    recognitionEn: 'Reserve a hall',
    responseAr: 'حجز قاعة يحتاج اعتماد الموظف بعد التحقق من الرقم الجامعي. يمكنك استعراض القاعات المتاحة الآن.',
    responseEn: 'Reserving a hall needs staff approval after University ID verification. You can browse available halls right now.',
    badgeAr: 'يحتاج اعتماد الموظف',
    badgeEn: 'Needs staff approval',
    actions: [
      { ar: 'بدء طلب الحجز',       en: 'Start booking request', kind: 'verify', to: '/start-request/activities?action=reserve-a-hall', variant: 'privacy', iconKind: 'shield' },
      { ar: 'استعراض القاعات',     en: 'Browse halls',           to: '/rooms/availability',                                              variant: 'secondary', iconKind: 'building' },
      { ar: 'رجوع',                 en: 'Back',                   kind: 'back',                                                            variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['حجز قاعة', 'حجز قاعة محاضرات', 'حجز قاعة باسمي'],
    phrasesEn: ['reserve a hall', 'book a hall', 'hall booking'],
  },
  {
    id: 'club-membership',
    category: 'private',
    recognitionAr: 'الانضمام لنادي طلابي',
    recognitionEn: 'Join a student club',
    responseAr: 'طلب الانضمام يحتاج تحقق من الرقم الجامعي ثم يراجعه مسؤول النادي. يمكنك استعراض الأندية الآن.',
    responseEn: 'Joining a club needs University ID verification, then the club coordinator reviews. You can browse clubs right now.',
    badgeAr: 'يحتاج مراجعة المسؤول',
    badgeEn: 'Needs coordinator review',
    actions: [
      { ar: 'بدء طلب الانضمام', en: 'Start membership request', kind: 'verify', to: '/start-request/activities?action=join-a-club', variant: 'privacy', iconKind: 'shield' },
      { ar: 'استعراض الأندية',    en: 'Browse clubs',              to: '/clubs/directory',                                            variant: 'secondary', iconKind: 'list' },
      { ar: 'رجوع',                en: 'Back',                      kind: 'back',                                                       variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['الانضمام لنادي', 'طلب انضمام نادي', 'تسجيل بنادي'],
    phrasesEn: ['join a club', 'club membership', 'club registration'],
  },
  {
    id: 'event-registration',
    category: 'private',
    recognitionAr: 'التسجيل في فعالية',
    recognitionEn: 'Event registration',
    responseAr: 'التسجيل في الفعالية يحتاج تحقق من الرقم الجامعي. تذكرتك تصلك على جوالك بعد التأكيد.',
    responseEn: 'Event registration needs University ID verification. Your ticket reaches you on your phone after confirmation.',
    actions: [
      { ar: 'بدء التحقق',     en: 'Start verification', kind: 'verify', to: '/start-request/activities?action=event-registration', variant: 'privacy', iconKind: 'shield' },
      { ar: 'فعاليات اليوم', en: "Today's events",     to: '/events/today',                                                          variant: 'secondary', iconKind: 'event' },
      { ar: 'رجوع',           en: 'Back',                kind: 'back',                                                                 variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['التسجيل في فعالية', 'سجلني في فعالية', 'تسجيل فعالية'],
    phrasesEn: ['register for event', 'event registration', 'sign up for event'],
  },
  {
    id: 'book-appointment',
    category: 'private',
    recognitionAr: 'حجز موعد طبي',
    recognitionEn: 'Book a medical appointment',
    responseAr: 'تأكيد الموعد يحتاج تحقق من الرقم الجامعي. يمكنك استعراض المواعيد المتاحة قبل التحقق.',
    responseEn: 'Confirming an appointment needs University ID verification. You can browse available slots before verifying.',
    actions: [
      { ar: 'بدء التحقق',         en: 'Start verification',  kind: 'verify', to: '/start-request/clinic?action=book-an-appointment', variant: 'privacy', iconKind: 'shield' },
      { ar: 'المواعيد المتاحة',   en: 'Available slots',      to: '/clinic/appointments',                                              variant: 'secondary', iconKind: 'calendar' },
      { ar: 'رجوع',                en: 'Back',                 kind: 'back',                                                            variant: 'cancel',    iconKind: 'back' },
    ],
    phrasesAr: ['حجز موعد', 'حجز موعد طبي', 'موعد عيادة'],
    phrasesEn: ['book appointment', 'medical appointment', 'clinic appointment'],
  },
  {
    id: 'document-pickup-private',
    category: 'private',
    recognitionAr: 'استلام وثيقة التخرج',
    recognitionEn: 'Pick up graduation certificate',
    responseAr: 'استلام الوثيقة يحتاج تحقق من الرقم الجامعي. رمز الاستلام يظهر على جوالك فقط.',
    responseEn: 'Picking up your document needs University ID verification. The pickup code appears only on your phone.',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/document-pickup?action=pick-up-graduation-certificate', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['استلام وثيقة تخرج', 'رمز استلام وثيقة', 'متى أستلم وثيقتي'],
    phrasesEn: ['pick up graduation certificate', 'pickup code', 'when can i pick up my document'],
  },
];

/** ═════════════════════════════════════════════════════════════════════
 *  HUMAN-DECISION / RED — sensitive flows that need staff/authority review.
 *  ═════════════════════════════════════════════════════════════════════ */

const HUMAN_DECISION_INTENTS: IntentDef[] = [
  {
    id: 'major-transfer',
    category: 'human-decision',
    recognitionAr: 'تحويل تخصص',
    recognitionEn: 'Major transfer',
    responseAr: 'تحويل التخصص يحتاج مراجعة من الجهة المختصة، ولا يتم اتخاذ القرار تلقائيًا. للمتابعة، أدخل رقمك الجامعي ثم أكمل الطلب من جوالك.',
    responseEn: 'A major transfer requires review by the relevant authority — the decision is not made automatically. Enter your University ID and complete the request privately on your phone.',
    badgeAr: 'قرار بشري مطلوب',
    badgeEn: 'Human decision required',
    badgeTone: 'unavailable',
    badgeIconKind: 'gavel',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/admissions?action=major-transfer', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['تحويل تخصص', 'أبغى أحول تخصص', 'تغيير تخصص'],
    phrasesEn: ['major transfer', 'change major', 'transfer my major'],
  },
  {
    id: 're-enrollment',
    category: 'human-decision',
    recognitionAr: 'إعادة قيد',
    recognitionEn: 'Re-enrollment',
    responseAr: 'إعادة القيد تحتاج مراجعة وقرار من الجهة المختصة. أدخل رقمك الجامعي ثم أكمل الطلب من جوالك.',
    responseEn: 'Re-enrollment requires review and a decision by the relevant authority. Enter your University ID and complete the request privately on your phone.',
    badgeAr: 'قرار بشري مطلوب',
    badgeEn: 'Human decision required',
    badgeTone: 'unavailable',
    badgeIconKind: 'gavel',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/admissions?action=re-enrollment', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['إعادة قيد', 'أعيد قيدي', 'استعادة قيد'],
    phrasesEn: ['re-enrollment', 're-enroll', 'reactivate enrollment'],
  },
];

/** ═════════════════════════════════════════════════════════════════════
 *  RESTRICTED — must NEVER appear on the public screen.
 *  Always routed through identity verification → QR.
 *  ═════════════════════════════════════════════════════════════════════ */

const RESTRICTED_INTENTS: IntentDef[] = [
  {
    id: 'gpa-grades',
    category: 'restricted',
    recognitionAr: 'المعدل / الدرجات',
    recognitionEn: 'GPA / grades',
    responseAr: 'لا يمكن عرض المعدل أو الدرجات على شاشة عامة. لحماية خصوصيتك، أدخل رقمك الجامعي ثم أكمل من جوالك بأمان.',
    responseEn: 'GPA and grades cannot be shown on a public screen. To protect your privacy, enter your University ID and continue securely on your phone.',
    actions: verifyAndBack.map((a) =>
      a.kind === 'verify' ? { ...a, to: '/refusal' } : a,
    ),
    phrasesAr: ['أبغى أعرف معدلي', 'معدلي', 'درجاتي', 'كم معدلي', 'معدل تراكمي'],
    phrasesEn: ['my gpa', 'check my gpa', 'my grades', 'show my grades'],
  },
  {
    id: 'medical-record',
    category: 'restricted',
    recognitionAr: 'السجل الطبي',
    recognitionEn: 'Medical record',
    responseAr: 'لا يمكن عرض السجل الطبي على شاشة عامة. لحماية خصوصيتك، أدخل رقمك الجامعي ثم أكمل من جوالك بأمان.',
    responseEn: 'Medical records cannot be shown on a public screen. To protect your privacy, enter your University ID and continue securely on your phone.',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/clinic/medical-record', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['سجلي الطبي', 'السجل الطبي', 'بيانات صحية'],
    phrasesEn: ['my medical record', 'medical record', 'health record'],
  },
  {
    id: 'borrowed-books',
    category: 'restricted',
    recognitionAr: 'الكتب المُعارة',
    recognitionEn: 'Borrowed books',
    responseAr: 'لا يمكن عرض الكتب المعارة وحالتها على شاشة عامة. أدخل رقمك الجامعي ثم أكمل من جوالك بأمان.',
    responseEn: 'Your borrowed books cannot be shown on a public screen. Enter your University ID and continue securely on your phone.',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/library?action=my-borrowed-books', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['كتبي المعارة', 'الكتب المعارة', 'كتبي'],
    phrasesEn: ['my borrowed books', 'borrowed books', 'my books'],
  },
  {
    id: 'support-tickets-mine',
    category: 'restricted',
    recognitionAr: 'تذاكر الدعم الخاصة بي',
    recognitionEn: 'My support tickets',
    responseAr: 'لا يمكن عرض تذاكر الدعم وتفاصيلها على شاشة عامة. أدخل رقمك الجامعي ثم أكمل من جوالك بأمان.',
    responseEn: 'Support tickets cannot be shown on a public screen. Enter your University ID and continue securely on your phone.',
    actions: [
      { ar: 'بدء التحقق', en: 'Start verification', kind: 'verify', to: '/start-request/tech-support?action=my-support-tickets', variant: 'privacy', iconKind: 'shield' },
      { ar: 'رجوع',        en: 'Back',                 kind: 'back',   variant: 'cancel',  iconKind: 'back' },
    ],
    phrasesAr: ['تذاكر الدعم', 'تذاكري', 'تذاكر الدعم الفنية'],
    phrasesEn: ['my support tickets', 'support tickets', 'my tickets'],
  },
  {
    id: 'exam-locations',
    category: 'restricted',
    recognitionAr: 'مواقع الاختبارات',
    recognitionEn: 'Exam locations',
    responseAr: 'مواقع الاختبارات وجدولك الشخصي بيانات خاصة لا تُعرض على شاشة عامة. أدخل رقمك الجامعي ثم أكمل من جوالك.',
    responseEn: 'Exam locations and your personal schedule are private and not shown on a public screen. Enter your University ID and continue privately on your phone.',
    actions: verifyAndBack.map((a) =>
      a.kind === 'verify' ? { ...a, to: '/refusal' } : a,
    ),
    phrasesAr: ['وين اختباري', 'مكان اختباري', 'جدولي', 'جدول الاختبارات'],
    phrasesEn: ['where is my exam', 'exam location', 'my schedule', 'exam schedule'],
  },
  {
    id: 'financial-academic-status',
    category: 'restricted',
    recognitionAr: 'الحالة المالية أو الإنذار الأكاديمي',
    recognitionEn: 'Financial holds or academic warnings',
    responseAr: 'الحالات المالية والإنذارات الأكاديمية بيانات خاصة لا تُعرض على شاشة عامة. أدخل رقمك الجامعي ثم أكمل من جوالك.',
    responseEn: 'Financial holds and academic warnings are private and never shown on a public screen. Enter your University ID and continue privately on your phone.',
    actions: verifyAndBack.map((a) =>
      a.kind === 'verify' ? { ...a, to: '/refusal' } : a,
    ),
    phrasesAr: ['حالتي المالية', 'إنذار أكاديمي', 'مرشدي', 'رسالة المرشد'],
    phrasesEn: ['financial status', 'academic warning', 'advisor message'],
  },
];

/** ═════════════════════════════════════════════════════════════════════
 *  AMBIGUOUS — fallback when nothing matches.
 *  ═════════════════════════════════════════════════════════════════════ */

export const AMBIGUOUS_INTENT: IntentDef = {
  id: 'ambiguous',
  category: 'ambiguous',
  recognitionAr: 'الطلب غير واضح',
  recognitionEn: 'Unclear request',
  responseAr: 'ما فهمت الطلب بالكامل. يمكنك اختيار خدمة من الخيارات التالية أو المحاولة مرة أخرى.',
  responseEn: "I didn't fully catch that. You can pick one of the options below, or try again.",
  actions: [
    { ar: 'إعادة المحاولة',  en: 'Try again',        kind: 'retry',   variant: 'primary',   iconKind: 'sparkle' },
    { ar: 'الخدمات',          en: 'All services',     to: '/services', variant: 'secondary', iconKind: 'list' },
    { ar: 'الخريطة',          en: 'Campus map',       to: '/map/main-gate', variant: 'secondary', iconKind: 'map' },
    { ar: 'استلام الوثائق',  en: 'Document pickup',   to: '/service/document-pickup', variant: 'secondary', iconKind: 'document' },
    { ar: 'حالة الطلب',       en: 'Request status',   to: '#intent:request-status',   variant: 'secondary', iconKind: 'document' },
    { ar: 'شؤون الطلبة',      en: 'Student Affairs',   to: '#intent:student-affairs-location', variant: 'secondary', iconKind: 'building' },
  ],
  phrasesAr: [],
  phrasesEn: [],
};

/** ═════════════════════════════════════════════════════════════════════
 *  Public catalog.
 *  ═════════════════════════════════════════════════════════════════════ */

export const INTENTS: IntentDef[] = [
  ...NAV_COMMAND_INTENTS,
  ...PUBLIC_INTENTS,
  ...PRIVATE_INTENTS,
  ...HUMAN_DECISION_INTENTS,
  ...RESTRICTED_INTENTS,
];

export const INTENT_BY_ID: Readonly<Record<string, IntentDef>> = Object.freeze(
  Object.fromEntries(
    [...INTENTS, AMBIGUOUS_INTENT].map((i) => [i.id, i]),
  ),
);

/** Demo phrases offered when the user taps the mic but no real speech
 *  recognition is available. Each one is a recognised intent so the demo
 *  exercises every category. */
export const DEMO_PHRASES_AR: { text: string; intentId: string }[] = [
  { text: 'وين شؤون الطلبة؟',         intentId: 'student-affairs-location' },
  { text: 'أبغى وثيقة تخرج',          intentId: 'pickup-graduation' },
  { text: 'حالة طلبي',                 intentId: 'request-status' },
  { text: 'افتح الخريطة',              intentId: 'nav-open-map' },
  { text: 'الفعاليات اليوم',           intentId: 'events-today' },
  { text: 'أقرب كافتيريا',             intentId: 'cafeteria-info' },
  { text: 'تحويل تخصص',                 intentId: 'major-transfer' },
  { text: 'سجلي الطبي',                 intentId: 'medical-record' },
  { text: 'مشكلة في الواي فاي',       intentId: 'wifi-help' },
];

export const DEMO_PHRASES_EN: { text: string; intentId: string }[] = [
  { text: 'Where is Student Affairs?',         intentId: 'student-affairs-location' },
  { text: 'I need a graduation certificate',   intentId: 'pickup-graduation' },
  { text: 'My request status',                  intentId: 'request-status' },
  { text: 'Open the map',                       intentId: 'nav-open-map' },
  { text: "Today's events",                     intentId: 'events-today' },
  { text: 'Nearest cafeteria',                  intentId: 'cafeteria-info' },
  { text: 'Major transfer',                     intentId: 'major-transfer' },
  { text: 'My medical record',                  intentId: 'medical-record' },
  { text: 'Wi-Fi issue',                        intentId: 'wifi-help' },
];
