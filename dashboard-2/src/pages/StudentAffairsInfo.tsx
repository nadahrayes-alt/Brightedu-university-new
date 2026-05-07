import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  Building2, Sparkles, MapPin, Clock, Info, HelpCircle,
  ListChecks, MessageCircle, FileText,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

const SERVICES_AT_HAND: { ar: string; en: string }[] = [
  { ar: 'إصدار خطاب إثبات القيد', en: 'Enrollment letter issuance' },
  { ar: 'طلب وثيقة التخرج', en: 'Graduation certificate request' },
  { ar: 'تحديث البيانات الشخصية', en: 'Personal information update' },
  { ar: 'متابعة الطلبات الإدارية', en: 'Administrative request tracking' },
  { ar: 'استفسارات الإجراءات الطلابية العامة', en: 'General student-procedure inquiries' },
];

const REQUIREMENTS: { ar: string; en: string }[] = [
  { ar: 'الرقم الجامعي للخدمات الشخصية.', en: 'University ID for personal services.' },
  { ar: 'مرفقات (إن وجدت) لكل طلب — تُرفع من جوالك.', en: 'Attachments (if any) for each request — uploaded from your phone.' },
  { ar: 'حضور شخصي عند الحاجة لاستلام مستندات ورقية.', en: 'In-person visit when paper documents must be picked up.' },
];

const HOW_TO: { ar: string; en: string }[] = [
  {
    ar: 'حدد نوع الطلب من قائمة الخدمات أعلاه أو من صفحة شؤون الطلبة.',
    en: 'Pick the request type from the services list above or from the Student Affairs page.',
  },
  {
    ar: 'إذا كان الطلب عامًا (ساعات عمل، مكان، إجراء عام): تصفحه مباشرة من اللوحة.',
    en: 'If the question is general (hours, location, general procedure): browse it directly from the board.',
  },
  {
    ar: 'إذا كان الطلب شخصيًا (حالة الطلب، السجل، الغرامات، الإنذارات): أكمل من جوالك بعد التحقق.',
    en: 'If the question is personal (request status, record, fines, warnings): continue privately on your phone after verification.',
  },
];

