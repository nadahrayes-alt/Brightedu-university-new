import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mic, MicOff, Sparkles, ArrowLeft, ArrowRight, Type as TypeIcon,
  Building2, Map, Clock, FileText, Users, CalendarDays,
  GraduationCap, ShieldCheck, AlertCircle, Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import {
  ASSISTANT_HINT, ASSISTANT_NAME, ASSISTANT_TAGLINE,
  QUICK_ACTIONS_HEADER, TEXT_INPUT_PLACEHOLDER,
  ASK_BUTTON, TYPE_FALLBACK_CTA, VOICE_STATE_COPY,
} from '../agent/assistantResponses';
import { DEMO_PHRASES_AR, DEMO_PHRASES_EN } from '../agent/intents';
import { matchIntent } from '../agent/agentRouter';

/**
 * Smart Campus Assistant — voice-first kiosk surface.
 *
 * The assistant home is the entry point only. Every input mode (voice mic,
 * text fallback, quick action chip) resolves the intent through the same
 * matcher and then navigates to the chat screen at
 * `/assistant/intent/<intentId>?q=<utterance>`, where the response card and
 * follow-up thread live.
 *
 * Voice keeps a brief listening / processing animation on this page so the
 * kiosk feels responsive; once the recogniser settles, control hands off to
 * the chat screen.
 *
 * No real speech recognition runs in the demo — the mic tap cycles through a
 * curated demo phrase set, each phrase fed back through the real matcher.
 */

type VoiceState = 'ready' | 'listening' | 'processing';

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
  { intentId: 'document-pickup-info',     icon: FileText,     ar: 'استلام الوثائق',     en: 'Document pickup',          color: 'primary' },
  { intentId: 'queue-status',             icon: Users,        ar: 'حالة الانتظار',      en: 'Queue status',             color: 'warning' },
  { intentId: 'events-today',             icon: CalendarDays, ar: 'الفعاليات اليوم',    en: "Today's events",           color: 'danger' },
  { intentId: 'enrollment-letter',        icon: GraduationCap, ar: 'إصدار إثبات قيد',  en: 'Issue enrollment letter',  color: 'primary' },
  { intentId: 'request-status',           icon: ShieldCheck,  ar: 'حالة طلبي',          en: 'My request status',        color: 'primary' },
];

const COLOR_CLASSES: Record<QuickActionDef['color'], string> = {
  primary: 'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30',
  teal:    'bg-teal/15 dark:bg-teal/20 text-teal border-teal/30',
  warning: 'bg-warning/15 dark:bg-warning/20 text-warning border-warning/30',
  privacy: 'bg-primary/10 dark:bg-primary/20 text-primary border-primary/30',
  success: 'bg-success/15 dark:bg-success/20 text-success border-success/30',
  danger:  'bg-danger/15 dark:bg-danger/20 text-danger border-danger/30',
};

export function Assistant() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [voiceState, setVoiceState] = useState<VoiceState>('ready');
  const [showTyping, setShowTyping] = useState(false);
  const [typed, setTyped] = useState('');
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

  /** Pick up `?q=...` from any callers that route back to /assistant
   *  (e.g. legacy pages). Resolves the intent and forwards to the chat
   *  screen so the response is rendered in the conversational thread. */
  useEffect(() => {
    const q = searchParams.get('q');
    if (!q) return;
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    setSearchParams(next, { replace: true });
    const match = matchIntent(q, lang);
    navigate(`/assistant/intent/${match.intent.id}?q=${encodeURIComponent(q)}`, {
      replace: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Resolve `utterance` → matched intent and hand control to the chat
   *  screen. Voice direct-navigation intents (`افتح الخريطة`, etc.) bypass
   *  the chat and route straight to their target page. */
  function routeToChat(utterance: string, source: 'voice' | 'text' | 'quick') {
    const match = matchIntent(utterance, lang);
    if (
      source !== 'text' &&
      match.intent.voiceDirect &&
      match.intent.voiceDirectRoute
    ) {
      navigate(match.intent.voiceDirectRoute);
      return;
    }
    navigate(`/assistant/intent/${match.intent.id}?q=${encodeURIComponent(utterance)}`);
  }

  function onMicTap() {
    if (voiceState === 'listening' || voiceState === 'processing') {
      // Cancel an in-flight recognition.
      clearTimers();
      setVoiceState('ready');
      return;
    }
    const next = samplePool[sampleCursor.current % samplePool.length];
    sampleCursor.current += 1;

    clearTimers();
    setVoiceState('listening');
    timers.current.push(window.setTimeout(() => setVoiceState('processing'), 1400));
    timers.current.push(
      window.setTimeout(() => {
        // Hand off to the chat screen with the recognised utterance.
        routeToChat(next.text, 'voice');
        setVoiceState('ready');
      }, 2700),
    );
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
    routeToChat(q, 'text');
  }

  function fireQuickAction(qa: QuickActionDef) {
    const text = lang === 'ar' ? qa.ar : qa.en;
    routeToChat(text, 'quick');
  }

  /* ────────────────────  derived UI strings (lang)  ─────────────────────── */

  const micLabel = (() => {
    switch (voiceState) {
      case 'listening':  return VOICE_STATE_COPY.listening[lang];
      case 'processing': return VOICE_STATE_COPY.processing[lang];
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

            {/* Text fallback. The input stays mounted so the user always has
             *  the option to type. Submitting routes to the chat screen. */}
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
                    placeholder={TEXT_INPUT_PLACEHOLDER[lang]}
                    aria-invalid={typedError ? 'true' : 'false'}
                    className={`flex-1 h-[60px] px-5 rounded-2xl bg-surface-2 border text-lg placeholder:text-ink-subtle focus:outline-none focus:bg-surface focus:shadow-focus text-ink ${
                      typedError ? 'border-danger/60' : 'border-border-soft'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={submitTyped}
                    aria-label={ASK_BUTTON[lang]}
                    className="h-[60px] px-6 rounded-2xl bg-primary text-white text-lg font-semibold hover:bg-primary-600 flex items-center justify-center gap-2"
                  >
                    <span>{ASK_BUTTON[lang]}</span>
                    <Arrow className="w-5 h-5" />
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
  const cancelable   = isListening || isProcessing;

  const ariaLabel = cancelable
    ? (lang === 'ar' ? 'إيقاف الاستماع' : 'Stop listening')
    : (lang === 'ar' ? 'بدء الاستماع'   : 'Start listening');

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
          <span className="absolute inset-0 -m-2 rounded-full bg-primary/30 blur-2xl animate-glow-soft" />
        )}
        <button
          onClick={onTap}
          aria-pressed={isListening}
          aria-label={ariaLabel}
          className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center shrink-0 transition active:scale-[0.98] focus:outline-none focus:shadow-focus ${
            isListening
              ? 'bg-primary text-white shadow-[0_0_80px_-8px_rgba(47,91,255,0.7)]'
              : isProcessing
                ? 'bg-primary text-white shadow-[0_0_60px_-12px_rgba(47,91,255,0.6)]'
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
