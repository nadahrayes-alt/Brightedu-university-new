// Mock Nafath (Saudi national SSO) authentication.
// In production this is an OAuth/OIDC handshake; here we just return
// a verified profile after a simulated delay.

import { findStudentByNationalId } from './students';

export type NafathOutcome =
  | { ok: true; nationalId: string; verifiedAt: string }
  | { ok: false; reason: 'declined' | 'timeout' | 'unknown_id' };

/**
 * Simulate the Nafath push-notification → biometric-confirm flow.
 * Default delay is 1.2s to feel realistic without slowing the demo.
 */
export function simulateNafathLogin(
  nationalId: string,
  delayMs = 1200
): Promise<NafathOutcome> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const student = findStudentByNationalId(nationalId);
      if (!student) {
        resolve({ ok: false, reason: 'unknown_id' });
        return;
      }
      resolve({
        ok: true,
        nationalId,
        verifiedAt: new Date().toISOString(),
      });
    }, delayMs);
  });
}
