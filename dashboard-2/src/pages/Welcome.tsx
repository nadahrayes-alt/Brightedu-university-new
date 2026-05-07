import {
  Building2, Map, Clock, FileText, Users, CalendarDays,
  Sparkles, ArrowLeft, ArrowRight, Activity, ShieldCheck, TrendingUp,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../lib/AppContext';
import { SERVICES } from '../data/services';
import { mockBackend } from '../data/mock';
import { ar } from '../lib/numerals';

interface QuickAction {
  to: string;
  icon: typeof Building2;
  ar: string;
  en: string;
  hintAr: string;
  hintEn: string;
  color: 'primary' | 'teal' | 'warning' | 'privacy' | 'success' | 'danger';
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    to: '/service/student-affairs',
    icon: Building2,
    ar: 'وين شؤون الطلبة؟',
    en: 'Where is Student Affairs?',
    hintAr: 'مبنى ٤ — الدور الأرضي',
    hintEn: 'Building 4 — Ground floor',
    color: 'primary',
  },
  {
    to: '/map/main-gate',
    icon: Map,
    ar: 'عرض الخريطة',
    en: 'Show campus map',
    hintAr: 'البوابة الرئيسية ومسارات الحرم',
    hintEn: 'Main gate and campus routes',
    color: 'teal',
  },
  {
    to: '/services',
    icon: Clock,
    ar: 'مواعيد الخدمات',
    en: 'Service hours',
    hintAr: 'ساعات العمل لجميع الخدمات',
    hintEn: 'Working hours for all services',
    color: 'success',
  },
  {
    to: '/service/document-pickup',
    icon: FileText,
    ar: 'استلام الوثائق',
    en: 'Document pickup',
    hintAr: 'وثيقة التخرج، كشف الدرجات، المتابعة',
    hintEn: 'Graduation cert, transcript, tracking',
    color: 'privacy',
  },
  {
    to: '/queue',
    icon: Users,
    ar: 'حالة الانتظار',
    en: 'Queue status',
    hintAr: 'مؤشرات الازدحام في الحرم الآن',
    hintEn: 'Live congestion across campus',
    color: 'warning',
  },
  {
    to: '/events/today',
    icon: CalendarDays,
    ar: 'الفعاليات اليوم',
    en: "Today's events",
    hintAr: 'ورش، أنشطة، ولقاءات الطلاب',
    hintEn: 'Workshops, activities, meet-ups',
    color: 'danger',
  },
];

const COLOR_CLASSES: Record<QuickAction['color'], string> = {
  primary: 'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30',
  teal:    'bg-teal/15 dark:bg-teal/20 text-teal border-teal/30',
  warning: 'bg-warning/15 dark:bg-warning/20 text-warning border-warning/30',
  privacy: 'bg-privacy/10 dark:bg-privacy/20 text-privacy border-privacy/30',
  success: 'bg-success/15 dark:bg-success/20 text-success border-success/30',
  danger:  'bg-danger/15 dark:bg-danger/20 text-danger border-danger/30',
};

