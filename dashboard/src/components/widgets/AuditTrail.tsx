import { Bot, User } from 'lucide-react';
import { useT, useLoc, useApp } from '../../context';

interface Entry {
  actor: string;
  actorAr: string;
  actionAr: string;
  actionEn?: string;
  at: string;
  system?: boolean;
}

function formatTime(iso: string, lang: 'ar' | 'en') {
  const d = new Date(iso);
  return d.toLocaleTimeString(
    lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US',
    { hour: '2-digit', minute: '2-digit' },
  );
}

export function AuditTrail({ entries }: { entries: Entry[] }) {
  const t = useT();
  const loc = useLoc();
  const { lang, isRTL } = useApp();
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-5">
      <div className="text-sm font-semibold text-ink mb-4">{t('drawer.audit')}</div>
      <ol className="relative">
        <span className={`absolute ${isRTL ? 'right-[15px]' : 'left-[15px]'} top-2 bottom-2 w-px bg-border-soft`} aria-hidden />
        {entries.map((e, i) => (
          <li key={i} className={`relative ${isRTL ? 'pr-10' : 'pl-10'} pb-4 last:pb-0`}>
            <span
              className={`absolute ${isRTL ? 'right-1' : 'left-1'} top-0 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-surface ${
                e.system ? 'bg-teal/15 text-teal' : 'bg-primary/15 text-primary'
              }`}
            >
              {e.system ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
            </span>
            <div className="text-sm font-medium text-ink leading-tight">{loc(e.actionAr, e.actionEn)}</div>
            <div className="text-xs text-ink-muted mt-0.5">
              <span>{loc(e.actorAr, e.actor)}</span>
              <span className="mx-2">·</span>
              <span className="num">{formatTime(e.at, lang)}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
