import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: Props) {
  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-surface rounded-2xl w-full ${widths[size]} border border-border-soft overflow-hidden max-h-[90vh] flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft shrink-0">
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-surface-2 flex items-center justify-center text-ink-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-border-soft bg-canvas/60 flex items-center justify-end gap-2 flex-wrap shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
