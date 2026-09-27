import { parseAsStringLiteral } from 'nuqs';

export const MODE_VIEWS = ['table', 'ranks'] as const;

export type ModeView = (typeof MODE_VIEWS)[number];

export const MODE_VIEW_PARSER = parseAsStringLiteral(MODE_VIEWS).withDefault('table');

export const MODE_TABLE = {
  numeric: { align: 'end', isNumeric: true },
  rankWidth: 64,
  tankWidth: '28%',
  rowHeight: 44,
  skeletonHeight: 240
} as const;

export const MODE_FIGURES = {
  winRate: { maximumFractionDigits: 1 },
  average: { maximumFractionDigits: 0 },
  frags: { maximumFractionDigits: 2 }
} as const satisfies Record<string, Intl.NumberFormatOptions>;
