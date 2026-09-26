export const LESTA_ID = {
  statePrefix: 'lesta-id:',
  stateBytes: 24,
  stateTtlMs: 10 * 60_000,
  tokenTtlSeconds: 14 * 86_400,
  callbackPath: '/auth/lesta/callback',
  errorParam: 'authError',
  verifyFields: ['account_id', 'nickname', 'private']
} as const;

export const LESTA_ID_ERROR = {
  state: 'lesta_state',
  denied: 'lesta_denied',
  token: 'lesta_token',
  unavailable: 'lesta_unavailable',
  taken: 'lesta_account_taken',
  limit: 'lesta_link_limit'
} as const;
