import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, padding = 'md', hover = false, className = '', ...rest }: Props) {
  const pad = padding === 'sm' ? 'p-4' : padding === 'lg' ? 'p-7' : 'p-5';
  return (
    <div
      {...rest}
      className={`bg-surface border border-border-soft rounded-2xl ${pad} ${
        hover ? 'transition hover:border-primary/40' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
