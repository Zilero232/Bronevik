export const PATTERN_SPECIMENS = {
  podium: [
    { rank: 2, name: 'Stalevar', value: 3412, battles: 18_420, tone: 'unicum' },
    { rank: 1, name: 'Grom', value: 3987, battles: 26_115, tone: 'unicum' },
    { rank: 3, name: 'Novobranec', value: 2388, battles: 9_870, tone: 'great' }
  ],
  marks: [
    { id: 'first', percent: 58.4, damageToNext: 420 },
    { id: 'second', percent: 81.2, damageToNext: 260 },
    { id: 'third', percent: 93.1, damageToNext: 95 }
  ],
  doneMark: 96.2,
  timeline: [
    { id: 'buff', tone: 'success' },
    { id: 'nerf', tone: 'danger' },
    { id: 'event', tone: 'accent' },
    { id: 'code', tone: 'premium' }
  ],
  tiers: [6, 7, 8, 9, 10, 11],
  initialTiers: [10],
  showcaseCount: 2,
  delta: -35
} as const;
