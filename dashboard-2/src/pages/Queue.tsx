import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Button } from '../components/ui/Button';
import { ar } from '../lib/numerals';

export function Queue() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const filled = 12;
  const total = 20;

  return (
    <div className="p-12">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          aria-label={lang === 'ar' ? 'الرجوع' : 'Back'}
          className="w-12 h-12 rounded-2xl bg-surface border border-border-soft hover:border-primary hover:bg-surface-2 flex items-center justify-center text-ink transition shrink-0"
        >
          {lang === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        <h1 className="text-4xl font-bold text-ink">
          {lang === 'ar' ? 'حالة الانتظار — شؤون الطلبة' : 'Wait status — Student Affairs'}
        </h1>
      </div>

      <div className="bg-surface border border-border-soft rounded-3xl p-10 max-w-4xl">
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`w-9 h-9 rounded-full ${
                i < filled ? 'bg-warning' : 'bg-surface-2 border border-border-soft'
              }`}
            />
          ))}
        </div>

        <div className="text-2xl font-semibold mb-2 text-ink">
          {lang === 'ar' ? 'الانتظار الحالي: متوسط' : 'Current wait: medium'}
        </div>
        <div className="text-xl text-ink-muted">
          {lang === 'ar' ? `متوسط الانتظار: ${ar(12)} دقيقة` : 'Average wait: 12 min'}
        </div>
        <div className="text-base text-ink-muted mt-1">
          {lang === 'ar' ? `آخر تحديث: قبل ${ar(1)} دقيقة` : 'Last updated: 1 min ago'}
        </div>
      </div>

      <div className="mt-10 max-w-4xl">
        <h3 className="text-2xl font-semibold mb-3">{lang === 'ar' ? 'نصيحة:' : 'Tip:'}</h3>
        <p className="text-xl text-ink-muted leading-relaxed">
          {lang === 'ar'
            ? 'ذروة الانتظار عادةً بين ١١ ص و ١ م. الفترة الأهدأ بعد ٢ م.'
            : 'Peak wait is usually 11 AM – 1 PM. Quietest after 2 PM.'}
        </p>
      </div>

      <div className="mt-12 flex gap-4 flex-wrap">
        <Link to="/map/student-affairs">
          <Button variant="primary">{lang === 'ar' ? 'عرض الموقع' : 'View location'}</Button>
        </Link>
        <Link to="/services">
          <Button variant="secondary">{lang === 'ar' ? 'خدمات بديلة' : 'Alternative services'}</Button>
        </Link>
        <Link to="/">
          <Button variant="cancel">{lang === 'ar' ? 'الرجوع' : 'Back'}</Button>
        </Link>
      </div>
    </div>
  );
}
