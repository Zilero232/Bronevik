export const OPENAPI = {
  internal: {
    path: 'docs',
    title: 'Three Marks API',
    description: 'Site API, public /v1 and the mod ingest for Три отметки. Data source: Леста Игры.',
    sessionCookie: 'better-auth.session_token',
    openApiVersion: '3.1.0'
  },
  public: {
    path: 'v1/docs',
    specPath: 'v1/docs/openapi.json',
    title: 'Three Marks Public API',
    description:
      'Derived «Мир танков» (Lesta RU) data: WN8 and recent periods, player history, server tank statistics, tier list, marks of excellence thresholds and their history, clans, leaderboards, sessions. Pass your key in the X-API-Key header; create one at /me/developer. Data source: Леста Игры.',
    securityName: 'apiKey',
    apiKeyHeader: 'X-API-Key'
  },
  version: '0.1.0',
  emptyTypeKey: 'x-nestjs_zod-empty-type',
  versions: { v30: '3.0', v31: '3.1' }
} as const;
