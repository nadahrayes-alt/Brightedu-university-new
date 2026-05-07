import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockBackend } from '../data/mock';
import { ar } from '../lib/numerals';

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function Attract() {
  const navigate = useNavigate();
  const { lang } = useApp();
  const pulse = mockBackend.getCampusPulse();
  const now = useNow();

  const start = () => navigate('/home');

  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  const time = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={start}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') start();
      }}
      aria-label={lang === 'ar' ? 'المس الشاشة للبدء' : 'Touch to start'}
      className="dark relative w-screen h-screen overflow-hidden bg-canvas cursor-pointer focus:outline-none animate-fade-in"
    >
      {/* Subtle ambient atmosphere — corners only */}
      <div className="pointer-events-none absolute -top-72 -start-52 w-[40rem] h-[40rem] rounded-full bg-primary/12 dark:bg-primary/15 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-72 -end-44 w-[44rem] h-[44rem] rounded-full bg-privacy/10 dark:bg-privacy/12 blur-[160px]" />

      {/* Eclipse — bright crescent rim formed by a halo + dark disc */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: '50%',
          top: '52%',
          transform: 'translate(-50%, -50%)',
          width: '1500px',
          height: '1500px',
        }}
      >
        {/* Bright halo glow */}
        <div
          className="absolute inset-0 rounded-full animate-glow-soft"
          style={{
            background:
              'radial-gradient(circle at center, rgba(80,115,255,0.95) 0%, rgba(125,100,255,0.65) 28%, rgba(60,90,220,0.3) 50%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Dark planet disc — shifted down to widen the TOP crescent rim */}
        <div
          className="absolute rounded-full bg-canvas"
          style={{
            inset: '4%',
            transform: 'translateY(40px)',
          }}
        />
      </div>

      {/* Top frame: brand + clock pill (mirrors reference's top-right CTA pill) */}
      <header className="relative z-20 flex items-start justify-between px-12 pt-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-primary/30">
            B
          </div>
          <div>
            <div className="text-lg font-bold text-ink leading-tight">BrightEdu × KAU</div>
            <div className="text-sm text-ink-muted leading-tight">
              {lang === 'ar' ? 'لوحة الحرم الذكية' : 'Smart Campus Board'}
            </div>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border-soft bg-surface/60 dark:bg-surface/30 backdrop-blur-md">
          <Clock className="w-4 h-4 text-ink-muted" />
          <span className="text-sm font-bold text-ink num">{time}</span>
        </div>
      </header>

      {/* Center: clean headline + subtitle (no badges, no CTA) */}
      <main className="relative z-10 h-[calc(100%-23rem)] flex flex-col items-center justify-center px-12">
        <h1
          className={`text-center max-w-[18ch] font-bold leading-[1.05] text-ink ${
            lang === 'ar' ? 'text-[80px]' : 'text-[72px]'
          }`}
        >
          {lang === 'ar' ? 'مرحبًا بك في حرمنا الذكي' : 'Welcome to our Smart Campus'}
        </h1>
        <p className="mt-6 max-w-[44ch] text-center text-lg text-ink-muted leading-relaxed">
          {lang === 'ar'
            ? 'الحرم الجامعي الرقمي ـــ مبنى ٤. خصوصية محمية وخدمات حيّة في الوقت الفعلي.'
            : 'Digital campus, building 4 — privacy-first design with live services in real time.'}
        </p>

        {/* Animated CTA — pulsing halo + traveling sheen + live dot + bouncing chevron */}
        <div className="relative mt-12">
          {/* Pulsing halo behind button */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -m-10 rounded-full bg-primary/40 blur-2xl animate-glow-soft"
          />
          {/* Secondary slower halo for depth */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -m-6 rounded-full bg-privacy/35 blur-2xl animate-glow-soft"
            style={{ animationDelay: '1.5s' }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              start();
            }}
            className="relative inline-flex items-center gap-4 h-16 ps-7 pe-9 rounded-full border-2 border-primary/55 bg-gradient-to-r from-primary/30 via-surface/30 to-privacy/30 backdrop-blur-md shadow-[0_0_60px_-10px_rgba(47,91,255,0.75)] overflow-hidden transition-all hover:scale-[1.03] active:scale-[0.97] hover:border-primary/80 hover:shadow-[0_0_80px_-6px_rgba(47,91,255,0.95)]"
          >
            {/* Traveling sheen */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-sheen-slide"
            />

            {/* Live pulsing dot */}
            <span className="relative flex w-3 h-3 shrink-0">
              <span className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_rgba(47,91,255,0.95)]" />
            </span>

            <span className="relative text-lg font-bold text-ink tracking-wide whitespace-nowrap">
              {lang === 'ar' ? 'ابدأ من هنا' : 'Start from here'}
            </span>

            {/* Bouncing chevron — flips for RTL via wrapper scaleX */}
            <span className="relative flex items-center rtl:-scale-x-100">
              <ChevronRight className="w-5 h-5 text-primary animate-arrow-nudge drop-shadow-[0_0_8px_rgba(47,91,255,0.9)]" strokeWidth={2.5} />
            </span>
          </button>
        </div>
      </main>

      {/* Bottom 3 feature cards — centered, glassmorphic, with soft edge glow */}
      <footer className="absolute bottom-10 inset-x-0 z-10 px-12 animate-fade-in">
        <div className="mx-auto max-w-[1280px] grid grid-cols-3 gap-6">
          <FeatureCard
            tone="privacy"
            icon={<ShieldCheck className="w-7 h-7" />}
            title={lang === 'ar' ? 'الخصوصية أولاً' : 'Privacy First'}
            description={
              lang === 'ar'
                ? 'البيانات مشفّرة وتُعالج على الجهاز كلما أمكن. زيارتك تبقى خاصة بك.'
                : 'All data is encrypted and processed on-device when possible. Your visit stays yours.'
            }
          />
          <FeatureCard
            tone="success"
            icon={<TrendingUp className="w-7 h-7" />}
            title={
              lang === 'ar'
                ? `${ar(pulse.visitsToday)} زيارة اليوم`
                : `${pulse.visitsToday} Visits Today`
            }
            description={
              lang === 'ar'
                ? 'حركة زوار حيّة عبر الحرم الذكي بتحديث مستمر.'
                : 'Live foot-traffic across the smart campus, updated in real time.'
            }
          />
          <FeatureCard
            tone="warning"
            icon={<Clock className="w-7 h-7" />}
            title={
              lang === 'ar'
                ? `${ar(pulse.averageWaitMin)} دقيقة انتظار`
                : `${pulse.averageWaitMin} min Average Wait`
            }
            description={
              lang === 'ar'
                ? 'متوسط الانتظار الحيّ عبر جميع الخدمات المفتوحة الآن.'
                : 'Live measurement across all currently open services.'
            }
          />
        </div>
      </footer>
    </div>
  );
}

const TONE: Record<string, { ring: string; bg: string; text: string; glow: string }> = {
  primary: { ring: 'border-primary/30', bg: 'bg-primary/10 dark:bg-primary/20', text: 'text-primary', glow: 'rgba(47,91,255,0.45)' },
  privacy: { ring: 'border-privacy/30', bg: 'bg-privacy/10 dark:bg-privacy/20', text: 'text-privacy', glow: 'rgba(109,93,246,0.45)' },
  success: { ring: 'border-success/30', bg: 'bg-success/15 dark:bg-success/20', text: 'text-success', glow: 'rgba(22,163,74,0.4)' },
  warning: { ring: 'border-warning/30', bg: 'bg-warning/15 dark:bg-warning/20', text: 'text-warning', glow: 'rgba(245,158,11,0.4)' },
};

function FeatureCard({
  tone, icon, title, description,
}: {
  tone: keyof typeof TONE;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const t = TONE[tone];
  return (
    <div className="relative rounded-3xl border border-border-soft/80 bg-surface/40 dark:bg-surface/25 backdrop-blur-xl p-8 overflow-hidden">
      {/* Top edge glow — light bleeds in from above */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-20 h-44 rounded-full blur-3xl opacity-90"
        style={{ background: `radial-gradient(ellipse at center, ${t.glow}, transparent 70%)` }}
      />
      {/* Hairline highlight along the top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/15" />

      <div className="relative z-10 flex flex-col items-center text-center gap-5">
        <span
          className={`shrink-0 w-16 h-16 rounded-full border ${t.ring} ${t.bg} ${t.text} flex items-center justify-center backdrop-blur-md`}
          style={{ boxShadow: `0 0 32px -8px ${t.glow}` }}
        >
          {icon}
        </span>

        <h3 className="text-xl font-bold text-ink leading-tight">{title}</h3>
        <p className="text-sm text-ink-muted leading-relaxed max-w-[30ch]">{description}</p>
      </div>
    </div>
  );
}
