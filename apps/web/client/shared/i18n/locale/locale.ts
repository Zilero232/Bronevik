import { isIncludedIn } from 'remeda';

import type { Locale } from './locale.types';

import { DEFAULT_LOCALE, LOCALES } from './locale.constants';

export const resolveLocale = (value: string | undefined): Locale => (value !== undefined && isIncludedIn(value, LOCALES) ? value : DEFAULT_LOCALE);
