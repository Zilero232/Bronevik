import type { Locale } from '../locale.types';

export const LOCALE_LABELS = {
  ru: 'Русский',
  en: 'English'
} as const satisfies Record<Locale, string>;
