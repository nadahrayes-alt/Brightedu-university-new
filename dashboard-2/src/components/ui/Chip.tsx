import type { ReactNode } from 'react';

type Tone =
  | 'open' | 'closed' | 'closing' | 'busy'
  | 'available' | 'unavailable'
  | 'private' | 'public-safe' | 'needs-qr' | 'black-tier'
  | 'neutral' | 'info';

interface ChipProps {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

const tones: Record<Tone, string> = {
  open:          'bg-success-soft dark:bg-success/15 text-success',
  closing:       'bg-warning-soft dark:bg-warning/15 text-warning',
  closed:        'bg-surface-2 text-ink-muted',
  busy:          'bg-warning-soft dark:bg-warning/15 text-warning',
  available:     'bg-success-soft dark:bg-success/15 text-success',
  unavailable:   'bg-danger-soft dark:bg-danger/15 text-danger',
  private:       'bg-privacy-50 dark:bg-privacy/15 text-privacy',
  'public-safe': 'bg-success-soft dark:bg-success/15 text-success',
  'needs-qr':    'bg-privacy-50 dark:bg-privacy/15 text-privacy',
  'black-tier':  'bg-ink/10 text-ink',
  neutral:       'bg-surface-2 text-ink',
  info:          'bg-primary/10 text-primary-700 dark:text-primary',
};

export function Chip({ tone = 'neutral', icon, children, size = 'md', className = '' }: ChipProps) {
  const dim = size === 'sm' ? 'h-9 px-3 text-base' : 'h-11 px-4 text-base';
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold ${tones[tone]} ${dim} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}

export function StatusDot({ tone }: { tone: 'open' | 'closing' | 'closed' | 'busy' | 'low' | 'med' | 'high' }) {
  const c =
    tone === 'open' || tone === 'low' ? 'bg-success'
    : tone === 'closing' || tone === 'busy' || tone === 'med' ? 'bg-warning'
    : tone === 'high' ? 'bg-danger'
    : 'bg-ink-subtle';
  return <span className={`inline-block w-3 h-3 rounded-full ${c}`} />;
}
