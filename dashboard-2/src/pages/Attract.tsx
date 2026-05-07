import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, TrendingUp, Clock, Activity,
  Sparkles, ChevronUp,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockBackend } from '../data/mock';
import { SERVICES } from '../data/services';
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
  const openCount = SERVICES.filter((s) => s.status === 'open').length;
  const now = useNow();

  const start = () => navigate('/home');

  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  const time = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={start}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') start();
      }}
      aria-label={lang === 'ar' ? 'المس الشاشة للبدء' : 'Touch to start'}
      className="relative w-screen h-screen overflow-hidden bg-canvas bg-campus-pattern cursor-pointer focus:outline-none animate-fade-in"
    >
      {/* Cinematic ambient video background (slow Ken Burns drift) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover opacity-50 dark:opacity-35 dark:mix-blend-screen animate-ken-burns"
      >
        <source src="/videos/83e6f4689c1025201ce25e0a3225f72.mp4" type="video/mp4" />
      </video>

      {/* Readability scrim over the video (vertical + radial vignette) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-canvas/55 via-canvas/40 to-canvas/85 dark:from-canvas/70 dark:via-canvas/55 dark:to-canvas/90" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, transparent 35%, rgba(0,0,0,0.18) 100%)',
        }}
      />

      {/* Ambient gradient blobs (theme-aware, slow drift) */}
      <div
        className="pointer-events-none absolute -top-56 -start-44 w-[48rem] h-[48rem] rounded-full bg-primary/20 dark:bg-primary/30 blur-[140px] animate-glow-soft"
      />
      <div
        className="pointer-events-none absolute -bottom-64 -end-40 w-[52rem] h-[52rem] rounded-full bg-privacy/15 dark:bg-privacy/25 blur-[160px] animate-glow-soft"
        style={{ animationDelay: '2.5s' }}
      />
      <div
        className="pointer-events-none absolute top-1/4 end-1/4 w-[28rem] h-[28rem] rounded-full bg-teal/10 dark:bg-teal/20 blur-[120px] animate-glow-soft"
        style={{ animationDelay: '4s' }}
      />

      {/* Top frame: brand + clock */}
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
        <div className="text-end">
          <div className="text-3xl font-bold text-ink num leading-none">{time}</div>
          <div className="text-sm text-ink-muted mt-1">{date}</div>
        </div>
      </header>

      {/* Center stack */}
      <main className="relative z-10 h-[calc(100%-10rem)] flex flex-col items-center justify-center px-12 -mt-6">
        {/* Animated medallion */}
        <div className="relative mb-12">
          {/* outer halo (pulsing) */}
          <div className="absolute inset-0 -m-20 rounded-full bg-primary/25 dark:bg-primary/40 blur-3xl animate-glow-soft" />

          {/* slow rotating dashed ring */}
          <div className="absolute inset-0 -m-10 rounded-full border-2 border-dashed border-primary/30 dark:border-primary/50 animate-spin-slow" />

          {/* slower counter-rotating thinner ring */}
          <div className="absolute inset-0 -m-4 rounded-full border border-privacy/30 dark:border-privacy/50 animate-spin-slow-reverse" />

          {/* core glass orb */}
          <div className="relative w-64 h-64 rounded-full border-2 border-primary/50 dark:border-primary/60 bg-gradient-to-br from-primary/45 via-primary/20 to-privacy/30 flex items-center justify-center shadow-[0_0_140px_rgba(47,91,255,0.55)] dark:shadow-[0_0_160px_rgba(47,91,255,0.65)]">
            {/* inner frosted disc */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-surface/50 via-surface/25 to-transparent backdrop-blur-md border border-primary/20 dark:border-white/10" />
            <CampusMark className="relative w-40 h-40 text-primary dark:text-white drop-shadow-[0_6px_24px_rgba(47,91,255,0.65)]" />
          </div>

          {/* orbiting accent dots (counter-rotation for visual life) */}
          <div className="absolute inset-0 -m-14 animate-spin-slow-reverse">
            <span className="absolute top-0 start-1/2 -ms-2 w-4 h-4 rounded-full bg-primary shadow-[0_0_18px_rgba(47,91,255,0.7)]" />
            <span className="absolute bottom-0 start-1/2 -ms-1.5 w-3 h-3 rounded-full bg-privacy shadow-[0_0_14px_rgba(109,93,246,0.7)]" />
            <span className="absolute top-1/2 start-0 -mt-1.5 w-3 h-3 rounded-full bg-teal shadow-[0_0_14px_rgba(0,124,138,0.7)]" />
            <span className="absolute top-1/2 end-0 -mt-1 w-2 h-2 rounded-full bg-warning shadow-[0_0_12px_rgba(245,158,11,0.7)]" />
          </div>
        </div>

        {/* Eyebrow with side decorative lines */}
        <div className="flex items-center gap-5 mb-7">
          <span className="hidden md:block w-20 h-px bg-gradient-to-r from-transparent to-primary/50" />
          <div className="inline-flex items-center gap-2 px-5 h-10 rounded-full bg-primary/10 dark:bg-primary/15 border border-primary/30 text-primary text-sm font-bold tracking-[0.28em] uppercase">
            <Sparkles className="w-4 h-4" />
            {lang === 'ar' ? 'جامعة الملك عبدالعزيز' : 'King Abdulaziz University'}
          </div>
          <span className="hidden md:block w-20 h-px bg-gradient-to-l from-transparent to-primary/50" />
        </div>

        {/* Headline with vertical gradient (works in both directions) */}
        <h1
          className={`text-center max-w-[20ch] font-bold leading-[1.04] bg-gradient-to-b from-ink via-primary to-privacy bg-clip-text text-transparent animate-gradient-shift ${
            lang === 'ar' ? 'text-[88px]' : 'text-[78px]'
          }`}
          style={{ backgroundSize: '200% 200%' }}
        >
          {lang === 'ar' ? 'مرحبًا بك في حرمنا الذكي' : 'Welcome to our Smart Campus'}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-2xl text-ink-muted">
          {lang === 'ar' ? 'الحرم الجامعي الرقمي — مبنى ٤' : 'Digital Campus — Building 4'}
        </p>

        {/* CTA pill + bouncing chevron */}
        <div className="mt-14 flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-5 h-20 px-12 rounded-full border-2 border-primary/40 dark:border-primary/50 bg-gradient-to-r from-primary/15 via-surface/70 to-privacy/15 dark:from-primary/25 dark:via-surface/40 dark:to-privacy/25 backdrop-blur-md shadow-2xl shadow-primary/20 dark:shadow-primary/30">
            <span className="relative flex w-4 h-4">
              <span className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative w-4 h-4 rounded-full bg-primary shadow-[0_0_12px_rgba(47,91,255,0.8)]" />
            </span>
            <span className="text-2xl text-ink font-bold">
              {lang === 'ar' ? 'المس الشاشة للبدء' : 'Touch the screen to start'}
            </span>
            <span className="text-ink-subtle text-2xl">·</span>
            <span className="text-xl text-ink-muted font-medium">
              {lang === 'ar' ? 'Touch to Start' : 'المس للبدء'}
            </span>
          </div>

          <div className="flex flex-col items-center text-primary/70 animate-arrow-float">
            <ChevronUp className="w-7 h-7 rotate-180" strokeWidth={2.5} />
            <ChevronUp className="w-7 h-7 rotate-180 -mt-3.5 opacity-50" strokeWidth={2.5} />
          </div>
        </div>
      </main>

      {/* Bottom KPI strip */}
      <footer className="absolute bottom-0 inset-x-0 z-10 border-t border-border-soft bg-surface/70 dark:bg-surface/40 backdrop-blur-md">
        <div className="grid grid-cols-4 divide-x divide-border-soft rtl:divide-x-reverse">
          <Stat
            tone="privacy"
            icon={<ShieldCheck className="w-6 h-6" />}
            label={lang === 'ar' ? 'الخصوصية' : 'Privacy'}
            value={lang === 'ar' ? 'محمية' : 'Protected'}
          />
          <Stat
            tone="success"
            icon={<TrendingUp className="w-6 h-6" />}
            label={lang === 'ar' ? 'الزيارات اليوم' : 'Visits today'}
            value={lang === 'ar' ? ar(pulse.visitsToday) : String(pulse.visitsToday)}
          />
          <Stat
            tone="warning"
            icon={<Clock className="w-6 h-6" />}
            label={lang === 'ar' ? 'متوسط الانتظار' : 'Average wait'}
            value={
              lang === 'ar'
                ? `${ar(pulse.averageWaitMin)} دقيقة`
                : `${pulse.averageWaitMin} min`
            }
          />
          <Stat
            tone="primary"
            icon={<Activity className="w-6 h-6" />}
            label={lang === 'ar' ? 'الخدمات المفتوحة' : 'Open services'}
            value={
              lang === 'ar'
                ? `${ar(openCount)} / ${ar(SERVICES.length)}`
                : `${openCount} / ${SERVICES.length}`
            }
          />
        </div>
      </footer>
    </div>
  );
}

