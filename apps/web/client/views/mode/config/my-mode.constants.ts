import type { CareerMode, PlayMode } from '@otmetki/schemas';

import { MODE_META } from '@otmetki/schemas';

const CAREER_OF: Partial<Record<PlayMode, CareerMode>> = { frontline: 'frontline', ranked: 'ranked' };

export const MY_MODE = {
  days: MODE_META.myDefaultDays,
  tanks: 5,
  retryAttempts: 2,
  skeletonHeight: 120,
  careerOf: CAREER_OF
} as const;