export function StudentAffairsInfo() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const ChevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div>
      <PrivacyBanner />
      <div className="p-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            aria-label={lang === 'ar' ? 'الرجوع' : 'Back'}
            className="w-12 h-12 rounded-2xl bg-surface border border-border-soft hover:border-primary hover:bg-surface-2 flex items-center justify-center text-ink transition shrink-0"
          >
            <ChevIcon className="w-6 h-6" />
          </button>
          <span className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
            <Building2 className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'شؤون الطلبة — استشارة عامة' : 'Student Affairs — general inquiry'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'دليل عام للخدمات والإجراءات في شؤون الطلبة'
                : 'A general guide to Student Affairs services and procedures'}
            </p>
          </div>
          <Chip tone="public-safe" icon={<Sparkles className="w-5 h-5" />}>
            {lang === 'ar' ? 'عام وآمن' : 'Public-safe'}
          </Chip>
        </div>

        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-primary/10 dark:bg-primary/15 border border-primary/30 mb-10">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-base text-ink leading-relaxed">
            {lang === 'ar'
              ? 'هذه إرشادات عامة. لا يتم عرض السجل الأكاديمي أو الإنذارات أو الحالة المالية أو طلباتك الشخصية على هذه الشاشة.'
              : 'These are general guidelines. Academic records, warnings, financial holds, and personal requests never appear on this screen.'}
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Location */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'أين أذهب؟' : 'Where to go?'}
              </h2>
            </header>
            <p className="text-lg text-ink">
              {lang === 'ar' ? 'مبنى ٤ — الدور الأرضي' : 'Building 4 — Ground floor'}
            </p>
            <p className="text-base text-ink-muted">
              {lang === 'ar' ? 'مدخل شؤون الطلبة بجانب العيادة الجامعية.' : 'Student Affairs entrance is next to the University Clinic.'}
            </p>
          </article>

          {/* Hours */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-success/15 dark:bg-success/20 text-success flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'ساعات العمل' : 'Working hours'}
              </h2>
            </header>
            <p className="text-lg text-ink">
              {lang === 'ar' ? '٨:٠٠ صباحًا — ٣:٠٠ مساءً' : '8:00 AM — 3:00 PM'}
            </p>
            <p className="text-base text-ink-muted">
              {lang === 'ar' ? 'الأحد إلى الخميس · الجمعة والسبت إجازة.' : 'Sunday to Thursday · closed Friday and Saturday.'}
            </p>
          </article>

          {/* Available services */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3 md:col-span-2">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-privacy/10 dark:bg-privacy/20 text-privacy flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'الخدمات المتاحة' : 'Available services'}
              </h2>
            </header>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-base text-ink leading-relaxed list-disc ms-5">
              {SERVICES_AT_HAND.map((svc, i) => (
                <li key={i}>{lang === 'ar' ? svc.ar : svc.en}</li>
              ))}
            </ul>
          </article>

          {/* General requirements */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-warning/15 dark:bg-warning/20 text-warning flex items-center justify-center">
                <ListChecks className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'المتطلبات العامة' : 'General requirements'}
              </h2>
            </header>
            <ul className="space-y-2 text-base text-ink leading-relaxed list-disc ms-5">
              {REQUIREMENTS.map((r, i) => (
                <li key={i}>{lang === 'ar' ? r.ar : r.en}</li>
              ))}
            </ul>
          </article>

          {/* How to start a request */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-teal/15 dark:bg-teal/20 text-teal flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'كيفية بدء طلب عام' : 'How to start a general request'}
              </h2>
            </header>
            <ul className="space-y-2 text-base text-ink leading-relaxed list-disc ms-5">
              {HOW_TO.map((s, i) => (
                <li key={i}>{lang === 'ar' ? s.ar : s.en}</li>
              ))}
            </ul>
          </article>
        </div>

        {/* Public actions */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            to="/map/student-affairs"
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-primary text-white text-lg font-semibold hover:bg-primary-600 transition"
          >
            <MapPin className="w-5 h-5" />
            <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
          </Link>
          <Link
            to="/hours/student-affairs"
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-surface text-primary border-2 border-primary/40 text-lg font-semibold hover:bg-primary/10 dark:hover:bg-primary/20 transition"
          >
            <Clock className="w-5 h-5" />
            <span>{lang === 'ar' ? 'ساعات العمل' : 'Working hours'}</span>
          </Link>
          <Button variant="primary" onClick={() => navigate('/service/student-affairs')}>
            <span>{lang === 'ar' ? 'صفحة شؤون الطلبة' : 'Student Affairs page'}</span>
            <ArrowIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Private switch — calm copy */}
        <section className="bg-surface border border-privacy/30 rounded-3xl p-7 mb-8">
          <header className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-6 h-6 text-privacy" />
            <h3 className="text-xl font-bold text-ink">
              {lang === 'ar' ? 'سؤالك عن طلبك أو حالتك الشخصية؟' : 'Asking about your request or personal status?'}
            </h3>
          </header>
          <p className="text-base text-ink-muted leading-relaxed mb-5 max-w-3xl">
            {lang === 'ar'
              ? 'لا يتم عرض السجل أو الإنذارات أو الحالة المالية على هذه اللوحة. أدخل رقمك الجامعي وتابع من جوالك بأمان.'
              : 'Your record, warnings, and financial status never appear on this board. Enter your University ID and continue privately on your phone.'}
          </p>
          <Button
            variant="privacy"
            onClick={() => navigate('/start-request/student-affairs?action=my-request-status')}
          >
            <span>{lang === 'ar' ? 'متابعة طلبي بشكل خاص' : 'Track my request privately'}</span>
            <ArrowIcon className="w-6 h-6" />
          </Button>
        </section>

        {/* Footer */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link to="/">
            <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
