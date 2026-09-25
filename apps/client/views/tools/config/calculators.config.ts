import { parseAsStringLiteral } from 'nuqs';

export const CALCULATOR_IDS = ['research', 'target', 'moe', 'crew', 'economy', 'gold', 'pass'] as const;

export type CalculatorId = (typeof CALCULATOR_IDS)[number];

export const CALC_URL_PARSER = parseAsStringLiteral(CALCULATOR_IDS).withDefault('research');

export const CALC_PANEL_ID = 'calculator-panel';

export const TOOLS_LAYOUT = {
  chartHeight: 240,
  debounceMs: 250
} as const;
