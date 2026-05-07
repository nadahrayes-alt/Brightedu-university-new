import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'privacy';
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
  secondary: 'bg-surface-2 text-primary-700 hover:bg-primary-100 border border-border-soft',
  ghost:     'bg-transparent text-ink hover:bg-surface-2',
  danger:    'bg-danger text-white hover:opacity-90',
  success:   'bg-success text-white hover:opacity-90',
  privacy:   'bg-privacy text-white hover:opacity-90',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
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
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-xl
        focus:outline-none focus:shadow-focus disabled:opacity-50 disabled:cursor-not-allowed
        transition ${variants[variant]} ${sizes[size]} ${block ? 'w-full' : ''} ${className}`}
    >
      {iconStart}
      <span>{children}</span>
      {iconEnd}
    </button>
  );
}
