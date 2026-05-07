import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  Wifi, Sparkles, MapPin, Info, Ticket, ShieldCheck,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

const STEPS: { ar: string; en: string }[] = [
  {
    ar: 'تأكد من اختيار شبكة الجامعة الصحيحة (KAU-Secure للطلاب).',
    en: 'Make sure you are connected to the correct university network (KAU-Secure for students).',
  },
  {
    ar: 'سجّل الدخول باستخدام الحساب الجامعي وكلمة المرور الخاصة بك.',
    en: 'Sign in with your university account and password.',
  },
  {
    ar: 'إذا لم يتصل الجهاز، أعد تشغيل الواي-فاي وافصل الشبكة ثم أعد إضافتها.',
    en: 'If the device cannot connect, toggle Wi-Fi off, forget the network, then re-add it.',
  },
  {
    ar: 'تأكد من وجودك في نطاق التغطية — اقترب من نقطة الوصول الأقرب.',
    en: 'Make sure you are within coverage — move closer to the nearest access point.',
  },
  {
    ar: 'إذا استمرت المشكلة، افتح بلاغ دعم وسيتواصل معك الفريق.',
    en: 'If the issue persists, open a support report and the team will reach out to you.',
  },
];

export function WifiTroubleshooting() {
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
          <span className="w-16 h-16 rounded-2xl bg-teal/15 dark:bg-teal/20 text-teal flex items-center justify-center">
            <Wifi className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'مشكلة في الواي-فاي' : 'Wi-Fi issue'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'خطوات عامة لاستعادة الاتصال بشبكة الجامعة'
                : 'General steps to restore your university Wi-Fi connection'}
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
              ? 'هذه نصائح عامة للاتصال بالواي-فاي. لا تحتاج رقمك الجامعي هنا. لفتح بلاغ يخص جهازك أو حسابك، أكمل من جوالك بأمان.'
              : 'These are general Wi-Fi tips. No University ID is needed here. To open a report tied to your device or account, continue privately on your phone.'}
          </p>
        </div>

        {/* Troubleshooting steps */}
        <section className="bg-surface border border-border-soft rounded-3xl p-7 mb-8">
          <header className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-teal" />
            <h2 className="text-2xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'خطوات عامة لحل المشكلة' : 'General troubleshooting steps'}
            </h2>
          </header>
          <ol className="space-y-4 text-lg text-ink list-none">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-9 h-9 shrink-0 rounded-full bg-teal text-white text-base font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{lang === 'ar' ? step.ar : step.en}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Primary actions */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Button
            variant="privacy"
            onClick={() =>
              navigate('/start-request/tech-support?action=support-ticket&topic=wifi')
            }
          >
            <Ticket className="w-5 h-5" />
            <span>{lang === 'ar' ? 'فتح بلاغ دعم' : 'Open support report'}</span>
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
