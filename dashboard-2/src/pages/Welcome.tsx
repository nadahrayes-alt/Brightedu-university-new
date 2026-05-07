import {
  Building2, Map, Clock, FileText, Users, CalendarDays,
  Sparkles, ArrowLeft, ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../lib/AppContext';

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

  return (
    <div className="px-6 py-8 sm:px-10 sm:py-12 max-w-5xl mx-auto">
      {/* Hero */}
      <section className="mb-10">
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

      {/* Quick Actions Grid — 2 columns, large cards */}
      <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-5">
        {lang === 'ar' ? 'إجراءات سريعة' : 'Quick actions'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
    </div>
  );
}
