import type { LocalizedTextInput } from './localized-text.types';

import { LOCALIZED_TEXT } from './localized-text.constants';

export const localizedText = <T extends string | null>({ locale, text, english }: LocalizedTextInput<T>): string | T =>
  locale === LOCALIZED_TEXT.english && english ? english : text;
