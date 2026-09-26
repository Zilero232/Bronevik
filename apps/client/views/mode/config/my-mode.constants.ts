import { MODE_META } from '@otmetki/schemas';

export const MY_MODE = {
  days: MODE_META.myDefaultDays,
  tanks: 5,
  retryAttempts: 2,
  skeletonHeight: 120
} as const;
