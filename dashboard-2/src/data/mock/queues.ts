// Live queue snapshots — different patterns by time of day.
// The kiosk shows "current" data which the mock backend rotates every minute
// to feel alive without needing a real backend.

export type QueueLevel = 'low' | 'medium' | 'high';

export interface QueueSnapshot {
  serviceId: string;
  level: QueueLevel;
  waitingCount: number;
  averageWaitMin: number;
  capacity: number;
  updatedAt: string; // ISO
  /** Hourly forecast for the next 6 hours. */
  forecast: { hour: string; level: QueueLevel; expectedWaitMin: number }[];
}

const FORECAST_TEMPLATE: { hour: string; level: QueueLevel; expectedWaitMin: number }[] = [
  { hour: '٩:٠٠ ص', level: 'low',    expectedWaitMin: 4 },
  { hour: '١٠:٠٠ ص', level: 'medium', expectedWaitMin: 12 },
  { hour: '١١:٠٠ ص', level: 'high',   expectedWaitMin: 25 },
  { hour: '١٢:٠٠ م', level: 'high',   expectedWaitMin: 28 },
  { hour: '١:٠٠ م',  level: 'medium', expectedWaitMin: 14 },
  { hour: '٢:٠٠ م',  level: 'low',    expectedWaitMin: 5 },
];

export const QUEUES: Record<string, QueueSnapshot> = {
  'student-affairs': {
    serviceId: 'student-affairs',
    level: 'medium',
    waitingCount: 12,
    averageWaitMin: 12,
    capacity: 20,
    updatedAt: new Date().toISOString(),
    forecast: FORECAST_TEMPLATE,
  },
  admissions: {
    serviceId: 'admissions',
    level: 'high',
    waitingCount: 18,
    averageWaitMin: 25,
    capacity: 24,
    updatedAt: new Date().toISOString(),
    forecast: FORECAST_TEMPLATE,
  },
  'document-pickup': {
    serviceId: 'document-pickup',
    level: 'low',
    waitingCount: 4,
    averageWaitMin: 5,
    capacity: 12,
    updatedAt: new Date().toISOString(),
    forecast: FORECAST_TEMPLATE,
  },
  library: {
    serviceId: 'library',
    level: 'low',
    waitingCount: 3,
    averageWaitMin: 5,
    capacity: 50,
    updatedAt: new Date().toISOString(),
    forecast: FORECAST_TEMPLATE,
  },
  'tech-support': {
    serviceId: 'tech-support',
    level: 'medium',
    waitingCount: 8,
    averageWaitMin: 10,
    capacity: 15,
    updatedAt: new Date().toISOString(),
    forecast: FORECAST_TEMPLATE,
  },
};

export function getQueue(serviceId: string): QueueSnapshot | undefined {
  return QUEUES[serviceId];
}

/** Telemetry the kiosk shows on the welcome screen. */
export function getCampusPulse() {
  const all = Object.values(QUEUES);
  const avg = Math.round(all.reduce((sum, q) => sum + q.averageWaitMin, 0) / all.length);
  return {
    averageWaitMin: avg,
    busiest: all.reduce((a, b) => (a.averageWaitMin > b.averageWaitMin ? a : b)).serviceId,
    quietest: all.reduce((a, b) => (a.averageWaitMin < b.averageWaitMin ? a : b)).serviceId,
    visitsToday: 124,
  };
}
