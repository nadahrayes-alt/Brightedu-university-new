import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight,
  MapPin, Phone, ShieldCheck, Sparkles, AlertCircle,
  HeartPulse, ArrowLeft, ArrowRight,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

interface SafetyTip {
  ar: string;
  en: string;
}

const EMERGENCY_NUMBER = '+966 12 695 0000';

const SAFETY_TIPS: SafetyTip[] = [
  {
    ar: 'في حالات الطوارئ الصحية اتجه فورًا إلى العيادة الجامعية أو اتصل برقم الطوارئ.',
    en: 'For medical emergencies, head to the University Clinic or call the emergency line immediately.',
  },
  {
    ar: 'لا تنقل المصاب إلا للضرورة، وأبقِه هادئًا حتى وصول فريق الطوارئ.',
    en: 'Do not move an injured person unless necessary; keep them calm until the emergency team arrives.',
  },
  {
    ar: 'في حال الحريق أو إخلاء المبنى، استخدم الدرج ولا تستخدم المصاعد.',
    en: 'If there is a fire or evacuation, use the stairs and avoid the elevators.',
  },
  {
    ar: 'أبلِغ نقطة الأمن والسلامة عن أي حادثة تشاهدها في الحرم.',
    en: 'Report any incident you witness on campus to the nearest safety point.',
  },
];

export function EmergencyInfo() {
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
          <span className="w-16 h-16 rounded-2xl bg-danger/15 dark:bg-danger/20 text-danger flex items-center justify-center">
            <HeartPulse className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'الحالات الطارئة' : 'Emergency information'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'بطاقة معلومات الطوارئ في الحرم الجامعي'
                : 'Campus emergency information card'}
            </p>
          </div>
          <Chip tone="public-safe" icon={<Sparkles className="w-5 h-5" />}>
            {lang === 'ar' ? 'عام وآمن' : 'Public-safe'}
          </Chip>
        </div>

        {/* Calm reassurance — public-safe page */}
        <p className="text-base text-ink-muted mb-10 leading-relaxed max-w-3xl">
          {lang === 'ar'
            ? 'هذه معلومات عامة للمساعدة الفورية. لا يتم جمع تفاصيل أي حادثة على الشاشة العامة. للإبلاغ عن حادثة شخصية، استخدم القناة الخاصة الآمنة.'
            : 'This is general information to help right away. The public board never collects incident details. To report a personal incident, use the secure private channel.'}
        </p>

        {/* Info cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Emergency number */}
          <article className="bg-surface border border-danger/30 rounded-3xl p-7 flex flex-col gap-3">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-danger/15 dark:bg-danger/20 text-danger flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'رقم الطوارئ الجامعية' : 'Campus emergency number'}
              </h2>
            </header>
            <p className="text-3xl font-bold text-danger num">{EMERGENCY_NUMBER}</p>
            <p className="text-base text-ink-muted">
              {lang === 'ar'
                ? 'متاح ٢٤ ساعة لطلب فريق الطوارئ والإسعاف.'
                : 'Available 24/7 to reach the emergency and ambulance team.'}
            </p>
          </article>

          {/* Clinic location */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'موقع العيادة الجامعية' : 'University Clinic location'}
              </h2>
            </header>
            <p className="text-lg text-ink">
              {lang === 'ar' ? 'مبنى ٦ — الدور الأرضي' : 'Building 6 — Ground Floor'}
            </p>
            <p className="text-base text-ink-muted">
              {lang === 'ar' ? 'ساعات العمل: ٨:٠٠ ص — ٤:٠٠ م' : 'Hours: 8:00 AM — 4:00 PM'}
            </p>
          </article>

          {/* Nearest safety point */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-success/15 dark:bg-success/20 text-success flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'أقرب نقطة أمن وسلامة' : 'Nearest safety & security point'}
              </h2>
            </header>
            <p className="text-lg text-ink">
              {lang === 'ar' ? 'نقطة الأمن الرئيسية — مبنى ١' : 'Main Safety Point — Building 1'}
            </p>
            <p className="text-base text-ink-muted">
              {lang === 'ar' ? 'تبعد عنك حوالي ٣ دقائق سيرًا' : 'About a 3-minute walk from here'}
            </p>
          </article>

          {/* Safety instructions */}
          <article className="bg-surface border border-border-soft rounded-3xl p-7 flex flex-col gap-3">
            <header className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-warning/15 dark:bg-warning/20 text-warning flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </span>
              <h2 className="text-xl font-bold text-ink leading-tight">
                {lang === 'ar' ? 'تعليمات عامة' : 'General instructions'}
              </h2>
            </header>
            <ul className="space-y-2 text-base text-ink leading-relaxed list-disc ms-5">
              {SAFETY_TIPS.map((tip, i) => (
                <li key={i}>{lang === 'ar' ? tip.ar : tip.en}</li>
              ))}
            </ul>
          </article>
        </div>

        {/* Primary actions */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link
            to="/map/clinic"
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-primary text-white text-lg font-semibold hover:bg-primary-600 transition"
          >
            <MapPin className="w-5 h-5" />
            <span>{lang === 'ar' ? 'عرض موقع العيادة' : 'Show clinic location'}</span>
          </Link>
          <a
            href={`tel:${EMERGENCY_NUMBER.replace(/\s/g, '')}`}
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-danger text-white text-lg font-semibold hover:opacity-90 transition"
          >
            <Phone className="w-5 h-5" />
            <span>{lang === 'ar' ? 'الاتصال بالطوارئ' : 'Call emergency'}</span>
          </a>
          <a
            href="#safety-tips"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('safety-tips-anchor')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 h-14 px-6 rounded-2xl bg-surface text-primary border-2 border-primary/40 text-lg font-semibold hover:bg-primary/10 dark:hover:bg-primary/20 transition"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{lang === 'ar' ? 'تعليمات السلامة' : 'Safety instructions'}</span>
          </a>
        </div>

        <div id="safety-tips-anchor" />

        {/* Private incident report — calm reassurance, not a scary error */}
        <section className="bg-surface border border-border-soft rounded-3xl p-7 mb-8">
          <h3 className="text-xl font-bold text-ink mb-2">
            {lang === 'ar' ? 'تريد الإبلاغ عن حادثة شخصية؟' : 'Need to report a personal incident?'}
          </h3>
          <p className="text-base text-ink-muted leading-relaxed mb-5 max-w-3xl">
            {lang === 'ar'
              ? 'لحماية خصوصيتك، تفاصيل الحادثة لا تظهر على هذه الشاشة. تحقق من رقمك الجامعي ثم أكمل البلاغ من جوالك بأمان.'
              : 'For your privacy, incident details are not shown on this screen. Verify your University ID, then complete the report on your phone.'}
          </p>
          <Button
            variant="privacy"
            onClick={() => navigate('/start-request/clinic?action=incident-report')}
          >
            <span>{lang === 'ar' ? 'إبلاغ عن حادثة شخصية' : 'Report a personal incident'}</span>
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
