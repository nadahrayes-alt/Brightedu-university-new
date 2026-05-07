// Central in-memory mock backend. Components talk to this instead of fetch().
// Swap with real fetch() against your API once it exists.

import type { DocType } from './documents';
import { DOC_TYPES, SAMPLE_REQUESTS } from './documents';
import type { Student } from './students';
import { STUDENTS, findStudentByNationalId } from './students';
import {
  createSession, getSession, listSessions, claimSession, completeSession,
  cancelSession, expireSession, subscribe,
} from './sessions';
import type { KioskSession } from './sessions';
import { simulateNafathLogin } from './nafath';
import { QUEUES, getQueue, getCampusPulse } from './queues';

export const mockBackend = {
  // Sessions ─────────────────────────────────────────────────────
  createDocumentSession(docType: DocType, kioskId?: string): KioskSession {
    return createSession({ type: 'document', docType }, kioskId);
  },

  createSensitiveSession(reason: string, kioskId?: string): KioskSession {
    return createSession({ type: 'sensitive', reason }, kioskId);
  },

  getSession,
  listSessions,
  cancelSession,
  expireSession,
  completeSession,
  subscribeSessions: subscribe,

  /**
   * The full "phone side" handshake:
   *   1) phone hits /continue?s=:id
   *   2) launches Nafath
   *   3) on success, claims the session with the verified national ID
   * Returns the resulting session.
   */
  async simulatePhoneClaim(sessionId: string, nationalId: string) {
    const auth = await simulateNafathLogin(nationalId);
    if (!auth.ok) return { ok: false as const, reason: auth.reason };
    const updated = claimSession(sessionId, nationalId);
    if (!updated) return { ok: false as const, reason: 'session_not_found' as const };
    return { ok: true as const, session: updated };
  },

  // Documents ────────────────────────────────────────────────────
  getDocType(t: DocType) { return DOC_TYPES[t]; },
  listDocTypes() { return Object.values(DOC_TYPES); },
  listRequestsForStudent(nationalId: string) {
    return SAMPLE_REQUESTS.filter((r) => r.studentNationalId === nationalId);
  },

  /**
   * Eligibility check (run AFTER Nafath claim).
   * Returns the reason if blocked.
   */
  checkDocumentEligibility(student: Student, docType: DocType): { ok: true } | { ok: false; reason: string } {
    const meta = DOC_TYPES[docType];
    if (!student.eligibleDocuments.includes(docType)) {
      return { ok: false, reason: `هذا المستند غير متاح لحالتك الأكاديمية (${student.status}).` };
    }
    if (student.outstandingFees > 0) {
      return { ok: false, reason: `رسوم متأخرة: ${student.outstandingFees} ر.س. — يرجى السداد قبل المتابعة.` };
    }
    if (meta.requires.includes('graduated') && student.status !== 'graduated') {
      return { ok: false, reason: 'هذا المستند للخريجين فقط.' };
    }
    if (meta.requires.includes('enrolled') && student.status !== 'enrolled') {
      return { ok: false, reason: 'هذا المستند للطلاب المسجلين حاليًا.' };
    }
    return { ok: true };
  },

  // Students ─────────────────────────────────────────────────────
  listStudents() { return STUDENTS; },
  findStudentByNationalId,

  // Queues ───────────────────────────────────────────────────────
  getQueue,
  getCampusPulse,
  listQueues() { return Object.values(QUEUES); },
};

// Re-export types so callers don't need to know the file structure
export type { DocType, KioskSession, Student };
