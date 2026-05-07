import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { PrivacyBanner } from '../components/board/PrivacyBanner';
import { IntentResponseCard } from '../components/board/IntentResponseCard';
import { ASSISTANT_NAME } from '../agent/assistantResponses';
import { getIntent } from '../agent/agentRouter';

/**
 * Deep-link page for a single intent. Reached when an action button or
 * suggestion uses the `#intent:<id>` shortcut, or when the user enters
 * `/assistant/intent/<id>` directly.
 *
 * Keeps the same `IntentResponseCard` the inline assistant flow uses, so the
 * privacy logic and CTAs stay identical regardless of how the intent was
 * reached.
 */
export function AssistantIntent() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const { intentId } = useParams<{ intentId: string }>();
  const intent = getIntent(intentId ?? 'ambiguous');
  const Arrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div>
      <PrivacyBanner />
      <div className="px-6 py-8 sm:px-10 sm:py-12">
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-8 h-8" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight">
              {ASSISTANT_NAME[lang]}
            </h1>
            <p className="text-base text-ink-muted mt-1">
              {lang === 'ar'
                ? 'هذي إجابة المساعد على طلبك. يمكنك الرجوع وطرح سؤال جديد بالصوت.'
                : "Here's the assistant's response. Go back to ask another question by voice."}
            </p>
          </div>
          <button
            onClick={() => navigate('/assistant')}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl text-base font-semibold bg-primary text-white hover:bg-primary-600 transition"
          >
            <Sparkles className="w-5 h-5" />
            <span>{lang === 'ar' ? 'سؤال جديد' : 'Ask again'}</span>
          </button>
        </div>

        <div className="bg-surface border border-border-soft rounded-3xl p-7 sm:p-8 animate-fade-in">
          <IntentResponseCard
            intent={intent}
            onRetry={() => navigate('/assistant')}
          />
        </div>

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
