import type { Language, Strings } from './i18n.types';

import { EN, RU } from './strings';

export const LANGUAGES = ['ru', 'en'] as const;

export const CATALOG: Record<Language, Strings> = { ru: RU, en: EN };
