import { parseAsStringLiteral } from 'nuqs';

export const CALCULATOR_IDS = ['research', 'target', 'moe', 'crew', 'economy', 'gold', 'pass'] as const;

export type CalculatorId = (typeof CALCULATOR_IDS)[number];

export const CALC_URL_PARSER = parseAsStringLiteral(CALCULATOR_IDS).withDefault('research');

export const TOOLS_LAYOUT = {
  panelId: 'calculator-panel',
  chartHeight: 240,
  mediansSkeleton: 80
} as const;

export const TOOLS_FORMAT = {
  signed: { signDisplay: 'exceptZero' }
} as const satisfies Record<string, Intl.NumberFormatOptions>;
