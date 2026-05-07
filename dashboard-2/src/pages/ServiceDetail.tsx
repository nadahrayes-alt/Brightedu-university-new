import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Clock, Users, Footprints, ArrowLeft, ArrowRight,
  Building2, GraduationCap, FileText, BookOpen, Coffee, Wrench, Cross, Sparkles,
  MapPin, Accessibility, ShieldCheck, Info, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Chip, StatusDot } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { MapCanvas } from '../components/board/MapCanvas';
import { useApp } from '../lib/AppContext';
import { SERVICES } from '../data/services';
import { ar } from '../lib/numerals';

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
  students:   'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30',
  facilities: 'bg-teal-50 dark:bg-teal/15 text-teal border-teal/30',
  documents:  'bg-privacy/10 dark:bg-privacy/20 text-privacy border-privacy/30',
  support:    'bg-warning/15 dark:bg-warning/20 text-warning border-warning/30',
  emergency:  'bg-danger/15 dark:bg-danger/20 text-danger border-danger/30',
};

// Actions that require a human decision (admissions/academic exceptions). They
// route through the same yellow-tier QR handoff but need stronger visual weight
// on the public board: red badge + "قرار بشري مطلوب".
const HUMAN_DECISION_ACTIONS = new Set(['re-enrollment', 'major-transfer']);

// Public-safe wording — never expose exact live queue counts.
function congestionLabel(level: 'low' | 'medium' | 'high', lang: 'ar' | 'en') {
  if (lang === 'ar') {
    return level === 'low' ? 'منخفض' : level === 'medium' ? 'متوسط' : 'مرتفع';
  }
  return level === 'low' ? 'Low' : level === 'medium' ? 'Medium' : 'High';
}

function expectedWaitRange(level: 'low' | 'medium' | 'high', lang: 'ar' | 'en') {
  const range = level === 'low' ? [0, 5] : level === 'medium' ? [10, 15] : [20, 30];
  if (lang === 'ar') {
    return `${ar(range[0])}–${ar(range[1])} دقيقة`;
  }
  return `${range[0]}–${range[1]} min`;
}

