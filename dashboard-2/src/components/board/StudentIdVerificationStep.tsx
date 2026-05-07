import { useEffect, useState } from 'react';
import {
  ChevronLeft, ChevronRight, ShieldCheck, KeyRound, Lock,
  Check, Loader2, Delete, AlertCircle, QrCode,
} from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { STUDENTS } from '../../data/mock';
import type { Student } from '../../data/mock';

interface Props {
  /** Called when the user confirms past the masked verification screen. */
  onSuccess: () => void;
  /** Called when the user backs out before verifying. */
  onBack?: () => void;
}

const ID_LENGTH = 7;

function maskName(fullAr: string): string {
  return `${fullAr.trim().charAt(0)}****`;
}
function maskNameEn(fullEn: string): string {
  return `${fullEn.trim().charAt(0)}****`;
}

type Phase = 'input' | 'checking' | 'success';

/**
 * Universal ID-verification gate that must run before any QR private
 * continuation. Reads / writes `verifiedStudentId` on AppContext so a single
 * verification covers all subsequent private flows in the session.
 */
export function StudentIdVerificationStep({ onSuccess, onBack }: Props) {
  const { lang, verifiedStudentId, setVerifiedStudentId, setPrivateMode } = useApp();
  const ChevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;

  const initialStudent: Student | null = verifiedStudentId
    ? (STUDENTS.find((s) => s.universityId === verifiedStudentId) ?? STUDENTS[0])
    : null;

  const [phase, setPhase] = useState<Phase>(verifiedStudentId ? 'success' : 'input');
  const [universityId, setUniversityId] = useState(verifiedStudentId ?? '');
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState<Student | null>(initialStudent);

  useEffect(() => { setPrivateMode(true); }, [setPrivateMode]);

  function pressDigit(d: string) {
    setError(null);
    setUniversityId((v) => (v + d).slice(0, ID_LENGTH));
  }
  function backspace() {
    setError(null);
    setUniversityId((v) => v.slice(0, -1));
  }
  function clearId() {
    setError(null);
    setUniversityId('');
  }
  function submitId() {
    if (!universityId) {
      setError(lang === 'ar' ? 'الرجاء إدخال الرقم الجامعي.' : 'Please enter your university ID.');
      return;
    }
    if (!/^\d+$/.test(universityId) || universityId.length !== ID_LENGTH) {
      setError(
        lang === 'ar'
          ? 'الرقم الجامعي غير صحيح. تأكد من الأرقام وحاول مرة أخرى.'
          : 'Invalid university ID. Check the digits and try again.'
      );
      return;
    }
    setPhase('checking');
    window.setTimeout(() => {
      const found = STUDENTS.find((s) => s.universityId === universityId) ?? STUDENTS[0];
      setVerified(found);
      setVerifiedStudentId(universityId);
      setPhase('success');
    }, 700);
  }

  // ─── SUCCESS ───────────────────────────────────────────────────
  if (phase === 'success' && verified) {
    return (
      <section className="bg-surface border border-border-soft rounded-3xl p-8 animate-fade-in">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-success/15 dark:bg-success/20 text-success flex items-center justify-center mb-4">
            <Check className="w-12 h-12" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {lang === 'ar' ? 'تم التحقق من الرقم الجامعي' : 'University ID verified'}
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl">
            {lang === 'ar'
              ? 'يمكنك الآن المتابعة عبر QR لإكمال الطلب من جوالك.'
              : 'You can now continue via QR to complete the request on your phone.'}
          </p>
        </div>

        {/* Masked identity — never reveal full name or any other detail */}
        <div className="bg-surface-2 border-2 border-border-soft rounded-3xl p-7 max-w-2xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <span className="text-base text-ink-muted">{lang === 'ar' ? 'الطالب' : 'Student'}</span>
            <span className="text-2xl font-bold text-ink num">
              {lang === 'ar' ? maskName(verified.nameAr) : maskNameEn(verified.nameEn)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-7 p-4 rounded-2xl bg-privacy/10 dark:bg-privacy/15 border-2 border-privacy/30 max-w-2xl mx-auto">
          <Lock className="w-5 h-5 text-privacy shrink-0" />
          <p className="text-base text-ink leading-relaxed">
            {lang === 'ar'
              ? 'لا يتم عرض أي تفاصيل شخصية على هذه الشاشة.'
              : 'No personal details appear on this screen.'}
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onSuccess}
            className="inline-flex items-center gap-3 h-16 px-7 rounded-2xl bg-primary text-white text-xl font-bold hover:bg-primary-600 shadow-lg shadow-primary/30 transition"
          >
            <QrCode className="w-6 h-6" />
            <span>{lang === 'ar' ? 'عرض QR للمتابعة' : 'Show QR to continue'}</span>
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 h-16 px-7 rounded-2xl bg-surface-2 text-ink border border-border-soft hover:bg-border-soft text-xl font-semibold transition"
            >
              <ChevIcon className="w-5 h-5" />
              <span>{lang === 'ar' ? 'رجوع' : 'Back'}</span>
            </button>
          )}
        </div>
      </section>
    );
  }

  // ─── CHECKING ───────────────────────────────────────────────────
  if (phase === 'checking') {
    return (
      <section className="bg-surface border border-border-soft rounded-3xl p-8 animate-fade-in">
        <div className="flex flex-col items-center text-center py-16">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-5" />
          <h2 className="text-3xl font-bold">
            {lang === 'ar' ? 'جاري التحقق من الرقم الجامعي...' : 'Verifying university ID...'}
          </h2>
        </div>
      </section>
    );
  }

  // ─── INPUT ──────────────────────────────────────────────────────
  return (
    <section className="bg-surface border border-border-soft rounded-3xl p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-5 p-4 rounded-2xl bg-privacy/10 dark:bg-privacy/15 border-2 border-privacy/30">
        <Lock className="w-6 h-6 text-privacy shrink-0" />
        <p className="text-base text-ink leading-relaxed">
          {lang === 'ar'
            ? 'لن يتم عرض أي بيانات شخصية على هذه الشاشة.'
            : 'No personal data will be shown on this screen.'}
        </p>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <KeyRound className="w-7 h-7 text-primary" />
        <h2 className="text-3xl font-bold">
          {lang === 'ar' ? 'التحقق من الرقم الجامعي' : 'University ID verification'}
        </h2>
      </div>
      <p className="text-lg text-ink-muted mb-6">
        {lang === 'ar'
          ? 'للمتابعة بأمان، أدخل رقمك الجامعي. لن يتم عرض أي بيانات شخصية على هذه الشاشة.'
          : 'To continue safely, enter your university ID. No personal data will be shown on this screen.'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Display + keypad */}
        <div>
          <label className="block text-base text-ink-muted font-semibold mb-2">
            {lang === 'ar' ? 'الرقم الجامعي' : 'University ID'}
          </label>
          <div className={`mb-3 h-20 px-5 rounded-3xl border-2 flex items-center justify-center bg-surface-2 ${error ? 'border-danger/40' : 'border-border-soft'}`}>
            <span className="font-mono num text-4xl font-bold text-ink tracking-[0.4em]">
              {universityId.padEnd(ID_LENGTH, '·')}
            </span>
          </div>

          {error ? (
            <div className="mb-4 flex items-center gap-2 text-danger text-base">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          ) : (
            <p className="mb-4 text-sm text-ink-muted">
              {lang === 'ar'
                ? 'سيتم استخدام الرقم للتحقق فقط قبل نقل الطلب إلى جوالك.'
                : 'The ID is used only for verification before continuing on your phone.'}
            </p>
          )}

          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <button
                key={d}
                onClick={() => pressDigit(d)}
                className="h-20 rounded-2xl bg-surface-2 hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-95 text-3xl font-bold text-ink num border-2 border-border-soft hover:border-primary/40 transition"
              >
                {d}
              </button>
            ))}
            <button
              onClick={clearId}
              aria-label={lang === 'ar' ? 'مسح' : 'Clear'}
              className="h-20 rounded-2xl bg-surface-2 hover:bg-danger/10 active:scale-95 text-base font-semibold text-ink-muted hover:text-danger border-2 border-border-soft hover:border-danger/40 transition"
            >
              {lang === 'ar' ? 'مسح' : 'Clear'}
            </button>
            <button
              onClick={() => pressDigit('0')}
              className="h-20 rounded-2xl bg-surface-2 hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-95 text-3xl font-bold text-ink num border-2 border-border-soft hover:border-primary/40 transition"
            >
              0
            </button>
            <button
              onClick={backspace}
              aria-label={lang === 'ar' ? 'حذف' : 'Backspace'}
              className="h-20 rounded-2xl bg-surface-2 hover:bg-warning/10 active:scale-95 flex items-center justify-center text-ink-muted hover:text-warning border-2 border-border-soft hover:border-warning/40 transition"
            >
              <Delete className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Right column: helper + actions */}
        <div className="flex flex-col gap-4">
          <div className="bg-surface-2 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold text-ink">
                {lang === 'ar' ? 'خطوة آمنة وقصيرة' : 'Quick and secure'}
              </span>
            </div>
            <p className="text-base text-ink-muted leading-relaxed">
              {lang === 'ar'
                ? 'بعد التحقق من رقمك الجامعي ستظهر QR لإكمال الطلب من جوالك. لن نعرض اسمك أو أي تفاصيل شخصية أخرى.'
                : 'After your ID is verified, a QR appears for you to complete the request on your phone. We will not show your name or any other personal detail.'}
            </p>
          </div>

          <button
            onClick={submitId}
            disabled={universityId.length === 0}
            className="h-20 rounded-2xl bg-primary text-white text-2xl font-bold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-primary/30 transition"
          >
            <ShieldCheck className="w-7 h-7" />
            <span>{lang === 'ar' ? 'متابعة التحقق' : 'Continue verification'}</span>
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="h-14 rounded-2xl bg-surface-2 text-ink border border-border-soft hover:bg-border-soft text-lg font-semibold flex items-center justify-center gap-2 transition"
            >
              <ChevIcon className="w-5 h-5" />
              <span>{lang === 'ar' ? 'رجوع' : 'Back'}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
