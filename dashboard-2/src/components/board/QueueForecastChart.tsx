import { useApp } from '../../lib/AppContext';
import type { QueueSnapshot } from '../../data/mock';

const LEVEL_COLOR: Record<'low' | 'medium' | 'high', string> = {
  low:    'bg-success',
  medium: 'bg-warning',
  high:   'bg-danger',
};

export function QueueForecastChart({ queue }: { queue: QueueSnapshot }) {
  const { lang } = useApp();
  const max = Math.max(...queue.forecast.map((f) => f.expectedWaitMin), 30);

  return (
    <div className="bg-surface border border-border-soft rounded-3xl p-7">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-ink">
            {lang === 'ar' ? 'توقعات الانتظار اليوم' : "Today's wait forecast"}
          </h3>
          <p className="text-sm text-ink-muted mt-1">
            {lang === 'ar'
              ? 'الذروة عادة بين ١١ ص و ١ م. الأهدأ بعد ٢ م.'
              : 'Peak hours usually 11 AM – 1 PM. Quietest after 2 PM.'}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            {lang === 'ar' ? 'منخفض' : 'Low'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            {lang === 'ar' ? 'متوسط' : 'Medium'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger" />
            {lang === 'ar' ? 'مرتفع' : 'High'}
          </span>
        </div>
      </div>

      <div className="flex items-end gap-3 h-40">
        {queue.forecast.map((slot) => {
          const heightPct = (slot.expectedWaitMin / max) * 100;
          return (
            <div key={slot.hour} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <div className="text-xs text-ink-muted num">
                {slot.expectedWaitMin}{lang === 'ar' ? 'د' : 'm'}
              </div>
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-xl ${LEVEL_COLOR[slot.level]}/85 hover:${LEVEL_COLOR[slot.level]} transition`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <div className="text-xs text-ink-muted truncate w-full text-center">
                {slot.hour}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
