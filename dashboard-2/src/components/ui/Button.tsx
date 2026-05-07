import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'cancel' | 'privacy' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  block?: boolean;
}

const variants: Record<Variant, string> = {
  primary:   'bg-primary text-white hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-surface text-primary border-2 border-primary hover:bg-primary/10 dark:hover:bg-primary/20',
  tertiary:  'bg-transparent text-primary hover:bg-primary/10 dark:hover:bg-primary/20',
  cancel:    'bg-surface-2 text-ink hover:bg-border-soft',
  privacy:   'bg-privacy text-white hover:opacity-90',
  danger:    'bg-danger text-white hover:opacity-90',
  ghost:     'bg-transparent text-ink hover:bg-surface-2',
};

// Touch-grade per spec: lg=72×min240, md=64×min200, sm=56×min160
const sizes: Record<Size, string> = {
  sm: 'h-14 min-w-[160px] px-6 text-lg',
  md: 'h-16 min-w-[200px] px-7 text-xl',
  lg: 'h-[72px] min-w-[240px] px-8 text-[22px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  iconStart,
  iconEnd,
  block,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-3 font-semibold rounded-2xl
        focus:outline-none focus:shadow-focus disabled:opacity-50 disabled:cursor-not-allowed
        transition-[background-color,transform] duration-150 active:scale-[0.98]
        ${variants[variant]} ${sizes[size]} ${block ? 'w-full' : ''} ${className}`}
    >
      {iconStart}
      {children}
      {iconEnd}
    </button>
  );
}
