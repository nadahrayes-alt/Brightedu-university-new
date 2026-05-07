import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, Lock, Gavel, AlertTriangle } from 'lucide-react';
import { Chip } from '../ui/Chip';
import { useApp } from '../../lib/AppContext';
import {
  ASSISTANT_BUBBLE_LABEL,
  RECOGNITION_PREFIX,
  TRY_AGAIN_LABEL,
} from '../../agent/assistantResponses';
import { resolveBadge, privacyReassurance } from '../../agent/agentRules';
import { resolveActionHref } from '../../agent/agentRouter';
import { getIntentIcon } from '../../agent/intentIcons';
import type { Lang } from '../../agent/lang';
import type { IntentDef } from '../../agent/intents';

interface Props {
  intent: IntentDef;
  /** Optional verbatim phrase the user said (or typed). Falls back to the
   *  intent's recognition label so the card always shows what the assistant
   *  understood. */
  recognizedText?: string;
  /** Called when the user taps "Try again" on the ambiguous fallback. The
   *  parent page typically resets the assistant back to its ready state. */
  onRetry?: () => void;
  /** Force the response language. The assistant must reply in the same
   *  language the user used; the parent recogniser passes the detected reply
   *  language here. Falls back to the UI language when not provided. */
  replyLang?: Lang;
}

const BADGE_ICON_NODE = {
  shield: <ShieldCheck className="w-5 h-5" />,
  lock: <Lock className="w-5 h-5" />,
  gavel: <Gavel className="w-5 h-5" />,
  alert: <AlertTriangle className="w-5 h-5" />,
} as const;

/**
 * Smart Campus Assistant — single response card.
 *
 * Kiosk-friendly layout, NOT a chat bubble thread:
 *   • thin "I understood" header line with the recognised request
 *   • large response paragraph
 *   • optional supplementary note
 *   • privacy reassurance strip
 *   • large action buttons grid
 */
export function IntentResponseCard({ intent, recognizedText, onRetry, replyLang }: Props) {
  const { lang: uiLang } = useApp();
  const navigate = useNavigate();
  // Always prefer the recognised reply language; fall back to UI language so
  // deep-link entries (where there's no utterance to detect from) still render.
  const lang: Lang = replyLang ?? uiLang;

  const recognized = recognizedText
    ?? (lang === 'ar' ? intent.recognitionAr : intent.recognitionEn);
  const response = lang === 'ar' ? intent.responseAr : intent.responseEn;
  const note = lang === 'ar' ? intent.noteAr : intent.noteEn;
  const reassurance = privacyReassurance(intent.category, lang);

  const badge = resolveBadge(intent, lang);
  const badgeIcon = BADGE_ICON_NODE[badge.iconKind];

  function onActionClick(action: IntentDef['actions'][number]) {
    if (action.kind === 'back') {
      navigate(-1);
      return;
    }
    if (action.kind === 'home') {
      navigate('/home');
      return;
    }
    if (action.kind === 'retry') {
      if (onRetry) onRetry();
      else navigate('/assistant');
      return;
    }
    const href = resolveActionHref(action, intent.category);
    if (href) navigate(href);
  }

  return (
    <article className="flex flex-col gap-5">
      {/* "I understood you want: …" header */}
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold uppercase tracking-wider text-ink-muted mb-2">
            {RECOGNITION_PREFIX[lang]}
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-ink leading-snug">
            {recognized}
          </p>
        </div>
        <Chip tone={badge.tone} icon={badgeIcon}>
          {badge.label}
        </Chip>
      </header>

      <div className="h-px bg-border-soft" aria-hidden />

      {/* Assistant attribution line */}
      <div className="flex items-center gap-2 text-primary font-semibold text-base">
        <Sparkles className="w-5 h-5" />
        <span>{ASSISTANT_BUBBLE_LABEL[lang]}</span>
      </div>

      {/* Response body */}
      <p className="text-2xl text-ink leading-relaxed">{response}</p>

      {note && (
        <p className="text-base text-ink-muted leading-relaxed -mt-2">{note}</p>
      )}

      {/* Privacy reassurance */}
      <div className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-privacy/5 dark:bg-privacy/10 border border-privacy/30">
        <ShieldCheck className="w-5 h-5 text-privacy shrink-0 mt-0.5" />
        <p className="text-base text-ink-muted leading-relaxed">{reassurance}</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {intent.actions.map((action, idx) => {
          const Icon = getIntentIcon(action.iconKind);
          const variant = action.variant ?? (idx === 0 ? 'primary' : 'secondary');
          const cls =
            variant === 'primary'
              ? 'bg-primary text-white hover:bg-primary-600'
              : variant === 'privacy'
              ? 'bg-privacy text-white hover:opacity-90 shadow-lg shadow-privacy/25'
              : variant === 'secondary'
              ? 'bg-surface text-primary border-2 border-primary hover:bg-primary/10 dark:hover:bg-primary/20'
              : variant === 'cancel'
              ? 'bg-surface-2 text-ink border border-border-soft hover:bg-border-soft'
              : 'bg-transparent text-ink hover:bg-surface-2';

          return (
            <button
              key={`${action.ar}-${idx}`}
              onClick={() => onActionClick(action)}
              className={`inline-flex items-center gap-2 h-16 px-7 rounded-2xl text-lg font-semibold transition active:scale-[0.98] ${cls}`}
            >
              <Icon className="w-5 h-5" />
              <span>{lang === 'ar' ? action.ar : action.en}</span>
            </button>
          );
        })}
      </div>

      {intent.category === 'ambiguous' && onRetry && (
        <button
          onClick={onRetry}
          className="self-start inline-flex items-center gap-2 h-12 px-5 rounded-2xl text-base font-semibold text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition"
        >
          <Sparkles className="w-5 h-5" />
          <span>{TRY_AGAIN_LABEL[lang]}</span>
        </button>
      )}
    </article>
  );
}
