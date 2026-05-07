import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../lib/AppContext';
import { AssistantInput } from '../components/board/AssistantInput';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { SUGGESTIONS } from '../data/services';

export function Assistant() {
  const { lang } = useApp();
  const navigate = useNavigate();
  return (
    <div>
      <PrivacyBanner />
      <div className="p-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-surface border border-border-soft rounded-3xl p-8 flex flex-col min-h-[640px]">
          <div className="flex items-center gap-4 mb-5">
            <button
              onClick={() => navigate(-1)}
              aria-label={lang === 'ar' ? 'الرجوع' : 'Back'}
              className="w-12 h-12 rounded-2xl bg-surface border border-border-soft hover:border-primary hover:bg-surface-2 flex items-center justify-center text-ink transition shrink-0"
            >
              {lang === 'ar' ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
            <span className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center">
              <Sparkles className="w-9 h-9" />
            </span>
            <div>
              <h2 className="text-3xl font-semibold text-ink leading-tight">
                {lang === 'ar' ? 'مساعد الحرم الذكي' : 'Smart Campus Assistant'}
              </h2>
              <p className="text-xl text-ink-muted">
                {lang === 'ar' ? 'كيف أقدر أساعدك؟' : 'How can I help?'}
              </p>
            </div>
          </div>

          <p className="text-xl text-ink-muted max-w-3xl mb-10">
            {lang === 'ar'
              ? 'اسألني عن المباني، الخدمات، المواعيد، أو كيفية بدء طلب.'
              : 'Ask about buildings, services, hours, or starting a request.'}
          </p>

          <div className="flex-1" />

          <AssistantInput autofocus />
        </section>

        <aside className="bg-surface border border-border-soft rounded-3xl p-7">
          <h3 className="text-xl font-semibold mb-4">
            {lang === 'ar' ? 'مقترحات شائعة' : 'Common suggestions'}
          </h3>
          <div className="flex flex-col gap-3">
            {SUGGESTIONS.map((s) => (
              <Link
                key={s.ar}
                to={s.route}
                className="block w-full px-4 h-14 rounded-2xl bg-surface-2 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary border border-border-soft text-lg text-ink-muted flex items-center"
              >
                {lang === 'ar' ? s.ar : s.en}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
