import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, TrendingUp, Clock, Activity } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockBackend } from '../data/mock';
import { SERVICES } from '../data/services';
import { ar } from '../lib/numerals';

export function Attract() {
  const navigate = useNavigate();
  const { lang } = useApp();
  const pulse = mockBackend.getCampusPulse();
  const openCount = SERVICES.filter((s) => s.status === 'open').length;

  const start = () => navigate('/home');

  return (
    <button
      type="button"
      onClick={start}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') start();
      }}
      className="relative w-screen h-screen overflow-hidden bg-canvas bg-campus-pattern text-start cursor-pointer focus:outline-none"
      aria-label={lang === 'ar' ? 'المس الشاشة للبدء' : 'Touch to start'}
    >
      {/* Ambient glow layers (theme-aware) */}
      <div className="pointer-events-none absolute -top-40 -start-40 w-[42rem] h-[42rem] rounded-full bg-primary/15 dark:bg-primary/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 -end-32 w-[44rem] h-[44rem] rounded-full bg-privacy/10 dark:bg-privacy/20 blur-[140px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Center stack */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-12 pb-44">
        {/* Glowing graduation-cap medallion */}
        <div className="relative mb-12">
          <div className="absolute inset-0 -m-10 rounded-full bg-primary/20 dark:bg-primary/30 blur-3xl" />
          <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/30 dark:border-primary/40 flex items-center justify-center shadow-[0_0_80px_rgba(47,91,255,0.35)]">
            <GraduationCap className="w-24 h-24 text-ink" strokeWidth={1.6} />
          </div>
        </div>

        {/* Subtitle eyebrow */}
        <div className="text-base tracking-[0.32em] text-primary/80 dark:text-primary/90 font-semibold uppercase mb-5">
          {lang === 'ar'
            ? 'جامعة الملك عبدالعزيز · الحرم الذكي'
            : 'King Abdulaziz University · Smart Campus'}
        </div>

        {/* Main headline */}
        <h1 className="text-[88px] leading-[1.05] font-bold text-ink text-center max-w-[20ch]">
          {lang === 'ar' ? 'مرحبًا بك في حرمنا الذكي' : 'Welcome to our Smart Campus'}
        </h1>

        {/* Building tag */}
        <p className="mt-6 text-2xl text-ink-muted">
          {lang === 'ar' ? 'الحرم الجامعي الرقمي — مبنى ٤' : 'Digital Campus — Building 4'}
        </p>

        {/* Touch to start pill */}
        <div className="mt-14 inline-flex items-center gap-4 h-16 px-8 rounded-full border border-border-soft bg-surface/70 dark:bg-surface/60 backdrop-blur-md text-lg text-ink-muted">
          <span className="w-2.5 h-2.5 rounded-full bg-primary live-dot" />
          <span>
            {lang === 'ar' ? 'المس الشاشة للبدء' : 'Touch the screen to start'}
          </span>
          <span className="text-ink-subtle">·</span>
          <span className="text-ink font-semibold">
            {lang === 'ar' ? 'Touch to Start' : 'المس للبدء'}
          </span>
        </div>
      </div>

      {/* Bottom KPI strip */}
      <div className="absolute bottom-0 inset-x-0 z-10 border-t border-border-soft bg-surface/40 dark:bg-surface/30 backdrop-blur-md">
        <div className="grid grid-cols-4 divide-x divide-border-soft rtl:divide-x-reverse">
          <Stat
            icon={<ShieldCheck className="w-7 h-7" />}
            tone="text-privacy"
            label={lang === 'ar' ? 'الخصوصية' : 'Privacy'}
            value={lang === 'ar' ? 'محمية' : 'Protected'}
          />
          <Stat
            icon={<TrendingUp className="w-7 h-7" />}
            tone="text-success"
            label={lang === 'ar' ? 'الزيارات اليوم' : 'Visits today'}
            value={lang === 'ar' ? ar(pulse.visitsToday) : String(pulse.visitsToday)}
          />
          <Stat
            icon={<Clock className="w-7 h-7" />}
            tone="text-warning"
            label={lang === 'ar' ? 'متوسط الانتظار' : 'Average wait'}
            value={lang === 'ar' ? `${ar(pulse.averageWaitMin)} دقيقة` : `${pulse.averageWaitMin} min`}
          />
          <Stat
            icon={<Activity className="w-7 h-7" />}
            tone="text-success"
            label={lang === 'ar' ? 'الخدمات المفتوحة' : 'Open services'}
            value={
              lang === 'ar'
                ? `${ar(openCount)} / ${ar(SERVICES.length)}`
                : `${openCount} / ${SERVICES.length}`
            }
          />
        </div>
      </div>
    </button>
  );
}

function Stat({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-center gap-4 py-6 px-8">
      <span className={`shrink-0 ${tone}`}>{icon}</span>
      <div className="min-w-0">
        <div className="text-sm text-ink-subtle uppercase tracking-wider">{label}</div>
        <div className={`text-2xl font-bold ${tone} num`}>{value}</div>
      </div>
    </div>
  );
}
