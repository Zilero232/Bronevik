import type { Language, StringKey } from './i18n.types';

import { CATALOG } from './i18n.constants';

export const translator =
  (language: Language) =>
  (key: StringKey): string =>
    CATALOG[language][key];
