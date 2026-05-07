import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Lock, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { useApp } from '../../lib/AppContext';
import { pad2 } from '../../lib/numerals';

interface Props {
  durationSec?: number;
  onScanned?: () => void;
  onExpired?: () => void;
  onCancel?: () => void;
  onRegenerate?: () => void;
  size?: number;
}

export function QRCard({
  durationSec = 300,
  onScanned,
  onExpired,
  onCancel,
  onRegenerate,
  size = 320,
}: Props) {
  const { lang } = useApp();
  const [remaining, setRemaining] = useState(durationSec);

  useEffect(() => {
    setRemaining(durationSec);
  }, [durationSec]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpired?.();
      return;
    }
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining, onExpired]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const timer = `${pad2(m)}:${pad2(s)}`;
  const timerColor =
    remaining > 60
      ? 'text-ink'
      : remaining > 30
      ? 'text-warning'
      : 'text-privacy';

  return (
    <article
      className="bg-surface border-2 border-privacy rounded-3xl p-10 w-[720px] text-center halo-violet animate-scale-in"
      role="region"
      aria-label="QR continuation"
    >
      <header className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="w-14 h-14 rounded-2xl bg-privacy/10 dark:bg-privacy/20 text-privacy flex items-center justify-center">
            <ShieldCheck className="w-8 h-8" />
          </span>
          <h2 className="text-3xl font-semibold text-ink">
            {lang === 'ar' ? 'أكمل من جوالك' : 'Continue on your phone'}
          </h2>
        </div>
        <Chip tone="private" icon={<Lock className="w-5 h-5" />}>
          {lang === 'ar' ? 'خاص' : 'Private'}
        </Chip>
      </header>

      <p className="text-xl text-ink-muted mb-8 leading-snug">
        {lang === 'ar'
          ? 'لحماية خصوصيتك، لن نعرض أي بيانات شخصية على هذه الشاشة.'
          : "For your privacy, we won't show any personal data on this screen."}
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={onScanned}
          aria-label="Simulate scan"
          className="bg-white p-6 rounded-2xl border border-border-soft hover:border-privacy transition"
        >
          <QRCodeSVG
            value="https://brightedu.kau.edu.sa/continue?session=demo"
            size={size}
            bgColor="#FFFFFF"
            fgColor="#0F172A"
            level="M"
          />
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 mb-7">
        <span className="text-xl text-ink-muted">
          {lang === 'ar' ? 'صلاحية الرمز:' : 'Code expires in:'}
        </span>
        <span
          className={`font-mono num text-6xl leading-none font-semibold ${timerColor}`}
          aria-live="polite"
        >
          {timer}
        </span>
      </div>

      <p className="text-lg text-ink-muted mb-7">
        {lang === 'ar'
          ? 'امسح الرمز خلال ٥ دقائق للمتابعة بأمان.'
          : 'Scan within 5 minutes to continue safely.'}
      </p>

      <div className="flex gap-4 justify-center">
        <Button variant="cancel" onClick={onCancel}>
          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button variant="privacy" onClick={onRegenerate}>
          {lang === 'ar' ? 'إنشاء رمز جديد' : 'Generate new code'}
        </Button>
      </div>
    </article>
  );
}

export function QRSuccessIcon({ size = 280 }: { size?: number }) {
  return (
    <div
      className="bg-success/15 dark:bg-success/20 rounded-3xl flex items-center justify-center animate-scale-in"
      style={{ width: size, height: size }}
    >
      <Check size={size * 0.6} className="text-success" strokeWidth={3} />
    </div>
  );
}
