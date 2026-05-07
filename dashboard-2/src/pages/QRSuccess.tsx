import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { QRSuccessIcon } from '../components/board/QRCard';
import { Button } from '../components/ui/Button';
import { useApp } from '../lib/AppContext';
import { mockBackend } from '../data/mock';
import type { Student } from '../data/mock';

interface ClaimState {
  sessionId?: string;
  claimedBy?: string;
}

export function QRSuccess() {
  const { lang, setPrivateMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as ClaimState;
  const [student, setStudent] = useState<Student | undefined>();

  useEffect(() => {
    setPrivateMode(true);
    if (state.claimedBy) {
      setStudent(mockBackend.findStudentByNationalId(state.claimedBy));
    }
    if (state.sessionId) {
      // Mark the session as completed once the phone-side request finalizes.
      window.setTimeout(() => mockBackend.completeSession(state.sessionId!), 1500);
    }
    const id = window.setTimeout(() => {
      setPrivateMode(false);
      navigate('/');
    }, 6000);
    return () => window.clearTimeout(id);
  }, [navigate, setPrivateMode, state.claimedBy, state.sessionId]);

  return (
    <div className="p-12 flex flex-col items-center justify-center text-center min-h-[800px]">
      <QRSuccessIcon size={240} />
      <h1 className="mt-10 text-5xl font-bold text-ink">
        {lang === 'ar' ? 'تم نقل الطلب إلى جوالك' : 'Request transferred to your phone'}
      </h1>

      {student ? (
        <p className="mt-4 text-xl text-ink-muted max-w-3xl">
          {lang === 'ar'
            ? 'تم التحقق من هويتك بنجاح عبر النفاذ الموحد. تابع الخطوات على جوالك.'
            : 'Identity verified via Nafath. Continue the steps on your phone.'}
        </p>
      ) : (
        <p className="mt-4 text-xl text-ink-muted max-w-3xl">
          {lang === 'ar'
            ? 'يمكنك الآن متابعة الخطوات هناك بأمان.'
            : 'You can continue the steps there safely.'}
        </p>
      )}

      <p className="mt-2 text-base text-ink-muted">
        {lang === 'ar'
          ? 'ستعود اللوحة إلى الشاشة الرئيسية خلال ٦ ثوانٍ.'
          : 'The board returns to home in 6 seconds.'}
      </p>

      <Link to="/" className="mt-10">
        <Button variant="primary">{lang === 'ar' ? 'العودة الآن' : 'Return now'}</Button>
      </Link>
    </div>
  );
}
