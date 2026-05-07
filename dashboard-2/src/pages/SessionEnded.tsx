import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/AppContext';

export function SessionEnded() {
  const { lang, setPrivateMode } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    setPrivateMode(false);
    const id = window.setTimeout(() => {
      navigate('/', { replace: true });
    }, 3000);
    return () => window.clearTimeout(id);
  }, [navigate, setPrivateMode]);

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[800px] animate-fade-in">
      <h1 className="text-6xl font-bold text-ink mb-5">
        {lang === 'ar' ? 'تم إنهاء الجلسة' : 'Session ended'}
      </h1>
      <p className="text-2xl text-ink-muted">
        {lang === 'ar'
          ? 'تمت إعادة اللوحة إلى الشاشة الرئيسية.'
          : 'The board has returned to the home screen.'}
      </p>
    </div>
  );
}
