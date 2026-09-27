import type { Language, Strings } from './i18n.types';

import { EN, RU } from './strings';

export const LANGUAGES = ['ru', 'en'] as const;

export const DEFAULT_LANGUAGE: Language = 'ru';

export const CATALOG: Record<Language, Strings> = { ru: RU, en: EN };
