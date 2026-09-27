declare module 'use-intl' {
  // eslint-disable-next-line ts/consistent-type-definitions -- use-intl reads its typed config through interface merging
  interface AppConfig {
    Locale: import('@/shared/i18n').Locale;
    Messages: import('@/shared/i18n').Messages;
  }
}

export {};
