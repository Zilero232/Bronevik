import { ANALYTICS_GRANULARITIES } from '@otmetki/schemas';

export const ANALYTICS_TANK = {
  defaultGranularity: 'week',
  granularities: ANALYTICS_GRANULARITIES,
  dateFormat: { day: 'numeric', month: 'short' }
} as const;
