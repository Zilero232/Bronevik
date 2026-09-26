export const HOME = {
  period: { server: '7d', rating: '7d' },
  garage: { limit: 10, skeletons: 6 },
  strongTanks: { tiers: ['10', '9', '8'], limit: 10 },
  topPlayers: { metrics: ['wn8', 'broneIndex', 'avgDamage'], limit: 10 },
  marks: { limit: 10 },
  news: { limit: 6 },
  clans: { limit: 8 },
  recent: { limit: 6 },
  staleMs: 60_000
} as const;
