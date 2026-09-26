import { parseAsArrayOf, parseAsInteger } from 'nuqs';

export const COMPARE_PARAMS = {
  ids: parseAsArrayOf(parseAsInteger).withDefault([])
} as const;
