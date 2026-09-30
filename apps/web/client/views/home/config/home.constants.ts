export const HOME = {
  period: { server: '7d', rating: '7d' },
  garage: { sort: 'battles', order: 'desc', limit: 10, skeletons: 6, skeletonHeight: 128 },
  hero: { tanks: 5 },
  strongTanks: { tiers: [10, 9, 8], sort: 'winRate', order: 'desc', limit: 10, cards: 6, skeletonHeight: 236 },
  topPlayers: { metrics: ['wn8', 'broneIndex', 'avgDamage'], limit: 10, podium: 3, skeletonHeight: 178 },
  marks: { sort: 'p95Delta30d', order: 'desc', limit: 10, highlights: 3, skeletonHeight: 128 },
  news: { limit: 6, skeletonHeight: 220 },
  clans: { sort: 'activeMembers', order: 'desc', limit: 8 },
  recent: { limit: 6 },
  forYou: { marksQuery: { tab: 'marks' } },
  league: { scope: 'division', metric: null, week: null },
  staleMs: 60_000
} as const;
