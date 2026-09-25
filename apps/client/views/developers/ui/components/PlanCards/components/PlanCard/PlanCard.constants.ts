import { API_PLAN_LIMITS } from '@bronevik/schemas';

const METRICS = ['requestsPerDay', 'requestsPerSecond', 'webhooks'] as const;

const ALL_LIMITS = Object.values(API_PLAN_LIMITS);

export const PLAN_CARD = {
  metrics: METRICS.map((metric) => ({ metric, max: Math.max(...ALL_LIMITS.map((limits) => limits[metric])) }))
} as const;
