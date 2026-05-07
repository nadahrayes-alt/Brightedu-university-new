import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { useApp } from '../lib/AppContext';

export function Refusal() {
  const { lang, setPrivateMode } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    setPrivateMode(true);
  }, [setPrivateMode]);

  return (
    <div className="p-12 flex items-center justify-center min-h-[800px]">
      <article className="bg-surface border-2 border-privacy rounded-3xl p-12 w-[880px] text-center halo-violet animate-scale-in">
        <div className="flex justify-center mb-6">
          <span className="w-24 h-24 rounded-full bg-privacy/10 dark:bg-privacy/20 flex items-center justify-center">
            <ShieldCheck className="w-14 h-14 text-privacy" />
          </span>
        </div>

        <h1 className="text-[40px] font-bold leading-tight mb-5">
          {lang === 'ar'
            ? 'هذه معلومات خاصة ولا تظهر على شاشة عامة'
            : 'This is private information and is not shown on a public screen'}
        </h1>

        <p className="text-xl text-ink-muted leading-relaxed mb-3 max-w-2xl mx-auto">
          {lang === 'ar'
            ? 'أكمل من جوالك بعد التحقق.'
            : 'Continue on your phone after verification.'}
        </p>
        <p className="text-lg text-ink-muted mb-7 max-w-2xl mx-auto">
          {lang === 'ar'
            ? 'البيانات الأكاديمية والشخصية تظهر فقط في قناة خاصة وآمنة.'
            : 'Academic and personal data only appear through a private, secure channel.'}
        </p>

        <div className="flex justify-center mb-5">
          <button
            onClick={() => navigate('/verify')}
            className="bg-white p-5 rounded-2xl border border-border-soft hover:border-privacy"
            aria-label="Continue on phone"
          >
            <QRCodeSVG
              value="https://brightedu.kau.edu.sa/private?session=demo"
              size={240}
              bgColor="#FFFFFF"
              fgColor="#0F172A"
              level="M"
            />
          </button>
        </div>

        <Chip tone="black-tier" icon={<Lock className="w-5 h-5" />}>
          {lang === 'ar' ? 'لا يظهر على شاشة عامة' : 'Phone-only'}
        </Chip>

        <div className="mt-10 flex gap-4 justify-center">
          <Button variant="cancel" onClick={() => navigate('/')}>
            {lang === 'ar' ? 'الرجوع للرئيسية' : 'Back to home'}
          </Button>
          <Button variant="privacy" onClick={() => navigate('/verify')}>
            {lang === 'ar' ? 'أكمل من الجوال' : 'Continue on phone'}
          </Button>
        </div>
      </article>
    </div>
  );
}
