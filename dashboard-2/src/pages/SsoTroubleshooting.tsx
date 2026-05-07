import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  KeyRound, Sparkles, MapPin, Info, Ticket, ShieldCheck,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

const STEPS: { ar: string; en: string }[] = [
  {
    ar: 'تأكد أنك تستخدم البريد الجامعي الصحيح بصيغة username@kau.edu.sa.',
    en: 'Make sure you are using the correct university email in the format username@kau.edu.sa.',
  },
  {
    ar: 'تحقق من حالة الخدمة على بوابة الجامعة قبل المحاولة مرة أخرى.',
    en: 'Check the university portal service status before trying again.',
  },
  {
    ar: 'أعد المحاولة بعد إغلاق المتصفح وحذف بيانات تصفح بوابة الدخول.',
    en: 'Close the browser and clear sign-in cookies, then try again.',
  },
  {
    ar: 'إذا ظهرت رسالة "كلمة مرور غير صحيحة" مرتين، استخدم خاصية إعادة التعيين.',
    en: 'If you see "incorrect password" twice, use the reset feature instead of retrying.',
  },
  {
    ar: 'إذا استمرت المشكلة، افتح تذكرة دعم وسيتواصل معك الفريق.',
    en: 'If the issue persists, open a support ticket and the team will reach out to you.',
  },
];

export function SsoTroubleshooting() {
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
            <KeyRound className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'مشاكل الدخول الموحد' : 'SSO login issues'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'خطوات عامة لحل مشكلة الدخول قبل التواصل مع الدعم'
                : 'General troubleshooting steps before reaching out to support'}
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
              ? 'هذه نصائح عامة لا تحتاج تسجيل دخول أو رقم جامعي. لإجراءات شخصية على حسابك (إعادة تعيين كلمة المرور، فتح تذكرة) أكمل من جوالك بأمان.'
              : 'These are general tips with no login or University ID required. For personal account actions (password reset, support ticket), continue privately on your phone.'}
          </p>
        </div>

        {/* Troubleshooting steps */}
        <section className="bg-surface border border-border-soft rounded-3xl p-7 mb-8">
          <header className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'خطوات عامة لحل المشكلة' : 'General troubleshooting steps'}
            </h2>
          </header>
          <ol className="space-y-4 text-lg text-ink list-none">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-9 h-9 shrink-0 rounded-full bg-primary text-white text-base font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{lang === 'ar' ? step.ar : step.en}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Primary actions: public + private switches */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Button
            variant="privacy"
            onClick={() => navigate('/start-request/tech-support?action=reset-password')}
          >
            <KeyRound className="w-5 h-5" />
            <span>{lang === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset password'}</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/start-request/tech-support?action=support-ticket&topic=sso')}
          >
            <Ticket className="w-5 h-5" />
            <span>{lang === 'ar' ? 'فتح تذكرة دعم' : 'Open support ticket'}</span>
          </Button>
          <Link
            to="/map/tech-support"
            className="inline-flex items-center gap-2 h-16 px-7 rounded-2xl bg-surface text-ink border-2 border-border-soft hover:border-primary text-xl font-semibold transition"
          >
            <MapPin className="w-5 h-5" />
            <span>{lang === 'ar' ? 'عرض موقع الدعم التقني' : 'Show Tech Support location'}</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="primary" onClick={() => navigate('/service/tech-support')}>
            <span>{lang === 'ar' ? 'الدعم التقني' : 'Tech Support'}</span>
            <ArrowIcon className="w-6 h-6" />
          </Button>
          <Link to="/">
            <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
