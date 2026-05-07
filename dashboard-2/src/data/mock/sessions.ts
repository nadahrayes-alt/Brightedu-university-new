// QR session lifecycle, simulated entirely in memory.
// The kiosk creates a session, displays a QR with `session_id` in the URL,
// and polls for status. The "phone side" (mocked) claims it after Nafath auth.

import type { DocType } from './documents';

export type SessionStatus =
  | 'pending'      // QR shown, waiting for scan
  | 'scanning'     // phone hit the URL, auth in progress
  | 'claimed'      // Nafath returned, student identified
  | 'completed'    // request finalized on phone
  | 'expired'      // 5-min timer ran out
  | 'cancelled';   // user pressed "إلغاء" on kiosk

export interface KioskSession {
  id: string;
  /** What the user asked for at the kiosk. */
  intent: { type: 'document'; docType: DocType } | { type: 'sensitive'; reason: string };
  /** Which kiosk issued it. */
  kioskId: string;
  status: SessionStatus;
  /** ISO timestamps. */
  createdAt: string;
  expiresAt: string;
  /** Set when status becomes 'claimed' — the verified student. */
  claimedByNationalId?: string;
  /** Last status change reason (for the demo trace). */
  lastEvent?: string;
}

const STORE = new Map<string, KioskSession>();
const LISTENERS = new Set<() => void>();

function emit() { LISTENERS.forEach((fn) => fn()); }

function uid() {
  // Short, readable ids for the demo.
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);
}

export function createSession(intent: KioskSession['intent'], kioskId = 'KAU-04-01'): KioskSession {
  const now = new Date();
  const s: KioskSession = {
    id: uid(),
    intent,
    kioskId,
    status: 'pending',
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 5 * 60 * 1000).toISOString(),
    lastEvent: 'تم إنشاء الجلسة وعرض QR',
  };
  STORE.set(s.id, s);
  emit();
  return s;
}

export function getSession(id: string): KioskSession | undefined {
  return STORE.get(id);
}

export function listSessions(): KioskSession[] {
  return [...STORE.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Phone side: simulate a successful Nafath claim. */
export function claimSession(id: string, nationalId: string): KioskSession | undefined {
  const s = STORE.get(id);
  if (!s || s.status !== 'pending') return s;
  s.status = 'claimed';
  s.claimedByNationalId = nationalId;
  s.lastEvent = `تم التحقق عبر النفاذ الموحد (${nationalId})`;
  emit();
  return s;
}

export function completeSession(id: string): KioskSession | undefined {
  const s = STORE.get(id);
  if (!s) return s;
  s.status = 'completed';
  s.lastEvent = 'اكتمل الطلب من الجوال';
  emit();
  return s;
}

export function cancelSession(id: string): KioskSession | undefined {
  const s = STORE.get(id);
  if (!s) return s;
  s.status = 'cancelled';
  s.lastEvent = 'ألغى المستخدم الجلسة من اللوحة';
  emit();
  return s;
}

export function expireSession(id: string): KioskSession | undefined {
  const s = STORE.get(id);
  if (!s || s.status !== 'pending') return s;
  s.status = 'expired';
  s.lastEvent = 'انتهت صلاحية الرمز';
  emit();
  return s;
}

/** Subscribe to any change in the session store. */
export function subscribe(fn: () => void): () => void {
  LISTENERS.add(fn);
  return () => { LISTENERS.delete(fn); };
}
