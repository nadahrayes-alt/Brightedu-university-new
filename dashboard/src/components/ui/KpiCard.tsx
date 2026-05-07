import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from './Card';

interface Props {
  label: string;
  value: ReactNode;
  unit?: string;
  trend?: number;
  hint?: string;
  accent?: 'primary' | 'teal' | 'success' | 'warning' | 'danger' | 'privacy' | 'purple';
  icon?: ReactNode;
}

const accentText: Record<NonNullable<Props['accent']>, string> = {
  primary: 'text-primary',
  teal:    'text-teal',
  success: 'text-success',
  warning: 'text-warning',
  danger:  'text-danger',
  privacy: 'text-privacy',
  purple:  'text-purple',
};

const accentGrad: Record<NonNullable<Props['accent']>, string> = {
  primary: 'from-primary/10',
  teal:    'from-teal/10',
  success: 'from-success/10',
  warning: 'from-warning/10',
  danger:  'from-danger/10',
  privacy: 'from-privacy/10',
  purple:  'from-purple/10',
};

export function KpiCard({ label, value, unit, trend, hint, accent = 'primary', icon }: Props) {
  const Icon = trend == null ? Minus : trend >= 0 ? TrendingUp : TrendingDown;
  const trendCls = trend == null ? 'text-ink-muted' : trend >= 0 ? 'text-success' : 'text-danger';
  return (
    <Card className="relative overflow-hidden" padding="md">
      <div className={`absolute inset-0 bg-gradient-to-bl pointer-events-none to-transparent ${accentGrad[accent]}`} />
      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm text-ink-muted leading-tight">{label}</div>
          {icon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accentText[accent]} bg-surface ring-1 ring-border-soft shrink-0`}>
              {icon}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <div className="text-2xl sm:text-3xl font-bold text-ink num">{value}</div>
          {unit && <div className="text-sm text-ink-muted">{unit}</div>}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
          {trend != null && (
            <span className={`inline-flex items-center gap-1 ${trendCls} font-medium`}>
              <Icon className="w-3.5 h-3.5" />
              <span className="num">{trend > 0 ? '+' : ''}{trend}%</span>
            </span>
          )}
          {hint && <span className="text-ink-muted">{hint}</span>}
        </div>
      </div>
    </Card>
  );
}