export function Welcome() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  const pulse = mockBackend.getCampusPulse();
  const openCount = SERVICES.filter((s) => s.status === 'open').length;
  const liveServices = SERVICES.slice(0, 3);

  return (
    <div className="relative">
      {/* Ambient gradient backdrop — fills the white space on wider viewports
        * without changing the portrait kiosk reading order. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -start-40 w-[36rem] h-[36rem] rounded-full bg-primary/10 dark:bg-primary/20 blur-[140px]" />
        <div className="absolute top-1/3 -end-40 w-[36rem] h-[36rem] rounded-full bg-privacy/10 dark:bg-privacy/15 blur-[140px]" />
        <div className="absolute -bottom-40 start-1/3 w-[28rem] h-[28rem] rounded-full bg-teal/10 dark:bg-teal/15 blur-[120px]" />
      </div>

      <div className="relative px-6 py-8 sm:px-10 sm:py-12">
        {/* Hero — text on one side, mascot on the other (lg+).
          * On portrait/small screens the mascot floats above the text. */}
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 h-10 rounded-full bg-primary/15 text-primary text-base font-semibold mb-5">
              <Sparkles className="w-5 h-5" />
              {lang === 'ar' ? 'لوحة الحرم الذكية' : 'Smart Campus Board'}
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-ink leading-[1.05]">
              {lang === 'ar' ? 'كيف أقدر أساعدك؟' : 'How can I help?'}
            </h1>
            <p className="mt-4 text-2xl text-ink-muted leading-snug max-w-2xl">
              {lang === 'ar'
                ? 'اضغط على المساعد للسؤال بالصوت، أو اختر إجراءً سريعًا.'
                : 'Tap the assistant to ask by voice, or pick a quick action below.'}
            </p>
          </div>

          {/* Mascot — friendly greeter sitting next to the headline */}
          <div className="order-1 lg:order-2 relative shrink-0 mx-auto lg:mx-0">
            {/* Soft glow halo behind the mascot */}
            <div className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-primary/20 dark:bg-primary/30 blur-3xl animate-glow-soft" />
            <img
              src="/mascot.png"
              alt={lang === 'ar' ? 'مساعد الحرم الذكي' : 'Smart Campus assistant mascot'}
              className="relative w-44 sm:w-52 lg:w-64 h-auto select-none animate-fade-in drop-shadow-[0_20px_30px_rgba(47,91,255,0.25)]"
              draggable={false}
            />
          </div>
        </section>

        {/* Live KPI strip — keeps the kiosk feeling alive */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            tone="success"
            icon={<Activity className="w-6 h-6" />}
            label={lang === 'ar' ? 'خدمات مفتوحة' : 'Open services'}
            value={lang === 'ar' ? `${ar(openCount)} / ${ar(SERVICES.length)}` : `${openCount} / ${SERVICES.length}`}
          />
          <KpiCard
            tone="warning"
            icon={<Clock className="w-6 h-6" />}
            label={lang === 'ar' ? 'متوسط الانتظار' : 'Average wait'}
            value={lang === 'ar' ? `${ar(pulse.averageWaitMin)} دقيقة` : `${pulse.averageWaitMin} min`}
          />
          <KpiCard
            tone="primary"
            icon={<TrendingUp className="w-6 h-6" />}
            label={lang === 'ar' ? 'زيارات اليوم' : 'Visits today'}
            value={lang === 'ar' ? ar(pulse.visitsToday) : String(pulse.visitsToday)}
          />
          <KpiCard
            tone="privacy"
            icon={<ShieldCheck className="w-6 h-6" />}
            label={lang === 'ar' ? 'الخصوصية' : 'Privacy'}
            value={lang === 'ar' ? 'محمية' : 'Protected'}
          />
        </section>

        {/* Big Voice CTA — promotes the assistant as the primary entry point */}
        <button
          onClick={() => navigate('/assistant')}
          className="group w-full mb-10 rounded-3xl border-2 border-primary/40 bg-gradient-to-r from-primary/15 via-surface to-privacy/15 dark:from-primary/25 dark:via-surface dark:to-privacy/25 p-7 sm:p-8 flex items-center gap-5 hover:border-primary/60 active:scale-[0.99] transition shadow-[0_8px_40px_-12px_rgba(47,91,255,0.4)]"
          aria-label={lang === 'ar' ? 'فتح المساعد الصوتي' : 'Open the voice assistant'}
        >
          <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 shrink-0">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12" />
          </span>
          <div className="flex-1 min-w-0 text-start">
            <div className="text-2xl sm:text-3xl font-bold text-ink leading-tight mb-1">
              {lang === 'ar' ? 'اسأل مساعد الحرم' : 'Ask the campus assistant'}
            </div>
            <div className="text-base sm:text-lg text-ink-muted">
              {lang === 'ar'
                ? 'اضغط للتحدث بصوتك — أو اكتب سؤالك'
                : 'Tap to speak — or type your question'}
            </div>
          </div>
          <Arrow className="w-7 h-7 text-primary shrink-0" />
        </button>

        {/* Quick Actions Grid — 1 / 2 / 3 cols by viewport (portrait → landscape) */}
        <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-5">
          {lang === 'ar' ? 'إجراءات سريعة' : 'Quick actions'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {QUICK_ACTIONS.map((q) => {
            const Icon = q.icon;
            return (
              <Link
                key={q.to + q.ar}
                to={q.to}
                className="group bg-surface border border-border-soft rounded-3xl p-6 sm:p-7 min-h-[180px] flex flex-col gap-3 hover:border-primary/40 active:scale-[0.99] transition"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-16 h-16 rounded-2xl border flex items-center justify-center shrink-0 ${COLOR_CLASSES[q.color]}`}
                  >
                    <Icon className="w-8 h-8" />
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-ink leading-tight flex-1 min-w-0">
                    {lang === 'ar' ? q.ar : q.en}
                  </h3>
                </div>
                <p className="text-base text-ink-muted leading-relaxed">
                  {lang === 'ar' ? q.hintAr : q.hintEn}
                </p>
                <div className="mt-auto inline-flex items-center text-base text-primary font-semibold">
                  <span>{lang === 'ar' ? 'افتح' : 'Open'}</span>
                  <Arrow className="w-5 h-5 ms-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Live now — busiest services right now */}
        <section className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-ink">
              {lang === 'ar' ? 'الآن في الحرم' : 'Live on campus'}
            </h2>
            <span className="inline-flex items-center gap-2 text-base text-ink-muted">
              <span className="w-2.5 h-2.5 rounded-full bg-success live-dot" />
              {lang === 'ar' ? 'تحديث مباشر' : 'Live updates'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveServices.map((s) => {
              const tone =
                s.queue?.level === 'high' ? 'bg-danger'
                : s.queue?.level === 'medium' ? 'bg-warning'
                : 'bg-success';
              return (
                <Link
                  key={s.id}
                  to={`/service/${s.id}`}
                  className="bg-surface border border-border-soft rounded-2xl p-5 hover:border-primary/40 transition flex items-center gap-4"
                >
                  <span className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-semibold text-ink truncate">
                      {lang === 'ar' ? s.nameAr : s.nameEn}
                    </div>
                    <div className="text-sm text-ink-muted truncate">
                      {lang === 'ar' ? s.building : s.buildingEn}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`w-3 h-3 rounded-full ${tone}`} />
                    {s.queue && (
                      <span className="text-sm text-ink-muted num">
                        {lang === 'ar' ? `${ar(s.queue.minutes)} د` : `${s.queue.minutes}m`}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

const TONES: Record<string, { ring: string; bg: string; text: string }> = {
  primary: { ring: 'border-primary/30',  bg: 'bg-primary/10 dark:bg-primary/20',   text: 'text-primary' },
  privacy: { ring: 'border-privacy/30',  bg: 'bg-privacy/10 dark:bg-privacy/20',   text: 'text-privacy' },
  success: { ring: 'border-success/30',  bg: 'bg-success/15 dark:bg-success/20',   text: 'text-success' },
  warning: { ring: 'border-warning/30',  bg: 'bg-warning/15 dark:bg-warning/20',   text: 'text-warning' },
};

function KpiCard({
  tone, icon, label, value,
}: {
  tone: keyof typeof TONES;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const t = TONES[tone];
  return (
    <div className="bg-surface border border-border-soft rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm">
      <span className={`shrink-0 w-12 h-12 rounded-2xl border ${t.ring} ${t.bg} ${t.text} flex items-center justify-center`}>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-[0.2em] text-ink-subtle font-semibold">
          {label}
        </div>
        <div className={`text-xl font-bold ${t.text} num leading-tight truncate`}>
          {value}
        </div>
      </div>
    </div>
  );
}