export function ServiceDetail() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const service = SERVICES.find((s) => s.id === id);

  if (!service) {
    return (
      <div className="p-12 text-center text-2xl text-ink-muted">
        {lang === 'ar' ? 'الخدمة غير موجودة.' : 'Service not found.'}
      </div>
    );
  }

  const Icon = ICONS[service.icon] ?? Building2;
  const colorCls = CATEGORY_COLORS[service.category] ?? CATEGORY_COLORS.students;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const ChevIcon = lang === 'ar' ? ChevronLeft : ChevronRight;

  const statusTone =
    service.status === 'open' ? 'open'
    : service.status === 'closing' ? 'closing'
    : service.status === 'busy' ? 'busy'
    : 'closed';

  const statusLabel =
    lang === 'ar'
      ? service.status === 'open' ? 'مفتوح الآن'
        : service.status === 'closing' ? 'يغلق قريبًا'
        : service.status === 'busy' ? 'مزدحم' : 'مغلق'
      : service.status === 'open' ? 'Open now'
        : service.status === 'closing' ? 'Closing soon'
        : service.status === 'busy' ? 'Busy' : 'Closed';

  const walkLabel = lang === 'ar'
    ? `${ar(service.walkMin)} دقائق مشي · ${ar(service.meters)} م`
    : `${service.walkMin} min walk · ${service.meters} m`;

  return (
    <div className="p-12 space-y-6">
      {/* Header */}
      <header className="flex items-start justify-between gap-5 flex-wrap">
        <div className="flex items-center gap-5">
          <span className={`w-20 h-20 rounded-3xl border flex items-center justify-center shrink-0 ${colorCls}`}>
            <Icon className="w-10 h-10" />
          </span>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl font-bold text-ink leading-tight">
                {lang === 'ar' ? service.nameAr : service.nameEn}
              </h1>
              <span className="inline-flex items-center gap-2 h-9 px-3 rounded-full bg-success-soft dark:bg-success/15 text-success text-base font-semibold">
                <ShieldCheck className="w-4 h-4" />
                {lang === 'ar' ? 'عام وآمن' : 'Public-safe'}
              </span>
            </div>
            <p className="text-lg text-ink-muted mt-1.5 inline-flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {lang === 'ar' ? service.building : service.buildingEn}
              <span className="text-ink-subtle">·</span>
              {lang === 'ar' ? 'حرم جدة الرئيسي' : 'KAU Jeddah Campus'}
            </p>
          </div>
        </div>
        <Chip tone={statusTone} icon={<StatusDot tone={statusTone === 'busy' ? 'med' : statusTone} />}>
          {statusLabel}
        </Chip>
      </header>

      {/* Public-safe helper note (service-aware copy for document-pickup
        * which is a public pickup-point info layer per Scenario #064/#022). */}
      <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-success-soft/60 dark:bg-success/10 border border-success/20">
        <Info className="w-5 h-5 text-success shrink-0 mt-0.5" />
        <p className="text-base text-ink leading-relaxed">
          {service.id === 'document-pickup'
            ? (lang === 'ar'
              ? 'هذه الصفحة تعرض موقع نقطة الاستلام وساعات العمل والازدحام التقديري فقط، ولا تعرض بيانات شخصية.'
              : 'This page only shows the pickup point location, working hours, and estimated congestion — no personal data is shown.')
            : service.id === 'student-affairs'
              ? (lang === 'ar'
                ? 'هذه الصفحة تعرض موقع شؤون الطلبة وساعات العمل والازدحام التقديري فقط، ولا تتطلب الرقم الجامعي.'
                : 'This page only shows the Student Affairs location, working hours, and estimated congestion — no University ID is required.')
              : (lang === 'ar'
                ? 'هذه الصفحة تعرض موقع الخدمة وساعات العمل والازدحام التقديري فقط، ولا تتطلب الرقم الجامعي.'
                : 'This page only shows location, working hours, and estimated congestion — no University ID is required.')}
        </p>
      </div>

      {/* KPI strip — public-safe (no exact live counts) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <div className="bg-surface border border-border-soft rounded-2xl p-5">
          <div className="flex items-center gap-2 text-base text-ink-muted mb-2">
            <Clock className="w-5 h-5" />
            {lang === 'ar' ? 'ساعات العمل' : 'Working hours'}
          </div>
          <div className="text-xl font-bold text-ink num">
            {service.hours.from} — {service.hours.to}
          </div>
        </div>

        {service.queue ? (
          <div className="bg-surface border border-border-soft rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-base text-ink-muted">
                <Users className="w-5 h-5" />
                {lang === 'ar' ? 'مؤشر الازدحام' : 'Congestion'}
              </div>
              <Chip tone={service.queue.level === 'high' ? 'busy' : service.queue.level === 'medium' ? 'closing' : 'open'} size="sm">
                {congestionLabel(service.queue.level, lang)}
              </Chip>
            </div>
            <div className="text-xl font-bold text-ink num">
              {expectedWaitRange(service.queue.level, lang)}
            </div>
            <div className="text-sm text-ink-muted mt-1">
              {lang === 'ar' ? 'انتظار متوقع' : 'Expected wait'}
            </div>
          </div>
        ) : (
          <div className="bg-surface border border-border-soft rounded-2xl p-5">
            <div className="flex items-center gap-2 text-base text-ink-muted mb-2">
              <Users className="w-5 h-5" />
              {lang === 'ar' ? 'الانتظار' : 'Wait'}
            </div>
            <div className="text-xl font-bold text-ink">
              {lang === 'ar' ? 'بدون انتظار' : 'No queue'}
            </div>
          </div>
        )}

        <div className="bg-surface border border-border-soft rounded-2xl p-5">
          <div className="flex items-center gap-2 text-base text-ink-muted mb-2">
            <Footprints className="w-5 h-5" />
            {lang === 'ar' ? 'المسافة' : 'Distance'}
          </div>
          <div className="text-xl font-bold text-ink num">
            {walkLabel}
          </div>
        </div>

        <div className="bg-surface border border-border-soft rounded-2xl p-5">
          <div className="flex items-center gap-2 text-base text-ink-muted mb-2">
            <Accessibility className="w-5 h-5 text-success" />
            {lang === 'ar' ? 'إمكانية الوصول' : 'Accessibility'}
          </div>
          <div className="text-xl font-bold text-ink">
            {lang === 'ar' ? 'مسار ميسر متاح' : 'Accessible'}
          </div>
        </div>
      </section>

      {/* Body grid: services list (left, 2 cols) + map (right, 1 col) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available services */}
        <div className="lg:col-span-2 bg-surface border border-border-soft rounded-3xl p-7">
          <h3 className="text-2xl font-bold mb-2">
            {lang === 'ar' ? 'الخدمات المتاحة هنا' : 'Available services'}
          </h3>
          <p className="text-base text-ink-muted mb-5">
            {lang === 'ar'
              ? 'الإجراءات الخاصة تتطلب متابعة من جوالك. لن تظهر بياناتك الشخصية على هذه الشاشة.'
              : 'Private actions continue on your phone. No personal data appears on this screen.'}
          </p>

          {service.available.length === 0 ? (
            <div className="text-center py-8 text-ink-muted">
              {lang === 'ar' ? 'تواصل مع الموظفين عند الوصول.' : 'Speak with staff on arrival.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {service.available.map((a) => {
                const isHumanDecision = HUMAN_DECISION_ACTIONS.has(a.id);
                // For graduation-certificate, the user-facing badge is
                // "Needs staff approval" — render as a yellow needs-qr tone
                // even though the data tier is black; the request itself is
                // routed through the existing GraduationFlow.
                const tierTone =
                  isHumanDecision ? 'unavailable'
                  : a.id === 'graduation-certificate' ? 'needs-qr'
                  : a.tier === 'green' ? 'public-safe'
                  : a.tier === 'yellow' ? 'needs-qr'
                  : 'black-tier';
                // Actions whose data is academic-grade (transcripts,
                // certificates, request status, admission status) get the
                // stronger "secure verification" wording so the badge
                // signals identity gating rather than just "phone needed".
                const SECURE_VERIFY_ACTIONS = new Set([
                  'pick-up-graduation-certificate',
                  'pick-up-transcript',
                  'my-request-status',
                  'my-admission-status',
                ]);
                const isSecureVerify =
                  (service.id === 'document-pickup' && a.tier === 'yellow') ||
                  SECURE_VERIFY_ACTIONS.has(a.id);
                // Actions where staff approval is the controlling step
                // (record updates, graduation certificate issuance) read
                // as "Needs staff approval" rather than the generic yellow.
                const STAFF_APPROVAL_ACTIONS = new Set([
                  'update-info',
                  'graduation-certificate',
                ]);
                const isStaffApproval = STAFF_APPROVAL_ACTIONS.has(a.id);
                // Enrollment-letter is fully automated after ID verification.
                const isFullAuto = a.id === 'enrollment-letter';
                const tierLabel =
                  lang === 'ar'
                    ? isHumanDecision ? 'قرار بشري مطلوب'
                    : isFullAuto ? 'أتمتة كاملة بعد التحقق'
                    : isStaffApproval ? 'يحتاج اعتماد الموظف'
                    : a.tier === 'green' ? 'عام وآمن'
                    : a.tier === 'yellow' ? (isSecureVerify ? 'يحتاج تحقق آمن' : 'يحتاج جوال')
                    : (isSecureVerify ? 'يحتاج تحقق آمن' : 'خاص — جوال')
                    : isHumanDecision ? 'Human decision required'
                    : isFullAuto ? 'Full automation after verification'
                    : isStaffApproval ? 'Needs staff approval'
                    : a.tier === 'green' ? 'Public-safe'
                    : a.tier === 'yellow' ? (isSecureVerify ? 'Secure verification required' : 'Phone needed')
                    : (isSecureVerify ? 'Secure verification required' : 'Phone only');
                const target =
                  a.id === 'graduation-certificate' ? '/request/graduation'
                  : a.id === 'enrollment-letter' ? '/request/enrollment'
                  : a.id === 'todays-events' ? '/events/today'
                  : a.id === 'join-a-club' ? '/clubs/directory'
                  : a.id === 'urgent-cases' ? '/clinic/emergency'
                  : a.id === 'general-consultation' ? '/clinic/info'
                  : a.id === 'book-an-appointment' ? '/clinic/appointments'
                  : a.id === 'my-medical-record' ? '/clinic/medical-record'
                  : a.id === 'sso-login-issues' ? '/tech/sso'
                  : a.id === 'wi-fi-issue' ? '/tech/wifi'
                  : a.id === 'my-support-tickets' ? `/start-request/${service.id}?action=${a.id}`
                  : a.id === 'todays-menu' ? '/cafeteria/menu'
                  : a.id === 'active-offers' ? '/cafeteria/offers'
                  : a.id === 'search-the-catalog' ? '/library/catalog'
                  : a.id === 'reserve-a-study-room' ? '/library/study-rooms'
                  : a.id === 'my-borrowed-books' ? `/start-request/${service.id}?action=${a.id}`
                  : a.id === 'admission-inquiry' ? '/admissions/inquiry'
                  : a.id === 'my-admission-status' ? `/start-request/${service.id}?action=${a.id}`
                  : (a.id === 'general-inquiry' && service.id === 'student-affairs') ? '/student-affairs/info'
                  : a.tier === 'black' ? '/refusal'
                  : a.tier === 'yellow' ? `/start-request/${service.id}?action=${a.id}`
                  : `/assistant/answer/${service.id}`;
                return (
                  <Link
                    key={a.titleAr}
                    to={target}
                    className="group bg-surface-2 border border-border-soft rounded-2xl p-4 hover:border-primary/40 hover:bg-surface transition flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-semibold text-ink leading-tight mb-1.5">
                        {lang === 'ar' ? a.titleAr : a.titleEn}
                      </div>
                      <Chip tone={tierTone} size="sm">{tierLabel}</Chip>
                    </div>
                    <ChevIcon className="w-5 h-5 text-ink-muted shrink-0 group-hover:text-primary transition" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Map + nearby */}
        <aside className="space-y-5">
          <div className="bg-surface border border-border-soft rounded-3xl overflow-hidden">
            <div className="h-[260px]">
              <MapCanvas lat={service.lat} lng={service.lng} />
            </div>
            <div className="p-5 space-y-3">
              <Link
                to={`/map/${service.id}`}
                className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-white text-base font-semibold hover:bg-primary-600 transition"
              >
                <span>{lang === 'ar' ? 'ابدأ التوجيه' : 'Start directions'}</span>
                <ArrowIcon className="w-5 h-5" />
              </Link>
              <button className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-surface-2 text-ink border border-border-soft hover:border-primary text-base font-medium transition">
                <Accessibility className="w-5 h-5" />
                <span>{lang === 'ar' ? 'مسار ميسر' : 'Accessible route'}</span>
              </button>
            </div>
          </div>

        </aside>
      </section>

      {/* Inline action row — public-safe defaults: location + back. Private requests come from the per-action list above. */}
      <div className="flex items-center gap-3 pt-2 flex-wrap">
        <Button variant="primary" onClick={() => navigate(`/map/${service.id}`)}>
          {lang === 'ar' ? 'عرض الموقع' : 'Show location'}
        </Button>
        <Button variant="cancel" onClick={() => navigate(-1)}>
          {lang === 'ar' ? 'الرجوع' : 'Back'}
        </Button>
      </div>
    </div>
  );
}
