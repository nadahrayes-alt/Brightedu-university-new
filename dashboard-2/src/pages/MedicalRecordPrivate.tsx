import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
  Lock, ShieldCheck, FileText, EyeOff,
} from 'lucide-react';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { useApp } from '../lib/AppContext';

const HIDDEN_DATA: { ar: string; en: string }[] = [
  { ar: 'الاسم وبيانات الطالب', en: 'Student name and personal info' },
  { ar: 'التشخيصات والوصفات', en: 'Diagnoses and prescriptions' },
  { ar: 'نتائج التحاليل والمختبر', en: 'Lab results and tests' },
  { ar: 'المواعيد الشخصية والإحالات', en: 'Personal appointments and referrals' },
  { ar: 'الأعراض وسجل الزيارات', en: 'Symptoms and visit history' },
];

export function MedicalRecordPrivate() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const ChevIcon = lang === 'ar' ? ChevronRight : ChevronLeft;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div>
      <PrivacyBanner />
      <div className="p-12 max-w-4xl mx-auto">
        {/* Header — calm tone, not an error */}
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            aria-label={lang === 'ar' ? 'الرجوع' : 'Back'}
            className="w-12 h-12 rounded-2xl bg-surface border border-border-soft hover:border-primary hover:bg-surface-2 flex items-center justify-center text-ink transition shrink-0"
          >
            <ChevIcon className="w-6 h-6" />
          </button>
          <span className="w-16 h-16 rounded-2xl bg-privacy/10 dark:bg-privacy/20 text-privacy flex items-center justify-center">
            <FileText className="w-9 h-9" />
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'السجل الطبي' : 'Medical record'}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {lang === 'ar'
                ? 'بيانات صحية شخصية — تُعرض فقط على جوالك'
                : 'Personal health data — viewed only on your phone'}
            </p>
          </div>
          <Chip tone="black-tier" icon={<Lock className="w-5 h-5" />}>
            {lang === 'ar' ? 'لا يظهر على شاشة عامة' : 'Not shown on public screens'}
          </Chip>
        </div>

        {/* Calm explanation */}
        <p className="text-2xl text-ink-muted leading-relaxed mb-3">
          {lang === 'ar'
            ? 'لا يمكن عرض السجل الطبي على شاشة عامة. لحماية خصوصيتك، أدخل رقمك الجامعي ثم أكمل من جوالك بأمان.'
            : 'A medical record cannot be shown on a public screen. To protect your privacy, enter your University ID and continue securely on your phone.'}
        </p>
        <p className="text-base text-ink-muted leading-relaxed mb-10">
          {lang === 'ar'
            ? 'هذه ليست رسالة خطأ — هذا تصرف مقصود لحماية بياناتك الصحية، حتى عند استخدامك لوحة عامة.'
            : 'This is not an error — it is intentional to protect your health data, even on a public board.'}
        </p>

        {/* What is never shown here */}
        <section className="bg-surface border border-border-soft rounded-3xl p-7 mb-8">
          <header className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-privacy/10 dark:bg-privacy/20 text-privacy flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'ما الذي لا يظهر على هذه اللوحة؟' : 'What is never shown on this board?'}
            </h3>
          </header>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-base text-ink leading-relaxed list-disc ms-5">
            {HIDDEN_DATA.map((item, i) => (
              <li key={i}>{lang === 'ar' ? item.ar : item.en}</li>
            ))}
          </ul>
        </section>

        {/* What happens after verification */}
        <section className="bg-primary/5 dark:bg-primary/10 border border-primary/30 rounded-3xl p-7 mb-10">
          <header className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-ink leading-tight">
              {lang === 'ar' ? 'ماذا يحدث بعد التحقق؟' : 'What happens after verification?'}
            </h3>
          </header>
          <ol className="space-y-3 text-base text-ink leading-relaxed list-none">
            {[
              { ar: 'تدخل رقمك الجامعي بشكل خاص.', en: 'You enter your University ID privately.' },
              { ar: 'يظهر رمز QR على هذه الشاشة فقط.', en: 'A QR code appears only on this screen.' },
              { ar: 'تمسحه بجوالك ويُفتح السجل عليه — لا على اللوحة.', en: 'You scan it with your phone, where the record opens — not on the board.' },
              { ar: 'تُغلق الجلسة تلقائيًا بعد انتهائك.', en: 'The session closes automatically when you are done.' },
            ].map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-9 h-9 shrink-0 rounded-full bg-primary text-white text-base font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{lang === 'ar' ? s.ar : s.en}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Primary CTA — go straight to verification */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="privacy" onClick={() => navigate('/verify')}>
            <span>{lang === 'ar' ? 'إدخال الرقم الجامعي والمتابعة' : 'Enter University ID and continue'}</span>
            <ArrowIcon className="w-6 h-6" />
          </Button>
          <Link to="/">
            <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
