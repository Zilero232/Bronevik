export const DEVELOPER_MOCK = {
  baseRequests: 3_400,
  errorShare: 0.04,
  usageDays: 30,
  deliveries: 12,
  endpoints: ['/v1/players/{idOrNick}', '/v1/players/{id}/tanks', '/v1/marks', '/v1/tanks/tier-list', '/v1/clans/{id}/members'],
  errors: [
    { method: 'GET', path: '/v1/players/Unknown_Nick', status: 404, code: 'PLAYER_NOT_FOUND', message: 'No player with nickname Unknown_Nick' },
    { method: 'GET', path: '/v1/players/12400000/tanks', status: 429, code: 'RATE_LIMITED', message: 'Too many requests per second' },
    { method: 'GET', path: '/v1/marks?tankId=abc', status: 400, code: 'VALIDATION_FAILED', message: 'tankId must be a number' },
    { method: 'GET', path: '/v1/clans/1/events', status: 502, code: 'UPSTREAM_UNAVAILABLE', message: 'The Lesta API did not answer in time' },
    { method: 'GET', path: '/v1/leaderboards?scope=wn8', status: 429, code: 'PLAN_LIMIT_REACHED', message: 'Daily request limit reached' }
  ]
} as const;
