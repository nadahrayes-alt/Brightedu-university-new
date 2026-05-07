// Single import surface for the whole mock layer.
//
// Use `import { mockBackend } from '../data/mock'` from any component.
// Swap this entire folder for real-backend calls when the API ships.

export { mockBackend } from './backend';
export { STUDENTS, findStudentByNationalId } from './students';
export type { Student, AcademicStatus } from './students';
export { DOC_TYPES, SAMPLE_REQUESTS } from './documents';
export type { DocType, DocStatus, DocTypeMeta, DocumentRequest } from './documents';
export { QUEUES, getQueue, getCampusPulse } from './queues';
export type { QueueLevel, QueueSnapshot } from './queues';
export { simulateNafathLogin } from './nafath';
export type { NafathOutcome } from './nafath';
export {
  createSession, getSession, listSessions, claimSession,
  completeSession, cancelSession, expireSession, subscribe,
} from './sessions';
export type { KioskSession, SessionStatus } from './sessions';
export {
  GREEN_SCENARIOS, YELLOW_SCENARIOS, BLACK_SCENARIOS,
  SYSTEM_SCENARIOS, ALL_SCENARIOS, DEMO_STORYLINE,
} from './scenarios';
export type { Scenario, DemoBeat } from './scenarios';
export { KIOSKS, DEFAULT_KIOSK_ID, findKioskById } from './kiosks';
export type { Kiosk } from './kiosks';
