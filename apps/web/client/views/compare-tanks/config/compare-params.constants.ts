import { parseAsArrayOf, parseAsInteger } from 'nuqs/server';

export const COMPARE_PARAMS = {
  ids: parseAsArrayOf(parseAsInteger).withDefault([])
} as const;
