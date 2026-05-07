export type ServiceTier = 'green' | 'yellow' | 'black';
export type ServiceStatus = 'open' | 'closed' | 'closing' | 'busy';
export type Queue = { level: 'low' | 'medium' | 'high'; minutes: number } | null;

export interface Service {
  id: string;
  icon: string;
  nameAr: string;
  nameEn: string;
  building: string;
  buildingEn: string;
  hours: { from: string; to: string };
  status: ServiceStatus;
  queue: Queue;
  walkMin: number;
  meters: number;
  category: 'students' | 'facilities' | 'documents' | 'support' | 'emergency';
  /** Approximate location on KAU Jeddah campus. */
  lat: number;
  lng: number;
  available: { id: string; titleAr: string; titleEn: string; tier: ServiceTier }[];
}

/** KAU Jeddah main campus reference point. */
export const KAU_CENTER = { lat: 21.4936, lng: 39.2469 };

export const SERVICES: Service[] = [
  {
    id: 'student-affairs',
    icon: 'building',
    nameAr: 'شؤون الطلبة',
    nameEn: 'Student Affairs',
    building: 'مبنى ٤ — الدور الأرضي',
    buildingEn: 'Building 4 — Ground floor',
    hours: { from: '٨:٠٠ ص', to: '٣:٠٠ م' },
    status: 'open',
    queue: { level: 'medium', minutes: 12 },
    walkMin: 6,
    meters: 450,
    category: 'students',
    lat: 21.4926,
    lng: 39.2467,
    available: [
      { id: 'enrollment-letter', titleAr: 'إثبات قيد', titleEn: 'Enrollment letter', tier: 'green' },
      { id: 'graduation-certificate', titleAr: 'وثيقة تخرج', titleEn: 'Graduation certificate', tier: 'black' },
      { id: 'update-info', titleAr: 'تحديث البيانات الشخصية', titleEn: 'Personal information update', tier: 'yellow' },
      { id: 'general-inquiry', titleAr: 'استشارة عامة', titleEn: 'General inquiry', tier: 'green' },
    ],
  },
  {
    id: 'admissions',
    icon: 'graduation',
    nameAr: 'القبول والتسجيل',
    nameEn: 'Admissions & Registration',
    building: 'مبنى ١',
    buildingEn: 'Building 1',
    hours: { from: '٨:٠٠ ص', to: '٣:٠٠ م' },
    status: 'open',
    queue: { level: 'high', minutes: 25 },
    walkMin: 8,
    meters: 620,
    category: 'students',
    lat: 21.4942,
    lng: 39.2476,
    available: [
      { id: 'admission-inquiry', titleAr: 'استفسار عن قبول', titleEn: 'Admission inquiry', tier: 'green' },
      { id: 're-enrollment', titleAr: 'إعادة قيد', titleEn: 'Re-enrollment', tier: 'yellow' },
      { id: 'major-transfer', titleAr: 'تحويل تخصص', titleEn: 'Major transfer', tier: 'yellow' },
      { id: 'my-admission-status', titleAr: 'حالة قبولي', titleEn: 'My admission status', tier: 'black' },
    ],
  },
  {
    id: 'document-pickup',
    icon: 'file',
    nameAr: 'استلام الوثائق',
    nameEn: 'Document Pickup',
    building: 'مبنى ٤ — شباك ٣',
    buildingEn: 'Building 4 — Counter 3',
    hours: { from: '٩:٠٠ ص', to: '٢:٠٠ م' },
    status: 'open',
    queue: { level: 'low', minutes: 5 },
    walkMin: 6,
    meters: 470,
    category: 'documents',
    lat: 21.4928,
    lng: 39.2469,
    available: [
      { id: 'pick-up-graduation-certificate', titleAr: 'استلام وثيقة تخرج', titleEn: 'Pick up graduation certificate', tier: 'yellow' },
      { id: 'pick-up-transcript', titleAr: 'استلام كشف درجات', titleEn: 'Pick up transcript', tier: 'yellow' },
      { id: 'my-request-status', titleAr: 'متابعة حالة الطلب', titleEn: 'Request tracking', tier: 'yellow' },
    ],
  },
  {
    id: 'library',
    icon: 'book',
    nameAr: 'المكتبة',
    nameEn: 'Library',
    building: 'مبنى ٢',
    buildingEn: 'Building 2',
    hours: { from: '٨:٠٠ ص', to: '٨:٠٠ م' },
    status: 'open',
    queue: { level: 'low', minutes: 5 },
    walkMin: 4,
    meters: 280,
    category: 'facilities',
    lat: 21.4946,
    lng: 39.2459,
    available: [
      { id: 'search-the-catalog', titleAr: 'البحث في الفهرس', titleEn: 'Search the catalog', tier: 'green' },
      { id: 'reserve-a-study-room', titleAr: 'حجز قاعة دراسية', titleEn: 'Reserve a study room', tier: 'yellow' },
      { id: 'borrow-a-book', titleAr: 'إعارة كتاب', titleEn: 'Borrow a book', tier: 'yellow' },
      { id: 'my-borrowed-books', titleAr: 'كتبي المُعارة', titleEn: 'My borrowed books', tier: 'black' },
    ],
  },
  {
    id: 'cafeteria',
    icon: 'coffee',
    nameAr: 'الكافتيريا',
    nameEn: 'Cafeteria',
    building: 'مبنى الخدمات الطلابية',
    buildingEn: 'Student Services Building',
    hours: { from: '٧:٣٠ ص', to: '٦:٠٠ م' },
    status: 'open',
    queue: null,
    walkMin: 4,
    meters: 240,
    category: 'facilities',
    lat: 21.4920,
    lng: 39.2458,
    available: [
      { id: 'todays-menu', titleAr: 'قائمة الطعام اليوم', titleEn: "Today's menu", tier: 'green' },
      { id: 'active-offers', titleAr: 'العروض النشطة', titleEn: 'Active offers', tier: 'green' },
    ],
  },
  {
    id: 'tech-support',
    icon: 'wrench',
    nameAr: 'الدعم التقني',
    nameEn: 'Tech Support',
    building: 'مبنى ٣',
    buildingEn: 'Building 3',
    hours: { from: '٨:٠٠ ص', to: '٤:٠٠ م' },
    status: 'open',
    queue: { level: 'medium', minutes: 10 },
    walkMin: 5,
    meters: 360,
    category: 'support',
    lat: 21.4938,
    lng: 39.2458,
    available: [
      { id: 'sso-login-issues', titleAr: 'مشاكل الدخول الموحد', titleEn: 'SSO login issues', tier: 'green' },
      { id: 'reset-password', titleAr: 'إعادة تعيين كلمة المرور', titleEn: 'Reset password', tier: 'yellow' },
      { id: 'wi-fi-issue', titleAr: 'مشكلة في الواي-فاي', titleEn: 'Wi-Fi issue', tier: 'green' },
      { id: 'my-support-tickets', titleAr: 'تذاكر الدعم الفنية', titleEn: 'My support tickets', tier: 'black' },
    ],
  },
  {
    id: 'clinic',
    icon: 'cross',
    nameAr: 'العيادة الجامعية',
    nameEn: 'University Clinic',
    building: 'مبنى ٦',
    buildingEn: 'Building 6',
    hours: { from: '٨:٠٠ ص', to: '٤:٠٠ م' },
    status: 'open',
    queue: null,
    walkMin: 9,
    meters: 700,
    category: 'support',
    lat: 21.4915,
    lng: 39.2478,
    available: [
      { id: 'book-an-appointment', titleAr: 'حجز موعد', titleEn: 'Book an appointment', tier: 'yellow' },
      { id: 'urgent-cases', titleAr: 'الحالات الطارئة', titleEn: 'Urgent cases', tier: 'green' },
      { id: 'general-consultation', titleAr: 'استشارة عامة', titleEn: 'General consultation', tier: 'green' },
      { id: 'my-medical-record', titleAr: 'سجلي الطبي', titleEn: 'My medical record', tier: 'black' },
    ],
  },
  {
    id: 'activities',
    icon: 'sparkle',
    nameAr: 'مركز الأنشطة',
    nameEn: 'Activities Center',
    building: 'مبنى ٥',
    buildingEn: 'Building 5',
    hours: { from: '٩:٠٠ ص', to: '٣:٠٠ م' },
    status: 'closing',
    queue: null,
    walkMin: 7,
    meters: 540,
    category: 'students',
    lat: 21.4922,
    lng: 39.2482,
    available: [
      { id: 'todays-events', titleAr: 'الفعاليات اليوم', titleEn: "Today's events", tier: 'green' },
      { id: 'join-a-club', titleAr: 'الانضمام لنادي', titleEn: 'Join a club', tier: 'yellow' },
      { id: 'reserve-a-hall', titleAr: 'حجز قاعة', titleEn: 'Reserve a hall', tier: 'yellow' },
    ],
  },
];

