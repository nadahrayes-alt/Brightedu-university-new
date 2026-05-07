import { Languages, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../../lib/AppContext';

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/**
 * Kiosk top bar: brand on the start side, live clock in the middle,
 * a large language toggle on the end side. Touch targets are sized for a
 * portrait wall-mounted kiosk (the language toggle is ≥ 80×80).
 */
export function TopBar() {
  const { lang, toggleLang, privateMode } = useApp();
  const now = useNow();
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  const time = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <header className="shrink-0 h-[96px] bg-surface border-b border-border-soft px-5 flex items-center gap-4">
      {/* Brand */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-700 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30 shrink-0">
          B
        </div>
        <div className="min-w-0 hidden xs:block sm:block">
          <div className="text-base font-bold text-ink leading-tight truncate">BrightEdu × KAU</div>
          <div className="text-xs text-ink-muted leading-tight truncate">
            {lang === 'ar' ? 'لوحة الحرم' : 'Smart Campus'}
          </div>
        </div>
      </div>

      <div className="flex-1" />

      {/* Private mode chip */}
      {privateMode && (
        <span className="hidden md:inline-flex items-center gap-2 h-12 px-4 rounded-2xl bg-privacy/10 dark:bg-privacy/20 text-privacy text-base font-semibold">
          <Lock className="w-5 h-5" />
          {lang === 'ar' ? 'وضع خاص' : 'Private mode'}
        </span>
      )}

      {/* Live clock */}
      <div className="hidden md:block text-end">
        <div className="text-2xl font-bold text-ink num leading-none">{time}</div>
        <div className="text-xs text-ink-muted mt-1">{date}</div>
      </div>

      {/* Language toggle — prominent kiosk control (≥ 80×80) */}
      <button
        onClick={toggleLang}
        className="min-w-[80px] min-h-[80px] h-20 px-4 rounded-2xl bg-primary/10 dark:bg-primary/20 hover:bg-primary/15 dark:hover:bg-primary/25 active:scale-[0.98] text-primary flex flex-col items-center justify-center gap-1 transition focus:outline-none focus:shadow-focus"
        aria-label={lang === 'ar' ? 'تبديل اللغة إلى الإنجليزية' : 'Switch to Arabic'}
      >
        <Languages className="w-7 h-7" />
        <span className="text-sm font-bold tracking-wider">
          {lang === 'ar' ? 'EN' : 'العربية'}
        </span>
      </button>
    </header>
  );
}
