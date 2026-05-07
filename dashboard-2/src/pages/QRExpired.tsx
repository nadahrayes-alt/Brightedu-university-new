import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { useApp } from '../lib/AppContext';

export function QRExpired() {
  const { lang } = useApp();
  const navigate = useNavigate();

  return (
    <div className="p-12 flex flex-col items-center justify-center min-h-[800px]">
      <article className="bg-surface border-2 border-privacy rounded-3xl p-10 w-[720px] text-center halo-violet">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-ink">
            {lang === 'ar' ? 'انتهت صلاحية الرمز' : 'Code expired'}
          </h2>
          <Chip tone="private" icon={<Lock className="w-5 h-5" />}>
            {lang === 'ar' ? 'خاص' : 'Private'}
          </Chip>
        </header>

        <div className="mx-auto mb-8 w-[320px] h-[320px] rounded-2xl bg-privacy/10 dark:bg-privacy/20 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #6D5DF6 0, #6D5DF6 8px, transparent 8px, transparent 18px)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-privacy">
              {lang === 'ar' ? 'منتهي' : 'Expired'}
            </span>
          </div>
        </div>

        <p className="text-xl text-ink-muted mb-10 leading-relaxed">
          {lang === 'ar'
            ? 'لحماية خصوصيتك، تنتهي الرموز تلقائيًا. أنشئ رمزًا جديدًا للمتابعة.'
            : 'Codes expire automatically for your privacy. Generate a new code to continue.'}
        </p>

        <div className="flex gap-4 justify-center">
          <Button variant="cancel" onClick={() => navigate(-2)}>
            {lang === 'ar' ? 'الرجوع' : 'Back'}
          </Button>
          <Button variant="privacy" onClick={() => navigate('/verify')}>
            {lang === 'ar' ? 'إنشاء رمز جديد' : 'Generate new code'}
          </Button>
        </div>
      </article>
    </div>
  );
}
