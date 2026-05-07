import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic, Sparkles, ArrowLeft, ArrowRight, Type as TypeIcon,
  Building2, Map, Clock, FileText, Users, CalendarDays,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { AssistantInput } from '../components/board/AssistantInput';
import { PrivacyBanner } from '../components/board/PrivacyBanner';

interface QuickAction {
  to: string;
  icon: typeof Building2;
  ar: string;
  en: string;
  color: 'primary' | 'teal' | 'warning' | 'privacy' | 'success' | 'danger';
}

const QUICK_ACTIONS: QuickAction[] = [
  { to: '/service/student-affairs', icon: Building2,    ar: 'وين شؤون الطلبة؟', en: 'Where is Student Affairs?', color: 'primary' },
  { to: '/map/main-gate',           icon: Map,          ar: 'عرض الخريطة',      en: 'Show campus map',          color: 'teal' },
  { to: '/services',                icon: Clock,        ar: 'مواعيد الخدمات',   en: 'Service hours',            color: 'success' },
  { to: '/service/document-pickup', icon: FileText,     ar: 'استلام الوثائق',   en: 'Document pickup',          color: 'privacy' },
  { to: '/queue',                   icon: Users,        ar: 'حالة الانتظار',    en: 'Queue status',             color: 'warning' },
  { to: '/events/today',            icon: CalendarDays, ar: 'الفعاليات اليوم',  en: "Today's events",           color: 'danger' },
];

const COLOR_CLASSES: Record<QuickAction['color'], string> = {
  primary: 'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30',
  teal:    'bg-teal/15 dark:bg-teal/20 text-teal border-teal/30',
  warning: 'bg-warning/15 dark:bg-warning/20 text-warning border-warning/30',
  privacy: 'bg-privacy/10 dark:bg-privacy/20 text-privacy border-privacy/30',
  success: 'bg-success/15 dark:bg-success/20 text-success border-success/30',
  danger:  'bg-danger/15 dark:bg-danger/20 text-danger border-danger/30',
};

export function Assistant() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;
  // The mock voice state: tapping the mic toggles a "listening" affordance.
  // No real speech recognition — typing remains the secondary fallback.
  const [listening, setListening] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  function toggleListening() {
    setListening((prev) => !prev);
  }

  return (
    <div>
      <PrivacyBanner />
      <div className="px-6 py-8 sm:px-10 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-9 h-9" />
          </span>
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'مساعد الحرم الذكي' : 'Smart Campus Assistant'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar' ? 'اضغط على الميكروفون وتحدث.' : 'Tap the microphone and speak.'}
            </p>
          </div>
        </div>

        {/* In landscape (xl+), the mic stage and Quick Actions sit side-by-side
          * so the screen reads as one comfortable composition. In portrait the
          * mic stage spans the full column and the grid sits below it. */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 xl:gap-8 mb-10">
        {/* Voice-first stage — the giant mic is the main affordance */}
        <section
          aria-live="polite"
          className="xl:col-span-3 bg-surface border border-border-soft rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center"
        >
          <div className="relative">
            {/* Pulsing halos when listening */}
            {listening && (
              <>
                <span className="absolute inset-0 -m-6 rounded-full bg-primary/20 animate-ping" />
                <span className="absolute inset-0 -m-2 rounded-full bg-primary/30 blur-2xl animate-glow-soft" />
              </>
            )}
            <button
              onClick={toggleListening}
              aria-pressed={listening}
              aria-label={
                listening
                  ? (lang === 'ar' ? 'إيقاف الاستماع' : 'Stop listening')
                  : (lang === 'ar' ? 'بدء الاستماع' : 'Start listening')
              }
              className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center shrink-0 transition active:scale-[0.98] focus:outline-none focus:shadow-focus ${
                listening
                  ? 'bg-primary text-white shadow-[0_0_80px_-8px_rgba(47,91,255,0.7)]'
                  : 'bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/15 dark:hover:bg-primary/25'
              }`}
            >
              <Mic className="w-20 h-20 sm:w-24 sm:h-24" strokeWidth={1.8} />
            </button>
          </div>

          <p className="mt-7 text-2xl sm:text-3xl font-bold text-ink leading-tight">
            {listening
              ? (lang === 'ar' ? 'يستمع...' : 'Listening...')
              : (lang === 'ar' ? 'اضغط للتحدث' : 'Tap to speak')}
          </p>
          <p className="mt-2 text-base sm:text-lg text-ink-muted max-w-lg">
            {lang === 'ar'
              ? 'يمكنك السؤال عن المباني، الخدمات، المواعيد، أو كيفية بدء طلب.'
              : 'Ask about buildings, services, hours, or starting a request.'}
          </p>

          {/* Type as fallback — collapsed by default */}
          {!showTyping ? (
            <button
              onClick={() => setShowTyping(true)}
              className="mt-6 inline-flex items-center gap-2 h-12 px-5 rounded-2xl text-base font-semibold text-ink-muted hover:text-ink hover:bg-surface-2 transition"
            >
              <TypeIcon className="w-5 h-5" />
              <span>{lang === 'ar' ? 'الكتابة بدلًا من ذلك' : 'Type instead'}</span>
            </button>
          ) : (
            <div className="mt-6 w-full max-w-2xl">
              <AssistantInput autofocus />
            </div>
          )}
        </section>

        {/* Quick Actions — 2 cols in portrait, single tall column in landscape */}
        <aside className="xl:col-span-2">
          <h2 className="text-xl sm:text-2xl font-bold text-ink mb-4">
            {lang === 'ar' ? 'إجراءات سريعة' : 'Quick actions'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            {QUICK_ACTIONS.map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.to + q.ar}
                  to={q.to}
                  className="group bg-surface border border-border-soft rounded-3xl p-5 sm:p-6 min-h-[96px] flex items-center gap-4 hover:border-primary/40 active:scale-[0.99] transition"
                >
                  <span
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center shrink-0 ${COLOR_CLASSES[q.color]}`}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </span>
                  <span className="flex-1 min-w-0 text-lg sm:text-xl font-bold text-ink leading-tight">
                    {lang === 'ar' ? q.ar : q.en}
                  </span>
                  <Arrow className="w-5 h-5 text-ink-muted group-hover:text-primary shrink-0" />
                </Link>
              );
            })}
          </div>
        </aside>
        </div>

        <div className="mt-8 flex">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 h-14 px-5 rounded-2xl text-base font-semibold text-ink-muted hover:text-ink hover:bg-surface-2 transition"
          >
            <Arrow className="w-5 h-5" />
            <span>{lang === 'ar' ? 'الرجوع' : 'Back'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
