export const HEALTH_STATUSES = ['ok', 'degraded', 'error', 'shutting_down'] as const;

export const HEALTH_INDICATOR_STATUSES = ['up', 'degraded', 'down'] as const;

export const HEALTH_WORKER_STATES = ['ok', 'stale', 'unknown'] as const;

export const HEALTH_CIRCUIT_STATES = ['closed', 'open', 'half-open', 'not_configured', 'unknown'] as const;

export const HEALTH_WORKER_MODES = ['no_lesta_key'] as const;

export const COLLECTOR_JOBS = ['lestaSync', 'tankStats', 'moeImport', 'xvmExpected', 'gameFiles'] as const;
