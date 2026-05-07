import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  GraduationCap, Sparkles, MapPin, Clock, Info, CalendarDays,
  HelpCircle,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

const DEADLINES: { ar: string; en: string }[] = [
  { ar: 'فتح بوابة القبول للفصل القادم: ١ ذو الحجة', en: 'Admissions portal opens for next term: 1st Dhul Hijjah' },
  { ar: 'آخر موعد لتقديم الطلبات: ٢٠ ذو الحجة', en: 'Application deadline: 20th Dhul Hijjah' },
  { ar: 'إعلان نتائج القبول: ١٠ محرّم', en: 'Admission results announced: 10th Muharram' },
  { ar: 'بدء التسجيل في المقررات: ٢٥ محرّم', en: 'Course registration begins: 25th Muharram' },
];

const INQUIRY_STEPS: { ar: string; en: string }[] = [
  {
    ar: 'لمعلومات عامة عن مواعيد القبول والشروط: تابع هذه الصفحة، لا تحتاج رقمك الجامعي.',
    en: 'For general information on admission timelines and requirements: use this page; no University ID needed.',
  },
  {
    ar: 'لاستفسار شخصي مثل "ما حالة طلبي؟" أو "هل تم قبولي؟": أدخل رقمك الجامعي وتابع من جوالك.',
    en: 'For a personal question like "What is my application status?" or "Have I been accepted?": enter your University ID and continue on your phone.',
  },
  {
    ar: 'للزيارة الحضورية: اطّلع على ساعات العمل والموقع، ثم احضر إلى مبنى ١.',
    en: 'For an in-person visit: check the working hours and location, then come to Building 1.',
  },
];

export function AdmissionInquiry() {
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
            <GraduationCap className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'استفسار عن القبول' : 'Admission inquiry'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'معلومات عامة عن القبول والتسجيل في الجامعة'
                : 'General information about university admissions and registration'}
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
              ? 'هذه الصفحة عامة. لا يتم عرض حالة طلبك أو نتيجة قبولك أو سجلك الأكاديمي عليها. لاستفسار شخصي أكمل من جوالك بأمان.'
              : 'This page is public. Your application status, admission result, and academic record never appear here. For a personal inquiry, continue privately on your phone.'}
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
                {lang === 'ar' ? 'موقع القبول والتسجيل' : 'Admissions location'}
              </h2>
            </header>
            <p className="text-lg text-ink">
              {lang === 'ar' ? 'مبنى ١ — الدور الأرضي' : 'Building 1 — Ground Floor'}
            </p>
            <p className="text-base text-ink-muted">
              {lang === 'ar' ? 'البوابة الرئيسية لحرم جامعة الملك عبدالعزيز' : 'Main gate of King Abdulaziz University campus'}
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
              {lang === 'ar' ? 'الأحد إلى الخميس' : 'Sunday to Thursday'}
            </p>
          </article>

          {/* Admission deadlines */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3 md:col-span-2">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-privacy/10 dark:bg-privacy/20 text-privacy flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'مواعيد القبول' : 'Admission timelines'}
              </h2>
            </header>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-base text-ink leading-relaxed list-disc ms-5">
              {DEADLINES.map((d, i) => (
                <li key={i}>{lang === 'ar' ? d.ar : d.en}</li>
              ))}
            </ul>
            <p className="text-sm text-ink-subtle mt-2">
              {lang === 'ar'
                ? 'المواعيد عامة وقد تتغير. تأكد من البوابة الرسمية للجامعة.'
                : 'Dates are general and subject to change. Confirm via the official university portal.'}
            </p>
          </article>

          {/* Inquiry steps */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3 md:col-span-2">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-warning/15 dark:bg-warning/20 text-warning flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'خطوات عامة للاستفسار' : 'How to ask'}
              </h2>
            </header>
            <ul className="space-y-2 text-base text-ink leading-relaxed list-disc ms-5">
              {INQUIRY_STEPS.map((s, i) => (
                <li key={i}>{lang === 'ar' ? s.ar : s.en}</li>
              ))}
            </ul>
          </article>
        </div>

        {/* Public actions */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            to="/map/admissions"
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-primary text-white text-lg font-semibold hover:bg-primary-600 transition"
          >
            <MapPin className="w-5 h-5" />
            <span>{lang === 'ar' ? 'عرض الموقع' : 'Show location'}</span>
          </Link>
          <Link
            to="/hours/admissions"
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-surface text-primary border-2 border-primary/40 text-lg font-semibold hover:bg-primary/10 dark:hover:bg-primary/20 transition"
          >
            <Clock className="w-5 h-5" />
            <span>{lang === 'ar' ? 'ساعات العمل' : 'Working hours'}</span>
          </Link>
        </div>

        {/* Personal status switch */}
        <section className="bg-surface border border-privacy/30 rounded-3xl p-7 mb-8">
          <h3 className="text-xl font-bold text-ink mb-2">
            {lang === 'ar' ? 'تريد متابعة طلبك أو حالة قبولك؟' : 'Want to track your application or admission status?'}
          </h3>
          <p className="text-base text-ink-muted leading-relaxed mb-5 max-w-3xl">
            {lang === 'ar'
              ? 'لن يتم عرض نتيجة القبول أو رقم الطلب أو اسم الطالب على هذه الشاشة. أدخل رقمك الجامعي وتابع من جوالك بأمان.'
              : 'Your admission result, application ID, and student name never appear on this screen. Enter your University ID and continue privately on your phone.'}
          </p>
          <Button
            variant="privacy"
            onClick={() => navigate('/start-request/admissions?action=my-admission-status')}
          >
            <span>{lang === 'ar' ? 'متابعة حالة القبول' : 'Track admission status'}</span>
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
