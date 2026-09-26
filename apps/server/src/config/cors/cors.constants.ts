export const CORS = {
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  publicMethods: ['GET', 'HEAD', 'OPTIONS'],
  publicPaths: [/^\/v1(?:\/|$)/u, /^\/overlays\/[^/]+(?:\/stream)?$/u],
  exposedHeaders: [
    'set-auth-token',
    'retry-after',
    'x-ratelimit-limit',
    'x-ratelimit-remaining',
    'x-ratelimit-daily-limit',
    'x-ratelimit-daily-remaining'
  ]
} as const;
