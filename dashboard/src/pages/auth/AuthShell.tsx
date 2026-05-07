import type { ReactNode } from 'react';
import { Sun, Moon, Languages } from 'lucide-react';
import { useApp, useT } from '../../context';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: Props) {
  const { theme, toggleTheme, lang, toggleLang } = useApp();
  const t = useT();

  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Brand panel — hidden on mobile */}
      <div className="hidden lg:flex flex-col w-[44%] xl:w-[40%] bg-sidebar text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(47,91,255,0.18),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(0,124,138,0.18),transparent_55%)]" />
        <div className="relative p-10 flex flex-col h-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-teal flex items-center justify-center font-bold text-xl">B</div>
            <div>
              <div className="font-semibold text-lg leading-tight">{t('brand.name')}</div>
              <div className="text-xs text-sidebar-text-muted leading-tight">{t('brand.tagline')}</div>
            </div>
          </div>

          <div className="my-auto max-w-md">
            <h2 className="text-3xl xl:text-4xl font-bold leading-snug">
              {lang === 'ar'
                ? 'مركز قيادة شؤون الطلبة المدعوم بالذكاء الاصطناعي.'
                : 'AI-powered Student Affairs command center.'}
            </h2>
            <p className="mt-4 text-sidebar-text leading-relaxed">
              {lang === 'ar'
                ? 'أتمتة الطلبات، اعتمادات أسرع، دعم أذكى للطلاب — مع إبقاء القرارات الحساسة بيد الإنسان.'
                : 'Automate routine requests, accelerate approvals, and offer smarter student support — while keeping sensitive decisions human.'}
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              {[
                lang === 'ar' ? '٦٤٪ نسبة أتمتة لطلبات الخدمات' : '64% automation rate on service requests',
                lang === 'ar' ? 'سجلّ إجراءات شفّاف لكل قرار' : 'Transparent audit trail for every decision',
                lang === 'ar' ? 'تنبيهات داعمة للطلاب — لا مراقبة' : 'Supportive student signals — never surveillance',
              ].map((line, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-sidebar-text-muted">© BrightEdu × KAU · 2026</div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        {/* Mini top bar with theme + lang */}
        <div className="flex items-center justify-end gap-2 p-4 sm:p-6">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl hover:bg-surface-2 flex items-center justify-center text-ink-muted"
            aria-label="theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleLang}
            className="h-10 px-3 rounded-xl hover:bg-surface-2 flex items-center gap-1.5 text-ink-muted"
            aria-label="language"
          >
            <Languages className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wider">{lang === 'ar' ? 'EN' : 'AR'}</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mobile brand strip */}
            <div className="lg:hidden mb-8 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-teal text-white flex items-center justify-center font-bold">B</div>
              <div>
                <div className="font-semibold text-ink leading-tight">{t('brand.name')}</div>
                <div className="text-xs text-ink-muted leading-tight">{t('brand.tagline')}</div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight">{title}</h1>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed">{subtitle}</p>

            <div className="mt-8">{children}</div>

            {footer && <div className="mt-6 text-sm text-center text-ink-muted">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
