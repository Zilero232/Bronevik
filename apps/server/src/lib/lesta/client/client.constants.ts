export const LESTA_API = {
  baseUrl: 'https://api.tanki.su/wot/',
  loginPath: 'auth/login/',
  language: 'ru',
  timeoutMs: 15_000,
  maxFields: 100,
  listSeparator: ','
} as const;

export const LESTA_RETRY = {
  retries: 5,
  factor: 2,
  minTimeout: 500,
  maxTimeout: 10_000,
  randomize: true
} as const;

export const LESTA_LANGUAGES = ['ru', 'en', 'be', 'kk', 'uk'] as const;
