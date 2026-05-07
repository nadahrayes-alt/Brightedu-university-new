import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, ChevronLeft, ChevronRight, Check, Loader2,
  ArrowLeft, ArrowRight, ShieldCheck, FileCheck, ClipboardList,
  Sparkles, Clock, Languages, Lock, BookCheck,
  Delete, Smartphone, KeyRound, AlertCircle, QrCode, Send,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';
import { STUDENTS } from '../data/mock';
import type { Student } from '../data/mock';

type Step =
  | 'intro'
  | 'language'
  | 'verification'
  | 'verification-result'
  | 'eligibility'
  | 'success';

type LetterLang = 'ar' | 'en';

interface CheckItem {
  id: string;
  ar: string;
  en: string;
  icon: typeof ShieldCheck;
}

// Eligibility checks per scenario #005.
const CHECKS: CheckItem[] = [
  { id: 'identity',     ar: 'التحقق من هوية الطالب',     en: 'Student identity verification', icon: ShieldCheck },
  { id: 'enrollment',   ar: 'التحقق من حالة القيد',       en: 'Enrollment status check',       icon: BookCheck },
  { id: 'completeness', ar: 'التحقق من اكتمال البيانات',  en: 'Data completeness check',       icon: FileCheck },
  { id: 'prepare',      ar: 'تجهيز الخطاب',                en: 'Preparing the letter',          icon: ClipboardList },
];

const ID_LENGTH = 7;

function maskName(fullAr: string): string {
  return `${fullAr.trim().charAt(0)}****`;
}
function maskNameEn(fullEn: string): string {
  return `${fullEn.trim().charAt(0)}****`;
}

