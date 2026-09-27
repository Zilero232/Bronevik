export const WORKER = {
  logContext: 'Worker',
  degradedWarning:
    'LESTA_APPLICATION_ID is empty: running degraded. Tracking and clan jobs stay queued, Lesta schedules are off; aggregates, news, purge and reference imports still run.'
} as const;
