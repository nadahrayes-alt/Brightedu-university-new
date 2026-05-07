// Compatibility shim — the real state lives in AppContext now.
// Existing pages import { useSession } from './SessionContext'; this keeps them working.
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from './AppContext';

export function useSession() {
  const app = useApp();
  return {
    lang: app.lang,
    setLang: app.setLang,
    privateMode: app.privateMode,
    setPrivateMode: app.setPrivateMode,
    startedAt: 0,
    resetSession: () => {},
  };
}

/**
 * Inactivity timeout watcher: 90s of no interaction → /timeout.
 * Mounted once inside the DashboardLayout so it covers every protected route.
 */
export function InactivityWatcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const timer = useRef<number | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const reset = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        if (location.pathname !== '/timeout' && location.pathname !== '/ended') {
          navigate('/timeout');
        }
      }, 90_000);
      setTick((n) => n + 1);
    };
    reset();
    window.addEventListener('pointerdown', reset);
    window.addEventListener('keydown', reset);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      window.removeEventListener('pointerdown', reset);
      window.removeEventListener('keydown', reset);
    };
  }, [navigate, location.pathname]);

  return null;
}
