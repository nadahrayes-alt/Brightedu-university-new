import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { useApp } from '../lib/AppContext';
import { mockBackend, STUDENTS } from '../data/mock';
import type { KioskSession } from '../data/mock';
import { pad2 } from '../lib/numerals';

const PHONE_BASE = 'https://brightedu.kau.edu.sa/continue';

export function QRContinuation() {
  const { lang, setPrivateMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<KioskSession | null>(null);
  const [remaining, setRemaining] = useState(300);

  // Decide what kind of session to create from the navigation context.
  useEffect(() => {
    setPrivateMode(true);
    // Try to read a doc-type hint from the previous route (?type=…).
    const params = new URLSearchParams(location.search);
    const docType = (params.get('type') ?? 'graduation_cert') as
      | 'graduation_cert' | 'enrollment_letter' | 'transcript' | 'good_standing' | 'update_info';
    const s = mockBackend.createDocumentSession(docType);
    setSession(s);
  }, [setPrivateMode, location.search]);

  // Countdown.
  useEffect(() => {
    if (!session) return;
    if (remaining <= 0) {
      mockBackend.expireSession(session.id);
      navigate('/qr/expired');
      return;
    }
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining, session, navigate]);

  // Watch for a phone-side claim → success page.
  useEffect(() => {
    if (!session) return;
    return mockBackend.subscribeSessions(() => {
      const latest = mockBackend.getSession(session.id);
      if (latest?.status === 'claimed') {
        navigate('/qr/success', { state: { sessionId: session.id, claimedBy: latest.claimedByNationalId } });
      }
    });
  }, [session, navigate]);

  function handleSimulateScan() {
    if (!session) return;
    // Demo affordance: pick a student appropriate for the requested doc type.
    const docType = session.intent.type === 'document' ? session.intent.docType : null;
    const candidate =
      (docType === 'graduation_cert'
        ? STUDENTS.find((s) => s.status === 'graduated')
        : STUDENTS.find((s) => s.status === 'enrolled')) ?? STUDENTS[0];

    mockBackend.simulatePhoneClaim(session.id, candidate.nationalId);
  }

  function handleRegenerate() {
    if (!session) return;
    mockBackend.cancelSession(session.id);
    const docType = session.intent.type === 'document' ? session.intent.docType : 'graduation_cert';
    setSession(mockBackend.createDocumentSession(docType));
    setRemaining(300);
  }

  function handleCancel() {
    if (session) mockBackend.cancelSession(session.id);
    navigate(-1);
  }

  if (!session) return null;

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const timer = `${pad2(m)}:${pad2(s)}`;
  const timerColor =
    remaining > 60 ? 'text-ink' : remaining > 30 ? 'text-warning' : 'text-privacy';

  const qrUrl = `${PHONE_BASE}?s=${session.id}`;

  return (
    <div className="p-12 flex flex-col items-center justify-center min-h-[800px]">
      <article className="bg-surface border-2 border-privacy rounded-3xl p-10 w-[720px] text-center halo-violet animate-scale-in">
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

        <p className="text-xl text-ink-muted mb-2 leading-snug">
          {lang === 'ar'
            ? 'امسح الرمز لإكمال الطلب من جوالك بأمان.'
            : 'Scan the code to complete the request on your phone, securely.'}
        </p>
        <p className="text-base text-ink-muted mb-8">
          {lang === 'ar'
            ? 'لحماية خصوصيتك، لن نعرض أي بيانات شخصية على هذه الشاشة.'
            : "For your privacy, we won't show any personal data on this screen."}
        </p>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleSimulateScan}
            aria-label="Simulate phone scan + Nafath auth"
            title={lang === 'ar' ? '(عرض تجريبي) محاكاة المسح والتحقق' : '(Demo) simulate scan + Nafath'}
            className="bg-white p-6 rounded-2xl border border-border-soft hover:border-privacy transition"
          >
            <QRCodeSVG value={qrUrl} size={320} bgColor="#FFFFFF" fgColor="#0F172A" level="M" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 mb-7">
          <span className="text-xl text-ink-muted">
            {lang === 'ar' ? 'صلاحية الرمز:' : 'Code expires in:'}
          </span>
          <span className={`font-mono num text-6xl leading-none font-semibold ${timerColor}`} aria-live="polite">
            {timer}
          </span>
        </div>

        <p className="text-lg text-ink-muted mb-3">
          {lang === 'ar'
            ? 'امسح الرمز خلال ٥ دقائق للمتابعة بأمان.'
            : 'Scan within 5 minutes to continue safely.'}
        </p>
        <p className="text-xs text-ink-subtle font-mono num mb-7">
          session: {session.id}
        </p>

        <div className="flex gap-4 justify-center">
          <Button variant="cancel" onClick={handleCancel}>
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button variant="privacy" onClick={handleRegenerate}>
            {lang === 'ar' ? 'إنشاء رمز جديد' : 'Generate new code'}
          </Button>
        </div>
      </article>
    </div>
  );
}
