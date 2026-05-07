import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserPlus } from 'lucide-react';
import { useT, useToast } from '../../context';
import { useAuth } from '../../auth';
import { Button } from '../../components/ui/Button';
import { AuthShell } from './AuthShell';

export function Signup() {
  const t = useT();
  const toast = useToast();
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const r = auth.signUp({ email, password, confirm, fullName });
      setSubmitting(false);
      if (!r.ok) {
        toast(t(r.reason === 'mismatch' ? 'auth.toast.mismatch' : 'auth.toast.required'), 'error');
        return;
      }
      toast(t('auth.toast.created'), 'success');
      navigate('/', { replace: true });
    }, 350);
  };

  return (
    <AuthShell
      title={t('auth.signup.title')}
      subtitle={t('auth.signup.subtitle')}
      footer={
        <Link to="/login" className="text-primary-700 dark:text-primary hover:underline">
          {t('auth.login.link')}
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field icon={<UserIcon className="w-4 h-4" />} label={t('auth.fields.fullName')} placeholder={t('auth.fields.fullName.ph')} value={fullName} onChange={setFullName} />
        <Field icon={<Mail     className="w-4 h-4" />} label={t('auth.fields.email')}    placeholder={t('auth.fields.email.ph')}    type="email" value={email}    onChange={setEmail} />
        <Field icon={<Lock     className="w-4 h-4" />} label={t('auth.fields.password')} placeholder={t('auth.fields.password.ph')} type="password" value={password} onChange={setPassword} />
        <Field icon={<Lock     className="w-4 h-4" />} label={t('auth.fields.confirm')}  placeholder={t('auth.fields.password.ph')} type="password" value={confirm}  onChange={setConfirm} />

        <Button type="submit" variant="primary" size="lg" block iconStart={<UserPlus className="w-4 h-4" />} disabled={submitting}>
          {submitting ? '…' : t('auth.btn.signup')}
        </Button>

        <div className="text-[11px] text-ink-subtle text-center mt-2 leading-relaxed">{t('auth.demoHint')}</div>
      </form>
    </AuthShell>
  );
}

function Field({
  icon, label, placeholder, type = 'text', value, onChange,
}: { icon: React.ReactNode; label: string; placeholder?: string; type?: string; value: string; onChange: (v: string) => void }) {
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
          className="w-full h-11 bg-surface-2 border border-border-soft rounded-xl ps-10 pe-3 text-sm focus:outline-none focus:bg-surface focus:shadow-focus text-ink placeholder:text-ink-subtle"
        />
      </span>
    </label>
  );
}
