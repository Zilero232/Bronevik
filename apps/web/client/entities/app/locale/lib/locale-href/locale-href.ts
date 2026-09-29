import type { LocaleHrefInput, WithPrefixInput } from './locale-href.types';

const withPrefix = ({ value, prefix }: WithPrefixInput) => (value === '' || value.startsWith(prefix) ? value : `${prefix}${value}`);

export const localeHref = ({ pathname, search = '', hash = '' }: LocaleHrefInput): string => {
  const query = withPrefix({ value: search, prefix: '?' });
  const fragment = withPrefix({ value: hash, prefix: '#' });

  return `${pathname}${query === '?' ? '' : query}${fragment === '#' ? '' : fragment}`;
};
