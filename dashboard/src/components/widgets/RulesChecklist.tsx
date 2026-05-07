import { Check, X } from 'lucide-react';
import { useT, useLoc } from '../../context';

interface Rule { id: string; labelAr: string; labelEn?: string; passed: boolean }

export function RulesChecklist({ rules }: { rules: Rule[] }) {
  const t = useT();
  const loc = useLoc();
  const passed = rules.filter((r) => r.passed).length;
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-5">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="text-sm font-semibold text-ink">{t('drawer.rules.title')}</div>
        <div className="text-xs text-ink-muted">
          <span className="num font-semibold text-ink">{passed}</span> / <span className="num">{rules.length}</span>{' '}
          {t('drawer.rules.passed')}
        </div>
      </div>
      <ul className="space-y-2">
        {rules.map((r) => (
          <li key={r.id} className="flex items-center gap-3 text-sm">
            <span
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                r.passed ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
              }`}
            >
              {r.passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            </span>
            <span className={r.passed ? 'text-ink' : 'text-ink-muted'}>{loc(r.labelAr, r.labelEn)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
