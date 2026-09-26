import { apiPlanSchema } from '@otmetki/schemas';

export const PLANS = {
  list: apiPlanSchema.options,
  metrics: ['requestsPerDay', 'requestsPerSecond', 'webhooks'],
  open: 'free',
  figures: ['requestsPerDay', 'requestsPerSecond']
} as const;
