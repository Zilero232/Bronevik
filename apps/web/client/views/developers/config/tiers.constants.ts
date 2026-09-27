import { apiTierSchema } from '@otmetki/schemas';

export const TIERS = {
  list: apiTierSchema.options,
  metrics: ['requestsPerDay', 'requestsPerSecond', 'webhooks'],
  open: 'free',
  figures: ['requestsPerDay', 'requestsPerSecond']
} as const;
