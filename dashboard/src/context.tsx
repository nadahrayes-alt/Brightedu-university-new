import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Role } from './data/mockData';
import { translate, type DictKey, type Lang } from './i18n';

export type Theme = 'light' | 'dark';
export type ToastKind = 'info' | 'success' | 'warning' | 'error';
export interface ToastItem { id: number; message: string; kind: ToastKind }

interface AppCtx {
  role: Role;
  setRole: (r: Role) => void;
  range: '24h' | '7d' | '30d';
  setRange: (r: '24h' | '7d' | '30d') => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (v: boolean) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: DictKey) => string;
  isRTL: boolean;
  toasts: ToastItem[];
  pushToast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: number) => void;
}

const Ctx = createContext<AppCtx | null>(null);

const LS_THEME = 'be.theme';
const LS_LANG  = 'be.lang';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(LS_THEME) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'ar';
  const stored = localStorage.getItem(LS_LANG) as Lang | null;
  return stored === 'en' ? 'en' : 'ar';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('supervisor');
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [lang, setLang]   = useState<Lang>(getInitialLang);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, message, kind }]);
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(LS_THEME, theme);
  }, [theme]);

  // Apply language and direction to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem(LS_LANG, lang);
  }, [lang]);

  const value = useMemo<AppCtx>(
    () => ({
      role, setRole,
      range, setRange,
      sidebarCollapsed, setSidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((c) => !c),
      mobileSidebarOpen, setMobileSidebarOpen,
      theme, setTheme,
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
      lang, setLang,
      toggleLang: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')),
      t: (key) => translate(key, lang),
      isRTL: lang === 'ar',
      toasts,
      pushToast,
      dismissToast,
    }),
    [role, range, sidebarCollapsed, mobileSidebarOpen, theme, lang, toasts, pushToast, dismissToast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('AppProvider missing');
  return v;
}

export function useT() {
  return useApp().t;
}

/**
 * Returns a function that picks the right localized string from a paired (ar, en) tuple.
 * If no English value is provided, falls back to the Arabic one.
 */
export function useLoc() {
  const { lang } = useApp();
  return (ar: string, en?: string | null) => (lang === 'en' && en ? en : ar);
}

export function useToast() {
  return useApp().pushToast;
}
