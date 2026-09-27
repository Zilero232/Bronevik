export const CIRCUIT_BREAKER = {
  threshold: 0.3,
  samplingMs: 60_000,
  minimumRps: 20 / 60,
  halfOpenAfterMs: 5 * 60_000,
  tickMs: 5_000
} as const;

export const CIRCUIT_STATE_NAME = {
  closed: 'closed',
  open: 'open',
  halfOpen: 'half-open'
} as const;
