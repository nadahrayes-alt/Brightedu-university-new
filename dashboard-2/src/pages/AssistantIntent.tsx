import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Sparkles, Type as TypeIcon, Loader2, AlertCircle,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { IntentResponseCard } from '../components/board/IntentResponseCard';
import {
  ASK_BUTTON, ASSISTANT_NAME,
  TEXT_INPUT_PLACEHOLDER, VOICE_STATE_COPY,
} from '../agent/assistantResponses';
import { getIntent, matchIntent } from '../agent/agentRouter';
import type { IntentDef } from '../agent/intents';

/**
 * Smart Campus Assistant — chat screen.
 *
 * Reached when the user types a question on /assistant and clicks "Ask", or
 * when an action chip uses the `#intent:<id>` shortcut. Each follow-up
 * question appends a new turn to a persistent thread on this same screen —
 * no navigation, no page reload — so the conversation reads as one
 * continuous exchange.
 *
 * Each turn renders one `IntentResponseCard` (which already shows the
 * recognised query + assistant response + action chips). Reply language is
 * detected per-turn from the user's utterance, so a thread can mix Arabic
 * and English replies if the user does.
 */

interface Turn {
  id: string;
  userQuery: string;
  intent: IntentDef;
}

let turnSeq = 0;
function nextTurnId(): string {
  turnSeq += 1;
  return `t${turnSeq}`;
}

export function AssistantIntent() {
  const { lang: uiLang } = useApp();
  const navigate = useNavigate();
  const { intentId } = useParams<{ intentId: string }>();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';

  /** Build the seed turn from the URL. Memoised so it doesn't re-fire when
   *  inner state changes; the URL params are the entry-point contract. */
  const seedTurn = useMemo<Turn | null>(() => {
    if (!intentId) return null;
    const intent = getIntent(intentId);
    return {
      id: nextTurnId(),
      // Show the user's verbatim input. If they reached the screen via an
      // intent shortcut without a query, fall back to the intent's UI-language
      // recognition label so nothing leaks across languages.
      userQuery: initialQuery || (uiLang === 'ar' ? intent.recognitionAr : intent.recognitionEn),
      intent,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intentId, initialQuery, uiLang]);

  const [turns, setTurns] = useState<Turn[]>(() => (seedTurn ? [seedTurn] : []));

  // Reseed the thread if the user navigates here with a different intent or
  // query (e.g. via an action chip's `#intent:<id>` shortcut).
  useEffect(() => {
    if (seedTurn) setTurns([seedTurn]);
  }, [seedTurn]);

  /** All chrome and response copy follow the kiosk's UI language so a single
   *  language theme is enforced across the screen. The user's verbatim input
   *  still appears as-is in each turn's recognition prefix. */
  const chromeLang = uiLang;
  const Arrow = chromeLang === 'ar' ? ArrowLeft : ArrowRight;

  /** Follow-up input — same recogniser as voice and the assistant home. */
  const [typed, setTyped] = useState('');
  const [typedError, setTypedError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll the latest turn into view whenever the thread grows.
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns.length]);

  function submit() {
    const q = typed.trim();
    if (!q) {
      setTypedError(
        chromeLang === 'ar'
          ? 'اكتب سؤالك أولًا أو استخدم المايك.'
          : 'Type your question first or use the microphone.',
      );
      return;
    }
    setTypedError(null);
    setSubmitting(true);

    // Brief processing flash so the recogniser feels deliberate.
    window.setTimeout(() => {
      const match = matchIntent(q, uiLang);
      const turn: Turn = {
        id: nextTurnId(),
        userQuery: q,
        intent: match.intent,
      };
      setTurns((prev) => [...prev, turn]);
      setTyped('');
      setSubmitting(false);
      // Re-focus so the user can keep typing.
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }, 350);
  }

  function onRetry() {
    // "Try again" on an ambiguous response — clear the input and refocus
    // instead of leaving the chat surface.
    setTyped('');
    setTypedError(null);
    inputRef.current?.focus();
  }

  return (
    <div>
      <PrivacyBanner />
      <div className="px-6 py-8 sm:px-10 sm:py-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-8 h-8" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight">
              {ASSISTANT_NAME[chromeLang]}
            </h1>
            <p className="text-base text-ink-muted mt-1">
              {chromeLang === 'ar'
                ? 'اكتب سؤالًا جديدًا أسفل الصفحة لمتابعة الحوار.'
                : 'Type another question at the bottom to continue the conversation.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/assistant')}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl text-base font-semibold bg-surface-2 text-ink border border-border-soft hover:bg-border-soft transition"
          >
            <Arrow className="w-5 h-5" />
            <span>{chromeLang === 'ar' ? 'عودة للمساعد' : 'Back to assistant'}</span>
          </button>
        </div>

        {/* Conversation thread */}
        <div className="flex flex-col gap-5 mb-6">
          {turns.map((turn) => (
            <div
              key={turn.id}
              className="bg-surface border border-border-soft rounded-3xl p-7 sm:p-8 animate-fade-in"
            >
              <IntentResponseCard
                intent={turn.intent}
                recognizedText={turn.userQuery}
                replyLang={uiLang}
                onRetry={onRetry}
              />
            </div>
          ))}
          <div ref={threadEndRef} />
        </div>

        {/* Follow-up input */}
        <div className="bg-surface border border-border-soft rounded-3xl p-5 sticky bottom-4">
          <label
            htmlFor="assistant-followup"
            className="flex items-center gap-2 text-sm font-semibold text-ink-muted mb-3"
          >
            <TypeIcon className="w-4 h-4" />
            <span>
              {chromeLang === 'ar' ? 'سؤال جديد' : 'Ask another question'}
            </span>
          </label>
          <div className="flex items-stretch gap-3">
            <input
              id="assistant-followup"
              ref={inputRef}
              value={typed}
              onChange={(e) => {
                setTyped(e.target.value);
                if (typedError) setTypedError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  submit();
                }
              }}
              disabled={submitting}
              placeholder={TEXT_INPUT_PLACEHOLDER[chromeLang]}
              aria-invalid={typedError ? 'true' : 'false'}
              className={`flex-1 h-[60px] px-5 rounded-2xl bg-surface-2 border text-lg placeholder:text-ink-subtle focus:outline-none focus:bg-surface focus:shadow-focus text-ink disabled:opacity-60 ${
                typedError ? 'border-danger/60' : 'border-border-soft'
              }`}
            />
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              aria-label={ASK_BUTTON[chromeLang]}
              className="h-[60px] px-7 rounded-2xl bg-primary text-white text-lg font-semibold hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : null}
              <span>{ASK_BUTTON[chromeLang]}</span>
              {!submitting && <Arrow className="w-5 h-5" />}
            </button>
          </div>
          {typedError && (
            <p
              role="alert"
              className="mt-2 text-sm font-semibold text-danger flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" />
              {typedError}
            </p>
          )}
          {submitting && (
            <p className="mt-2 text-sm font-semibold text-ink-muted">
              {VOICE_STATE_COPY.processing[chromeLang]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
