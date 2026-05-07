import { Sparkles } from 'lucide-react';
import { useT } from '../../context';

export function AiSummaryPanel({ summary }: { summary: string }) {
  const t = useT();
  return (
    <div className="rounded-2xl border border-border-soft bg-gradient-to-br from-primary/5 via-surface to-teal/5 p-5">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-sm font-semibold text-primary-700 dark:text-primary">{t('drawer.aiSummary.title')}</div>
        <div className="ms-auto text-[11px] text-ink-muted">{t('drawer.aiSummary.note')}</div>
      </div>
      <p className="text-sm leading-7 text-ink">{summary}</p>
    </div>
  );
}
