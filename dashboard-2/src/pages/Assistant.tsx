import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mic, MicOff, Sparkles, ArrowLeft, ArrowRight, Type as TypeIcon,
  Building2, Map, Clock, FileText, Users, CalendarDays,
  GraduationCap, ShieldCheck, AlertCircle, Loader2, CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { IntentResponseCard } from '../components/board/IntentResponseCard';
import {
  ASSISTANT_HINT, ASSISTANT_NAME, ASSISTANT_TAGLINE,
  QUICK_ACTIONS_HEADER, RECOGNITION_PREFIX, TEXT_INPUT_PLACEHOLDER,
  ASK_BUTTON, TYPE_FALLBACK_CTA, VOICE_STATE_COPY,
} from '../agent/assistantResponses';
import {
  AMBIGUOUS_INTENT, DEMO_PHRASES_AR, DEMO_PHRASES_EN, INTENT_BY_ID,
} from '../agent/intents';
import type { IntentDef } from '../agent/intents';
import { matchIntent } from '../agent/agentRouter';

/**
 * Smart Campus Assistant — voice-first kiosk surface.
 *
 * Mic flow: ready → listening → processing → recognised → responding.
 * The recognised intent is rendered inline below the mic stage via the shared
 * `IntentResponseCard`, so voice, text fallback, and quick-action chips all
 * traverse the exact same agent router code.
 *
 * No real speech recognition runs in the kiosk demo. The mic tap cycles
 * through a curated demo phrase set; each phrase is fed back through the real
 * matcher so the recognition path itself is exercised.
 */

type VoiceState = 'ready' | 'listening' | 'processing' | 'understood' | 'responding';
type RecognitionSource = 'voice' | 'text' | 'quick';

interface QuickActionDef {
  intentId: string;
  icon: LucideIcon;
  ar: string;
  en: string;
  color: 'primary' | 'teal' | 'warning' | 'privacy' | 'success' | 'danger';
}

/** Quick actions on the assistant home — every chip fires the same agent
 *  router as voice/text, so privacy logic is identical across input modes. */
const QUICK_ACTIONS: QuickActionDef[] = [
  { intentId: 'student-affairs-location', icon: Building2,    ar: 'وين شؤون الطلبة؟',  en: 'Where is Student Affairs?', color: 'primary' },
  { intentId: 'show-campus-map',          icon: Map,          ar: 'عرض الخريطة',        en: 'Show campus map',          color: 'teal' },
  { intentId: 'service-hours',            icon: Clock,        ar: 'مواعيد الخدمات',     en: 'Service hours',            color: 'success' },
  { intentId: 'document-pickup-info',     icon: FileText,     ar: 'استلام الوثائق',     en: 'Document pickup',          color: 'privacy' },
  { intentId: 'queue-status',             icon: Users,        ar: 'حالة الانتظار',      en: 'Queue status',             color: 'warning' },
  { intentId: 'events-today',             icon: CalendarDays, ar: 'الفعاليات اليوم',    en: "Today's events",           color: 'danger' },
  { intentId: 'enrollment-letter',        icon: GraduationCap, ar: 'إصدار إثبات قيد',  en: 'Issue enrollment letter',  color: 'privacy' },
  { intentId: 'request-status',           icon: ShieldCheck,  ar: 'حالة طلبي',          en: 'My request status',        color: 'privacy' },
];

const COLOR_CLASSES: Record<QuickActionDef['color'], string> = {
  primary: 'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30',
  teal:    'bg-teal/15 dark:bg-teal/20 text-teal border-teal/30',
  warning: 'bg-warning/15 dark:bg-warning/20 text-warning border-warning/30',
  privacy: 'bg-privacy/10 dark:bg-privacy/20 text-privacy border-privacy/30',
  success: 'bg-success/15 dark:bg-success/20 text-success border-success/30',
  danger:  'bg-danger/15 dark:bg-danger/20 text-danger border-danger/30',
};

