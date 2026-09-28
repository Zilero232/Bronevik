export const HOME = {
  period: { server: '7d', rating: '7d' },
  garage: { limit: 10, skeletons: 6 },
  hero: { tanks: 5 },
  strongTanks: { tiers: [10, 9, 8], limit: 10, cards: 6 },
  topPlayers: { metrics: ['wn8', 'broneIndex', 'avgDamage'], limit: 10, podium: 3 },
  marks: { limit: 10, highlights: 3 },
  news: { limit: 6 },
  clans: { limit: 8 },
  recent: { limit: 6 },
  league: { scope: 'division', metric: null, week: null },
  staleMs: 60_000
} as const;
