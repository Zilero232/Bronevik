import type { LOCALES } from '../../config';

export type Locale = (typeof LOCALES)[number];

export type ResolveLocaleInput = {
  language: 'auto' | Locale;
  systemLanguage: string | undefined;
};
