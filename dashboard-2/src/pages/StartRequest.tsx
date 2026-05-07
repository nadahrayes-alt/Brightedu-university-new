import { useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  FileText, Lock, ShieldCheck, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  Building2, GraduationCap, BookOpen, Coffee, Wrench, Cross, Sparkles, AlertCircle,
  AlertTriangle, Gavel,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';
import { SERVICES } from '../data/services';
import type { ServiceTier } from '../data/services';

const ICONS: Record<string, typeof Building2> = {
  building: Building2,
  graduation: GraduationCap,
  file: FileText,
  book: BookOpen,
  coffee: Coffee,
  wrench: Wrench,
  cross: Cross,
  sparkle: Sparkles,
};

const CATEGORY_COLORS: Record<string, string> = {
  students:   'bg-primary/10 dark:bg-primary/20 text-primary',
  facilities: 'bg-teal-50 dark:bg-teal/15 text-teal',
  documents:  'bg-privacy/10 dark:bg-privacy/20 text-privacy',
  support:    'bg-warning/15 dark:bg-warning/20 text-warning',
  emergency:  'bg-danger/15 dark:bg-danger/20 text-danger',
};

interface ScenarioCopy {
  titleAr?: string;
  titleEn?: string;
  introAr: string;
  introEn: string;
  stepsAr: string[];
  stepsEn: string[];
  /** Optional override for the steps section title (e.g. private-handoff scenarios). */
  stepsTitleAr?: string;
  stepsTitleEn?: string;
  /** Optional safety note (e.g. AI does not update records itself). */
  noticeAr?: string;
  noticeEn?: string;
  /** Optional override for the tier badge label. */
  badgeAr?: string;
  badgeEn?: string;
  /** Optional override for the badge tone (e.g. 'unavailable' for red 'human decision required'). */
  badgeTone?: 'needs-qr' | 'black-tier' | 'unavailable' | 'private';
  /** Optional override for the badge icon. */
  badgeIconKind?: 'shield' | 'lock' | 'gavel' | 'alert';
  /** Optional supporting text shown under the badge to explain the tier. */
  badgeSupportAr?: string;
  badgeSupportEn?: string;
  /** Optional override for the primary CTA. */
  ctaAr?: string;
  ctaEn?: string;
  /** Optional secondary CTA — e.g. a public-safe alternative path
   *  ("Browse available rooms" alongside "Start booking request"). */
  secondaryCtaAr?: string;
  secondaryCtaEn?: string;
  secondaryRoute?: string;
}

const BADGE_ICONS = {
  shield: <ShieldCheck className="w-5 h-5" />,
  lock: <Lock className="w-5 h-5" />,
  gavel: <Gavel className="w-5 h-5" />,
  alert: <AlertTriangle className="w-5 h-5" />,
} as const;

// Scenario-specific copy. Generic flows fall back to the default config.
const SCENARIO_COPY: Record<string, ScenarioCopy> = {
  // Scenario #008 — Personal Information Update (Yellow-tier, requires staff approval)
  'update-info': {
    titleAr: 'تحديث البيانات الشخصية',
    titleEn: 'Personal information update',
    introAr:
      'لإكمال طلب تحديث بياناتك، تحتاج إلى التحقق من هويتك ورفع المستندات المطلوبة من قناة خاصة وآمنة.',
    introEn:
      'To complete your information-update request, you need to verify your identity and upload the required documents through a private, secure channel.',
    stepsAr: [
      'التحقق من هويتك',
      'رفع المستندات المطلوبة',
      'إرسال الطلب لمراجعة الموظف',
    ],
    stepsEn: [
      'Verify your identity',
      'Upload the required documents',
      'Submit the request for staff review',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لن يقوم المساعد الذكي بتحديث بياناتك تلقائيًا. التحديث يتم بعد مراجعة الموظف فقط.',
    noticeEn:
      'The AI assistant does not update your data automatically. Changes only take effect after staff review.',
    badgeAr: 'يحتاج اعتماد الموظف',
    badgeEn: 'Needs staff approval',
    badgeSupportAr:
      'الذكاء الاصطناعي يتحقق من اكتمال الطلب والمرفقات، والموظف يعتمد التحديث قبل تعديل السجل.',
    badgeSupportEn:
      'The AI assistant validates the request and attachments; a staff member approves before any record change.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Request tracking — Scenario #003 (Urgent Student Affairs Request Tracking)
  // and the general "متابعة حالة الطلب" pattern. Yellow-tier: tracking stages
  // expose personal request details, so the public board only explains the
  // private flow; the actual status appears on the student's phone after
  // private identity verification.
  'my-request-status': {
    titleAr: 'متابعة حالة الطلب',
    titleEn: 'Request tracking',
    introAr:
      'لمتابعة حالة طلبك، تحتاج إلى التحقق من هويتك عبر قناة خاصة وآمنة. ستظهر تفاصيل الطلب على جوالك فقط.',
    introEn:
      'To track your request, you need to verify your identity through a private, secure channel. Request details will appear only on your phone.',
    stepsAr: [
      'التحقق من هويتك',
      'عرض طلباتك الحالية',
      'متابعة حالة الطلب والتحديثات',
    ],
    stepsEn: [
      'Verify your identity',
      'View your current requests',
      'Track request status and updates',
    ],
    stepsTitleAr: 'ما الذي ستراه على جوالك؟',
    stepsTitleEn: 'What will you see on your phone?',
    noticeAr:
      'لن تظهر تفاصيل الطلب أو رقمه أو اسم الطالب أو أسباب التأخير أو المرفقات أو القرارات على هذه اللوحة. كل تحديثات الطلب تصلك على جوالك بعد التحقق.',
    noticeEn:
      'Request details, request ID, student name, delay reasons, attachments, and decisions will never appear on this board. All updates reach you on your phone after verification.',
    badgeAr: 'يحتاج تحقق آمن',
    badgeEn: 'Secure verification required',
    badgeSupportAr:
      'متابعة الطلب تكشف بيانات شخصية، فالاطلاع عليها يتم من جوالك بعد التحقق. اللوحة العامة هنا تُمهّد للقناة الخاصة فقط.',
    badgeSupportEn:
      'Tracking exposes personal data, so it is viewed from your phone after verification. This public board only initiates the private channel.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Pick up graduation certificate — Scenario #002 (with #021 as the upstream
  // request when not yet issued, and #064 for the public pickup-point map).
  // Yellow-tier: pickup code + document status are personal and only appear on
  // the student's phone after private verification. The public board only
  // explains the private flow.
  'pick-up-graduation-certificate': {
    titleAr: 'استلام وثيقة التخرج',
    titleEn: 'Pick up graduation certificate',
    introAr:
      'لإكمال استلام وثيقة التخرج، تحتاج إلى التحقق من هويتك عبر قناة خاصة. لن يتم عرض تفاصيل الوثيقة أو رمز الاستلام على هذه الشاشة.',
    introEn:
      'To pick up your graduation certificate, you need to verify your identity through a private channel. Document details and the pickup code will not be displayed on this screen.',
    stepsAr: [
      'التحقق من هويتك عبر القناة الخاصة',
      'عرض رمز الاستلام على جوالك',
      'التوجه إلى نقطة الاستلام المحددة',
    ],
    stepsEn: [
      'Verify your identity through the private channel',
      'View the pickup code on your phone',
      'Head to the assigned pickup point',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'إذا لم تكن الوثيقة جاهزة بعد، سيتم إشعارك على جوالك عند جاهزيتها. لن يظهر اسم الطالب أو حالة التخرج أو محتوى الوثيقة على اللوحة العامة.',
    noticeEn:
      'If the document is not ready yet, you will be notified on your phone when it is. Student name, graduation status, and document content never appear on the public board.',
    badgeAr: 'يحتاج تحقق آمن',
    badgeEn: 'Secure verification required',
    badgeSupportAr:
      'رمز الاستلام وتفاصيل الوثيقة بيانات شخصية. يتم عرضها فقط على جوالك بعد التحقق، ثم تتوجه لنقطة الاستلام العامة.',
    badgeSupportEn:
      'The pickup code and document details are personal. They appear only on your phone after verification; you then proceed to the public pickup point.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Scenario #001 — Instant Official Transcript Request (with #002 as the
  // pickup flow when ready). Yellow-tier: grades, GPA, and pickup codes are
  // personal and only appear on the phone. The public board only initiates
  // the secure flow.
  'pick-up-transcript': {
    titleAr: 'استلام كشف درجات',
    titleEn: 'Pick up transcript',
    introAr:
      'لإكمال طلب كشف الدرجات، تحتاج إلى التحقق من هويتك عبر قناة خاصة. لن يتم عرض الدرجات أو المعدل أو محتوى الكشف على هذه الشاشة.',
    introEn:
      'To complete a transcript request, verify your identity through a private channel. Grades, GPA, and transcript content will not be displayed on this screen.',
    stepsAr: [
      'التحقق من هويتك عبر القناة الخاصة',
      'استعراض الكشف على جوالك',
      'استلام نسخة رقمية أو رمز الاستلام',
      'التوجه لنقطة الاستلام إذا اخترت نسخة ورقية',
    ],
    stepsEn: [
      'Verify your identity through the private channel',
      'View the transcript on your phone',
      'Receive a digital copy or a pickup code',
      'Head to the pickup point if you chose a paper copy',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'الذكاء الاصطناعي لا يعرض درجاتك أو معدلك على هذه الشاشة. كل تفاصيل الكشف تصل إليك على جوالك بعد التحقق.',
    noticeEn:
      'The AI assistant does not show grades or GPA on this screen. All transcript details reach you on your phone after verification.',
    badgeAr: 'يحتاج تحقق آمن',
    badgeEn: 'Secure verification required',
    badgeSupportAr:
      'كشف الدرجات بيانات أكاديمية شخصية. يتم عرضه فقط على جوالك بعد التحقق من الهوية.',
    badgeSupportEn:
      'A transcript is personal academic data. It is shown only on your phone after identity verification.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Major transfer — academic eligibility + seats + college rules + final human
  // decision. Not part of the original 100-scenario pack; treated as a Red-tier
  // pre-handoff: the public board only collects the request and explains the
  // private flow. All verification/data entry happens on the student's phone.
  'major-transfer': {
    titleAr: 'تحويل تخصص',
    titleEn: 'Major transfer',
    introAr:
      'لإكمال طلب تحويل التخصص، تحتاج إلى التحقق من هويتك واستكمال البيانات من قناة خاصة وآمنة. سيتم توجيه الطلب للجهة المختصة للمراجعة، ولا يتم اتخاذ القرار تلقائيًا.',
    introEn:
      'To complete your major-transfer request, you need to verify your identity and complete the required information through a private, secure channel. The request will be routed to the relevant authority for review; the decision is not made automatically.',
    stepsAr: [
      'التحقق من هويتك',
      'استكمال بيانات طلب التحويل',
      'مراجعة الشروط من الجهة المختصة',
      'إشعارك بنتيجة الطلب بعد القرار',
    ],
    stepsEn: [
      'Verify your identity',
      'Complete the transfer request information',
      'Review of the eligibility rules by the relevant authority',
      'Notify you of the decision after it is made',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لن يقوم المساعد الذكي بالموافقة أو الرفض لطلب تحويل التخصص. القرار يُتخذ من الجهة المختصة بعد مراجعة الشروط الأكاديمية والمقاعد المتاحة.',
    noticeEn:
      'The AI assistant does not approve or reject major-transfer requests. The decision is made by the relevant authority after reviewing academic eligibility and seat availability.',
    badgeAr: 'قرار بشري مطلوب',
    badgeEn: 'Human decision required',
    badgeTone: 'unavailable',
    badgeIconKind: 'gavel',
    badgeSupportAr:
      'هذا الطلب يحتاج مراجعة وقرار من الجهة المختصة. اللوحة العامة تُمهّد للطلب فقط، ولا تعرض المعدل أو السجل الأكاديمي ولا تُجري أي تقييم نهائي.',
    badgeSupportEn:
      'This request requires review and a decision by the relevant authority. The public board only initiates the request — it never displays GPA or academic records and performs no final evaluation.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Scenario #054 — Room Booking. Yellow-tier: AI prepares & checks availability,
  // staff approves the actual reservation. Public board exposes a parallel
  // "browse availability" path that needs no QR or ID.
  'reserve-a-hall': {
    titleAr: 'حجز قاعة',
    titleEn: 'Room booking',
    introAr:
      'يمكنك استعراض القاعات المتاحة على اللوحة، ولإرسال طلب حجز رسمي تحتاج إلى التحقق من رقمك الجامعي ثم إكمال التفاصيل من جوالك.',
    introEn:
      'You can browse available rooms on this board. To submit an official booking request, verify your University ID and complete the details on your phone.',
    stepsAr: [
      'اختيار القاعة',
      'تحديد التاريخ والوقت',
      'إدخال سبب الحجز',
      'رفع المرفقات إن وجدت',
      'إرسال الطلب لاعتماد الموظف',
    ],
    stepsEn: [
      'Pick the room',
      'Set the date and time',
      'Enter the booking reason',
      'Upload attachments if any',
      'Submit the request for staff approval',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لن يقوم المساعد الذكي بتأكيد الحجز تلقائيًا. الموظف يعتمد طلب الحجز قبل تثبيت القاعة.',
    noticeEn:
      'The AI assistant does not confirm the booking automatically. A staff member approves the request before the room is reserved.',
    badgeAr: 'يحتاج اعتماد الموظف',
    badgeEn: 'Needs staff approval',
    badgeSupportAr:
      'الذكاء الاصطناعي يجهّز الطلب ويتحقق من توفّر القاعة، والموظف هو من يعتمد الحجز نهائيًا.',
    badgeSupportEn:
      'The AI assistant prepares the request and checks room availability; a staff member approves the booking.',
    ctaAr: 'بدء طلب حجز',
    ctaEn: 'Start booking request',
    secondaryCtaAr: 'استعراض القاعات المتاحة',
    secondaryCtaEn: 'Browse available rooms',
    secondaryRoute: '/rooms/availability',
  },

  // Admissions — My admission status. Personal application data lives on the
  // phone only; the public board never displays admission results.
  'my-admission-status': {
    titleAr: 'حالة قبولي',
    titleEn: 'My admission status',
    introAr:
      'لمتابعة حالة قبولك، أدخل رقمك الجامعي ثم أكمل من جوالك بأمان. لن يتم عرض نتيجة القبول على هذه الشاشة.',
    introEn:
      'To track your admission status, enter your University ID and continue privately on your phone. The admission result is never shown on this screen.',
    stepsAr: [
      'تأكيد الهوية',
      'عرض حالة طلبك على جوالك',
      'متابعة الخطوات التالية أو الإشعارات',
    ],
    stepsEn: [
      'Confirm your identity',
      'View your application status on your phone',
      'Follow the next steps or notifications',
    ],
    stepsTitleAr: 'ما الذي ستراه على جوالك؟',
    stepsTitleEn: 'What will you see on your phone?',
    noticeAr:
      'لن تظهر نتيجة القبول أو رقم الطلب أو اسم الطالب أو سبب القبول/الرفض على هذه اللوحة. كل التحديثات تصلك على جوالك بعد التحقق.',
    noticeEn:
      'The admission result, application ID, student name, and acceptance/rejection reason never appear on this board. Updates reach you on your phone after verification.',
    badgeAr: 'يحتاج تحقق آمن',
    badgeEn: 'Secure verification required',
    badgeSupportAr:
      'حالة القبول بيانات شخصية، فالاطلاع عليها يتم من جوالك بعد التحقق. اللوحة العامة هنا تُمهّد للقناة الخاصة فقط.',
    badgeSupportEn:
      'Admission status is personal, so it is viewed from your phone after verification. This public board only initiates the private channel.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Library — Borrow a book. Account-tied, continues privately on the phone.
  'borrow-a-book': {
    titleAr: 'إعارة كتاب',
    titleEn: 'Borrow a book',
    introAr:
      'لإكمال طلب إعارة كتاب، تحتاج إلى التحقق من رقمك الجامعي ثم المتابعة من جوالك بأمان.',
    introEn:
      'To complete a book-borrow request, verify your University ID and continue privately on your phone.',
    stepsAr: [
      'تأكيد الهوية',
      'اختيار الكتاب',
      'تأكيد الإعارة',
      'عرض تعليمات الاستلام أو الإرجاع على جوالك',
    ],
    stepsEn: [
      'Confirm your identity',
      'Pick the book',
      'Confirm the loan',
      'View pickup or return instructions on your phone',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لن يظهر اسمك أو حسابك في المكتبة أو تاريخ إعارتك أو الغرامات على هذه الشاشة. الإعارة تُسجَّل بعد التحقق من الهوية على جوالك.',
    noticeEn:
      'Your name, library account, borrowing history, and fines never appear on this screen. The loan is recorded after identity verification on your phone.',
    badgeAr: 'يحتاج جوال',
    badgeEn: 'Phone needed',
    badgeSupportAr:
      'الإعارة مرتبطة بحسابك في المكتبة. يتم إكمالها بشكل خاص على جوالك بعد التحقق من الهوية.',
    badgeSupportEn:
      'Borrowing is tied to your library account. It is completed privately on your phone after identity verification.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
    secondaryCtaAr: 'البحث في الفهرس',
    secondaryCtaEn: 'Search the catalog',
    secondaryRoute: '/library/catalog',
  },

  // Library — Reserve a study room. Public availability is shown on the board,
  // but tying a room to a student requires private continuation.
  'reserve-a-study-room': {
    titleAr: 'حجز قاعة دراسية',
    titleEn: 'Reserve a study room',
    introAr:
      'لحجز القاعة باسمك، أدخل رقمك الجامعي ثم أكمل الحجز من جوالك.',
    introEn:
      'To reserve the room in your name, enter your University ID and complete the booking on your phone.',
    stepsAr: [
      'تأكيد الهوية',
      'اختيار وقت الحجز',
      'تأكيد الحجز على جوالك',
      'استلام تأكيد الحجز',
    ],
    stepsEn: [
      'Confirm your identity',
      'Pick the booking time',
      'Confirm the booking on your phone',
      'Receive booking confirmation',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لن يتم تأكيد الحجز على هذه اللوحة. تُسجَّل القاعة باسمك فقط بعد التحقق من الهوية على جوالك.',
    noticeEn:
      'The booking is not confirmed on this board. The room is recorded under your name only after identity verification on your phone.',
    badgeAr: 'يحتاج جوال',
    badgeEn: 'Phone needed',
    badgeSupportAr:
      'توفّر القاعة معلومة عامة، لكن ربط القاعة برقمك الجامعي يتم بشكل خاص على جوالك.',
    badgeSupportEn:
      'Room availability is public; tying the room to your University ID happens privately on your phone.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
    secondaryCtaAr: 'استعراض القاعات المتاحة',
    secondaryCtaEn: 'Browse available rooms',
    secondaryRoute: '/library/study-rooms',
  },

  // Library — My borrowed books. Personal account data; phone-only output.
  'my-borrowed-books': {
    titleAr: 'كتبي المعارة',
    titleEn: 'My borrowed books',
    introAr:
      'لا يمكن عرض كتبك المعارة على شاشة عامة. أدخل رقمك الجامعي ثم أكمل من جوالك بأمان.',
    introEn:
      'Your borrowed books cannot be shown on a public screen. Enter your University ID and continue privately on your phone.',
    stepsAr: [
      'تأكيد الهوية',
      'عرض الكتب المعارة وتواريخ الإرجاع على جوالك',
      'تجديد الإعارة إذا لزم',
      'استعراض الغرامات إن وجدت',
    ],
    stepsEn: [
      'Confirm your identity',
      'View borrowed books and return dates on your phone',
      'Renew loans if needed',
      'Review any fines',
    ],
    stepsTitleAr: 'ما الذي ستراه على جوالك؟',
    stepsTitleEn: 'What will you see on your phone?',
    noticeAr:
      'لن تظهر قائمة كتبك أو تواريخ الإرجاع أو الغرامات أو حالة التجديد على هذه اللوحة. كل التفاصيل تصل إليك على جوالك بعد التحقق.',
    noticeEn:
      'Your books, return dates, fines, and renewal status never appear on this board. All details reach you on your phone after verification.',
    badgeAr: 'خاص — جوال',
    badgeEn: 'Private — phone',
    badgeTone: 'black-tier',
    badgeIconKind: 'lock',
    badgeSupportAr:
      'الكتب المعارة بيانات حسابك في المكتبة. تظهر فقط على جوالك بعد التحقق من الهوية.',
    badgeSupportEn:
      'Borrowed books are part of your library account. They appear only on your phone after identity verification.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Tech Support — Reset password. Account-related, must continue privately.
  'reset-password': {
    titleAr: 'إعادة تعيين كلمة المرور',
    titleEn: 'Reset password',
    introAr:
      'لإعادة تعيين كلمة المرور، تحتاج إلى التحقق من رقمك الجامعي ثم إكمال الخطوات من جوالك بأمان.',
    introEn:
      'To reset your password, verify your University ID and complete the steps securely on your phone.',
    stepsAr: [
      'تأكيد الهوية',
      'إثبات ملكية الحساب',
      'إعادة تعيين كلمة المرور على جوالك',
      'إشعارك عند نجاح العملية',
    ],
    stepsEn: [
      'Confirm your identity',
      'Verify account ownership',
      'Reset the password on your phone',
      'Get a notification when the change succeeds',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لا يتم عرض كلمة المرور أو أي تفاصيل من حسابك على هذه الشاشة. الذكاء الاصطناعي لا يغيّر كلمة المرور — العملية تتم على جوالك.',
    noticeEn:
      'Your password and account details never appear on this screen. The AI assistant does not change the password — the change happens on your phone.',
    badgeAr: 'يحتاج تحقق خاص',
    badgeEn: 'Private verification required',
    badgeSupportAr:
      'إعادة تعيين كلمة المرور إجراء على حسابك. تتم بأمان على جوالك بعد التحقق من الهوية.',
    badgeSupportEn:
      'Resetting a password is an account action. It happens privately on your phone after identity verification.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Tech Support — Open a new support ticket. Routed from troubleshooting
  // pages. Personal device or account details belong on the phone, not the board.
  'support-ticket': {
    titleAr: 'فتح تذكرة دعم فني',
    titleEn: 'Open a support ticket',
    introAr:
      'لفتح تذكرة دعم، أدخل رقمك الجامعي ثم أكمل وصف المشكلة وتفاصيل جهازك من جوالك بأمان.',
    introEn:
      'To open a support ticket, enter your University ID and describe the issue and device details privately on your phone.',
    stepsAr: [
      'تأكيد الهوية',
      'وصف المشكلة على جوالك',
      'إرفاق صور أو معلومات الجهاز إن وجدت',
      'إرسال التذكرة لفريق الدعم',
      'متابعة حالة التذكرة على جوالك',
    ],
    stepsEn: [
      'Confirm your identity',
      'Describe the issue on your phone',
      'Attach screenshots or device info if any',
      'Send the ticket to the support team',
      'Track the ticket status on your phone',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لن يظهر رقم التذكرة أو وصف المشكلة أو تفاصيل الجهاز على هذه اللوحة. الذكاء الاصطناعي يجهّز التذكرة، وفريق الدعم يردّ عليك خلال ساعات العمل.',
    noticeEn:
      'Ticket number, issue description, and device details never appear on this board. The AI assistant prepares the ticket and the support team replies during working hours.',
    badgeAr: 'يحتاج تحقق خاص',
    badgeEn: 'Private verification required',
    badgeSupportAr:
      'وصف المشكلة وتفاصيل الجهاز شخصية. يتم إرسالها بشكل خاص من جوالك إلى فريق الدعم.',
    badgeSupportEn:
      'Issue descriptions and device details are personal. They are sent privately from your phone to the support team.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Tech Support — My support tickets (tracking own tickets). Phone-only:
  // ticket numbers, statuses, and notes are personal and never on the board.
  'my-support-tickets': {
    titleAr: 'تذاكر الدعم الفنية',
    titleEn: 'My support tickets',
    introAr:
      'لفتح أو متابعة تذكرة دعم فنية، أدخل رقمك الجامعي ثم أكمل من جوالك بأمان.',
    introEn:
      'To open or follow up on a support ticket, enter your University ID and continue privately on your phone.',
    stepsAr: [
      'تأكيد الهوية',
      'عرض تذاكرك على جوالك',
      'متابعة الردود وإضافة تفاصيل إن لزم',
      'استلام إشعارات التحديث',
    ],
    stepsEn: [
      'Confirm your identity',
      'View your tickets on your phone',
      'Follow replies and add details if needed',
      'Receive update notifications',
    ],
    stepsTitleAr: 'ما الذي ستراه على جوالك؟',
    stepsTitleEn: 'What will you see on your phone?',
    noticeAr:
      'لن تظهر أرقام التذاكر أو حالتها أو تفاصيل الجهاز أو ردود الفريق على هذه اللوحة. كل التحديثات تصل إليك على جوالك بعد التحقق.',
    noticeEn:
      'Ticket numbers, statuses, device details, and team replies never appear on this board. All updates reach you on your phone after verification.',
    badgeAr: 'خاص — جوال',
    badgeEn: 'Private — phone',
    badgeTone: 'black-tier',
    badgeIconKind: 'lock',
    badgeSupportAr:
      'تذاكر الدعم تكشف بيانات حسابك وجهازك. تظهر فقط على جوالك بعد التحقق من الهوية.',
    badgeSupportEn:
      'Support tickets expose account and device data. They appear only on your phone after identity verification.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Clinic — Book an appointment. Yellow-tier: appointment selection happens
  // on the public board (anonymised slots), but tying a slot to a student and
  // capturing any visit reason is private and lives on the phone.
  'book-an-appointment': {
    titleAr: 'حجز موعد طبي',
    titleEn: 'Book a medical appointment',
    introAr:
      'لتأكيد حجز الموعد، تحتاج إلى التحقق من رقمك الجامعي ثم إكمال التفاصيل من جوالك بأمان.',
    introEn:
      'To confirm your appointment, verify your University ID and complete the details securely on your phone.',
    stepsAr: [
      'اختيار الموعد',
      'تأكيد الهوية',
      'إدخال سبب الزيارة إذا لزم',
      'تأكيد الحجز',
      'إشعارك بتأكيد الموعد',
    ],
    stepsEn: [
      'Pick the appointment',
      'Confirm your identity',
      'Enter a visit reason if needed',
      'Confirm the booking',
      'Get a confirmation notification',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لن يظهر سبب الزيارة أو أي بيانات صحية على هذه اللوحة. تفاصيل الموعد تصل إلى جوالك بعد التحقق.',
    noticeEn:
      'Your visit reason and any health data never appear on this board. Appointment details reach your phone after verification.',
    badgeAr: 'يحتاج تحقق خاص',
    badgeEn: 'Private verification required',
    badgeSupportAr:
      'الموعد العام يظهر على اللوحة، لكن ربطه برقمك الجامعي وأي تفاصيل طبية يتم بشكل خاص على جوالك.',
    badgeSupportEn:
      'The public slot is shown on the board, but tying it to your University ID and any medical details happens privately on your phone.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
    secondaryCtaAr: 'استعراض المواعيد المتاحة',
    secondaryCtaEn: 'Browse available slots',
    secondaryRoute: '/clinic/appointments',
  },

  // Clinic — Personal consultation. Yellow-tier: a personal consultation ties
  // symptoms or a request to a specific student, so it must continue privately.
  'personal-consultation': {
    titleAr: 'استشارة شخصية',
    titleEn: 'Personal consultation',
    introAr:
      'لبدء استشارة شخصية، تحتاج إلى التحقق من رقمك الجامعي ثم وصف حالتك بشكل خاص من جوالك. لا تظهر تفاصيل الاستشارة على هذه اللوحة.',
    introEn:
      'To start a personal consultation, verify your University ID and describe your case privately on your phone. No consultation details appear on this board.',
    stepsAr: [
      'تأكيد الهوية',
      'وصف الحالة على جوالك',
      'إرسال الاستشارة لطاقم العيادة',
      'استلام الرد على جوالك',
    ],
    stepsEn: [
      'Confirm your identity',
      'Describe the case on your phone',
      'Send the consultation to the clinic team',
      'Receive the response on your phone',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لا يتم عرض الأعراض أو البيانات الصحية على اللوحة. الذكاء الاصطناعي لا يقدم تشخيصًا — الكادر الطبي يراجع الاستشارة.',
    noticeEn:
      'Symptoms and health data are not shown on the board. The AI assistant does not provide diagnoses — the medical team reviews the consultation.',
    badgeAr: 'يحتاج تحقق خاص',
    badgeEn: 'Private verification required',
    badgeSupportAr:
      'الاستشارات الشخصية تشمل بيانات صحية حساسة. تنتقل بشكل خاص إلى جوالك بعد التحقق من الهوية.',
    badgeSupportEn:
      'Personal consultations involve sensitive health data. They move privately to your phone after identity verification.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Clinic — Incident report. Yellow-tier: incident details are private and
  // never collected on the public board. The board only initiates the channel.
  'incident-report': {
    titleAr: 'إبلاغ عن حادثة شخصية',
    titleEn: 'Personal incident report',
    introAr:
      'لإكمال البلاغ، تحتاج إلى التحقق من رقمك الجامعي ثم وصف الحادثة من جوالك. لا تظهر تفاصيل الحادثة على هذه اللوحة.',
    introEn:
      'To complete the report, verify your University ID and describe the incident on your phone. Incident details never appear on this board.',
    stepsAr: [
      'تأكيد الهوية',
      'وصف الحادثة على جوالك',
      'إرسال البلاغ لفريق الأمن والسلامة',
      'متابعة حالة البلاغ على جوالك',
    ],
    stepsEn: [
      'Confirm your identity',
      'Describe the incident on your phone',
      'Send the report to the safety team',
      'Track the report status on your phone',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'في حالات الطوارئ الصحية، اتصل برقم الطوارئ الجامعية مباشرة. هذا البلاغ مخصص للحوادث التي يمكن متابعتها لاحقًا.',
    noticeEn:
      'For medical emergencies, call the campus emergency line directly. This report is for incidents that can be reviewed afterwards.',
    badgeAr: 'يحتاج تحقق خاص',
    badgeEn: 'Private verification required',
    badgeSupportAr:
      'تفاصيل الحادثة شخصية. تنتقل إلى قناة خاصة على جوالك ولا تظهر على هذه الشاشة.',
    badgeSupportEn:
      'Incident details are personal. They move to a private channel on your phone and are not shown on this screen.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Scenario #047 — Club Membership Request. Yellow-tier: AI prepares the
  // request, club coordinator reviews and approves. Public board exposes a
  // green-tier club directory; this screen explains the private path.
  'join-a-club': {
    titleAr: 'طلب انضمام لنادي طلابي',
    titleEn: 'Student club membership request',
    introAr:
      'لإرسال طلب الانضمام، تحتاج إلى التحقق من رقمك الجامعي ثم إكمال الطلب من جوالك. سيتم توجيه الطلب لمسؤول النادي للمراجعة.',
    introEn:
      'To submit a membership request, verify your University ID and complete the request on your phone. The request is then routed to the club coordinator for review.',
    stepsAr: [
      'اختيار النادي',
      'تعبئة سبب الانضمام',
      'إرسال الطلب لمسؤول النادي',
      'إشعارك عند مراجعة الطلب',
    ],
    stepsEn: [
      'Pick the club',
      'Write your reason for joining',
      'Submit the request to the club coordinator',
      'Notify you once the request is reviewed',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لن يتم عرض أي بيانات شخصية على هذه الشاشة، ولن تتم الموافقة على الطلب تلقائيًا — مسؤول النادي يراجع الطلب.',
    noticeEn:
      'No personal data is shown on this screen and the request is not approved automatically — the club coordinator reviews it.',
    badgeAr: 'يحتاج مراجعة المسؤول',
    badgeEn: 'Needs coordinator review',
    badgeSupportAr:
      'الذكاء الاصطناعي يجهّز الطلب ويوجّهه للنادي. القرار يتخذه مسؤول النادي بعد مراجعة الطلب.',
    badgeSupportEn:
      'The AI assistant prepares and routes the request; the club coordinator decides after review.',
    ctaAr: 'بدء طلب الانضمام',
    ctaEn: 'Start membership request',
    secondaryCtaAr: 'استعراض الأندية',
    secondaryCtaEn: 'Browse clubs',
    secondaryRoute: '/clubs/directory',
  },

  // Scenario #046 — Event Registration Assistant. Yellow-tier: registration
  // ties an event seat to a specific student, so the public board only
  // initiates the private flow. Selection + confirmation happen on the phone.
  'event-registration': {
    titleAr: 'التسجيل في فعالية',
    titleEn: 'Event registration',
    introAr:
      'لإكمال التسجيل في الفعالية، نحتاج التحقق من رقمك الجامعي ثم تتمّ تأكيد المقعد من جوالك. اللوحة العامة لا تحفظ بياناتك.',
    introEn:
      'To complete event registration, we need to verify your University ID and your seat is then confirmed on your phone. The public board does not store your data.',
    stepsAr: [
      'التحقق من هويتك',
      'مراجعة تفاصيل الفعالية',
      'تأكيد المقعد على جوالك',
      'استلام تذكرة الحضور',
    ],
    stepsEn: [
      'Verify your identity',
      'Review the event details',
      'Confirm the seat on your phone',
      'Receive your attendance ticket',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لن تظهر تفاصيل الحضور أو رقم المقعد على هذه اللوحة. التذكرة تصل إلى جوالك بعد التحقق.',
    noticeEn:
      'Attendance details and seat number never appear on this board. The ticket reaches your phone after verification.',
    badgeAr: 'يحتاج تحقق خاص',
    badgeEn: 'Private verification required',
    badgeSupportAr:
      'تأكيد المقعد يربط الفعالية برقمك الجامعي، ويتم التأكيد بشكل خاص على جوالك بعد التحقق.',
    badgeSupportEn:
      'Seat confirmation ties the event to your University ID; it is finalised privately on your phone after verification.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },

  // Re-enrollment — sensitive admissions-related flow that requires a human
  // decision. Not part of the original 100-scenario pack; treated as a Red-tier
  // pre-handoff: the public board only collects the request and explains the
  // private flow. All verification/data entry happens on the student's phone.
  're-enrollment': {
    titleAr: 'إعادة قيد',
    titleEn: 'Re-enrollment',
    introAr:
      'لإكمال طلب إعادة القيد، تحتاج إلى التحقق من هويتك واستكمال البيانات من قناة خاصة وآمنة. سيتم توجيه الطلب للجهة المختصة للمراجعة، ولا يتم اتخاذ القرار تلقائيًا.',
    introEn:
      'To complete your re-enrollment request, you need to verify your identity and complete the required information through a private, secure channel. The request will be routed to the relevant authority for review; the decision is not made automatically.',
    stepsAr: [
      'التحقق من هويتك',
      'استكمال البيانات والمرفقات المطلوبة',
      'مراجعة الطلب من الجهة المختصة',
      'إشعارك بنتيجة الطلب بعد القرار',
    ],
    stepsEn: [
      'Verify your identity',
      'Complete the required information and attachments',
      'Review of the request by the relevant authority',
      'Notify you of the decision after it is made',
    ],
    stepsTitleAr: 'ما الذي ستكمله على جوالك؟',
    stepsTitleEn: 'What will you complete on your phone?',
    noticeAr:
      'لن يقوم المساعد الذكي باتخاذ قرار إعادة القيد. القرار يُتخذ من الجهة المختصة بعد مراجعة الطلب.',
    noticeEn:
      'The AI assistant does not decide re-enrollment outcomes. The decision is made by the relevant authority after reviewing the request.',
    badgeAr: 'قرار بشري مطلوب',
    badgeEn: 'Human decision required',
    badgeTone: 'unavailable',
    badgeIconKind: 'gavel',
    badgeSupportAr:
      'هذا الطلب يحتاج مراجعة وقرار من الجهة المختصة. اللوحة العامة تُمهّد للطلب فقط، ولا تُجري أي تقييم نهائي.',
    badgeSupportEn:
      'This request requires review and a decision by the relevant authority. The public board only initiates the request; it does not perform any final evaluation.',
    ctaAr: 'المتابعة الآمنة عبر QR',
    ctaEn: 'Secure continuation via QR',
  },
};

const DEFAULT_COPY: ScenarioCopy = {
  introAr:
    'لإكمال هذا الطلب نحتاج التحقق من هويتك. لحماية خصوصيتك، التفاصيل تظهر فقط على جوالك.',
  introEn:
    'To complete this request we need to verify your identity. For your privacy, details only appear on your phone.',
  stepsAr: [
    'التحقق من الهوية عبر النفاذ الموحد.',
    'مراجعة الطلب من جوالك.',
    'إشعار عند جاهزية الوثيقة.',
  ],
  stepsEn: [
    'Identity verification via Nafath.',
    'Review the request on your phone.',
    'Notification when the document is ready.',
  ],
};

/** Tier-aware badge for the request screen header. Scenario copy can override
 * the label, tone, and icon — letting yellow-data flows render with red
 * "human decision required" emphasis when the scenario calls for it. */
function tierBadge(
  tier: ServiceTier,
  lang: 'ar' | 'en',
  overrides?: {
    label?: { ar?: string; en?: string };
    tone?: 'needs-qr' | 'black-tier' | 'unavailable' | 'private';
    iconKind?: 'shield' | 'lock' | 'gavel' | 'alert';
  },
) {
  const defaultIcon = tier === 'yellow' ? BADGE_ICONS.shield : BADGE_ICONS.lock;
  const defaultTone: 'needs-qr' | 'black-tier' = tier === 'yellow' ? 'needs-qr' : 'black-tier';
  const defaultLabelAr = tier === 'yellow' ? 'يحتاج استكمال آمن' : 'خاص — جوال فقط';
  const defaultLabelEn = tier === 'yellow' ? 'Secure continuation required' : 'Private — phone only';

  return {
    tone: overrides?.tone ?? defaultTone,
    icon: overrides?.iconKind ? BADGE_ICONS[overrides.iconKind] : defaultIcon,
    label:
      lang === 'ar'
        ? (overrides?.label?.ar ?? defaultLabelAr)
        : (overrides?.label?.en ?? defaultLabelEn),
  };
}

export function StartRequest() {
  const { lang, setPrivateMode } = useApp();
  const navigate = useNavigate();
  const { kind } = useParams();
  const [searchParams] = useSearchParams();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    setPrivateMode(true);
  }, [setPrivateMode]);

  // URL pattern: /start-request/{service-id}?action={action-id}
  const service = SERVICES.find((s) => s.id === kind);
  const actionId = searchParams.get('action');
  const action = service?.available.find((a) => a.id === actionId);

  // Legacy /start-request/graduation, /enrollment routes.
  const legacyMap: Record<string, { ar: string; en: string }> = {
    graduation: { ar: 'وثيقة تخرج', en: 'Graduation certificate' },
    enrollment: { ar: 'إثبات قيد', en: 'Enrollment letter' },
  };
  const legacy = !service && kind ? legacyMap[kind] : undefined;

  const copy = (actionId && SCENARIO_COPY[actionId]) || DEFAULT_COPY;
  const titleAr = copy.titleAr ?? action?.titleAr ?? service?.nameAr ?? legacy?.ar ?? 'طلب جديد';
  const titleEn = copy.titleEn ?? action?.titleEn ?? service?.nameEn ?? legacy?.en ?? 'New request';

  const Icon = service ? (ICONS[service.icon] ?? FileText) : FileText;
  const colorCls = service ? CATEGORY_COLORS[service.category] : 'bg-privacy/10 dark:bg-privacy/20 text-privacy';

  const tier: ServiceTier = action?.tier ?? 'yellow';
  const badge = tierBadge(tier, lang, {
    label: { ar: copy.badgeAr, en: copy.badgeEn },
    tone: copy.badgeTone,
    iconKind: copy.badgeIconKind,
  });

  const steps = lang === 'ar' ? copy.stepsAr : copy.stepsEn;
  const intro = lang === 'ar' ? copy.introAr : copy.introEn;
  const notice = lang === 'ar' ? copy.noticeAr : copy.noticeEn;
  const badgeSupport = lang === 'ar' ? copy.badgeSupportAr : copy.badgeSupportEn;
  const stepsTitle = lang === 'ar'
    ? (copy.stepsTitleAr ?? 'ما الذي يحدث بعد المسح؟')
    : (copy.stepsTitleEn ?? 'What happens after scanning?');
  const cta = lang === 'ar'
    ? (copy.ctaAr ?? 'المتابعة عبر QR')
    : (copy.ctaEn ?? 'Continue via QR');
  const secondaryCta = lang === 'ar' ? copy.secondaryCtaAr : copy.secondaryCtaEn;
  const secondaryRoute = copy.secondaryRoute;

  return (
    <div>
      <PrivacyBanner />
      <div className="p-12">
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            aria-label={lang === 'ar' ? 'الرجوع' : 'Back'}
            className="w-12 h-12 rounded-2xl bg-surface border border-border-soft hover:border-primary hover:bg-surface-2 flex items-center justify-center text-ink transition shrink-0"
          >
            {lang === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>
          <span className={`w-16 h-16 rounded-2xl ${colorCls} flex items-center justify-center`}>
            <Icon className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? titleAr : titleEn}
            </h1>
            {service && (action || actionId) && (
              <p className="text-lg text-ink-muted mt-1">
                {lang === 'ar'
                  ? `عبر ${service.nameAr} · ${service.building}`
                  : `Via ${service.nameEn} · ${service.buildingEn}`}
              </p>
            )}
          </div>
          <Chip tone={badge.tone} icon={badge.icon}>
            {badge.label}
          </Chip>
        </div>

        <p className="text-2xl text-ink-muted mb-3 leading-relaxed">
          {intro}
        </p>

        {badgeSupport && (
          <p className="text-base text-ink-muted mb-10 leading-relaxed">
            {badgeSupport}
          </p>
        )}
        {!badgeSupport && <div className="mb-10" />}

        {notice && (
          <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-warning/10 dark:bg-warning/15 border border-warning/30 mb-10">
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <p className="text-base text-ink leading-relaxed">{notice}</p>
          </div>
        )}

        <h3 className="text-2xl font-semibold mb-5">
          {stepsTitle}
        </h3>
        <ol className="space-y-4 text-xl text-ink mb-12 list-none">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-9 h-9 shrink-0 rounded-full bg-privacy text-white text-base font-bold flex items-center justify-center mt-1">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="flex gap-4 flex-wrap">
          <Button variant="privacy" onClick={() => navigate('/verify')}>
            <span>{cta}</span>
            <ArrowIcon className="w-6 h-6" />
          </Button>
          {secondaryCta && secondaryRoute && (
            <Button variant="secondary" onClick={() => navigate(secondaryRoute)}>
              <span>{secondaryCta}</span>
            </Button>
          )}
          <Link to="/">
            <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
