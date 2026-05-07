import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, Bell, Calendar, ChevronDown, Sun, Moon, Languages, Menu,
  PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen,
  LogOut, User, Settings, AlertTriangle, AlertOctagon, Info,
} from 'lucide-react';
import { useApp, useToast } from '../../context';
import { useAuth } from '../../auth';
import type { Role } from '../../data/mockData';
import type { DictKey } from '../../i18n';
import { alerts } from '../../data/mockData';

const ranges: { key: '24h' | '7d' | '30d'; lblKey: DictKey }[] = [
  { key: '24h', lblKey: 'topbar.range.24h' },
  { key: '7d',  lblKey: 'topbar.range.7d' },
  { key: '30d', lblKey: 'topbar.range.30d' },
];

const sevIcon = { critical: AlertOctagon, warning: AlertTriangle, info: Info } as const;
const sevCls  = {
  critical: 'bg-danger/10 text-danger',
  warning:  'bg-warning/10 text-warning',
  info:     'bg-primary/10 text-primary-700 dark:text-primary',
} as const;

export function TopBar() {
  const {
    role, setRole, range, setRange,
    sidebarCollapsed, toggleSidebar,
    setMobileSidebarOpen,
    theme, toggleTheme,
    lang, toggleLang,
    t, isRTL,
  } = useApp();
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userOpen && userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [notifOpen, userOpen]);

  const SidebarToggleIcon = isRTL
    ? (sidebarCollapsed ? PanelRightOpen : PanelRightClose)
    : (sidebarCollapsed ? PanelLeftOpen : PanelLeftClose);

  const fmtAgo = (m: number) => m > 60 ? `${Math.round(m / 60)}${t('common.unit.h')}` : `${m}${t('common.unit.m')}`;

  const initials = auth.user?.initials ?? 'م';
  const userName = auth.user?.name ?? 'منيرة العتيبي';
  const userEmail = auth.user?.email ?? 'munira@kau.edu.sa';

  const handleSignOut = () => {
    setUserOpen(false);
    auth.signOut();
    toast(t('auth.toast.signedOut'), 'info');
    navigate('/login', { replace: true });
  };

  const openAlert = (id: string, related?: string) => {
    setNotifOpen(false);
    if (related) {
      toast(t('cta.opening'), 'info');
      navigate(`/requests?id=${related}`);
    } else {
      navigate('/alerts');
    }
  };

  return (
    <header className="h-16 bg-surface border-b border-border-soft px-3 sm:px-4 lg:px-6 flex items-center gap-2 sm:gap-3 sticky top-0 z-40">
      {/* Mobile: hamburger */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden w-10 h-10 rounded-xl hover:bg-surface-2 flex items-center justify-center text-ink-muted"
        aria-label={t('sidebar.toggle')}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop: collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="hidden md:flex w-10 h-10 rounded-xl hover:bg-surface-2 items-center justify-center text-ink-muted shrink-0"
        aria-label={t('sidebar.toggle')}
        title={t('sidebar.toggle')}
      >
        <SidebarToggleIcon className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="hidden md:block flex-1 max-w-xl">
        <div className="relative">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted ${isRTL ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t('topbar.search')}
            className={`w-full h-10 bg-surface-2 border border-border-soft rounded-xl text-sm focus:outline-none focus:bg-surface focus:shadow-focus placeholder:text-ink-subtle text-ink ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
          />
        </div>
      </div>
      <div className="md:hidden flex-1" />

      {/* Date range */}
      <div className="hidden lg:flex items-center bg-surface-2 rounded-xl p-1 border border-border-soft">
        <Calendar className="w-4 h-4 text-ink-muted mx-2" />
        {ranges.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-3 h-8 rounded-lg text-xs font-medium transition ${
              range === r.key
                ? 'bg-surface text-primary-700 dark:text-primary'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {t(r.lblKey)}
          </button>
        ))}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-xl hover:bg-surface-2 flex items-center justify-center text-ink-muted"
        aria-label="theme"
        title={t(theme === 'light' ? 'theme.toggleToDark' : 'theme.toggleToLight')}
      >
        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {/* Language toggle */}
      <button
        onClick={toggleLang}
        className="h-10 px-3 rounded-xl hover:bg-surface-2 flex items-center gap-1.5 text-ink-muted"
        aria-label="language"
      >
        <Languages className="w-4 h-4" />
        <span className="text-xs font-semibold tracking-wider">{lang === 'ar' ? 'EN' : 'AR'}</span>
      </button>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => { setNotifOpen((v) => !v); setUserOpen(false); }}
          className="relative w-10 h-10 rounded-xl hover:bg-surface-2 flex items-center justify-center"
          aria-label={t('notif.title')}
        >
          <Bell className="w-5 h-5 text-ink-muted" />
          {alerts.length > 0 && (
            <span className={`absolute top-2 w-2 h-2 rounded-full bg-danger ring-2 ring-surface ${isRTL ? 'left-2' : 'right-2'}`} />
          )}
        </button>

        {notifOpen && (
          <div className={`absolute mt-2 w-[340px] sm:w-[380px] bg-surface border border-border-soft rounded-2xl overflow-hidden z-50 ${isRTL ? 'left-0' : 'right-0'}`}>
            <div className="px-4 py-3 border-b border-border-soft flex items-center justify-between">
              <span className="font-semibold text-ink text-sm">{t('notif.title')}</span>
              <button
                onClick={() => { setNotifOpen(false); toast(t('cta.notifMarkedRead'), 'info'); }}
                className="text-xs text-primary-700 dark:text-primary hover:underline"
              >
                {t('btn.viewAll')}
              </button>
            </div>
            <ul className="max-h-[360px] overflow-y-auto">
              {alerts.slice(0, 5).map((a) => {
                const Icon = sevIcon[a.severity];
                return (
                  <li key={a.id}>
                    <button
                      onClick={() => openAlert(a.id, a.relatedRequest)}
                      className="w-full text-start flex items-start gap-3 px-4 py-3 hover:bg-surface-2 border-b border-border-soft last:border-0"
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sevCls[a.severity]}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-ink truncate">{lang === 'ar' ? a.titleAr : a.titleEn}</div>
                        <div className="text-xs text-ink-muted mt-0.5 line-clamp-1">{lang === 'ar' ? a.detailAr : a.detailEn}</div>
                      </div>
                      <div className="text-[11px] text-ink-muted whitespace-nowrap num shrink-0">{fmtAgo(a.openedMinAgo)}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
            <Link
              to="/alerts"
              onClick={() => setNotifOpen(false)}
              className="block px-4 py-3 text-center text-sm text-primary-700 dark:text-primary hover:bg-surface-2 border-t border-border-soft"
            >
              {t('notif.viewAll')}
            </Link>
          </div>
        )}
      </div>

      {/* Live status */}
      <div className="hidden xl:flex items-center gap-2 text-xs text-ink-muted">
        <span className="w-2 h-2 rounded-full bg-success live-dot" />
        <span>{t('topbar.system.live')}</span>
      </div>

      {/* Role switcher */}
      <div className="relative">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className={`appearance-none bg-surface-2 border border-border-soft rounded-xl h-10 text-sm font-medium focus:outline-none focus:shadow-focus cursor-pointer text-ink ${isRTL ? 'pr-3 pl-9' : 'pl-3 pr-9'}`}
        >
          {(['staff', 'supervisor', 'dean'] as Role[]).map((r) => (
            <option key={r} value={r}>{t(`role.${r}.label` as DictKey)}</option>
          ))}
        </select>
        <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none ${isRTL ? 'left-2.5' : 'right-2.5'}`} />
      </div>

      {/* User menu */}
      <div className="relative" ref={userRef}>
        <button
          onClick={() => { setUserOpen((v) => !v); setNotifOpen(false); }}
          className={`hidden sm:flex items-center gap-3 ps-2 ${isRTL ? 'border-r' : 'border-l'} border-border-soft hover:bg-surface-2 rounded-l-xl rounded-r-xl px-2 py-1`}
        >
          <div className="text-end hidden md:block">
            <div className="text-sm font-medium text-ink leading-tight max-w-[120px] truncate">{userName}</div>
            <div className="text-[11px] text-ink-muted leading-tight">{t(`role.${role}.sub` as DictKey)}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple text-white flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>
        </button>

        {userOpen && (
          <div className={`absolute mt-2 w-64 bg-surface border border-border-soft rounded-2xl overflow-hidden z-50 ${isRTL ? 'left-0' : 'right-0'}`}>
            <div className="px-4 py-3 border-b border-border-soft">
              <div className="text-sm font-semibold text-ink truncate">{userName}</div>
              <div className="text-xs text-ink-muted truncate">{userEmail}</div>
            </div>
            <ul className="py-1">
              <li>
                <button
                  onClick={() => { setUserOpen(false); navigate('/settings'); }}
                  className="w-full text-start px-4 py-2.5 text-sm text-ink hover:bg-surface-2 flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-ink-muted" />
                  {t('auth.user.menu.profile')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setUserOpen(false); navigate('/settings'); }}
                  className="w-full text-start px-4 py-2.5 text-sm text-ink hover:bg-surface-2 flex items-center gap-2.5"
                >
                  <Settings className="w-4 h-4 text-ink-muted" />
                  {t('auth.user.menu.settings')}
                </button>
              </li>
            </ul>
            <div className="border-t border-border-soft py-1">
              <button
                onClick={handleSignOut}
                className="w-full text-start px-4 py-2.5 text-sm text-danger hover:bg-danger/5 flex items-center gap-2.5"
              >
                <LogOut className="w-4 h-4" />
                {t('auth.user.menu.signout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
