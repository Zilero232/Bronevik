import type { Language, StringKey, Strings } from './i18n.types';

import { EN } from './strings/en';
import { RU } from './strings/ru';

const CATALOG: Record<Language, Strings> = { ru: RU, en: EN };

export const translator =
  (language: Language) =>
  (key: StringKey): string =>
    CATALOG[language][key];
