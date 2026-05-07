import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useApp } from '../../lib/AppContext';
import { ar } from '../../lib/numerals';

export function TimeoutModal() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState(20);

  useEffect(() => {
    if (remaining <= 0) {
      navigate('/ended');
      return;
    }
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining, navigate]);

  const pct = (remaining / 20) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center animate-fade-in p-4">
      <div className="bg-surface rounded-3xl p-10 w-[720px] text-center animate-scale-in border border-border-soft">
        <div className="flex justify-center mb-5">
          <span className="w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
            <Clock className="w-12 h-12" />
          </span>
        </div>
        <h2 className="text-4xl font-semibold mb-3">
          {lang === 'ar' ? 'هل ما زلت تستخدم اللوحة؟' : 'Are you still using the board?'}
        </h2>
        <p className="text-2xl text-ink-muted mb-1">
          {lang === 'ar'
            ? `ستنتهي الجلسة خلال ${ar(remaining)} ثانية`
            : `The session will end in ${remaining} seconds`}
        </p>
        <p className="text-xl text-ink-muted mb-7">
          {lang === 'ar' ? 'لحماية خصوصيتك.' : 'For your privacy.'}
        </p>

        <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden mb-8">
          <div
            className="h-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="cancel" onClick={() => navigate('/ended')}>
            {lang === 'ar' ? 'إنهاء الجلسة' : 'End session'}
          </Button>
          <Button variant="primary" onClick={() => navigate(-1)}>
            {lang === 'ar' ? 'نعم، أكمل' : 'Yes, continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