/**
 * Custom Smart-Campus mark: a stylized 3-building skyline with an AI
 * sparkle on top and lit windows. Uses currentColor so the glow orb's
 * text-color drives both the strokes and fills.
 */
function CampusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
    >
      <defs>
        <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* AI sparkle + halo on top */}
      <g className="origin-center" style={{ transformOrigin: '60px 18px' }}>
        <circle cx="60" cy="18" r="9" fill="currentColor" opacity="0.18" className="animate-pulse" />
        <circle cx="60" cy="18" r="3.4" fill="currentColor" />
        <path d="M60 6 L60 11 M60 25 L60 30 M48 18 L53 18 M67 18 L72 18" strokeWidth="1.8" />
      </g>

      {/* Antenna line down to the tower roof */}
      <line x1="60" y1="30" x2="60" y2="40" strokeWidth="1.6" />

      {/* Center tall tower */}
      <path
        d="M48 40 L72 40 L72 102 L48 102 Z"
        fill="url(#bldg)"
      />

      {/* Left wing (shorter) */}
      <path
        d="M22 60 L48 60 L48 102 L22 102 Z"
        fill="url(#bldg)"
        opacity="0.95"
      />

      {/* Right wing (medium) */}
      <path
        d="M72 54 L98 54 L98 102 L72 102 Z"
        fill="url(#bldg)"
        opacity="0.95"
      />

      {/* Lit windows — center tower */}
      <g fill="currentColor" stroke="none">
        <rect x="53.5" y="48"  width="3" height="5" rx="0.5" />
        <rect x="63.5" y="48"  width="3" height="5" rx="0.5" opacity="0.55" />
        <rect x="53.5" y="60"  width="3" height="5" rx="0.5" opacity="0.55" />
        <rect x="63.5" y="60"  width="3" height="5" rx="0.5" />
        <rect x="53.5" y="72"  width="3" height="5" rx="0.5" />
        <rect x="63.5" y="72"  width="3" height="5" rx="0.5" />
        <rect x="53.5" y="84"  width="3" height="5" rx="0.5" opacity="0.55" />
        <rect x="63.5" y="84"  width="3" height="5" rx="0.5" />
        <rect x="53.5" y="94"  width="3" height="4" rx="0.5" />
        <rect x="63.5" y="94"  width="3" height="4" rx="0.5" opacity="0.55" />
      </g>

      {/* Lit windows — left wing */}
      <g fill="currentColor" stroke="none" opacity="0.85">
        <rect x="27"   y="68"  width="2.6" height="4" rx="0.4" />
        <rect x="33.7" y="68"  width="2.6" height="4" rx="0.4" opacity="0.55" />
        <rect x="40.4" y="68"  width="2.6" height="4" rx="0.4" />
        <rect x="27"   y="80"  width="2.6" height="4" rx="0.4" opacity="0.55" />
        <rect x="33.7" y="80"  width="2.6" height="4" rx="0.4" />
        <rect x="40.4" y="80"  width="2.6" height="4" rx="0.4" />
        <rect x="27"   y="92"  width="2.6" height="4" rx="0.4" />
        <rect x="33.7" y="92"  width="2.6" height="4" rx="0.4" opacity="0.55" />
        <rect x="40.4" y="92"  width="2.6" height="4" rx="0.4" />
      </g>

      {/* Lit windows — right wing */}
      <g fill="currentColor" stroke="none" opacity="0.85">
        <rect x="77"   y="62"  width="2.6" height="4" rx="0.4" opacity="0.55" />
        <rect x="83.7" y="62"  width="2.6" height="4" rx="0.4" />
        <rect x="90.4" y="62"  width="2.6" height="4" rx="0.4" opacity="0.55" />
        <rect x="77"   y="74"  width="2.6" height="4" rx="0.4" />
        <rect x="83.7" y="74"  width="2.6" height="4" rx="0.4" opacity="0.55" />
        <rect x="90.4" y="74"  width="2.6" height="4" rx="0.4" />
        <rect x="77"   y="86"  width="2.6" height="4" rx="0.4" />
        <rect x="83.7" y="86"  width="2.6" height="4" rx="0.4" />
        <rect x="90.4" y="86"  width="2.6" height="4" rx="0.4" opacity="0.55" />
        <rect x="77"   y="96"  width="2.6" height="3" rx="0.4" opacity="0.55" />
        <rect x="83.7" y="96"  width="2.6" height="3" rx="0.4" />
        <rect x="90.4" y="96"  width="2.6" height="3" rx="0.4" />
      </g>

      {/* Ground line */}
      <line x1="14" y1="102" x2="106" y2="102" strokeWidth="2" opacity="0.45" />
    </svg>
  );
}

const TONE: Record<string, { ring: string; bg: string; text: string }> = {
  primary: { ring: 'border-primary/30',  bg: 'bg-primary/10 dark:bg-primary/20',   text: 'text-primary' },
  privacy: { ring: 'border-privacy/30',  bg: 'bg-privacy/10 dark:bg-privacy/20',   text: 'text-privacy' },
  success: { ring: 'border-success/30',  bg: 'bg-success/15 dark:bg-success/20',   text: 'text-success' },
  warning: { ring: 'border-warning/30',  bg: 'bg-warning/15 dark:bg-warning/20',   text: 'text-warning' },
};

function Stat({
  tone, icon, label, value,
}: {
  tone: keyof typeof TONE;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const t = TONE[tone];
  return (
    <div className="flex items-center gap-4 py-6 px-8">
      <span
        className={`shrink-0 w-12 h-12 rounded-2xl border ${t.ring} ${t.bg} ${t.text} flex items-center justify-center`}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-xs text-ink-subtle uppercase tracking-[0.2em] font-semibold">
          {label}
        </div>
        <div className={`text-2xl font-bold ${t.text} num leading-tight`}>{value}</div>
      </div>
    </div>
  );
}
