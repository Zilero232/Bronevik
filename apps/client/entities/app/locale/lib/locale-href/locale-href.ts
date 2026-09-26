import type { LocaleHrefInput } from './locale-href.types';

const withPrefix = (value: string, prefix: string) => (value === '' || value.startsWith(prefix) ? value : `${prefix}${value}`);

export const localeHref = ({ pathname, search = '', hash = '' }: LocaleHrefInput): string => {
  const query = withPrefix(search, '?');
  const fragment = withPrefix(hash, '#');

  return `${pathname}${query === '?' ? '' : query}${fragment === '#' ? '' : fragment}`;
};
