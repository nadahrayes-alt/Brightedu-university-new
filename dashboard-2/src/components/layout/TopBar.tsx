import {
  Search, Sun, Moon, Languages, Menu,
  PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen,
  Lock,
} from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { KioskSwitcher } from './KioskSwitcher';

export function TopBar() {
  const {
    sidebarCollapsed, toggleSidebar, setMobileSidebarOpen,
    theme, toggleTheme, lang, toggleLang, isRTL, privateMode,
  } = useApp();
  const SidebarToggleIcon = isRTL
    ? (sidebarCollapsed ? PanelRightOpen : PanelRightClose)
    : (sidebarCollapsed ? PanelLeftOpen : PanelLeftClose);

  return (
    <header className="h-[88px] bg-surface border-b border-border-soft px-6 flex items-center gap-4 sticky top-0 z-40">
      {/* Mobile: hamburger */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden w-14 h-14 rounded-2xl hover:bg-surface-2 flex items-center justify-center text-ink-muted"
        aria-label="menu"
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Desktop: collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="hidden md:flex w-14 h-14 rounded-2xl hover:bg-surface-2 items-center justify-center text-ink-muted shrink-0"
        aria-label="toggle"
      >
        <SidebarToggleIcon className="w-7 h-7" />
      </button>

      {/* Search */}
      <div className="hidden md:block flex-1 max-w-2xl">
        <div className="relative">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 text-ink-muted ${isRTL ? 'right-5' : 'left-5'}`} />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث عن خدمة، مبنى، أو سؤال...' : 'Search services, buildings, or questions...'}
            className={`w-full h-14 bg-surface-2 border border-border-soft rounded-2xl text-lg focus:outline-none focus:bg-surface focus:shadow-focus placeholder:text-ink-subtle text-ink ${isRTL ? 'pr-14 pl-4' : 'pl-14 pr-4'}`}
          />
        </div>
      </div>
      <div className="md:hidden flex-1" />

      {/* Private mode chip */}
      {privateMode && (
        <span className="hidden md:inline-flex items-center gap-2 h-12 px-4 rounded-2xl bg-privacy/10 dark:bg-privacy/20 text-privacy text-base font-semibold">
          <Lock className="w-5 h-5" />
          {lang === 'ar' ? 'وضع خاص' : 'Private mode'}
        </span>
      )}

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="w-14 h-14 rounded-2xl hover:bg-surface-2 flex items-center justify-center text-ink-muted"
        aria-label="theme"
      >
        {theme === 'light' ? <Moon className="w-7 h-7" /> : <Sun className="w-7 h-7" />}
      </button>

      {/* Language toggle */}
      <button
        onClick={toggleLang}
        className="h-14 px-4 rounded-2xl hover:bg-surface-2 flex items-center gap-2 text-ink-muted"
        aria-label="language"
      >
        <Languages className="w-6 h-6" />
        <span className="text-base font-bold tracking-wider">{lang === 'ar' ? 'EN' : 'AR'}</span>
      </button>

      {/* Live status */}
      <div className="hidden xl:flex items-center gap-2 text-base text-ink-muted">
        <span className="w-2.5 h-2.5 rounded-full bg-success live-dot" />
        <span>{lang === 'ar' ? 'الخدمات حية' : 'Services live'}</span>
      </div>

      {/* Kiosk switcher (real dropdown) */}
      <KioskSwitcher />
    </header>
  );
}
