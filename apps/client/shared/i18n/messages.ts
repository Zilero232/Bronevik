import type { Locale } from './locale';

import { en } from './locales/en';
import { ru } from './locales/ru';

export type Messages = typeof ru;

export const messages: Record<Locale, Messages> = { ru, en };
