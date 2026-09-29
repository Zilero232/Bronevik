import { minutesToMilliseconds, secondsToMilliseconds } from 'date-fns';

import type { ServiceStatusValue } from '@/ui-kit';

import type { HealthVerdict } from '../lib/health-summary';

export const HEALTH_REQUEST = {
  path: '/health',
  answeredStatuses: [200, 503],
  staleMs: secondsToMilliseconds(30),
  refetchMs: minutesToMilliseconds(1)
} as const;

export const HEALTH_COMPONENTS = ['database', 'redis', 'worker', 'lestaCircuit'] as const;

export const HEALTH_STATES = {
  noLestaKey: 'no_lesta_key',
  notConfigured: 'not_configured',
  stale: 'stale',
  closed: 'closed',
  open: 'open',
  halfOpen: 'half-open'
} as const;

export const HEALTH_VERDICT_STATUS = {
  ok: 'ok',
  noLestaKey: 'degraded',
  degraded: 'degraded',
  down: 'down',
  unreachable: 'down',
  unknown: 'unknown'
} as const satisfies Record<HealthVerdict, ServiceStatusValue>;
