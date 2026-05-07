import { Link, useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useApp } from '../lib/AppContext';

export function ErrorScreen() {
  const { lang } = useApp();
  const navigate = useNavigate();

  return (
    <div className="p-12 flex items-center justify-center min-h-[800px]">
      <article className="bg-surface border border-border-soft rounded-3xl p-10 w-[640px] text-center shadow-card">
        <div className="flex justify-center mb-6">
          <span className="w-16 h-16 rounded-full bg-surface-2 border border-border-soft flex items-center justify-center text-ink-muted">
            <Info className="w-8 h-8" />
          </span>
        </div>
        <h2 className="text-3xl font-semibold mb-3">
          {lang === 'ar' ? 'تعذر إكمال الطلب الآن' : "Couldn't complete the request"}
        </h2>
        <p className="text-xl text-ink-muted mb-3">
          {lang === 'ar'
            ? 'جرّب مرة أخرى أو توجه لأقرب مكتب خدمة.'
            : 'Try again or visit the nearest service desk.'}
        </p>
        <p className="text-lg text-ink-muted mb-8">
          {lang === 'ar'
            ? 'أقرب مكتب: شؤون الطلبة — مبنى ٤'
            : 'Nearest desk: Student Affairs — Building 4'}
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
          </Link>
          <Button variant="primary" onClick={() => navigate(0)}>
            {lang === 'ar' ? 'إعادة المحاولة' : 'Try again'}
          </Button>
        </div>
      </article>
    </div>
  );
}
