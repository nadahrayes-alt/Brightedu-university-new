import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { useApp, useT, useToast } from '../../context';
import { useAuth } from '../../auth';
import { Button } from '../../components/ui/Button';
import { AuthShell } from './AuthShell';

export function ForgotPassword() {
  const t = useT();
  const toast = useToast();
  const auth = useAuth();
  const navigate = useNavigate();
  const { isRTL } = useApp();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const r = auth.requestReset(email);
      setSubmitting(false);
      if (!r.ok) {
        toast(t('auth.toast.required'), 'error');
        return;
      }
      toast(t('auth.toast.resetSent'), 'success');
      navigate('/login');
    }, 400);
  };

  return (
    <AuthShell
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.subtitle')}
      footer={
        <Link to="/login" className="text-primary-700 dark:text-primary hover:underline inline-flex items-center gap-1.5">
          <BackIcon className="w-4 h-4" />
          {t('auth.back.login')}
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink mb-1.5 block">{t('auth.fields.email')}</span>
          <span className="relative block">
            <span className="absolute top-1/2 -translate-y-1/2 start-3 text-ink-muted">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.fields.email.ph')}
              autoComplete="email"
              className="w-full h-11 bg-surface-2 border border-border-soft rounded-xl ps-10 pe-3 text-sm focus:outline-none focus:bg-surface focus:shadow-focus text-ink placeholder:text-ink-subtle"
            />
          </span>
        </label>

        <Button type="submit" variant="primary" size="lg" block iconStart={<Send className="w-4 h-4" />} disabled={submitting}>
          {submitting ? '…' : t('auth.btn.sendReset')}
        </Button>
      </form>
    </AuthShell>
  );
}
