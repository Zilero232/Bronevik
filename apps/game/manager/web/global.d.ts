declare module 'use-intl' {
  interface AppConfig {
    Locale: import('@/shared/i18n').Locale;
    Messages: import('@/shared/i18n').Messages;
  }
}

export {};