export const SUGGESTIONS: { ar: string; en: string; route: string; tier: ServiceTier }[] = [
  { ar: 'وين شؤون الطلبة؟', en: 'Where is Student Affairs?', route: '/assistant/answer/student-affairs', tier: 'green' },
  { ar: 'مواعيد المكتبة',   en: 'Library hours',             route: '/hours/library',                 tier: 'green' },
  { ar: 'إصدار إثبات قيد',   en: 'Issue enrollment letter',   route: '/request/enrollment',           tier: 'green' },
  { ar: 'أقرب كافتيريا',    en: 'Nearest cafeteria',         route: '/hours/cafeteria',               tier: 'green' },
  { ar: 'البوابة الرئيسية', en: 'Main gate',                 route: '/map/main-gate',                 tier: 'green' },
  { ar: 'أبغى وثيقة تخرج',  en: 'Request graduation cert.',  route: '/request/graduation',            tier: 'yellow' },
  { ar: 'أبغى أعرف معدلي',  en: 'Check my GPA',              route: '/refusal',                       tier: 'black' },
];

export const REFUSAL_TRIGGERS = [
  'أبغى أعرف معدلي',
  'وين اختباري؟',
  'هل عندي إنذار أكاديمي؟',
  'أبغى أشوف تفاصيل حالتي المالية',
  'أبغى أشوف رسالة المرشد',
  'وريني وثيقتي',
  'جدولي',
  'درجاتي',
  // Personal admissions queries — Scenario #009 boundary: location/hours/services are public,
  // but personal status/tracking is private and must continue via QR.
  'ما حالة طلبي؟',
  'هل تم قبولي؟',
  'أريد متابعة طلب قبول',
  'رقم طلبي',
];
