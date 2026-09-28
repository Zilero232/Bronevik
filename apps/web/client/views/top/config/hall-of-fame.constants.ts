import type { OfficialRatingField } from '@otmetki/schemas';

export const HALL_OF_FAME = {
  fields: [
    'globalRating',
    'winRate',
    'avgDamage',
    'avgXp',
    'avgFrags',
    'avgSpotted',
    'survivalRate',
    'accuracy',
    'battles',
    'maxXp'
  ] satisfies OfficialRatingField[],
  percentFields: ['winRate', 'survivalRate', 'accuracy'] satisfies OfficialRatingField[],
  topLimit: 20,
  neighborsLimit: 5,
  historyDays: 14,
  skeletonHeight: 360,
  missing: '—',
  sparkline: { width: 220, height: 48 }
} as const;
