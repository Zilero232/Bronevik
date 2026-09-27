import type { PickLocalizedInput } from './localized.types';

export const pickLocalized = ({ text, locale }: PickLocalizedInput): string => text[locale] || text.ru || text.en;
