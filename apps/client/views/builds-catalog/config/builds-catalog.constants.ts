import { BUILD_USAGE } from '@otmetki/schemas';
import { parseAsStringLiteral } from 'nuqs';

export const CATALOG_QUERY_PARSERS = {
  mode: parseAsStringLiteral(BUILD_USAGE.modes).withDefault(BUILD_USAGE.defaultMode)
} as const;

export const CATALOG_TABLE = {
  numeric: { align: 'end', isNumeric: true },
  tankWidth: '28%',
  rowHeight: 44,
  iconSize: 24
} as const;
