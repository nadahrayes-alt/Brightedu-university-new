import { Mic, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../lib/AppContext';
import {
  ASK_BUTTON, TEXT_INPUT_PLACEHOLDER,
} from '../../agent/assistantResponses';

/**
 * Text fallback input. Always returns the user to the main Assistant screen
 * — the kiosk has a single conversational surface, not a separate chat page.
 *
 * Submitting routes to `/assistant?q=<query>`; the Assistant page reads the
 * query on mount and runs the standard recognition flow inline (same code
 * path as voice and quick actions). The mic remains the primary affordance.
 */
export function AssistantInput({ autofocus = false }: { autofocus?: boolean }) {
  const { lang } = useApp();
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  function send() {
    const q = value.trim();
    if (!q) return;
    navigate(`/assistant?q=${encodeURIComponent(q)}`);
  }

  const SendIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="flex items-stretch gap-3">
      <input
        autoFocus={autofocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        placeholder={TEXT_INPUT_PLACEHOLDER[lang]}
        className="flex-1 h-[72px] px-6 rounded-2xl bg-surface-2 border border-border-soft text-xl placeholder:text-ink-subtle focus:outline-none focus:bg-surface focus:shadow-focus text-ink"
      />
      <button
        aria-label={lang === 'ar' ? 'تحدث' : 'Speak'}
        onClick={() => navigate('/assistant')}
        className="w-[72px] h-[72px] rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/15 dark:hover:bg-primary/25 flex items-center justify-center"
      >
        <Mic className="w-8 h-8" />
      </button>
      <button
        onClick={send}
        className="h-[72px] min-w-[200px] px-7 rounded-2xl bg-primary text-white text-xl font-semibold hover:bg-primary-600 flex items-center justify-center gap-3"
      >
        <span>{ASK_BUTTON[lang]}</span>
        <SendIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
