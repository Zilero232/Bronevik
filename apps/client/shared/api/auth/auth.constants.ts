export const AUTH_PATHS = {
  session: '/auth/get-session',
  lestaStart: '/auth/lesta/start',
  telegramWidget: '/auth/telegram/widget',
  telegramCallback: '/auth/telegram/callback',
  magicLink: '/auth/sign-in/magic-link',
  signOut: '/auth/sign-out'
} as const;

export const MOCK_AUTH = {
  storageKey: 'bronevik-mock-auth',
  signedIn: 'in',
  signedOut: 'out'
} as const;
