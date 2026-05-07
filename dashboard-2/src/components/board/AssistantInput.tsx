import { Mic, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../lib/AppContext';
import { REFUSAL_TRIGGERS } from '../../data/services';

export function AssistantInput({ autofocus = false }: { autofocus?: boolean }) {
  const { lang } = useApp();
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  function send() {
    const q = value.trim();
    if (!q) return;
    if (REFUSAL_TRIGGERS.some((t) => q.includes(t.split(' ')[0]) || q.includes(t))) {
      navigate('/refusal');
      return;
    }
    if (q.includes('وثيقة تخرج') || q.toLowerCase().includes('graduation')) {
      navigate('/request/graduation');
      return;
    }
    if (q.includes('شؤون الطلبة')) {
      navigate('/assistant/answer/student-affairs');
      return;
    }
    navigate('/assistant');
  }

  const SendIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="flex items-stretch gap-3">
      <input
        autoFocus={autofocus}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && send()}
        placeholder={lang === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question...'}
        className="flex-1 h-[72px] px-6 rounded-2xl bg-surface-2 border border-border-soft text-xl placeholder:text-ink-subtle focus:outline-none focus:bg-surface focus:shadow-focus text-ink"
      />
      <button
        aria-label={lang === 'ar' ? 'تحدث' : 'Speak'}
        className="w-[72px] h-[72px] rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/15 dark:hover:bg-primary/25 flex items-center justify-center"
      >
        <Mic className="w-8 h-8" />
      </button>
      <button
        onClick={send}
        className="h-[72px] min-w-[200px] px-7 rounded-2xl bg-primary text-white text-xl font-semibold hover:bg-primary-600 flex items-center justify-center gap-3"
      >
        <span>{lang === 'ar' ? 'اسأل' : 'Ask'}</span>
        <SendIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
