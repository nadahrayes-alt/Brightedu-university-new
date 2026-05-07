import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight,
  MapPin, Clock, Stethoscope, Sparkles, ArrowLeft, ArrowRight,
  HelpCircle, MessageCircle, Cross,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

const GENERAL_SERVICES: { ar: string; en: string }[] = [
  { ar: 'الفحص العام والكشف الأولي', en: 'General check-ups and initial assessment' },
  { ar: 'تطعيمات وتحصينات الطلاب', en: 'Student vaccinations and immunisations' },
  { ar: 'الإسعافات الأولية للحالات الطارئة', en: 'First aid for emergency cases' },
  { ar: 'إحالة للأخصائيين خارج الحرم', en: 'Referral to specialists outside campus' },
  { ar: 'استشارات وقائية وتثقيف صحي', en: 'Preventive consultations and health education' },
];

const HOW_TO_HELP: { ar: string; en: string }[] = [
  {
    ar: 'لمعلومات عامة (الموقع، ساعات العمل، الخدمات): تواصل من هذه اللوحة دون الحاجة لرقمك الجامعي.',
    en: 'For general information (location, hours, services): use this board with no University ID required.',
  },
  {
    ar: 'لاستشارة شخصية أو وصف حالة: تحقق من رقمك الجامعي ثم أكمل من جوالك بأمان.',
    en: 'For a personal consultation or to describe symptoms: verify your University ID and continue privately on your phone.',
  },
  {
    ar: 'في الحالات الطارئة: استخدم بطاقة "الحالات الطارئة" أو اتصل برقم الطوارئ مباشرة.',
    en: 'In emergencies: use the "Emergency information" card or call the emergency number directly.',
  },
];

export function ClinicInfo() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const ChevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div>
      <PrivacyBanner />
      <div className="p-12 max-w-7xl mx-auto">
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
            <Stethoscope className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'العيادة الجامعية — معلومات عامة' : 'University Clinic — general information'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'كل ما تحتاج لمعرفة الخدمات الصحية في الحرم'
                : 'Everything you need to know about campus health services'}
            </p>
          </div>
          <Chip tone="public-safe" icon={<Sparkles className="w-5 h-5" />}>
            {lang === 'ar' ? 'عام وآمن' : 'Public-safe'}
          </Chip>
        </div>

        <p className="text-base text-ink-muted mb-10 leading-relaxed max-w-3xl">
          {lang === 'ar'
            ? 'هذه معلومات عامة ولا تتضمن أي بيانات صحية شخصية. لاستشارة خاصة بحالتك، انتقل للقناة الآمنة بعد التحقق من رقمك الجامعي.'
            : 'This is general information with no personal health data. For a private consultation, switch to the secure channel after verifying your University ID.'}
        </p>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Location */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'موقع العيادة' : 'Clinic location'}
              </h2>
            </header>
            <p className="text-lg text-ink">
              {lang === 'ar' ? 'مبنى ٦ — الدور الأرضي' : 'Building 6 — Ground Floor'}
            </p>
            <p className="text-base text-ink-muted">
              {lang === 'ar' ? 'تقع بين شؤون الطلبة ومركز الأنشطة.' : 'Located between Student Affairs and the Activities Center.'}
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
              {lang === 'ar' ? '٨:٠٠ صباحًا — ٤:٠٠ مساءً' : '8:00 AM — 4:00 PM'}
            </p>
            <p className="text-base text-ink-muted">
              {lang === 'ar' ? 'الأحد إلى الخميس · الجمعة والسبت إجازة.' : 'Sunday to Thursday · closed Friday and Saturday.'}
            </p>
          </article>

          {/* General services */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3 md:col-span-2">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-teal/15 dark:bg-teal/20 text-teal flex items-center justify-center">
                <Cross className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'الخدمات العامة' : 'General services'}
              </h2>
            </header>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-base text-ink leading-relaxed list-disc ms-5">
              {GENERAL_SERVICES.map((svc, i) => (
                <li key={i}>{lang === 'ar' ? svc.ar : svc.en}</li>
              ))}
            </ul>
          </article>

          {/* How to ask for help */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3 md:col-span-2">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-privacy/10 dark:bg-privacy/20 text-privacy flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'كيف تطلب المساعدة' : 'How to ask for help'}
              </h2>
            </header>
            <ul className="space-y-2 text-base text-ink leading-relaxed list-disc ms-5">
              {HOW_TO_HELP.map((tip, i) => (
                <li key={i}>{lang === 'ar' ? tip.ar : tip.en}</li>
              ))}
            </ul>
          </article>
        </div>

        {/* Footer actions: public + private switch */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            to="/map/clinic"
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-primary text-white text-lg font-semibold hover:bg-primary-600 transition"
          >
            <MapPin className="w-5 h-5" />
            <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
          </Link>
          <Link
            to="/hours/clinic"
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-surface text-primary border-2 border-primary/40 text-lg font-semibold hover:bg-primary/10 dark:hover:bg-primary/20 transition"
          >
            <Clock className="w-5 h-5" />
            <span>{lang === 'ar' ? 'ساعات العمل' : 'Working hours'}</span>
          </Link>
        </div>

        {/* Private consultation switch — calm copy */}
        <section className="bg-surface border border-privacy/30 rounded-3xl p-7 mb-8">
          <header className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-6 h-6 text-privacy" />
            <h3 className="text-xl font-bold text-ink">
              {lang === 'ar' ? 'تريد استشارة شخصية؟' : 'Need a personal consultation?'}
            </h3>
          </header>
          <p className="text-base text-ink-muted leading-relaxed mb-5 max-w-3xl">
            {lang === 'ar'
              ? 'لا يتم عرض أي بيانات صحية على هذه اللوحة. تحقق من رقمك الجامعي وأكمل الاستشارة بشكل خاص من جوالك.'
              : 'No health data is shown on this board. Verify your University ID and complete the consultation privately on your phone.'}
          </p>
          <Button
            variant="privacy"
            onClick={() => navigate('/start-request/clinic?action=personal-consultation')}
          >
            <span>{lang === 'ar' ? 'بدء استشارة شخصية' : 'Start personal consultation'}</span>
            <ArrowIcon className="w-6 h-6" />
          </Button>
        </section>

        <div className="flex items-center gap-4 flex-wrap">
          <Link to="/">
            <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
