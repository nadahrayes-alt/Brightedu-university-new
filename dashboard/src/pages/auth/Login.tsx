import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { useT, useToast } from '../../context';
import { useAuth } from '../../auth';
import { Button } from '../../components/ui/Button';
import { AuthShell } from './AuthShell';

interface LocState { from?: { pathname: string } }

export function Login() {
  const t = useT();
  const toast = useToast();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocState | null)?.from?.pathname ?? '/';

  const [email, setEmail] = useState('munira@kau.edu.sa');
  const [password, setPassword] = useState('demo1234');
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const r = auth.signIn(email, password);
      setSubmitting(false);
      if (!r.ok) {
        toast(t(r.reason === 'required' ? 'auth.toast.required' : 'auth.toast.invalid'), 'error');
        return;
      }
      toast(t('auth.toast.signedIn'), 'success');
      navigate(from, { replace: true });
    }, 350);
  };

  const onSso = () => {
    setSsoLoading(true);
    // Simulate university SSO redirect → callback
    setTimeout(() => {
      auth.signIn('munira.alotaibi@kau.edu.sa', 'sso-session');
      setSsoLoading(false);
      toast(t('auth.toast.signedIn'), 'success');
      navigate(from, { replace: true });
    }, 700);
  };

  return (
    <AuthShell
      title={t('auth.login.title')}
      subtitle={t('auth.login.subtitle')}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          icon={<Mail className="w-4 h-4" />}
          label={t('auth.fields.email')}
          placeholder={t('auth.fields.email.ph')}
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <Field
          icon={<Lock className="w-4 h-4" />}
          label={t('auth.fields.password')}
          placeholder={t('auth.fields.password.ph')}
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 cursor-pointer text-ink-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            {t('auth.remember')}
          </label>
          <Link to="/forgot-password" className="text-primary-700 dark:text-primary hover:underline">
            {t('auth.forgot.link')}
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" block iconStart={<LogIn className="w-4 h-4" />} disabled={submitting}>
          {submitting ? '…' : t('auth.btn.login')}
        </Button>

        <Divider t={t('auth.divider')} />

        <Button
          type="button"
          variant="secondary"
          size="lg"
          block
          iconStart={<ShieldCheck className="w-4 h-4" />}
          onClick={onSso}
          disabled={ssoLoading || submitting}
        >
          {ssoLoading ? '…' : t('auth.btn.sso')}
        </Button>

        <div className="text-[11px] text-ink-subtle text-center mt-3 leading-relaxed">{t('auth.demoHint')}</div>
      </form>
    </AuthShell>
  );
}

function Field({
  icon, label, placeholder, type = 'text', value, onChange, autoComplete,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink mb-1.5 block">{label}</span>
      <span className="relative block">
        <span className="absolute top-1/2 -translate-y-1/2 start-3 text-ink-muted">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full h-11 bg-surface-2 border border-border-soft rounded-xl ps-10 pe-3 text-sm focus:outline-none focus:bg-surface focus:shadow-focus text-ink placeholder:text-ink-subtle"
        />
      </span>
    </label>
  );
}

function Divider({ t }: { t: string }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-border-soft" />
      <span className="text-xs text-ink-subtle">{t}</span>
      <div className="flex-1 h-px bg-border-soft" />
    </div>
  );
}