export function EnrollmentFlow() {
  const { lang, setPrivateMode, setVerifiedStudentId } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('intro');
  const [letterLang, setLetterLang] = useState<LetterLang>('ar');
  const [universityId, setUniversityId] = useState('');
  const [idError, setIdError] = useState<string | null>(null);
  const [verified, setVerified] = useState<Student | null>(null);
  const [checkedCount, setCheckedCount] = useState(0);
  const [requestNumber] = useState(
    () => `ENR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
  );
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const ChevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;

  useEffect(() => { setPrivateMode(true); }, [setPrivateMode]);

  // Animated checks; on completion advance to success (green-tier auto-issue).
  useEffect(() => {
    if (step !== 'eligibility') return;
    setCheckedCount(0);
    const id = window.setInterval(() => {
      setCheckedCount((c) => {
        if (c >= CHECKS.length) {
          window.clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 700);
    return () => window.clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (step !== 'eligibility' || checkedCount < CHECKS.length) return;
    const t = window.setTimeout(() => setStep('success'), 900);
    return () => window.clearTimeout(t);
  }, [step, checkedCount]);

  function back() {
    const order: Step[] = ['intro', 'language', 'verification', 'verification-result', 'eligibility', 'success'];
    const idx = order.indexOf(step);
    if (idx <= 0) navigate(-1);
    else setStep(order[idx - 1]);
  }

  // ─── Keypad ─────────────────────────────────────────────────────
  function pressDigit(d: string) {
    setIdError(null);
    setUniversityId((v) => (v + d).slice(0, ID_LENGTH));
  }
  function backspace() {
    setIdError(null);
    setUniversityId((v) => v.slice(0, -1));
  }
  function clearId() {
    setIdError(null);
    setUniversityId('');
  }
  function submitId() {
    if (!universityId) {
      setIdError(lang === 'ar' ? 'يرجى إدخال الرقم الجامعي.' : 'Please enter your university ID.');
      return;
    }
    if (!/^\d+$/.test(universityId)) {
      setIdError(lang === 'ar' ? 'الرقم يجب أن يحتوي على أرقام فقط.' : 'ID must contain digits only.');
      return;
    }
    if (universityId.length !== ID_LENGTH) {
      setIdError(
        lang === 'ar'
          ? `يجب أن يتكوّن الرقم من ${ID_LENGTH} خانات.`
          : `ID must be ${ID_LENGTH} digits.`
      );
      return;
    }
    const found = STUDENTS.find((s) => s.universityId === universityId);
    setVerified(found ?? STUDENTS[0]);
    // Cache so the universal /verify gate skips re-entry on subsequent QR jumps.
    setVerifiedStudentId(universityId);
    setStep('verification-result');
  }

  // ─── Header + Stepper ───────────────────────────────────────────
  const Header = () => (
    <div className="flex items-center gap-4 mb-3 flex-wrap">
      <button
        onClick={back}
        aria-label={lang === 'ar' ? 'الرجوع' : 'Back'}
        className="w-12 h-12 rounded-2xl bg-surface border border-border-soft hover:border-primary hover:bg-surface-2 flex items-center justify-center text-ink transition shrink-0"
      >
        <ChevIcon className="w-6 h-6" />
      </button>
      <span className="w-16 h-16 rounded-2xl bg-success/10 dark:bg-success/20 text-success flex items-center justify-center">
        <FileText className="w-9 h-9" />
      </span>
      <div className="flex-1 min-w-0">
        <h1 className="text-4xl font-bold text-ink leading-tight">
          {lang === 'ar' ? 'إثبات قيد' : 'Enrollment letter'}
        </h1>
        <p className="text-base text-ink-muted mt-1">
          {lang === 'ar' ? 'عبر شؤون الطلبة · مبنى ٤' : 'Via Student Affairs · Building 4'}
        </p>
      </div>
      <Chip tone="public-safe" icon={<Sparkles className="w-4 h-4" />}>
        {lang === 'ar' ? 'أتمتة كاملة بعد التحقق' : 'Fully automated after verification'}
      </Chip>
    </div>
  );

  const Stepper = () => {
    const order: { key: Step; ar: string; en: string }[] = [
      { key: 'intro',         ar: 'تعليمات',  en: 'Overview' },
      { key: 'language',      ar: 'اللغة',     en: 'Language' },
      { key: 'verification',  ar: 'التحقق',    en: 'Verify' },
      { key: 'eligibility',   ar: 'الاستحقاق', en: 'Eligibility' },
      { key: 'success',       ar: 'الإصدار',   en: 'Issued' },
    ];
    const visualKey = step === 'verification-result' ? 'verification' : step;
    const currentIdx = order.findIndex((o) => o.key === visualKey);
    return (
      <ol className="flex items-center gap-1 mt-3 mb-6 text-sm flex-wrap">
        {order.map((o, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          return (
            <li key={o.key} className="inline-flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                done   ? 'bg-success text-white'
                : active ? 'bg-primary text-white shadow-lg shadow-primary/30'
                :          'bg-surface-2 text-ink-muted border border-border-soft'
              }`}>
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </span>
              <span className={`text-sm ${active ? 'text-ink font-semibold' : 'text-ink-muted'}`}>
                {lang === 'ar' ? o.ar : o.en}
              </span>
              {i < order.length - 1 && (
                <span className={`mx-2 w-5 h-0.5 ${done ? 'bg-success' : 'bg-border-soft'}`} />
              )}
            </li>
          );
        })}
      </ol>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div>
      <PrivacyBanner />
      <div className="p-12 max-w-5xl mx-auto">
        <Header />
        <Stepper />

        {/* INTRO */}
        {step === 'intro' && (
          <section className="bg-surface border border-border-soft rounded-3xl p-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">
              {lang === 'ar' ? 'تفاصيل الخدمة' : 'Service details'}
            </h2>
            <p className="text-xl text-ink-muted leading-relaxed mb-3">
              {lang === 'ar'
                ? 'يمكنك إصدار خطاب إثبات القيد بعد التحقق من هويتك وحالة القيد. لحماية خصوصيتك، لن يتم عرض الخطاب كاملًا على هذه الشاشة.'
                : 'You can issue your enrollment confirmation letter after we verify your identity and enrollment status. For your privacy, the full letter will not be displayed on this screen.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-7">
              <div className="bg-surface-2 rounded-2xl p-5">
                <Sparkles className="w-6 h-6 text-success mb-2" />
                <div className="text-base text-ink-muted mb-1">{lang === 'ar' ? 'النوع' : 'Type'}</div>
                <div className="text-xl font-bold text-success">{lang === 'ar' ? 'أتمتة كاملة' : 'Fully automated'}</div>
              </div>
              <div className="bg-surface-2 rounded-2xl p-5">
                <Clock className="w-6 h-6 text-primary mb-2" />
                <div className="text-base text-ink-muted mb-1">{lang === 'ar' ? 'الوقت' : 'Time'}</div>
                <div className="text-xl font-bold text-ink">{lang === 'ar' ? 'لحظي' : 'Instant'}</div>
              </div>
              <div className="bg-surface-2 rounded-2xl p-5">
                <Smartphone className="w-6 h-6 text-privacy mb-2" />
                <div className="text-base text-ink-muted mb-1">{lang === 'ar' ? 'التسليم' : 'Delivery'}</div>
                <div className="text-xl font-bold text-ink">{lang === 'ar' ? 'إلى الجوال' : 'To your phone'}</div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">{lang === 'ar' ? 'الخطوات:' : 'Steps:'}</h3>
            <ol className="space-y-3 text-lg text-ink mb-8 list-none">
              {(lang === 'ar'
                ? [
                    'اختيار لغة الخطاب',
                    'التحقق من الرقم الجامعي',
                    'فحص حالة القيد',
                    'إرسال الخطاب إلى الجوال',
                  ]
                : [
                    'Choose letter language',
                    'Verify university ID',
                    'Check enrollment status',
                    'Send the letter to your phone',
                  ]
              ).map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-success text-white text-sm font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>

            <div className="flex gap-4 flex-wrap">
              <Button variant="primary" onClick={() => setStep('language')}>
                <span>{lang === 'ar' ? 'بدء التحقق' : 'Start verification'}</span>
                <ArrowIcon className="w-6 h-6" />
              </Button>
              <Button variant="secondary" onClick={() => navigate('/verify')}>
                <Smartphone className="w-6 h-6" />
                <span>{lang === 'ar' ? 'أكمل من الجوال' : 'Continue on phone'}</span>
              </Button>
              <Link to="/">
                <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
              </Link>
            </div>
          </section>
        )}

        {/* LANGUAGE */}
        {step === 'language' && (
          <section className="bg-surface border border-border-soft rounded-3xl p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Languages className="w-7 h-7 text-primary" />
              <h2 className="text-3xl font-bold">{lang === 'ar' ? 'اختر لغة الخطاب' : 'Choose letter language'}</h2>
            </div>
            <p className="text-lg text-ink-muted mb-7">
              {lang === 'ar'
                ? 'سيُصدر خطاب إثبات القيد باللغة المختارة فقط.'
                : 'The enrollment letter will be issued only in the selected language.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {([
                { code: 'ar' as LetterLang, label: 'عربي',    sub: 'Arabic',     flag: '🇸🇦' },
                { code: 'en' as LetterLang, label: 'English', sub: 'الإنجليزية', flag: '🇬🇧' },
              ]).map((opt) => {
                const active = letterLang === opt.code;
                return (
                  <button
                    key={opt.code}
                    onClick={() => setLetterLang(opt.code)}
                    className={`text-start rounded-3xl border-2 p-7 transition ${
                      active
                        ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-lg shadow-primary/20'
                        : 'border-border-soft bg-surface-2 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-4xl">{opt.flag}</span>
                      {active && (
                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </span>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-ink leading-tight">{opt.label}</div>
                    <div className="text-base text-ink-muted mt-1">{opt.sub}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 flex-wrap">
              <Button variant="primary" onClick={() => setStep('verification')}>
                <span>{lang === 'ar' ? 'متابعة للتحقق' : 'Continue to verification'}</span>
                <ArrowIcon className="w-6 h-6" />
              </Button>
              <Button variant="cancel" onClick={() => setStep('intro')}>
                {lang === 'ar' ? 'الرجوع' : 'Back'}
              </Button>
            </div>
          </section>
        )}

        {/* VERIFICATION (keypad) */}
        {step === 'verification' && (
          <section className="bg-surface border border-border-soft rounded-3xl p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-5 p-4 rounded-2xl bg-privacy/10 dark:bg-privacy/15 border-2 border-privacy/30">
              <Lock className="w-6 h-6 text-privacy shrink-0" />
              <p className="text-base text-ink leading-relaxed">
                {lang === 'ar'
                  ? 'لن يتم عرض أي بيانات شخصية على هذه الشاشة. الرقم الجامعي يُستخدم للتحقق فقط.'
                  : 'No personal data will be shown on this screen. The university ID is used only for verification.'}
              </p>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <KeyRound className="w-7 h-7 text-primary" />
              <h2 className="text-3xl font-bold">{lang === 'ar' ? 'التحقق من الرقم الجامعي' : 'Verify university ID'}</h2>
            </div>
            <p className="text-lg text-ink-muted mb-6">
              {lang === 'ar'
                ? `أدخل رقمك الجامعي (${ID_LENGTH} أرقام).`
                : `Enter your university ID (${ID_LENGTH} digits).`}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
              <div>
                <div className={`mb-4 h-20 px-5 rounded-3xl border-2 flex items-center justify-center bg-surface-2 ${
                  idError ? 'border-danger/40' : 'border-border-soft'
                }`}>
                  <span className="font-mono num text-4xl font-bold text-ink tracking-[0.4em]">
                    {universityId.padEnd(ID_LENGTH, '·')}
                  </span>
                </div>

                {idError && (
                  <div className="mb-4 flex items-center gap-2 text-danger text-base">
                    <AlertCircle className="w-5 h-5" />
                    {idError}
                  </div>
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

              <div className="flex flex-col gap-4">
                <button
                  onClick={submitId}
                  disabled={universityId.length === 0}
                  className="h-20 rounded-2xl bg-primary text-white text-2xl font-bold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-primary/30 transition"
                >
                  <ShieldCheck className="w-7 h-7" />
                  <span>{lang === 'ar' ? 'بدء التحقق' : 'Start verification'}</span>
                </button>

                <div className="bg-surface-2 rounded-3xl p-6 flex flex-col items-center text-center">
                  <Smartphone className="w-12 h-12 text-privacy mb-3" />
                  <h3 className="text-xl font-bold text-ink mb-2">
                    {lang === 'ar' ? 'بديل من الجوال' : 'Phone alternative'}
                  </h3>
                  <p className="text-base text-ink-muted mb-4">
                    {lang === 'ar'
                      ? 'تفضّل التحقق من جوالك بدلًا من إدخال الرقم على اللوحة العامة؟'
                      : 'Prefer to verify on your phone instead of entering your ID on the public board?'}
                  </p>
                  <Button variant="privacy" onClick={() => navigate('/verify')} block>
                    {lang === 'ar' ? 'أكمل من الجوال' : 'Continue on phone'}
                  </Button>
                </div>

                <div className="text-center text-sm text-ink-muted inline-flex items-center justify-center gap-2 mt-2">
                  <Clock className="w-4 h-4" />
                  {lang === 'ar' ? 'تنتهي الجلسة تلقائيًا بعد فترة من عدم الاستخدام' : 'Session auto-ends after inactivity'}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* VERIFICATION RESULT (masked only) */}
        {step === 'verification-result' && verified && (
          <section className="bg-surface border border-border-soft rounded-3xl p-8 animate-fade-in">
            <div className="flex flex-col items-center text-center mb-7">
              <div className="w-20 h-20 rounded-full bg-success/15 dark:bg-success/20 text-success flex items-center justify-center mb-4">
                <Check className="w-12 h-12" strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {lang === 'ar' ? 'تم التحقق من الرقم الجامعي' : 'University ID verified'}
              </h2>
              <p className="text-lg text-ink-muted max-w-2xl">
                {lang === 'ar'
                  ? 'لن نعرض البيانات الكاملة على هذه الشاشة. الهوية أدناه ظاهرة بشكل مُقنّع للتأكيد فقط.'
                  : 'We will not show full details on this screen. The identity below is masked for confirmation only.'}
              </p>
            </div>

            <div className="bg-surface-2 border-2 border-border-soft rounded-3xl p-7 max-w-2xl mx-auto mb-7">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base text-ink-muted">{lang === 'ar' ? 'الطالب' : 'Student'}</span>
                  <span className="text-xl font-bold text-ink num">
                    {lang === 'ar' ? maskName(verified.nameAr) : maskNameEn(verified.nameEn)}
                  </span>
                </div>
                <div className="h-px bg-border-soft" />
                <div className="flex items-center justify-between">
                  <span className="text-base text-ink-muted">{lang === 'ar' ? 'الكلية' : 'College'}</span>
                  <span className="text-xl font-semibold text-ink">
                    {verified.college}
                  </span>
                </div>
                <div className="h-px bg-border-soft" />
                <div className="flex items-center justify-between">
                  <span className="text-base text-ink-muted">{lang === 'ar' ? 'الرقم الجامعي' : 'University ID'}</span>
                  <span className="text-xl font-mono num text-ink">
                    {verified.universityId.slice(0, 2) + '****' + verified.universityId.slice(-1)}
                  </span>
                </div>
              </div>
            </div>

            {/* What we never display on the public board */}
            <div className="bg-privacy/10 dark:bg-privacy/15 border-2 border-privacy/30 rounded-2xl p-5 mb-7 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-privacy mt-0.5 shrink-0" />
                <div>
                  <p className="text-base text-ink font-semibold mb-1">
                    {lang === 'ar' ? 'لا تظهر هذه البيانات على اللوحة:' : "We don't show on this board:"}
                  </p>
                  <ul className="text-sm text-ink-muted list-disc ms-5 space-y-0.5">
                    <li>{lang === 'ar' ? 'المعدل التراكمي' : 'GPA'}</li>
                    <li>{lang === 'ar' ? 'الإنذارات الأكاديمية' : 'Academic warnings'}</li>
                    <li>{lang === 'ar' ? 'محتوى الخطاب الكامل' : 'Full letter content'}</li>
                    <li>{lang === 'ar' ? 'البيانات الشخصية الكاملة' : 'Full personal data'}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="primary" onClick={() => setStep('eligibility')}>
                <span>{lang === 'ar' ? 'متابعة فحص حالة القيد' : 'Continue to enrollment check'}</span>
                <ArrowIcon className="w-6 h-6" />
              </Button>
              <Button variant="cancel" onClick={() => { setVerified(null); setUniversityId(''); setStep('verification'); }}>
                {lang === 'ar' ? 'تعديل الرقم' : 'Edit ID'}
              </Button>
            </div>
          </section>
        )}

        {/* ELIGIBILITY */}
        {step === 'eligibility' && (
          <section className="bg-surface border border-border-soft rounded-3xl p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              {checkedCount < CHECKS.length ? (
                <Loader2 className="w-7 h-7 text-primary animate-spin" />
              ) : (
                <Check className="w-7 h-7 text-success" />
              )}
              <h2 className="text-3xl font-bold">
                {checkedCount < CHECKS.length
                  ? lang === 'ar' ? 'جاري فحص حالة القيد' : 'Checking enrollment status'
                  : lang === 'ar' ? 'تم التحقق بنجاح' : 'Verification complete'}
              </h2>
            </div>
            <p className="text-lg text-ink-muted mb-8">
              {lang === 'ar'
                ? 'يقوم النظام بفحص بياناتك في خلفية آمنة. لن نعرض أي تفاصيل شخصية على هذه الشاشة.'
                : 'The system is checking your records in a secure backend. No personal details will be shown on this screen.'}
            </p>

            <ul className="space-y-3 mb-8">
              {CHECKS.map((c, i) => {
                const done = i < checkedCount;
                const active = i === checkedCount;
                const Icon = c.icon;
                return (
                  <li
                    key={c.id}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                      done   ? 'border-success/30 bg-success/5'
                      : active ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                      :          'border-border-soft bg-surface-2 opacity-60'
                    }`}
                  >
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      done   ? 'bg-success text-white'
                      : active ? 'bg-primary text-white'
                      :          'bg-surface text-ink-muted border border-border-soft'
                    }`}>
                      {done ? <Check className="w-6 h-6" /> : active ? <Loader2 className="w-6 h-6 animate-spin" /> : <Icon className="w-6 h-6" />}
                    </span>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-ink">
                        {lang === 'ar' ? c.ar : c.en}
                      </div>
                      <div className="text-sm text-ink-muted">
                        {done   ? lang === 'ar' ? 'مكتمل' : 'Complete'
                        : active ? lang === 'ar' ? 'جارٍ التحقق...' : 'Checking...'
                        :          lang === 'ar' ? 'بانتظار' : 'Pending'}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* SUCCESS — green-tier auto-issue, delivered privately */}
        {step === 'success' && (
          <section className="bg-surface border border-border-soft rounded-3xl p-8 animate-fade-in">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-success/15 dark:bg-success/20 text-success mx-auto mb-5">
              <Check className="w-12 h-12" strokeWidth={3} />
            </div>
            <h2 className="text-4xl font-bold text-center mb-3">
              {lang === 'ar' ? 'تم تجهيز خطاب إثبات القيد' : 'Enrollment letter is ready'}
            </h2>
            <p className="text-xl text-ink-muted text-center mb-3 leading-relaxed max-w-3xl mx-auto">
              {lang === 'ar'
                ? 'تم إرسال الخطاب إلى جوالك بأمان.'
                : 'The letter has been sent to your phone securely.'}
            </p>
            <p className="text-lg text-ink-muted text-center mb-7 leading-relaxed max-w-3xl mx-auto">
              {lang === 'ar'
                ? 'يمكنك أيضًا مسح QR لتحميل الخطاب من قناة خاصة.'
                : 'You can also scan QR to download it through a private channel.'}
            </p>

            <div className="bg-success/10 dark:bg-success/15 border-2 border-success/30 rounded-2xl p-6 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 rounded-xl bg-success text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </span>
                <span className="text-lg font-bold text-ink">
                  {lang === 'ar' ? 'صدر تلقائيًا بعد التحقق' : 'Issued automatically after verification'}
                </span>
              </div>
              <p className="text-base text-ink-muted leading-relaxed">
                {lang === 'ar'
                  ? 'الخطاب موقّع رقميًا. لم يتم عرض محتواه الكامل على هذه الشاشة لحماية خصوصيتك.'
                  : 'The letter is digitally signed. Its full contents were not shown on this screen to protect your privacy.'}
              </p>
            </div>

            <div className="bg-surface-2 border-2 border-border-soft rounded-2xl p-5 max-w-md mx-auto mb-8 text-center">
              <div className="text-sm text-ink-muted mb-1">
                {lang === 'ar' ? 'رقم الإصدار' : 'Reference number'}
              </div>
              <div className="font-mono num text-2xl font-bold text-ink tracking-wider">
                {requestNumber}
              </div>
              <div className="text-sm text-ink-muted mt-1">
                {lang === 'ar' ? 'لغة الخطاب: ' : 'Letter language: '}
                <span className="font-semibold text-ink">
                  {letterLang === 'ar'
                    ? (lang === 'ar' ? 'عربي' : 'Arabic')
                    : (lang === 'ar' ? 'الإنجليزية' : 'English')}
                </span>
              </div>
            </div>

            {/* Primary: send-to-phone (already auto-sent — this is a re-send affordance). Secondary: QR. */}
            <div className="flex flex-wrap gap-4 justify-center mb-3">
              <Button variant="primary" onClick={() => navigate('/qr/success')}>
                <Send className="w-6 h-6" />
                <span>{lang === 'ar' ? 'إرسال إلى الجوال' : 'Send to phone'}</span>
              </Button>
              <Button variant="secondary" onClick={() => navigate('/verify')}>
                <QrCode className="w-6 h-6" />
                <span>{lang === 'ar' ? 'عرض QR للتحميل الآمن' : 'Show QR for secure download'}</span>
              </Button>
            </div>

            <div className="text-center mt-5">
              <Link to="/" className="text-base text-ink-muted hover:text-ink transition">
                {lang === 'ar' ? 'العودة للرئيسية' : 'Back to home'}
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
