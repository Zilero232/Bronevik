import type { LANGUAGES } from './i18n.constants';
import type { RU } from './strings';

export type StringKey = keyof typeof RU;

export type Strings = Record<StringKey, string>;

export type Language = (typeof LANGUAGES)[number];
