import type { RU } from './strings/ru';

export type StringKey = keyof typeof RU;

export type Strings = Record<StringKey, string>;

export type Language = 'en' | 'ru';
