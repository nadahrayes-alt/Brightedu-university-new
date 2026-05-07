import { CheckCircle2, AlertTriangle, Info, X, AlertOctagon } from 'lucide-react';
import { useApp, type ToastKind } from '../../context';

const config: Record<ToastKind, { icon: typeof CheckCircle2; ring: string; iconCls: string }> = {
  info:    { icon: Info,           ring: 'border-primary/30', iconCls: 'text-primary' },
  success: { icon: CheckCircle2,   ring: 'border-success/30', iconCls: 'text-success' },
  warning: { icon: AlertTriangle,  ring: 'border-warning/30', iconCls: 'text-warning' },
  error:   { icon: AlertOctagon,   ring: 'border-danger/30',  iconCls: 'text-danger' },
};

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:end-6 z-[60] flex flex-col gap-2 max-w-[380px] sm:w-[380px] pointer-events-none">
      {toasts.map((t) => {
        const c = config[t.kind];
        const Icon = c.icon;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto bg-sidebar text-white rounded-xl border ${c.ring} px-3 py-3 flex items-start gap-3 animate-[fadeIn_0.18s_ease-out]`}
          >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${c.iconCls}`} strokeWidth={2} />
            <div className="flex-1 text-sm leading-6">{t.message}</div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-white/60 hover:text-white shrink-0 -mt-0.5"
              aria-label="dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
