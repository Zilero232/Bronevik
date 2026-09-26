import { BUILD_USAGE, LEARNING_DIFFICULTIES } from '@otmetki/schemas';
import { parseAsArrayOf, parseAsStringLiteral } from 'nuqs';

export const CATALOG_QUERY_PARSERS = {
  mode: parseAsStringLiteral(BUILD_USAGE.modes).withDefault(BUILD_USAGE.defaultMode),
  difficulties: parseAsArrayOf(parseAsStringLiteral(LEARNING_DIFFICULTIES)).withDefault([])
} as const;

export const CATALOG_TABLE = {
  numeric: { align: 'end', isNumeric: true },
  tankWidth: '28%',
  rowHeight: 44,
  iconSize: 24
} as const;
