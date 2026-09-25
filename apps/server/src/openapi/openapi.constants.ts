export const OPENAPI = {
  internal: {
    path: 'docs',
    title: 'Bronevik API',
    description: 'Site API, public /v1 and the mod ingest for Броневик. Data source: Леста Игры.',
    sessionCookie: 'better-auth.session_token'
  },
  public: {
    path: 'v1/docs',
    title: 'Bronevik Public API',
    description:
      'Derived «Мир танков» (Lesta RU) data: WN8 and recent periods, player history, server tank statistics, tier list, marks of excellence thresholds and their history, clans, leaderboards, sessions. Pass your key in the X-API-Key header; create one at /me/developer. Data source: Леста Игры.',
    prefix: '/v1/',
    securityName: 'apiKey',
    apiKeyHeader: 'X-API-Key'
  },
  version: '0.1.0',
  refPrefix: '#/components/schemas/'
} as const;
