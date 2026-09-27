import type { Locale, ResolveLocaleInput } from './locale.types';

import { LOCALE } from '../../config';

export const resolveLocale = ({ language, systemLanguage }: ResolveLocaleInput): Locale => {
  if (language !== 'auto') {
    return language;
  }

  if (systemLanguage && !systemLanguage.toLowerCase().startsWith(LOCALE.russianPrefix)) {
    return 'en';
  }

  return LOCALE.fallback;
};
