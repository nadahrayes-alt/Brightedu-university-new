import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/AppContext';
import { Button } from '../components/ui/Button';
import { Welcome } from './Welcome';

export function LangModal() {
  const { lang, setLang } = useApp();
  const navigate = useNavigate();

  return (
    <>
      <Welcome />
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center animate-fade-in p-4">
        <div className="bg-surface rounded-3xl p-10 w-[560px] animate-scale-in border border-border-soft">
          <h2 className="text-3xl font-semibold text-center mb-1">اختر اللغة</h2>
          <p className="text-xl text-ink-muted text-center mb-7">Choose language</p>

          <button
            onClick={() => setLang('ar')}
            className={`w-full h-[88px] mb-3 rounded-2xl border-2 px-6 flex items-center justify-between text-2xl font-medium ${
              lang === 'ar' ? 'border-primary bg-primary/10 dark:bg-primary/20 text-primary' : 'border-border-soft bg-surface-2 text-ink'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-3xl">🇸🇦</span>
              عربي
            </span>
            {lang === 'ar' && <Check className="w-7 h-7" />}
          </button>
          <button
            onClick={() => setLang('en')}
            className={`w-full h-[88px] rounded-2xl border-2 px-6 flex items-center justify-between text-2xl font-medium ${
              lang === 'en' ? 'border-primary bg-primary/10 dark:bg-primary/20 text-primary' : 'border-border-soft bg-surface-2 text-ink'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-3xl">🇬🇧</span>
              English
            </span>
            {lang === 'en' && <Check className="w-7 h-7" />}
          </button>

          <div className="mt-7 flex justify-center">
            <Button onClick={() => navigate(-1)}>تم · Done</Button>
          </div>
        </div>
      </div>
    </>
  );
}
