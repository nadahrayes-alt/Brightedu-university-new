import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface AuthUser {
  email: string;
  name: string;
  initials: string;
  roleLabelAr: string;
  roleLabelEn: string;
}

interface AuthCtx {
  user: AuthUser | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => { ok: true } | { ok: false; reason: 'invalid' | 'required' };
  signUp: (data: { email: string; password: string; confirm: string; fullName: string }) => { ok: true } | { ok: false; reason: 'required' | 'mismatch' };
  requestReset: (email: string) => { ok: true } | { ok: false; reason: 'required' };
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const LS_KEY = 'be.auth';

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function load(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch { return null; }
}

function save(u: AuthUser | null) {
  if (typeof window === 'undefined') return;
  if (u) localStorage.setItem(LS_KEY, JSON.stringify(u));
  else   localStorage.removeItem(LS_KEY);
}

function nameFromEmail(email: string) {
  const local = email.split('@')[0] ?? 'User';
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(load);

  useEffect(() => { save(user); }, [user]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      isAuthenticated: !!user,
      signIn(email, password) {
        if (!email.trim() || !password.trim()) return { ok: false, reason: 'required' };
        if (password.length < 4) return { ok: false, reason: 'invalid' };
        const name = nameFromEmail(email);
        setUser({
          email: email.trim(),
          name,
          initials: getInitials(name),
          roleLabelAr: 'موظف شؤون طلبة',
          roleLabelEn: 'Affairs Staff',
        });
        return { ok: true };
      },
      signUp({ email, password, confirm, fullName }) {
        if (!email.trim() || !password || !fullName.trim()) return { ok: false, reason: 'required' };
        if (password !== confirm) return { ok: false, reason: 'mismatch' };
        setUser({
          email: email.trim(),
          name: fullName.trim(),
          initials: getInitials(fullName),
          roleLabelAr: 'موظف شؤون طلبة',
          roleLabelEn: 'Affairs Staff',
        });
        return { ok: true };
      },
      requestReset(email) {
        if (!email.trim()) return { ok: false, reason: 'required' };
        return { ok: true };
      },
      signOut() {
        setUser(null);
      },
    }),
    [user],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('AuthProvider missing');
  return v;
}