export function Assistant() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [voiceState, setVoiceState] = useState<VoiceState>('ready');
  /** Recognised intent (or null while we're still listening). */
  const [intent, setIntent] = useState<IntentDef | null>(null);
  /** Verbatim phrase to show under "I understood you want:" */
  const [recognized, setRecognized] = useState<string>('');
  const [showTyping, setShowTyping] = useState(false);
  const [typed, setTyped] = useState('');
  /** Inline validation message under the typing input (e.g. "type something
   *  first"). Cleared on next keystroke or successful submit. */
  const [typedError, setTypedError] = useState<string | null>(null);

  /** Cycles through demo phrases each time the mic is tapped without input. */
  const sampleCursor = useRef(0);
  const timers = useRef<number[]>([]);

  const samplePool = useMemo(
    () => (lang === 'ar' ? DEMO_PHRASES_AR : DEMO_PHRASES_EN),
    [lang],
  );

  function clearTimers() {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }
  useEffect(() => clearTimers, []);

  /** Pick up `?q=...` from any callers that route back to the assistant
   *  surface (e.g. the standalone AssistantInput on legacy pages). The query
   *  fires the same inline recognition flow as in-page typing — never opens
   *  a separate chat page. */
  useEffect(() => {
    const q = searchParams.get('q');
    if (!q) return;
    // Strip the param so a later refresh doesn't replay the recognition.
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next, { replace: true });
    runRecognition(q, 'text');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetFlow() {
    clearTimers();
    setVoiceState('ready');
    setIntent(null);
    setRecognized('');
    setTypedError(null);
  }

  /** Drive the listening → processing → understood → responding sequence
   *  for a chosen utterance. The matcher always runs, so voice, text, and
   *  quick actions all traverse the same recognition path.
   *
   *  When the source is `voice` and the resolved intent has `voiceDirect`
   *  set (explicit navigation commands like "افتح الخريطة"), the assistant
   *  flashes the recognition for a beat and then navigates straight to the
   *  target route — no chat card. Typed input ALWAYS shows the chat card so
   *  the user can review the recognised request before any navigation. */
  function runRecognition(
    utterance: string,
    source: RecognitionSource,
    fallbackIntentId?: string,
  ) {
    clearTimers();
    setVoiceState('listening');
    setIntent(null);
    setRecognized('');

    // Text input is conversational from the first frame — skip the simulated
    // listening/processing animation that's only meaningful for voice.
    const listenMs    = source === 'voice' ? 1400 : 200;
    const processMs   = source === 'voice' ? 2700 : 500;
    const respondMs   = source === 'voice' ? 3500 : 700;

    timers.current.push(window.setTimeout(() => setVoiceState('processing'), listenMs));
    timers.current.push(
      window.setTimeout(() => {
        const match = matchIntent(utterance);
        const resolved =
          match.intent.id !== AMBIGUOUS_INTENT.id
            ? match.intent
            : fallbackIntentId
              ? INTENT_BY_ID[fallbackIntentId] ?? AMBIGUOUS_INTENT
              : AMBIGUOUS_INTENT;

        setRecognized(utterance);
        setIntent(resolved);
        setVoiceState('understood');

        // Voice direct-navigation: brief recognition flash, then navigate.
        // Quick actions follow voice rules per the spec ("quick actions should
        // behave exactly like recognised voice intents") — none of the
        // assistant-home quick actions are flagged voiceDirect today, but the
        // rule keeps the two paths aligned. Typed input NEVER auto-navigates.
        if (
          source !== 'text' &&
          resolved.voiceDirect &&
          resolved.voiceDirectRoute
        ) {
          const t = window.setTimeout(() => {
            navigate(resolved.voiceDirectRoute!);
          }, 900);
          timers.current.push(t);
          return;
        }
      }, processMs),
    );
    timers.current.push(window.setTimeout(() => setVoiceState('responding'), respondMs));
  }

  function onMicTap() {
    if (voiceState === 'listening' || voiceState === 'processing' || voiceState === 'understood') {
      resetFlow();
      return;
    }
    const next = samplePool[sampleCursor.current % samplePool.length];
    sampleCursor.current += 1;
    runRecognition(next.text, 'voice', next.intentId);
  }

  function submitTyped() {
    const q = typed.trim();
    if (!q) {
      setTypedError(
        lang === 'ar'
          ? 'اكتب سؤالك أولًا أو استخدم المايك.'
          : 'Type your question first or use the microphone.',
      );
      return;
    }
    setTypedError(null);
    // Keep `typed` populated so the input still reflects what the user asked
    // while the recognition flow runs.
    runRecognition(q, 'text');
  }

  function fireQuickAction(qa: QuickActionDef) {
    const text = lang === 'ar' ? qa.ar : qa.en;
    // Quick actions render a chat-style response with action chips so the
    // user can review and choose, identical to typed input.
    runRecognition(text, 'quick', qa.intentId);
  }

  /* ────────────────────  derived UI strings (lang)  ─────────────────────── */

  const micLabel = (() => {
    switch (voiceState) {
      case 'listening':  return VOICE_STATE_COPY.listening[lang];
      case 'processing': return VOICE_STATE_COPY.processing[lang];
      case 'understood': return lang === 'ar' ? 'فهمت طلبك' : 'Got it';
      case 'responding': return lang === 'ar' ? 'اضغط لطرح سؤال آخر' : 'Tap to ask another question';
      default:           return VOICE_STATE_COPY.ready[lang];
    }
  })();

  const micHint = (() => {
    switch (voiceState) {
      case 'listening':
        return lang === 'ar'
          ? 'تحدث الآن — تقدر تسأل عن المباني، الخدمات، أو حالة طلبك.'
          : 'Speak now — ask about buildings, services, or your request.';
      case 'processing':
        return lang === 'ar' ? 'لحظة واحدة...' : 'One moment...';
      case 'understood':
        return lang === 'ar' ? 'جاري عرض الإجابة' : 'Preparing the answer';
      case 'responding':
        return lang === 'ar'
          ? 'الإجابة جاهزة بالأسفل. تقدر تتابع أو تسأل من جديد.'
          : 'Answer ready below — follow up or ask again.';
      default:
        return ASSISTANT_HINT[lang];
    }
  })();

  return (
    <div>
      <PrivacyBanner />
      <div className="px-6 py-8 sm:px-10 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-9 h-9" />
          </span>
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight">
              {ASSISTANT_NAME[lang]}
            </h1>
            <p className="text-lg text-ink-muted mt-1">
              {ASSISTANT_TAGLINE[lang]}
            </p>
          </div>
        </div>

        {/* Mic stage + Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 xl:gap-8 mb-10">
          <section
            aria-live="polite"
            className="xl:col-span-3 bg-surface border border-border-soft rounded-3xl p-8 sm:p-12 flex flex-col items-center text-center"
          >
            <MicStage
              state={voiceState}
              onTap={onMicTap}
              lang={lang}
              label={micLabel}
              hint={micHint}
            />

            {/* Recognition confirmation — visible while we're showing the answer. */}
            {(voiceState === 'understood' || voiceState === 'responding') && recognized && (
              <div className="mt-7 max-w-2xl w-full bg-success/10 dark:bg-success/15 border border-success/30 rounded-2xl px-5 py-4 flex items-start gap-3 animate-fade-in text-start">
                <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-sm font-bold uppercase tracking-wider text-success mb-1">
                    {RECOGNITION_PREFIX[lang]}
                  </div>
                  <div className="text-xl text-ink font-semibold leading-snug">
                    {recognized}
                  </div>
                </div>
              </div>
            )}

            {/* Text fallback. The input stays mounted across all voice states
             *  so the user can SEE the loading / recognised / responding flow
             *  beneath the input — clicking Ask never makes the surface vanish. */}
            {!showTyping ? (
              <button
                type="button"
                onClick={() => setShowTyping(true)}
                className="mt-6 inline-flex items-center gap-2 h-12 px-5 rounded-2xl text-base font-semibold text-ink-muted hover:text-ink hover:bg-surface-2 transition"
              >
                <TypeIcon className="w-5 h-5" />
                <span>{TYPE_FALLBACK_CTA[lang]}</span>
              </button>
            ) : (
              <div className="mt-6 w-full max-w-2xl">
                <div className="flex items-stretch gap-3">
                  <input
                    autoFocus
                    value={typed}
                    onChange={(e) => {
                      setTyped(e.target.value);
                      if (typedError) setTypedError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        submitTyped();
                      }
                    }}
                    disabled={voiceState === 'listening' || voiceState === 'processing'}
                    placeholder={TEXT_INPUT_PLACEHOLDER[lang]}
                    aria-invalid={typedError ? 'true' : 'false'}
                    className={`flex-1 h-[60px] px-5 rounded-2xl bg-surface-2 border text-lg placeholder:text-ink-subtle focus:outline-none focus:bg-surface focus:shadow-focus text-ink disabled:opacity-60 disabled:cursor-not-allowed ${
                      typedError ? 'border-danger/60' : 'border-border-soft'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={submitTyped}
                    disabled={voiceState === 'listening' || voiceState === 'processing'}
                    aria-label={ASK_BUTTON[lang]}
                    className="h-[60px] px-6 rounded-2xl bg-primary text-white text-lg font-semibold hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {voiceState === 'listening' || voiceState === 'processing' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : null}
                    <span>{ASK_BUTTON[lang]}</span>
                    {!(voiceState === 'listening' || voiceState === 'processing') && (
                      <Arrow className="w-5 h-5" />
                    )}
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
                {(voiceState === 'listening' || voiceState === 'processing') && (
                  <p className="mt-2 text-sm font-semibold text-ink-muted">
                    {VOICE_STATE_COPY.processing[lang]}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Quick actions */}
          <aside className="xl:col-span-2">
            <h2 className="text-xl sm:text-2xl font-bold text-ink mb-4">
              {QUICK_ACTIONS_HEADER[lang]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
              {QUICK_ACTIONS.map((q) => {
                const Icon = q.icon;
                return (
                  <button
                    key={q.intentId}
                    onClick={() => fireQuickAction(q)}
                    className="group bg-surface border border-border-soft rounded-3xl p-5 sm:p-6 min-h-[96px] flex items-center gap-4 hover:border-primary/40 active:scale-[0.99] transition text-start"
                  >
                    <span
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex items-center justify-center shrink-0 ${COLOR_CLASSES[q.color]}`}
                    >
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                    </span>
                    <span className="flex-1 min-w-0 text-lg sm:text-xl font-bold text-ink leading-tight">
                      {lang === 'ar' ? q.ar : q.en}
                    </span>
                    <Arrow className="w-5 h-5 text-ink-muted group-hover:text-primary shrink-0" />
                  </button>
                );
              })}
            </div>
          </aside>
        </div>

        {/* Response card — shared across voice / text / quick actions. */}
        {voiceState === 'responding' && intent && (
          <div className="bg-surface border border-border-soft rounded-3xl p-7 sm:p-8 animate-fade-in">
            <IntentResponseCard
              intent={intent}
              recognizedText={recognized}
              onRetry={resetFlow}
            />
          </div>
        )}

        <div className="mt-8 flex">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 h-14 px-5 rounded-2xl text-base font-semibold text-ink-muted hover:text-ink hover:bg-surface-2 transition"
          >
            <Arrow className="w-5 h-5" />
            <span>{lang === 'ar' ? 'الرجوع' : 'Back'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────  Mic stage  ──────────────────────────────── */

function MicStage({
  state, onTap, lang, label, hint,
}: {
  state: VoiceState;
  onTap: () => void;
  lang: 'ar' | 'en';
  label: string;
  hint: string;
}) {
  const isListening  = state === 'listening';
  const isProcessing = state === 'processing';
  const cancelable   = isListening || isProcessing || state === 'understood';

  const ariaLabel = (() => {
    if (cancelable) return lang === 'ar' ? 'إيقاف الاستماع' : 'Stop listening';
    if (state === 'responding') return lang === 'ar' ? 'سؤال جديد' : 'Ask again';
    return lang === 'ar' ? 'بدء الاستماع' : 'Start listening';
  })();

  const Icon = cancelable ? MicOff : Mic;

  return (
    <>
      <div className="relative">
        {isListening && (
          <>
            <span className="absolute inset-0 -m-6 rounded-full bg-primary/20 animate-ping" />
            <span className="absolute inset-0 -m-2 rounded-full bg-primary/30 blur-2xl animate-glow-soft" />
          </>
        )}
        {isProcessing && (
          <span className="absolute inset-0 -m-2 rounded-full bg-warning/30 blur-2xl animate-glow-soft" />
        )}
        <button
          onClick={onTap}
          aria-pressed={isListening}
          aria-label={ariaLabel}
          className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center shrink-0 transition active:scale-[0.98] focus:outline-none focus:shadow-focus ${
            isListening
              ? 'bg-primary text-white shadow-[0_0_80px_-8px_rgba(47,91,255,0.7)]'
              : isProcessing
                ? 'bg-warning text-white shadow-[0_0_60px_-12px_rgba(245,158,11,0.6)]'
                : 'bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/15 dark:hover:bg-primary/25'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-20 h-20 sm:w-24 sm:h-24 animate-spin" strokeWidth={1.8} />
          ) : (
            <Icon className="w-20 h-20 sm:w-24 sm:h-24" strokeWidth={1.8} />
          )}
        </button>
      </div>

      <p className="mt-7 text-2xl sm:text-3xl font-bold text-ink leading-tight">
        {label}
      </p>

      {isListening && <VoiceWave />}

      <p className="mt-2 text-base sm:text-lg text-ink-muted max-w-lg">{hint}</p>
    </>
  );
}

/** A 7-bar voice wave that pulses while the mic is "listening". */
function VoiceWave() {
  const bars = [0, 80, 160, 240, 160, 80, 0];
  return (
    <div className="mt-4 flex items-end justify-center gap-1.5 h-10" aria-hidden>
      {bars.map((delay, i) => (
        <span
          key={i}
          className="w-1.5 bg-primary rounded-full animate-sparkle-twinkle"
          style={{
            height: '100%',
            animationDelay: `${delay}ms`,
            animationDuration: '900ms',
          }}
        />
      ))}
    </div>
  );
}

/** Re-export for code that previously imported the inline ambiguous helper. */
export { AlertCircle as AmbiguousIcon };
