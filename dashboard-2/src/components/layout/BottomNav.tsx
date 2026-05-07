import { NavLink } from 'react-router-dom';
import { Home, Mic, LayoutGrid, MapPin, ListChecks } from 'lucide-react';
import { useApp } from '../../lib/AppContext';

interface NavItem {
  to: string;
  /** Match these path prefixes when deciding active state. */
  matchPrefixes: string[];
  icon: typeof Home;
  ar: string;
  en: string;
}

const ITEMS: NavItem[] = [
  { to: '/home',     matchPrefixes: ['/home'],         icon: Home,       ar: 'الرئيسية',  en: 'Home' },
  { to: '/assistant', matchPrefixes: ['/assistant'],   icon: Mic,        ar: 'المساعد',   en: 'Assistant' },
  { to: '/services', matchPrefixes: ['/services', '/service'], icon: LayoutGrid, ar: 'الخدمات', en: 'Services' },
  { to: '/map/main-gate', matchPrefixes: ['/map'],     icon: MapPin,     ar: 'الخريطة',   en: 'Map' },
  {
    to: '/start-request/student-affairs?action=my-request-status',
    matchPrefixes: ['/start-request', '/verify', '/qr'],
    icon: ListChecks, ar: 'المتابعة', en: 'Track',
  },
];

export function BottomNav() {
  const { lang } = useApp();

  return (
    <nav
      aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
      // Always-dark bottom nav so it reads as a distinct surface against
      // the white kiosk canvas in light mode (matches the brand sidebar
      // tokens, which are intentionally theme-invariant).
      className="shrink-0 bg-sidebar border-t border-sidebar-border px-3 py-3 flex items-stretch justify-around gap-2 sm:gap-3"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => {
              const active =
                isActive ||
                item.matchPrefixes.some((p) => window.location.pathname.startsWith(p));
              return [
                'flex flex-col items-center justify-center gap-1 flex-1 min-w-[80px] min-h-[80px] rounded-2xl transition focus:outline-none focus:shadow-focus',
                active
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white',
              ].join(' ');
            }}
          >
            <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
            <span className="text-sm sm:text-base font-semibold leading-tight">
              {lang === 'ar' ? item.ar : item.en}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
