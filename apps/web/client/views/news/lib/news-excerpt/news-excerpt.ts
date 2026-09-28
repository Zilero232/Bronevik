import { NEWS_EXCERPT } from '../../config';

export const newsExcerpt = (summary: string | null | undefined): string | null => {
  const text = NEWS_EXCERPT.boilerplate
    .reduce((acc, pattern) => acc.replace(pattern, ' '), summary ?? '')
    .replace(/\s+/gu, ' ')
    .trim();

  return text.length >= NEWS_EXCERPT.minLength ? text : null;
};
