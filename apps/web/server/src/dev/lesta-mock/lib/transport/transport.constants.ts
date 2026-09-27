export const TRANSPORT = {
  latencyMs: [40, 180],
  loginPath: 'auth/login/',
  realApiPatterns: ['https://api.tanki.su/wot/*', 'https://api.tanki.su/wgn/*', 'https://api.worldoftanks.ru/*']
} as const;
