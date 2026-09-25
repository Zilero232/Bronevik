import type { PercentTextInput } from './percent.types';

import { PERCENT_TEXT } from './percent.constants';

export const percentText = ({ format, value, digits = PERCENT_TEXT.digits }: PercentTextInput): string =>
  value === null || value === undefined ? PERCENT_TEXT.empty : `${format.number(value, { maximumFractionDigits: digits })}%`;

export const pointsText = ({ format, value, digits = PERCENT_TEXT.digits }: PercentTextInput): string =>
  value === null || value === undefined ? PERCENT_TEXT.empty : format.number(value, { maximumFractionDigits: digits, signDisplay: 'exceptZero' });
