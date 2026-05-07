import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_KIOSK_ID } from '../data/mock';

type Lang = 'ar' | 'en';
type Theme = 'light' | 'dark';

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  isRTL: boolean;
  theme: Theme;
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (v: boolean) => void;
  privateMode: boolean;
  setPrivateMode: (v: boolean) => void;
  /** Identifier of the kiosk this app instance is "running on". */
  currentKioskId: string;
  setCurrentKioskId: (id: string) => void;
  /** University ID verified for the current session — required before any QR
   * private continuation can be shown. Cleared on session end. */
  verifiedStudentId: string | null;
  setVerifiedStudentId: (id: string | null) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [privateMode, setPrivateMode] = useState(false);
  const [currentKioskId, setCurrentKioskId] = useState<string>(DEFAULT_KIOSK_ID);
  const [verifiedStudentId, setVerifiedStudentId] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleLang = useCallback(() => setLang((l) => (l === 'ar' ? 'en' : 'ar')), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'light' ? 'dark' : 'light')), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((v) => !v), []);

  const value = useMemo<AppState>(
    () => ({
      lang, setLang, toggleLang, isRTL: lang === 'ar',
      theme, toggleTheme,
      sidebarCollapsed, toggleSidebar,
      mobileSidebarOpen, setMobileSidebarOpen,
      privateMode, setPrivateMode,
      currentKioskId, setCurrentKioskId,
      verifiedStudentId, setVerifiedStudentId,
    }),
    [lang, toggleLang, theme, toggleTheme, sidebarCollapsed, toggleSidebar, mobileSidebarOpen, privateMode, currentKioskId, verifiedStudentId]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}
